// Landscape generator for the portfolio hero ("The Summit").
//
// Builds an original, procedurally shaped mountain scene in three.js and renders
// it offline into transparent depth layers (sky, far range, massif, mid ridge,
// foreground forest). The site composites those layers with CSS parallax, so
// visitors get the depth and lighting of a 3D scene without runtime WebGL.
//
// Open via `npm run landscape:render` (see render.mjs).

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { createNoise } from "./noise.js";

const N = createNoise(1407);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const smax = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.max(a, b) + h * h * k * 0.25;
};
const deg = (d) => (d * Math.PI) / 180;

// ---------------------------------------------------------------------------
// Art direction
// ---------------------------------------------------------------------------

export const CAMERA = {
  position: new THREE.Vector3(0, 600, 0),
  pitchDeg: 4,
  fovDeg: 40,
};

// Low dawn sun from the front-left: only the high snow catches first light.
const SUN_DIR = new THREE.Vector3(-0.812, 0.13, 0.568).normalize();

// Two times of day bookend the site: first light on the hero, full sunrise at
// the summit (contact). Call setLighting() before building a scene.
const LIGHTING = {
  dawn: {
    sun: [-0.812, 0.13, 0.568],
    massifMask: [1240, 1560],
    farMask: [1250, 1700],
    sunColor: "#ffc8a0",
    sunPower: 3.1,
    ambient: 0.95,
    rim: 0.55,
    fog: "#45524f",
    fogSun: "#6f5e54",
    sky: { zenith: "#0a1215", upper: "#172429", belt: "#56605f", horizon: "#44504e", glow: "#b98563" },
  },
  sunrise: {
    sun: [-0.72, 0.26, 0.64],
    massifMask: [780, 1120],
    farMask: [900, 1250],
    sunColor: "#ffcfa6",
    sunPower: 1.75,
    ambient: 1.0,
    rim: 0.9,
    fog: "#55605d",
    fogSun: "#93765f",
    sky: { zenith: "#0c1a1f", upper: "#22363b", belt: "#6a6b66", horizon: "#5a6460", glow: "#c99068" },
  },
};
let light = LIGHTING.dawn;

export function setLighting(mode) {
  light = LIGHTING[mode];
  SUN_DIR.set(...light.sun).normalize();
}

const C = (hex) => new THREE.Color(hex);

const PALETTE = {
  skyZenith: C("#0a1215"),
  skyUpper: C("#172429"),
  skyBelt: C("#56605f"),
  skyHorizon: C("#44504e"),
  skyGlow: C("#b98563"),
  fog: C("#45524f"),
  fogSun: C("#6f5e54"),
  sun: C("#ffc8a0"),
  ambientSky: C("#3e5563"),
  ambientGround: C("#0d1411"),
  rim: C("#6a5446"),
  snow: C("#e6ecef"),
  snowShade: C("#cfd9de"),
  rockDark: C("#24292a"),
  rockWarm: C("#45413e"),
  scree: C("#2d302c"),
  forest: C("#0f1a14"),
  forestLight: C("#1a2a20"),
  pine: C("#0e1a13"),
  pineLight: C("#16261c"),
  trunk: C("#1e1915"),
};

// ---------------------------------------------------------------------------
// Height functions (world units are metres; camera looks toward -Z)
// ---------------------------------------------------------------------------

function pyramid(x, z, cx, cz, H, slopes, rot) {
  let m = -Infinity;
  const n = slopes.length;
  for (let i = 0; i < n; i++) {
    const a = rot + (i * Math.PI * 2) / n;
    const d = ((x - cx) * Math.cos(a) + (z - cz) * Math.sin(a)) * slopes[i];
    if (d > m) m = d;
  }
  return H - m;
}

/** Monotone cubic interpolation through [u, value] pairs (sorted by u). */
function curve(points) {
  return (u) => {
    if (u <= points[0][0]) return points[0][1];
    for (let i = 0; i < points.length - 1; i++) {
      const [u0, v0] = points[i];
      const [u1, v1] = points[i + 1];
      if (u <= u1) {
        const t = smoothstep(0, 1, (u - u0) / (u1 - u0));
        return lerp(v0, v1, t);
      }
    }
    return points[points.length - 1][1];
  };
}

/** Height that puts a crest at elevation angle `eDeg` when seen at distance `d`. */
const crestHeight = (eDeg, d) => CAMERA.position.y + Math.tan(deg(eDeg)) * d;

export const SUMMIT = { x: 700, z: -5200, y: 1900 };

