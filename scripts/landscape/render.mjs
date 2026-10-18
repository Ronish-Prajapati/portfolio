// Renders the hero landscape layers, route data, topo map and mist texture.
//
//   npm run landscape:render              full render into public/landscape + src/components/landscape
//   npm run landscape:render -- --preview <dir>   quick composite preview (PNG) into <dir>
//   npm run landscape:render -- --data-only       only route/topo data and mist (no layers)
//   npm run landscape:render -- --summit          only the sunrise arrival view (contact background)
//   (combine --summit with --preview <dir> for a quick summit preview)
//
// Uses headless Chrome/Edge via playwright-core (no browser download needed).

import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const args = process.argv.slice(2);
const previewIndex = args.indexOf("--preview");
const preview = previewIndex !== -1;
const dataOnly = args.includes("--data-only");
const summitOnly = args.includes("--summit");
const previewDir = preview ? path.resolve(args[previewIndex + 1] ?? path.join(root, ".landscape-preview")) : null;

const OUT_PUBLIC = path.join(root, "public", "landscape");
const OUT_DATA = path.join(root, "src", "components", "landscape");

// Final layer size. Rendered at SUPERSAMPLE x and downscaled for clean edges.
const WIDTH = 3200;
const HEIGHT = 1800;
const SUPERSAMPLE = 2;
const SUMMIT_WIDTH = 2880;
const SUMMIT_HEIGHT = 1620;

const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json" };

