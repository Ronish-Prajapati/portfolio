"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Loader2, X, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface MultiImageUploadProps {
  name: string;
  label: string;
  defaultValue?: string[];
  help?: string;
}

export default function MultiImageUpload({
  name,
  label,
  defaultValue = [],
  help,
}: MultiImageUploadProps) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(data.error ?? `Failed to upload ${file.name}`);
          continue;
        }
        uploaded.push(data.url);
      }
      if (uploaded.length) {
        setUrls((prev) => [...prev, ...uploaded]);
        toast.success(`Uploaded ${uploaded.length} image${uploaded.length > 1 ? "s" : ""}.`);
      }
    } catch {
      toast.error("Upload failed. Check your connection.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function remove(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    setUrls((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{label}</label>

      {/* Hidden field submitted with the form (newline-separated URLs) */}
      <input type="hidden" name={name} value={urls.join("\n")} />

      {urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {urls.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted group"
            >
              <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" sizes="160px" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="p-1.5 rounded-full bg-white/90 text-black hover:bg-white disabled:opacity-30"
                  aria-label="Move left"
                >
                  <ArrowLeft size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-1.5 rounded-full bg-destructive text-destructive-foreground hover:opacity-90"
                  aria-label="Remove"
                >
                  <X size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === urls.length - 1}
                  className="p-1.5 rounded-full bg-white/90 text-black hover:bg-white disabled:opacity-30"
                  aria-label="Move right"
                >
                  <ArrowRight size={13} />
                </button>
              </div>
              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      <div>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Uploading…" : urls.length ? "Add more photos" : "Upload photos"}
        </Button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  );
}