function massifHeight(x, z) {
  let h = pyramid(x, z, SUMMIT.x, SUMMIT.z, SUMMIT.y, [1.18, 0.86, 1.32, 0.98, 1.1], 0.35);
  h = smax(h, pyramid(x, z, 1080, -5330, 1700, [1.3, 1.05, 1.4], 0.2), 70);
  h = smax(h, pyramid(x, z, -950, -5900, 1480, [0.92, 1.12, 0.84], 1.15), 140);
  h = smax(h, pyramid(x, z, 2450, -5700, 1390, [0.98, 0.84, 1.02, 1.12], 0.7), 140);
  h = smax(h, pyramid(x, z, -2650, -6350, 1260, [0.82, 0.95, 0.88], 2.05), 140);
  h = smax(h, pyramid(x, z, 3950, -6450, 1230, [0.9, 1.0, 0.86, 1.05], 0.2), 140);
  // Connecting crest line so the peaks read as one massif.
  const crestZ = -5900 + 320 * Math.sin(x * 0.0007 + 0.4);
  const crest = 1120 + 130 * N.fbm(x * 0.0009, 0.37, 3) - 0.58 * Math.abs(z - crestZ);
  h = smax(h, crest, 220);
  // Snowfield apron below the summit: the gentler slope the route climbs.
  const apron = 1380 - 0.46 * Math.max(0, z + 5000) - 0.3 * Math.abs(x - 260 + (z + 5000) * 0.12);
  h = smax(h, apron, 160);
  // Flutes and couloirs radiating from the summit (seamless around the peak).
  const dx = x - SUMMIT.x;
  const dz = z - SUMMIT.z;
  const r = Math.hypot(dx, dz) + 1e-3;
  const ca = dx / r;
  const sa = dz / r;
  const flute = 1 - Math.abs(N.noise3D(ca * 3.4, sa * 3.4, r * 0.0011));
  const near = smoothstep(1900, 250, r);
  const apexCalm = smoothstep(60, 380, r);
  // Only on faces turned toward the camera: edge-on flutes read as a comb on the skyline.
  const facing = smoothstep(0.15, 0.7, sa);
  h += (flute * flute - 0.45) * 72 * near * apexCalm * facing;
  // Broad erosion elsewhere, kept low-frequency so faces stay planar.
  const elev = clamp((h - 500) / 1400, 0.1, 1);
  h += (N.ridged(x * 0.0013 + 11.3, z * 0.0013 - 4.1, 5) - 0.45) * 85 * elev * (1 - near * 0.6);
  h += N.fbm(x * 0.012, z * 0.012, 3) * 6;
  return h;
}

const midCrestElev = curve([
  [-0.75, 1.5],
  [-0.42, 2.25],
  [-0.24, 1.5],
  [-0.1, 0.55],
  [0.02, 0.2],
  [0.14, 0.45],
  [0.3, 1.6],
  [0.5, 2.0],
  [0.75, 1.2],
]);

function ridgeHeight(x, z) {
  const dCrest = 2000 + 160 * N.fbm(x * 0.0012, 5.5, 2);
  const crest = crestHeight(midCrestElev(x / dCrest), dCrest) + 14 * N.fbm(x * 0.006, 2.2, 3);
  const across = Math.abs(-z - dCrest);
  let h = crest - 0.012 * Math.pow(across, 1.55);
  h += (N.ridged(x * 0.004, z * 0.004, 4) - 0.5) * 26;
  h += N.fbm(x * 0.03, z * 0.03, 2) * 3;
  return h;
}

const foreCrestElev = curve([
  [-0.8, -2.6],
  [-0.55, -3.2],
  [-0.32, -4.6],
  [-0.12, -7.6],
  [0.06, -10.8],
  [0.22, -11.6],
  [0.4, -9.6],
  [0.62, -7.4],
  [0.85, -6.6],
]);

function foreHeight(x, z) {
  const dCrest = 430 + 40 * N.fbm(x * 0.004, 9.1, 2);
  const crest = crestHeight(foreCrestElev(x / dCrest), dCrest);
  const across = -z - dCrest;
  // Steeper drop toward the far valley than toward the camera.
  const fall = across > 0 ? 0.0009 * Math.pow(across, 1.9) : 0.0016 * Math.pow(-across, 1.75);
  let h = crest - fall;
  h += N.fbm(x * 0.01, z * 0.01, 4) * 6;
  return h;
}

const FAR_PEAKS = [
  [-7600, -11600, 1700],
  [-5600, -12400, 1930],
  [-3500, -11400, 1780],
  [-1600, -12600, 2060],
  [300, -11900, 1880],
  [2300, -12900, 2120],
  [4200, -11700, 1820],
  [6300, -12500, 2010],
  [8200, -11800, 1760],
];

function farHeight(x, z) {
  let h = 900 - 0.4 * Math.abs(z + 12000);
  FAR_PEAKS.forEach(([cx, cz, H], i) => {
    h = smax(h, pyramid(x, z, cx, cz, H, [0.95, 0.78, 1.05, 0.88], 0.4 + i * 0.9), 260);
  });
  h += (N.ridged(x * 0.0011 - 3.3, z * 0.0011, 5) - 0.45) * 200;
  return h;
}

