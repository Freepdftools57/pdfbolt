"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { ToolLayout } from "@/components/tool-layout";
import { FileDropZone } from "@/components/file-drop-zone";
import { uint8ToBlob, formatFileSize } from "@/lib/pdf-utils";

interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: string;
  pageCount: number | null;
}

export default function MergePage() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback(async (newFiles: File[]) => {
    const pdfFiles: PdfFile[] = [];

    for (const file of newFiles) {
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        continue;
      }

      let pageCount: number | null = null;
      try {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        pageCount = doc.getPageCount();
      } catch {
        // skip page count if we can't read it
      }

      pdfFiles.push({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: formatFileSize(file.size),
        pageCount,
      });
    }

    setFiles((prev) => [...prev, ...pdfFiles]);
    setError(null);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const moveFile = useCallback((index: number, direction: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const merge = useCallback(async () => {
    if (files.length < 2) {
      setError("Add at least 2 PDF files to merge.");
      return;
    }

    setMerging(true);
    setError(null);

    try {
      const merged = await PDFDocument.create();

      for (const pdfFile of files) {
        const bytes = await pdfFile.file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        for (const page of pages) {
          merged.addPage(page);
        }
      }

      const pdfBytes = await merged.save();
      saveAs(uint8ToBlob(pdfBytes), "merged.pdf");
    } catch (err) {
      setError(
        "Failed to merge PDFs. One or more files may be corrupted or encrypted."
      );
      console.error(err);
    } finally {
      setMerging(false);
    }
  }, [files]);

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document. Drag to reorder."
    >
      <FileDropZone
        accept=".pdf,application/pdf"
        multiple
        onFiles={addFiles}
        label="Drop PDF files here"
        sublabel="or click to browse — add multiple files"
      />

      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          {files.map((f, i) => (
            <div
              key={f.id}
              className="file-item flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3"
            >
              <span className="text-xs text-muted font-mono w-6 text-center">
                {i + 1}
              </span>

              <svg className="w-5 h-5 text-danger shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{f.name}</p>
                <p className="text-xs text-muted">
                  {f.size}
                  {f.pageCount !== null && ` — ${f.pageCount} page${f.pageCount > 1 ? "s" : ""}`}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveFile(i, -1)}
                  disabled={i === 0}
                  className="p-1 text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => moveFile(i, 1)}
                  disabled={i === files.length - 1}
                  className="p-1 text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => removeFile(f.id)}
                  className="p-1 text-muted hover:text-danger"
                  title="Remove"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted">
              {files.length} file{files.length > 1 ? "s" : ""} selected
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setFiles([])}
                className="px-4 py-2 text-sm text-muted hover:text-foreground border border-border rounded-lg hover:bg-card-hover transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={merge}
                disabled={merging || files.length < 2}
                className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {merging ? "Merging..." : "Merge PDFs"}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-danger mt-2">{error}</p>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
