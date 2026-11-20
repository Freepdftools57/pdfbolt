"use client";

import { useState, useCallback } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { ToolLayout } from "@/components/tool-layout";
import { FileDropZone } from "@/components/file-drop-zone";
import { Faq } from "@/components/faq";

const faqItems = [
  { question: "What image formats can I export to?", answer: "You can export PDF pages as PNG or JPEG images. PNG is lossless and best for text-heavy documents, while JPEG produces smaller files." },
  { question: "Can I control the image resolution?", answer: "Yes. Use the quality slider to set the rendering scale from 1x (fast, lower resolution) to 4x (HD, higher resolution). Higher scales produce sharper images." },
  { question: "Is there a page limit?", answer: "No. All pages in your PDF will be converted. They are packaged into a single ZIP file for easy download." },
  { question: "Are my files uploaded anywhere?", answer: "No. All conversion happens locally in your browser. Your PDF never leaves your device." },
];

type ImageFormat = "png" | "jpeg";

export default function PdfToImagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [format, setFormat] = useState<ImageFormat>("png");
  const [scale, setScale] = useState(2);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      const bytes = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      setPageCount(pdf.numPages);
      setFile(f);
      setError(null);
    } catch {
      setError("Could not read this PDF.");
    }
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;

      const zip = new JSZip();
      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const ext = format === "png" ? "png" : "jpg";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvas, viewport }).promise;

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (b) => resolve(b!),
            mimeType,
            format === "jpeg" ? 0.92 : undefined
          );
        });

        zip.file(`page-${i}.${ext}`, blob);
        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const name = file.name.replace(/\.pdf$/i, "");
      saveAs(zipBlob, `${name}-images.zip`);
    } catch (err) {
      setError("Failed to convert PDF to images.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }, [file, format, scale]);

  return (
    <ToolLayout
      title="PDF to Images"
      description="Convert each page of a PDF to a PNG or JPG image."
    >
      {!file ? (
        <FileDropZone
          accept=".pdf,application/pdf"
          multiple={false}
          onFiles={loadFile}
          label="Drop a PDF file here"
          sublabel="or click to browse"
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted">{pageCount} pages</p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setPageCount(0);
                setError(null);
              }}
              className="text-sm text-muted hover:text-foreground"
            >
              Change file
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Format</label>
              <div className="flex gap-2">
                {(["png", "jpeg"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                      format === f
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border text-muted hover:text-foreground hover:bg-card-hover"
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Quality ({scale}x)
              </label>
              <input
                type="range"
                min={1}
                max={4}
                step={0.5}
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted">
                <span>Fast</span>
                <span>HD</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {processing && (
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm text-muted">{progress}%</span>
              </div>
            )}
            <button
              onClick={convert}
              disabled={processing}
              className="ml-auto px-6 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? "Converting..." : "Convert to images"}
            </button>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
      <Faq items={faqItems} />
    </ToolLayout>
  );
}
