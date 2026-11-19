"use client";

import { useState, useCallback } from "react";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { saveAs } from "file-saver";
import { ToolLayout } from "@/components/tool-layout";
import { FileDropZone } from "@/components/file-drop-zone";
import { uint8ToBlob } from "@/lib/pdf-utils";

export default function WatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(50);
  const [opacity, setOpacity] = useState(0.15);
  const [rotation, setRotation] = useState(-45);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
      setFile(f);
      setError(null);
    } catch {
      setError("Could not read this PDF.");
    }
  }, []);

  const apply = useCallback(async () => {
    if (!file || !text.trim()) return;

    setProcessing(true);
    setError(null);

    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const x = (width - textWidth) / 2;
        const y = height / 2;

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: degrees(rotation),
        });
      }

      const pdfBytes = await doc.save();
      const name = file.name.replace(/\.pdf$/i, "");
      saveAs(uint8ToBlob(pdfBytes), `${name}-watermarked.pdf`);
    } catch (err) {
      setError("Failed to add watermark.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }, [file, text, fontSize, opacity, rotation]);

  return (
    <ToolLayout
      title="Watermark PDF"
      description="Add a text watermark to every page of your PDF."
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
              onClick={() => { setFile(null); setPageCount(0); setError(null); }}
              className="text-sm text-muted hover:text-foreground"
            >
              Change file
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Watermark text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. CONFIDENTIAL, DRAFT, DO NOT COPY"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Font size ({fontSize}px)</label>
              <input
                type="range"
                min={20}
                max={120}
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted"><span>Small</span><span>Large</span></div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Opacity ({Math.round(opacity * 100)}%)</label>
              <input
                type="range"
                min={0.05}
                max={0.5}
                step={0.05}
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted"><span>Subtle</span><span>Strong</span></div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rotation ({rotation}&deg;)</label>
              <input
                type="range"
                min={-90}
                max={90}
                step={5}
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted"><span>-90&deg;</span><span>0&deg;</span><span>90&deg;</span></div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={apply}
              disabled={processing || !text.trim()}
              className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? "Adding watermark..." : "Add watermark & download"}
            </button>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
    </ToolLayout>
  );
}
