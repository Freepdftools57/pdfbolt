"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { ToolLayout } from "@/components/tool-layout";
import { FileDropZone } from "@/components/file-drop-zone";
import { uint8ToBlob, formatFileSize } from "@/lib/pdf-utils";

interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: string;
  previewUrl: string;
}

type PageSize = "fit" | "a4" | "letter";

export default function ImagesToPdfPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("fit");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addImages = useCallback((files: File[]) => {
    const accepted = files.filter((f) =>
      ["image/png", "image/jpeg", "image/webp"].includes(f.type)
    );

    const newImages: ImageFile[] = accepted.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      name: f.name,
      size: formatFileSize(f.size),
      previewUrl: URL.createObjectURL(f),
    }));

    setImages((prev) => [...prev, ...newImages]);
    setError(null);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const moveImage = useCallback((index: number, direction: -1 | 1) => {
    setImages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const convert = useCallback(async () => {
    if (images.length === 0) return;

    setProcessing(true);
    setError(null);

    try {
      const doc = await PDFDocument.create();

      for (const img of images) {
        const bytes = await img.file.arrayBuffer();
        const uint8 = new Uint8Array(bytes);

        let image;
        if (img.file.type === "image/png") {
          image = await doc.embedPng(uint8);
        } else {
          // JPEG and WebP (convert WebP via canvas)
          if (img.file.type === "image/webp") {
            const bitmap = await createImageBitmap(img.file);
            const canvas = document.createElement("canvas");
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(bitmap, 0, 0);
            const jpegBlob = await new Promise<Blob>((resolve) =>
              canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.95)
            );
            const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());
            image = await doc.embedJpg(jpegBytes);
          } else {
            image = await doc.embedJpg(uint8);
          }
        }

        let pageWidth: number;
        let pageHeight: number;

        if (pageSize === "a4") {
          pageWidth = 595.28;
          pageHeight = 841.89;
        } else if (pageSize === "letter") {
          pageWidth = 612;
          pageHeight = 792;
        } else {
          pageWidth = image.width;
          pageHeight = image.height;
        }

        const page = doc.addPage([pageWidth, pageHeight]);

        if (pageSize === "fit") {
          page.drawImage(image, { x: 0, y: 0, width: pageWidth, height: pageHeight });
        } else {
          // Fit image within page with margins
          const margin = 36;
          const maxW = pageWidth - margin * 2;
          const maxH = pageHeight - margin * 2;
          const ratio = Math.min(maxW / image.width, maxH / image.height);
          const w = image.width * ratio;
          const h = image.height * ratio;
          const x = (pageWidth - w) / 2;
          const y = (pageHeight - h) / 2;
          page.drawImage(image, { x, y, width: w, height: h });
        }
      }

      const pdfBytes = await doc.save();
      saveAs(uint8ToBlob(pdfBytes), "images.pdf");
    } catch (err) {
      setError("Failed to create PDF from images.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }, [images, pageSize]);

  return (
    <ToolLayout
      title="Images to PDF"
      description="Convert JPG, PNG, or WebP images into a single PDF document."
    >
      <FileDropZone
        accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
        multiple
        onFiles={addImages}
        label="Drop images here"
        sublabel="PNG, JPG, or WebP — click to browse"
      />

      {images.length > 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Page size</label>
            <div className="flex gap-2">
              {([
                ["fit", "Fit to image"],
                ["a4", "A4"],
                ["letter", "Letter"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setPageSize(value)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    pageSize === value
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-border text-muted hover:text-foreground hover:bg-card-hover"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div
                key={img.id}
                className="relative group bg-card border border-border rounded-lg overflow-hidden"
              >
                <img
                  src={img.previewUrl}
                  alt={img.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => moveImage(i, -1)}
                    disabled={i === 0}
                    className="p-1.5 bg-white/20 rounded text-white disabled:opacity-30"
                    title="Move left"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="p-1.5 bg-red-500/80 rounded text-white"
                    title="Remove"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveImage(i, 1)}
                    disabled={i === images.length - 1}
                    className="p-1.5 bg-white/20 rounded text-white disabled:opacity-30"
                    title="Move right"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-muted truncate px-2 py-1">{img.name}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted">
              {images.length} image{images.length > 1 ? "s" : ""}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
                  setImages([]);
                }}
                className="px-4 py-2 text-sm text-muted hover:text-foreground border border-border rounded-lg hover:bg-card-hover transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={convert}
                disabled={processing}
                className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? "Creating PDF..." : "Create PDF"}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
    </ToolLayout>
  );
}