function serve() {
  const server = http.createServer(async (req, res) => {
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const allowed = url.startsWith("/scripts/landscape/") || url.startsWith("/node_modules/three/");
    const file = path.join(root, url);
    if (!allowed || !file.startsWith(root)) {
      res.writeHead(403).end();
      return;
    }
    try {
      const body = await fs.readFile(file);
      res.writeHead(200, { "content-type": MIME[path.extname(file)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

async function launch() {
  const attempts = [
    { channel: "chrome", args: ["--enable-gpu", "--ignore-gpu-blocklist", "--use-angle=d3d11"] },
    { channel: "msedge", args: ["--enable-gpu", "--ignore-gpu-blocklist", "--use-angle=d3d11"] },
    { channel: "chrome", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] },
  ];
  for (const opts of attempts) {
    try {
      return await chromium.launch({ headless: true, ...opts });
    } catch (error) {
      console.warn(`[landscape] could not launch ${opts.channel}: ${error.message.split("\n")[0]}`);
    }
  }
  throw new Error("No Chrome or Edge installation found.");
}

const dataUrlToBuffer = (url) => Buffer.from(url.split(",")[1], "base64");

async function main() {
  const server = await serve();
  const port = server.address().port;
  const browser = await launch();
  const page = await browser.newPage();
  page.on("console", (msg) => console.log(`[browser] ${msg.text()}`));
  page.on("pageerror", (err) => console.error(`[browser error] ${err.message}`));
  await page.goto(`http://127.0.0.1:${port}/scripts/landscape/index.html`);
  await page.waitForFunction(() => window.__ready === true);

  const gpu = await page.evaluate(() => {
    const gl = document.createElement("canvas").getContext("webgl2");
    const ext = gl?.getExtension("WEBGL_debug_renderer_info");
    return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "unknown";
  });
  console.log(`[landscape] WebGL renderer: ${gpu}`);

  if (summitOnly || (!preview && !dataOnly)) {
    if (preview) await fs.mkdir(previewDir, { recursive: true });
    else await fs.mkdir(OUT_PUBLIC, { recursive: true });
    const [w, h] = preview ? [1600, 900] : [SUMMIT_WIDTH * SUPERSAMPLE, SUMMIT_HEIGHT * SUPERSAMPLE];
    const result = await page.evaluate(
      ({ w, h, quality, finalW, finalH }) => {
        const L = window.landscape;
        L.setLighting("sunrise");
        const parts = L.createHeroScene({ quality });
        const camera = L.createArrivalCamera(w / h);
        const url = L.renderLayers(parts, camera, w, h, ["composite"]).composite;
        const route = L.routeScreenData(parts, L.createArrivalCamera(finalW / finalH), finalW, finalH);
        L.setLighting("dawn");
        return { url, route };
      },
      { w, h, quality: preview ? 0.6 : 1, finalW: SUMMIT_WIDTH, finalH: SUMMIT_HEIGHT },
    );
    const file = preview ? path.join(previewDir, "summit-preview.png") : path.join(OUT_PUBLIC, "summit.webp");
    const img = sharp(dataUrlToBuffer(result.url));
    if (preview) await img.png().toFile(file);
    else await img.resize(SUMMIT_WIDTH, SUMMIT_HEIGHT, { kernel: "lanczos3" }).webp({ quality: 82, effort: 6, smartSubsample: true }).toFile(file);
    console.log(`[landscape] ${path.relative(root, file)} ${((await fs.stat(file)).size / 1024).toFixed(0)} KB`);
    if (!preview) {
      await fs.mkdir(OUT_DATA, { recursive: true });
      const segments = [];
      let current = [];
      for (const p of result.route.points) {
        if (p.hidden) {
          if (current.length > 1) segments.push(current);
          current = [];
        } else current.push(p.xy.map((v) => Math.round(v * 10) / 10));
      }
      if (current.length > 1) segments.push(current);
      const data = { width: SUMMIT_WIDTH, height: SUMMIT_HEIGHT, route: segments, summit: result.route.summit.map((v) => Math.round(v)) };
      await fs.writeFile(path.join(OUT_DATA, "summit-scene.json"), JSON.stringify(data) + "\n");
    }
    if (summitOnly) {
      await browser.close();
      server.close();
      return;
    }
  }

  if (preview) {
    await fs.mkdir(previewDir, { recursive: true });
    const result = await page.evaluate(
      ({ w, h }) => {
        const L = window.landscape;
        const parts = L.createHeroScene({ quality: 0.6 });
        const camera = L.createCamera(w / h);
        const layers = L.renderLayers(parts, camera, w, h, ["composite"]);
        const route = L.routeScreenData(parts, camera, w, h);
        return { composite: layers.composite, route };
      },
      { w: 1600, h: 900 },
    );
    const base = sharp(dataUrlToBuffer(result.composite));
    const pts = result.route.points;
    const d = pts.map((p, i) => `${i ? "L" : "M"}${p.xy[0].toFixed(1)},${p.xy[1].toFixed(1)}`).join(" ");
    const hidden = pts
      .filter((p) => p.hidden)
      .map((p) => `<circle cx="${p.xy[0]}" cy="${p.xy[1]}" r="2" fill="red"/>`)
      .join("");
    const overlay = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><path d="${d}" fill="none" stroke="#e9a35f" stroke-width="2" stroke-dasharray="6 5"/>${hidden}<circle cx="${result.route.summit[0]}" cy="${result.route.summit[1]}" r="5" fill="none" stroke="#fff"/></svg>`,
    );
    await base.composite([{ input: overlay }]).png().toFile(path.join(previewDir, "hero-preview.png"));
    await sharp(dataUrlToBuffer(result.composite)).png().toFile(path.join(previewDir, "hero-preview-clean.png"));
    console.log(`[landscape] preview written to ${previewDir}`);
  } else {
    await fs.mkdir(OUT_PUBLIC, { recursive: true });
    await fs.mkdir(OUT_DATA, { recursive: true });
    const W = WIDTH * SUPERSAMPLE;
    const H = HEIGHT * SUPERSAMPLE;
    await page.evaluate(
      ({ w, h }) => {
        const L = window.landscape;
        window.__parts = L.createHeroScene({ quality: 1 });
        window.__camera = L.createCamera(w / h);
      },
      { w: W, h: H },
    );
    for (const name of dataOnly ? [] : ["sky", "far", "massif", "ridge", "fore"]) {
      const url = await page.evaluate(
        ({ w, h, name }) => window.landscape.renderLayers(window.__parts, window.__camera, w, h, [name])[name],
        { w: W, h: H, name },
      );
      const file = path.join(OUT_PUBLIC, `hero-${name}.webp`);
      await sharp(dataUrlToBuffer(url))
        .resize(WIDTH, HEIGHT, { kernel: "lanczos3" })
        .webp({ quality: name === "sky" ? 86 : 84, alphaQuality: 90, effort: 6, smartSubsample: true })
        .toFile(file);
      const { size } = await fs.stat(file);
      console.log(`[landscape] ${path.relative(root, file)} ${(size / 1024).toFixed(0)} KB`);
    }

    const route = await page.evaluate(
      ({ w, h }) => window.landscape.routeScreenData(window.__parts, window.landscape.createCamera(w / h), w, h),
      { w: WIDTH, h: HEIGHT },
    );
    const topo = await page.evaluate(() => window.landscape.topoData());
    const mist = await page.evaluate(() => window.landscape.mistTexture(1024, 256));
    await sharp(dataUrlToBuffer(mist)).webp({ quality: 60, alphaQuality: 60, effort: 6 }).toFile(path.join(OUT_PUBLIC, "mist.webp"));

    // Visible route only: split into segments wherever terrain hides the trail.
    const segments = [];
    let current = [];
    for (const p of route.points) {
      if (p.hidden) {
        if (current.length > 1) segments.push(current);
        current = [];
      } else current.push(p.xy.map((v) => Math.round(v * 10) / 10));
    }
    if (current.length > 1) segments.push(current);
    const heroScene = { width: WIDTH, height: HEIGHT, route: segments, summit: route.summit.map((v) => Math.round(v)) };
    await fs.writeFile(path.join(OUT_DATA, "hero-scene.json"), JSON.stringify(heroScene) + "\n");

    await fs.writeFile(path.join(OUT_PUBLIC, "topo.svg"), topoSvg(topo));
    const topoRoute = { width: topo.width, height: topo.height, route: topo.route.map((p) => p.map((v) => Math.round(v * 10) / 10)), summit: topo.summit };
    await fs.writeFile(path.join(OUT_DATA, "topo-route.json"), JSON.stringify(topoRoute) + "\n");
    console.log("[landscape] data written");
  }

  await browser.close();
  server.close();
}

/** Ramer-Douglas-Peucker simplification. */
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  let maxDist = 0;
  let index = 0;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  const len = Math.hypot(bx - ax, by - ay);
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    // Closed rings start and end on the same point: measure distance to it instead.
    const dist =
      len < 1e-9
        ? Math.hypot(px - ax, py - ay)
        : Math.abs((by - ay) * px - (bx - ax) * py + bx * ay - by * ax) / len;
    if (dist > maxDist) {
      maxDist = dist;
      index = i;
    }
  }
  if (maxDist <= tolerance) return [points[0], points[points.length - 1]];
  return simplify(points.slice(0, index + 1), tolerance).slice(0, -1).concat(simplify(points.slice(index), tolerance));
}

function topoSvg(topo) {
  const paths = topo.lines
    .map(({ level, polylines }) => {
      const major = level % 250 === 0;
      const d = polylines
        .map((line) => simplify(line, 0.35))
        .filter((line) => line.length > 2)
        .map((line) => "M" + line.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L"))
        .join("");
      if (!d) return "";
      return `<path d="${d}" stroke-width="${major ? 0.9 : 0.45}" stroke-opacity="${major ? 0.9 : 0.55}"/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${topo.width} ${topo.height}" fill="none" stroke="#9fb3a8" stroke-linejoin="round" stroke-linecap="round">${paths}</svg>\n`;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