// ---------------------------------------------------------------------------
// Height grids + meshes
// ---------------------------------------------------------------------------

function heightGrid(fn, { x0, x1, z0, z1, nx, nz }) {
  const h = new Float32Array((nx + 1) * (nz + 1));
  const dx = (x1 - x0) / nx;
  const dz = (z1 - z0) / nz;
  for (let iz = 0; iz <= nz; iz++) {
    const z = z0 + iz * dz;
    for (let ix = 0; ix <= nx; ix++) h[iz * (nx + 1) + ix] = fn(x0 + ix * dx, z);
  }
  const sample = (x, z) => {
    const fx = (x - x0) / dx;
    const fz = (z - z0) / dz;
    if (fx < 0 || fz < 0 || fx >= nx || fz >= nz) return -Infinity;
    const ix = Math.floor(fx);
    const iz = Math.floor(fz);
    const tx = fx - ix;
    const tz = fz - iz;
    const i = iz * (nx + 1) + ix;
    const a = lerp(h[i], h[i + 1], tx);
    const b = lerp(h[i + nx + 1], h[i + nx + 2], tx);
    return lerp(a, b, tz);
  };
  return { x0, x1, z0, z1, nx, nz, dx, dz, h, sample };
}

/** Soft sun visibility by marching the heightfield toward the sun. */
function sunVisibility(grid, x, y, z, maxDist = 4200) {
  let t = 10;
  let vis = 1;
  while (t < maxDist) {
    const px = x + SUN_DIR.x * t;
    const pz = z + SUN_DIR.z * t;
    const th = grid.sample(px, pz);
    if (th === -Infinity) break;
    const py = y + SUN_DIR.y * t;
    vis = Math.min(vis, (12 * (py - th)) / t);
    if (vis <= 0) return 0;
    t += 6 + t * 0.025;
  }
  return clamp(vis, 0, 1);
}

