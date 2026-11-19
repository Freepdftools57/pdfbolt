"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { ToolLayout } from "@/components/tool-layout";
import { FileDropZone } from "@/components/file-drop-zone";
import { uint8ToBlob, uint8ToArrayBuffer } from "@/lib/pdf-utils";

type SplitMode = "ranges" | "each";

export default function SplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<SplitMode>("ranges");
  const [ranges, setRanges] = useState("1-3, 4-6");
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
      setRanges(`1-${Math.min(3, doc.getPageCount())}`);
    } catch {
      setError("Could not read this PDF. It may be corrupted or encrypted.");
    }
  }, []);

  const parseRanges = useCallback(
    (input: string): number[][] | null => {
      const result: number[][] = [];
      const parts = input.split(",").map((s) => s.trim()).filter(Boolean);

      for (const part of parts) {
        const match = part.match(/^(\d+)\s*-\s*(\d+)$/);
        if (match) {
          const start = parseInt(match[1]);
          const end = parseInt(match[2]);
          if (start < 1 || end > pageCount || start > end) return null;
          const pages: number[] = [];
          for (let i = start; i <= end; i++) pages.push(i - 1);
          result.push(pages);
        } else {
          const num = parseInt(part);
          if (isNaN(num) || num < 1 || num > pageCount) return null;
          result.push([num - 1]);
        }
      }

      return result.length > 0 ? result : null;
    },
    [pageCount]
  );

  const split = useCallback(async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);

    try {
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      if (mode === "each") {
        const zip = new JSZip();

        for (let i = 0; i < srcDoc.getPageCount(); i++) {
          const newDoc = await PDFDocument.create();
          const [page] = await newDoc.copyPages(srcDoc, [i]);
          newDoc.addPage(page);
          const pdfBytes = await newDoc.save();
          zip.file(`page-${i + 1}.pdf`, uint8ToArrayBuffer(pdfBytes));
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "split-pages.zip");
      } else {
        const parsed = parseRanges(ranges);
        if (!parsed) {
          setError(`Invalid range. Use format like "1-3, 4-6" with pages 1-${pageCount}.`);
          setProcessing(false);
          return;
        }

        if (parsed.length === 1) {
          const newDoc = await PDFDocument.create();
          const pages = await newDoc.copyPages(srcDoc, parsed[0]);
          for (const page of pages) newDoc.addPage(page);
          const pdfBytes = await newDoc.save();
          saveAs(uint8ToBlob(pdfBytes), "split.pdf");
        } else {
          const zip = new JSZip();
          for (let i = 0; i < parsed.length; i++) {
            const newDoc = await PDFDocument.create();
            const pages = await newDoc.copyPages(srcDoc, parsed[i]);
            for (const page of pages) newDoc.addPage(page);
            const pdfBytes = await newDoc.save();
            zip.file(`part-${i + 1}.pdf`, uint8ToArrayBuffer(pdfBytes));
          }
          const zipBlob = await zip.generateAsync({ type: "blob" });
          saveAs(zipBlob, "split-parts.zip");
        }
      }
    } catch (err) {
      setError("Failed to split the PDF. The file may be corrupted.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }, [file, mode, ranges, parseRanges, pageCount]);

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract pages or split a PDF into multiple documents."
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

          <div className="flex gap-3">
            <button
              onClick={() => setMode("ranges")}
              className={`flex-1 py-2 px-4 text-sm rounded-lg border transition-colors ${
                mode === "ranges"
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border text-muted hover:text-foreground hover:bg-card-hover"
              }`}
            >
              By page ranges
            </button>
            <button
              onClick={() => setMode("each")}
              className={`flex-1 py-2 px-4 text-sm rounded-lg border transition-colors ${
                mode === "each"
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border text-muted hover:text-foreground hover:bg-card-hover"
              }`}
            >
              Extract every page
            </button>
          </div>

          {mode === "ranges" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Page ranges
              </label>
              <input
                type="text"
                value={ranges}
                onChange={(e) => setRanges(e.target.value)}
                placeholder="e.g. 1-3, 5, 7-10"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted mt-1">
                Separate ranges with commas. Use &quot;1-3&quot; for a range or &quot;5&quot; for a single page.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={split}
              disabled={processing}
              className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? "Splitting..." : "Split PDF"}
            </button>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
    </ToolLayout>
  );
}
