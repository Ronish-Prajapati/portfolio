"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  help?: string;
}

export default function ImageUpload({ name, label, defaultValue, help }: ImageUploadProps) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Upload failed.");
        return;
      }
      setUrl(data.url);
      toast.success("Image uploaded.");
    } catch {
      toast.error("Upload failed. Check your connection.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{label}</label>

      {/* Hidden field that actually submits with the form */}
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative w-full max-w-xs aspect-video rounded-lg overflow-hidden border border-border bg-muted">
          <Image src={url} alt={label} fill className="object-cover" sizes="320px" />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Uploading…" : "Upload Image"}
          </Button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {/* Also allow pasting a direct URL */}
      <Input
        type="text"
        placeholder="…or paste an image URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  );
}