function terrainMesh(grid, { albedo, sun }) {
  const { x0, z0, nx, nz, dx, dz, h } = grid;
  const count = (nx + 1) * (nz + 1);
  const positions = new Float32Array(count * 3);
  for (let iz = 0; iz <= nz; iz++) {
    for (let ix = 0; ix <= nx; ix++) {
      const i = iz * (nx + 1) + ix;
      positions[i * 3] = x0 + ix * dx;
      positions[i * 3 + 1] = h[i];
      positions[i * 3 + 2] = z0 + iz * dz;
    }
  }
  const index = new Uint32Array(nx * nz * 6);
  let k = 0;
  for (let iz = 0; iz < nz; iz++) {
    for (let ix = 0; ix < nx; ix++) {
      const a = iz * (nx + 1) + ix;
      const b = a + 1;
      const c = a + nx + 1;
      const d = c + 1;
      index[k++] = a;
      index[k++] = c;
      index[k++] = b;
      index[k++] = b;
      index[k++] = c;
      index[k++] = d;
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setIndex(new THREE.BufferAttribute(index, 1));
  geo.computeVertexNormals();

  const normals = geo.getAttribute("normal").array;
  const colors = new Float32Array(count * 3);
  const sunAttr = new Float32Array(count);
  const tmp = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];
    const slope = 1 - normals[i * 3 + 1];
    albedo(tmp, x, y, z, slope);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
    sunAttr[i] = sun ? sun(x, y, z) : 0;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.setAttribute("aSun", new THREE.BufferAttribute(sunAttr, 1));
  return new THREE.Mesh(geo, terrainMaterial());
}

// ---------------------------------------------------------------------------
// Albedo rules
// ---------------------------------------------------------------------------

function snowCover(x, y, z, slope, line) {
  const n = N.fbm(x * 0.004, z * 0.004, 4);
  const byHeight = smoothstep(line - 90, line + 70, y + n * 110);
  const bySlope = 1 - smoothstep(0.38, 0.6, slope + N.fbm(x * 0.02, z * 0.02, 2) * 0.09);
  return byHeight * bySlope;
}

function rockColor(out, x, z) {
  const t = clamp(0.5 + 0.6 * N.fbm(x * 0.006 + 7, z * 0.006, 3), 0, 1);
  return out.copy(PALETTE.rockDark).lerp(PALETTE.rockWarm, t);
}

function massifAlbedo(out, x, y, z, slope) {
  rockColor(out, x, z);
  if (y < 900) out.lerp(PALETTE.scree, smoothstep(900, 700, y) * 0.8);
  const snow = snowCover(x, y, z, slope, 860);
  const snowTone = tmpColor.copy(PALETTE.snowShade).lerp(PALETTE.snow, clamp(0.5 + N.fbm(x * 0.01, z * 0.01, 2), 0, 1));
  return out.lerp(snowTone, snow);
}

function farAlbedo(out, x, y, z, slope) {
  rockColor(out, x, z);
  return out.lerp(PALETTE.snow, snowCover(x, y, z, slope, 1350) * 0.9);
}

function ridgeAlbedo(out, x, y, z, slope) {
  const n = clamp(0.5 + N.fbm(x * 0.01, z * 0.01, 3), 0, 1);
  out.copy(PALETTE.forest).lerp(PALETTE.forestLight, n * 0.7);
  const rocky = smoothstep(0.45, 0.65, slope + N.fbm(x * 0.02 + 3, z * 0.02, 2) * 0.15);
  out.lerp(PALETTE.rockDark, rocky * 0.8);
  return out.lerp(PALETTE.snowShade, snowCover(x, y, z, slope, 668) * 0.55);
}

function foreAlbedo(out, x, y, z, slope) {
  const n = clamp(0.5 + N.fbm(x * 0.02, z * 0.02, 3), 0, 1);
  out.copy(PALETTE.forest).lerp(PALETTE.forestLight, n * 0.5);
  return out.lerp(PALETTE.rockDark, smoothstep(0.5, 0.7, slope) * 0.6);
}

const tmpColor = new THREE.Color();

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------

const GLSL_NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x - floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p){ float s = 0.0; float a = 0.5; for (int i = 0; i < 5; i++){ s += a * snoise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
`;

export const ATMOSPHERE = {
  fogDensity: 9.4e-5,
  aerial: 6.5e-5,
  heightFog: 0.68,
  heightFogBase: 470,
  heightFogFalloff: 120,
};

function terrainMaterial({ tree = false } = {}) {
  return new THREE.ShaderMaterial({
    vertexColors: true,
    defines: tree ? { TREE: "" } : {},
    uniforms: {
      uSunDir: { value: SUN_DIR },
      uSunColor: { value: C(light.sunColor).multiplyScalar(light.sunPower) },
      uRimColor: { value: PALETTE.rim.clone().multiplyScalar(light.rim) },
      uSkyColor: { value: PALETTE.ambientSky.clone().multiplyScalar(light.ambient) },
      uGroundColor: { value: PALETTE.ambientGround },
      uFogColor: { value: C(light.fog) },
      uFogSunColor: { value: C(light.fogSun) },
      uCamPos: { value: CAMERA.position },
      uFogDensity: { value: ATMOSPHERE.fogDensity },
      uHeightFog: { value: ATMOSPHERE.heightFog },
      uHeightFogBase: { value: ATMOSPHERE.heightFogBase },
      uHeightFogFalloff: { value: ATMOSPHERE.heightFogFalloff },
      uTreeSun: { value: 0 },
      uAerial: { value: ATMOSPHERE.aerial },
      uAmbient: { value: 1 },
    },
    vertexShader: /* glsl */ `
      attribute float aSun;
      uniform float uTreeSun;
      varying vec3 vAlbedo;
      varying float vSun;
      varying vec3 vWorld;
      varying vec3 vN;
      void main() {
        #ifdef USE_INSTANCING
          vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
        #else
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vN = normalize(mat3(modelMatrix) * normal);
        #endif
        vAlbedo = color;
        #ifdef USE_INSTANCING_COLOR
          vAlbedo *= instanceColor;
        #endif
        #ifdef TREE
          vSun = uTreeSun;
        #else
          vSun = aSun;
        #endif
        vWorld = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunDir;
      uniform vec3 uSunColor;
      uniform vec3 uRimColor;
      uniform vec3 uSkyColor;
      uniform vec3 uGroundColor;
      uniform vec3 uFogColor;
      uniform vec3 uFogSunColor;
      uniform vec3 uCamPos;
      uniform float uFogDensity;
      uniform float uHeightFog;
      uniform float uHeightFogBase;
      uniform float uHeightFogFalloff;
      uniform float uAerial;
      uniform float uAmbient;
      varying vec3 vAlbedo;
      varying float vSun;
      varying vec3 vWorld;
      varying vec3 vN;
      ${GLSL_NOISE}
      void main() {
        vec3 n = normalize(vN);
        // Fine surface detail below mesh resolution (rock striation, snow ripples).
        vec2 q = vWorld.xz * 0.03;
        n = normalize(n + 0.13 * vec3(snoise(q), 0.0, snoise(q.yx + 9.2)) * (1.0 - n.y * 0.6));
        float ndl = max(dot(n, uSunDir), 0.0);
        float hemi = n.y * 0.5 + 0.5;
        vec3 ambient = mix(uGroundColor, uSkyColor, hemi) * uAmbient;
        float grain = 0.92 + 0.16 * snoise(vWorld.xz * 0.11 + vWorld.y * 0.05);
        vec3 albedo = vAlbedo * grain;
        vec3 lit = albedo * (ambient + uSunColor * ndl * vSun + uRimColor * ndl);

        float dist = length(vWorld - uCamPos);
        float fog = 1.0 - exp(-pow(uFogDensity * dist, 2.0));
        fog = max(fog, 1.0 - exp(-dist * uAerial));
        float hf = uHeightFog * exp(-(vWorld.y - uHeightFogBase) / uHeightFogFalloff) * (1.0 - exp(-dist * 0.00035));
        fog = clamp(fog + hf, 0.0, 1.0);
        vec3 viewDir = normalize(vWorld - uCamPos);
        float toSun = pow(max(dot(normalize(vec3(viewDir.x, 0.0, viewDir.z)), normalize(vec3(uSunDir.x, 0.0, uSunDir.z))), 0.0), 3.0);
        vec3 fogColor = mix(uFogColor, uFogSunColor, toSun * 0.8);
        gl_FragColor = vec4(mix(lit, fogColor, fog), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
}

function skyMaterial() {
  return new THREE.ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uInvProj: { value: new THREE.Matrix4() },
      uCamWorld: { value: new THREE.Matrix4() },
      uSunDir: { value: SUN_DIR },
      uZenith: { value: C(light.sky.zenith) },
      uUpper: { value: C(light.sky.upper) },
      uBelt: { value: C(light.sky.belt) },
      uHorizon: { value: C(light.sky.horizon) },
      uGlow: { value: C(light.sky.glow) },
      uClouds: { value: 1 },
      uGlowPow: { value: 3 },
      uGlowAmount: { value: 0.18 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      uniform mat4 uInvProj;
      uniform mat4 uCamWorld;
      uniform vec3 uSunDir;
      uniform vec3 uZenith;
      uniform vec3 uUpper;
      uniform vec3 uBelt;
      uniform vec3 uHorizon;
      uniform vec3 uGlow;
      uniform float uClouds;
      uniform float uGlowPow;
      uniform float uGlowAmount;
      varying vec2 vUv;
      ${GLSL_NOISE}
      void main() {
        vec4 view = uInvProj * vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
        view /= view.w;
        vec3 dir = normalize((uCamWorld * vec4(view.xyz, 0.0)).xyz);
        float e = dir.y;
        float sunSide = max(dot(normalize(vec3(dir.x, 0.0, dir.z)), normalize(vec3(uSunDir.x, 0.0, uSunDir.z))), 0.0);
        vec3 col = uHorizon;
        col = mix(col, uBelt, smoothstep(0.005, 0.085, e));
        col = mix(col, uUpper, smoothstep(0.07, 0.24, e));
        col = mix(col, uZenith, smoothstep(0.22, 0.7, e));
        float glow = pow(max(dot(dir, uSunDir), 0.0), uGlowPow);
        col += uGlow * (uGlowAmount * glow + 0.12 * exp(-abs(e - 0.03) * 26.0) * (0.35 + 0.65 * sunSide));
        if (e > 0.004) {
          vec2 uv = dir.xz / max(e, 0.02) * 0.22;
          float c = fbm(uv * vec2(0.35, 1.1) + vec2(3.1, 7.7));
          float density = smoothstep(0.25, 0.85, c) * uClouds * 0.7;
          density *= smoothstep(0.02, 0.1, e) * (1.0 - smoothstep(0.32, 0.62, e));
          vec3 cloud = mix(uUpper * 1.35, uBelt * 0.9 + uGlow * 0.35, clamp(0.25 + 0.75 * sunSide + glow, 0.0, 1.0));
          col = mix(col, cloud, density * 0.45);
        }
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
}

// ---------------------------------------------------------------------------
// Trees
// ---------------------------------------------------------------------------

function pineGeometry() {
  const parts = [];
  const paint = (geo, color) => {
    const n = geo.getAttribute("position").count;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = color.r;
      arr[i * 3 + 1] = color.g;
      arr[i * 3 + 2] = color.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
    geo.setAttribute("aSun", new THREE.BufferAttribute(new Float32Array(n), 1));
    return geo;
  };
  const trunk = new THREE.CylinderGeometry(0.18, 0.32, 4, 5, 1, true);
  trunk.translate(0, 2, 0);
  parts.push(paint(trunk, PALETTE.trunk));
  const tiers = 5;
  for (let k = 0; k < tiers; k++) {
    const r = 2.6 * (1 - k * 0.17);
    const h = 6.2 - k * 0.7;
    const cone = new THREE.ConeGeometry(r, h, 7, 1, true);
    cone.translate(0, 3 + k * 3.1 + h / 2, 0);
    parts.push(paint(cone, k % 2 ? PALETTE.pineLight : PALETTE.pine));
  }
  const merged = mergeGeometries(parts.map((g) => g.toNonIndexed()));
  merged.computeVertexNormals();
  // Normalise height to 1 unit so instances scale in metres.
  merged.computeBoundingBox();
  const s = 1 / merged.boundingBox.max.y;
  merged.scale(s, s, s);
  return merged;
}

function forest(grid, { density, minDist, spacing, heightRange, accept, seed }) {
  const rand = createNoise(seed).random;
  const points = [];
  for (let z = grid.z0 + spacing; z < grid.z1 - spacing; z += spacing) {
    for (let x = grid.x0 + spacing; x < grid.x1 - spacing; x += spacing) {
      const jx = x + (rand() - 0.5) * spacing * 0.9;
      const jz = z + (rand() - 0.5) * spacing * 0.9;
      if (-jz < minDist) continue;
      const y = grid.sample(jx, jz);
      if (y === -Infinity) continue;
      const slope = Math.abs(grid.sample(jx + 2, jz) - grid.sample(jx - 2, jz)) / 4 + Math.abs(grid.sample(jx, jz + 2) - grid.sample(jx, jz - 2)) / 4;
      const clump = 0.5 + 0.5 * N.fbm(jx * 0.008, jz * 0.008, 3);
      if (rand() > density * clump) continue;
      if (accept && !accept(jx, y, jz, slope)) continue;
      points.push([jx, y - 0.6, jz, lerp(heightRange[0], heightRange[1], rand()), rand()]);
    }
  }
  const geo = pineGeometry();
  const mesh = new THREE.InstancedMesh(geo, terrainMaterial({ tree: true }), points.length);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const e = new THREE.Euler();
  const tint = new THREE.Color();
  points.forEach(([x, y, z, h, r], i) => {
    e.set((r - 0.5) * 0.08, r * Math.PI * 2, (r - 0.5) * 0.06);
    q.setFromEuler(e);
    const w = h * (0.95 + r * 0.35);
    s.set(w, h, w);
    p.set(x, y, z);
    m.compose(p, q, s);
    mesh.setMatrixAt(i, m);
    tint.setScalar(0.8 + r * 0.4);
    mesh.setColorAt(i, tint);
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  return mesh;
}

// ---------------------------------------------------------------------------
// Scene assembly
// ---------------------------------------------------------------------------

export function createCamera(aspect) {
  const cam = new THREE.PerspectiveCamera(CAMERA.fovDeg, aspect, 1, 40000);
  cam.position.copy(CAMERA.position);
  const pitch = deg(CAMERA.pitchDeg);
  cam.lookAt(CAMERA.position.x, CAMERA.position.y + Math.tan(pitch) * 1000, CAMERA.position.z - 1000);
  cam.updateMatrixWorld();
  cam.updateProjectionMatrix();
  return cam;
}

/** Telephoto view from the same spot, framed on the upper massif: the arrival. */
export function createArrivalCamera(aspect) {
  const cam = new THREE.PerspectiveCamera(24, aspect, 1, 40000);
  cam.position.copy(CAMERA.position);
  cam.lookAt(300, 1460, -5200);
  cam.updateMatrixWorld();
  cam.updateProjectionMatrix();
  return cam;
}

export function createHeroScene({ quality = 1 } = {}) {
  const q = (n) => Math.max(8, Math.round(n * quality));
  const t0 = performance.now();

  const farGrid = heightGrid(farHeight, { x0: -10500, x1: 10500, z0: -15000, z1: -9000, nx: q(1050), nz: q(300) });
  const massifGrid = heightGrid(massifHeight, { x0: -4800, x1: 5400, z0: -7800, z1: -3200, nx: q(1360), nz: q(620) });
  const ridgeGrid = heightGrid(ridgeHeight, { x0: -2400, x1: 2400, z0: -2900, z1: -1250, nx: q(960), nz: q(330) });
  const foreGrid = heightGrid(foreHeight, { x0: -760, x1: 760, z0: -1100, z1: -140, nx: q(600), nz: q(380) });

  const [maskLow, maskHigh] = light.massifMask;
  const lowSun = (x, y, z) => smoothstep(maskLow, maskHigh, y + N.fbm(x * 0.002, z * 0.002, 3) * 120);

  const far = new THREE.Group();
  far.add(terrainMesh(farGrid, { albedo: farAlbedo, sun: (x, y) => smoothstep(light.farMask[0], light.farMask[1], y) }));

  const massif = new THREE.Group();
  massif.add(
    terrainMesh(massifGrid, {
      albedo: massifAlbedo,
      sun: (x, y, z) => {
        const mask = lowSun(x, y, z);
        return mask > 0 ? mask * sunVisibility(massifGrid, x, y, z) : 0;
      },
    }),
  );

  const ridge = new THREE.Group();
  ridge.add(terrainMesh(ridgeGrid, { albedo: ridgeAlbedo, sun: null }));
  ridge.add(
    forest(ridgeGrid, {
      density: 0.7,
      minDist: 1500,
      spacing: 13,
      heightRange: [16, 27],
      seed: 21,
      accept: (x, y, z, slope) => slope < 0.75 && y < 672 + N.fbm(x * 0.01, z * 0.01) * 10,
    }),
  );

  const fore = new THREE.Group();
  fore.add(terrainMesh(foreGrid, { albedo: foreAlbedo, sun: null }));
  fore.add(
    forest(foreGrid, {
      density: 0.85,
      minDist: 300,
      spacing: 7.5,
      heightRange: [17, 31],
      seed: 5,
      accept: (x, y, z, slope) => slope < 0.9,
    }),
  );

  // Lift the near layers out of pure black: forest green, not void.
  const ambient = (group, value) =>
    group.traverse((o) => {
      if (o.material?.uniforms?.uAmbient) o.material.uniforms.uAmbient.value = value;
    });
  ambient(ridge, 1.25);
  ambient(fore, 1.9);

  const skyQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), skyMaterial());
  skyQuad.frustumCulled = false;
  skyQuad.renderOrder = -1;

  console.log(`[landscape] built hero scene in ${Math.round(performance.now() - t0)}ms`);
  return {
    layers: { sky: skyQuad, far, massif, ridge, fore },
    grids: { far: farGrid, massif: massifGrid, ridge: ridgeGrid, fore: foreGrid },
  };
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

let renderer;
export function getRenderer(width, height) {
  if (!renderer) {
    const canvas = document.createElement("canvas");
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  return renderer;
}

export function renderLayers(parts, camera, width, height, names) {
  const r = getRenderer(width, height);
  const sky = parts.layers.sky;
  sky.material.uniforms.uInvProj.value.copy(camera.projectionMatrixInverse);
  sky.material.uniforms.uCamWorld.value.copy(camera.matrixWorld);
  const out = {};
  for (const name of names) {
    const scene = new THREE.Scene();
    const list = name === "composite" ? ["sky", "far", "massif", "ridge", "fore"] : [name];
    for (const n of list) scene.add(parts.layers[n]);
    r.setClearColor(0x000000, 0);
    r.clear();
    r.render(scene, camera);
    out[name] = r.domElement.toDataURL("image/png");
    for (const n of list) scene.remove(parts.layers[n]);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Route (trail) data for the SVG overlay
// ---------------------------------------------------------------------------

// Switchbacks up the snow apron, then the final ridge to the summit.
const ROUTE_PLAN = [
  [-120, -3950],
  [330, -4130],
  [20, -4320],
  [430, -4500],
  [250, -4640],
  [600, -4720],
  [560, -4880],
  [680, -5000],
  [SUMMIT.x, SUMMIT.z],
];

export function routeWorldPoints(samples = 220) {
  const curvePts = ROUTE_PLAN.map(([x, z]) => new THREE.Vector3(x, 0, z));
  const spline = new THREE.CatmullRomCurve3(curvePts, false, "centripetal", 0.5);
  return spline.getSpacedPoints(samples).map((p) => {
    const y = massifHeight(p.x, p.z) + 3;
    return new THREE.Vector3(p.x, y, p.z);
  });
}

/** Is world point p hidden from the camera by any terrain grid? */
function occluded(p, grids) {
  const cam = CAMERA.position;
  const steps = 260;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    if (t > 0.985) break;
    const x = lerp(cam.x, p.x, t);
    const y = lerp(cam.y, p.y, t);
    const z = lerp(cam.z, p.z, t);
    for (const g of grids) {
      const h = g.sample(x, z);
      if (h !== -Infinity && h > y + 1) return true;
    }
  }
  return false;
}

export function routeScreenData(parts, camera, width, height) {
  const world = routeWorldPoints();
  const grids = [parts.grids.massif, parts.grids.ridge, parts.grids.fore];
  const toScreen = (v) => {
    const p = v.clone().project(camera);
    return [((p.x + 1) / 2) * width, ((1 - p.y) / 2) * height];
  };
  const points = world.map((v) => ({ xy: toScreen(v), hidden: occluded(v, grids) }));
  const summit = toScreen(new THREE.Vector3(SUMMIT.x, massifHeight(SUMMIT.x, SUMMIT.z), SUMMIT.z));
  return { points, summit };
}

// ---------------------------------------------------------------------------
// Topographic contour map of the massif (plan view)
// ---------------------------------------------------------------------------

export function topoData({ x0 = -3600, x1 = 4600, z0 = -7400, z1 = -3500, cell = 24, step = 50 } = {}) {
  const nx = Math.round((x1 - x0) / cell);
  const nz = Math.round((z1 - z0) / cell);
  const g = heightGrid(massifHeight, { x0, x1, z0, z1, nx, nz });
  const levels = [];
  for (let l = 800; l <= 1900; l += step) levels.push(l);
  const W = nx;
  const H = nz;
  const at = (ix, iz) => g.h[iz * (nx + 1) + ix];
  const lines = levels.map((level) => {
    const segs = [];
    for (let iz = 0; iz < nz; iz++) {
      for (let ix = 0; ix < nx; ix++) {
        const a = at(ix, iz);
        const b = at(ix + 1, iz);
        const c = at(ix + 1, iz + 1);
        const d = at(ix, iz + 1);
        const idx = (a > level) | ((b > level) << 1) | ((c > level) << 2) | ((d > level) << 3);
        if (idx === 0 || idx === 15) continue;
        const e = (p, q, vp, vq) => {
          const t = (level - vp) / (vq - vp);
          return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
        };
        const A = [ix, iz];
        const B = [ix + 1, iz];
        const Cc = [ix + 1, iz + 1];
        const D = [ix, iz + 1];
        const top = () => e(A, B, a, b);
        const right = () => e(B, Cc, b, c);
        const bottom = () => e(D, Cc, d, c);
        const left = () => e(A, D, a, d);
        const table = {
          1: [[left, top]], 2: [[top, right]], 3: [[left, right]], 4: [[right, bottom]],
          5: [[left, top], [right, bottom]], 6: [[top, bottom]], 7: [[left, bottom]], 8: [[bottom, left]],
          9: [[bottom, top]], 10: [[top, right], [bottom, left]], 11: [[bottom, right]], 12: [[right, left]],
          13: [[right, top]], 14: [[top, left]],
        };
        for (const [f, h] of table[idx]) segs.push([f(), h()]);
      }
    }
    return { level, polylines: joinSegments(segs) };
  });
  const toPlan = ([x, z]) => [((x - x0) / (x1 - x0)) * W, ((z - z0) / (z1 - z0)) * H];
  const route = routeWorldPoints(160).map((p) => toPlan([p.x, p.z]));
  return { width: W, height: H, lines, route, summit: toPlan([SUMMIT.x, SUMMIT.z]) };
}

function joinSegments(segs) {
  // Chain marching-squares segments into polylines, in either direction.
  const key = ([x, y]) => `${x.toFixed(3)},${y.toFixed(3)}`;
  const byPoint = new Map();
  segs.forEach((s, i) => {
    for (const end of [0, 1]) {
      const k = key(s[end]);
      if (!byPoint.has(k)) byPoint.set(k, []);
      byPoint.get(k).push(i);
    }
  });
  const used = new Uint8Array(segs.length);
  const extend = (line) => {
    for (let guard = 0; guard < 200000; guard++) {
      const tail = line[line.length - 1];
      const next = byPoint.get(key(tail))?.find((j) => !used[j]);
      if (next === undefined) return;
      used[next] = 1;
      const [a, b] = segs[next];
      line.push(key(a) === key(tail) ? b : a);
    }
  };
  const lines = [];
  for (let i = 0; i < segs.length; i++) {
    if (used[i]) continue;
    used[i] = 1;
    const line = [segs[i][0], segs[i][1]];
    extend(line);
    line.reverse();
    extend(line);
    if (line.length > 3) lines.push(line);
  }
  return lines;
}

// ---------------------------------------------------------------------------
// Drifting mist texture (horizontally tileable)
// ---------------------------------------------------------------------------

export function mistTexture(width = 2048, height = 512, seed = 3) {
  const noise = createNoise(seed);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(width, height);
  const R = 0.7;
  for (let y = 0; y < height; y++) {
    const v = y / height;
    const vertical = smoothstep(0, 0.35, v) * (1 - smoothstep(0.6, 1, v));
    for (let x = 0; x < width; x++) {
      const a = (x / width) * Math.PI * 2;
      const cx = Math.cos(a) * R;
      const cz = Math.sin(a) * R;
      let s = 0;
      let amp = 0.55;
      let f = 1;
      for (let o = 0; o < 5; o++) {
        s += amp * noise.noise3D(cx * f, v * 6.5 * f, cz * f);
        amp *= 0.5;
        f *= 2;
      }
      const alpha = smoothstep(-0.15, 0.55, s) * vertical;
      const i = (y * width + x) * 4;
      img.data[i] = 214;
      img.data[i + 1] = 222;
      img.data[i + 2] = 219;
      img.data[i + 3] = Math.round(alpha * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL("image/png");
}
