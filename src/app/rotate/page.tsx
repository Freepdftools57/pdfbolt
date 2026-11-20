"use client";

import { useState, useCallback } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { saveAs } from "file-saver";
import { ToolLayout } from "@/components/tool-layout";
import { FileDropZone } from "@/components/file-drop-zone";
import { uint8ToBlob } from "@/lib/pdf-utils";
import { Faq } from "@/components/faq";

const faqItems = [
  { question: "Can I rotate specific pages only?", answer: "Yes. Switch to 'Specific pages' mode and enter the page numbers you want to rotate, like '1, 3-5'. The rest of the pages will remain unchanged." },
  { question: "What rotation angles are available?", answer: "You can rotate by 90° (clockwise), 180° (upside down), or 270° (counter-clockwise). The rotation is applied on top of any existing rotation." },
  { question: "Does rotation affect the content quality?", answer: "No. The page is rotated without re-encoding. All text, images, and formatting remain exactly as they are." },
  { question: "Is my file uploaded to a server?", answer: "No. All processing happens locally in your browser. Your file stays on your device at all times." },
];

type RotationAngle = 90 | 180 | 270;

export default function RotatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [angle, setAngle] = useState<RotationAngle>(90);
  const [applyTo, setApplyTo] = useState<"all" | "custom">("all");
  const [customPages, setCustomPages] = useState("");
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

  const parsePages = useCallback(
    (input: string): number[] | null => {
      const result = new Set<number>();
      const parts = input.split(",").map((s) => s.trim()).filter(Boolean);

      for (const part of parts) {
        const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
        if (rangeMatch) {
          const start = parseInt(rangeMatch[1]);
          const end = parseInt(rangeMatch[2]);
          if (start < 1 || end > pageCount || start > end) return null;
          for (let i = start; i <= end; i++) result.add(i - 1);
        } else {
          const num = parseInt(part);
          if (isNaN(num) || num < 1 || num > pageCount) return null;
          result.add(num - 1);
        }
      }

      return result.size > 0 ? Array.from(result) : null;
    },
    [pageCount]
  );

  const rotate = useCallback(async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);

    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = doc.getPages();

      let targetIndices: number[];

      if (applyTo === "all") {
        targetIndices = pages.map((_, i) => i);
      } else {
        const parsed = parsePages(customPages);
        if (!parsed) {
          setError(`Invalid page selection. Use format like "1, 3-5" with pages 1-${pageCount}.`);
          setProcessing(false);
          return;
        }
        targetIndices = parsed;
      }

      for (const idx of targetIndices) {
        const page = pages[idx];
        const current = page.getRotation().angle;
        page.setRotation(degrees(current + angle));
      }

      const pdfBytes = await doc.save();
      const name = file.name.replace(/\.pdf$/i, "");
      saveAs(uint8ToBlob(pdfBytes), `${name}-rotated.pdf`);
    } catch (err) {
      setError("Failed to rotate PDF pages.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }, [file, angle, applyTo, customPages, parsePages, pageCount]);

  return (
    <ToolLayout
      title="Rotate PDF"
      description="Rotate PDF pages by 90°, 180°, or 270°."
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

          <div>
            <label className="block text-sm font-medium mb-2">Rotation</label>
            <div className="flex gap-2">
              {([90, 180, 270] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAngle(a)}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                    angle === a
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-border text-muted hover:text-foreground hover:bg-card-hover"
                  }`}
                >
                  {a}° {a === 90 ? "→" : a === 180 ? "↓" : "←"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Apply to</label>
            <div className="flex gap-2">
              <button
                onClick={() => setApplyTo("all")}
                className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                  applyTo === "all"
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border text-muted hover:text-foreground hover:bg-card-hover"
                }`}
              >
                All pages
              </button>
              <button
                onClick={() => setApplyTo("custom")}
                className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                  applyTo === "custom"
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-border text-muted hover:text-foreground hover:bg-card-hover"
                }`}
              >
                Specific pages
              </button>
            </div>
          </div>

          {applyTo === "custom" && (
            <div>
              <input
                type="text"
                value={customPages}
                onChange={(e) => setCustomPages(e.target.value)}
                placeholder="e.g. 1, 3-5, 8"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted mt-1">
                Comma-separated page numbers or ranges
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={rotate}
              disabled={processing}
              className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? "Rotating..." : "Rotate & Download"}
            </button>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
      <Faq items={faqItems} />
    </ToolLayout>
  );
}
