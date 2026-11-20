"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { ToolLayout } from "@/components/tool-layout";
import { FileDropZone } from "@/components/file-drop-zone";
import { uint8ToBlob } from "@/lib/pdf-utils";
import { Faq } from "@/components/faq";

const faqItems = [
  { question: "How do I reorder pages?", answer: "After uploading your PDF, you'll see all pages listed with up and down arrows. Use the arrows to move pages to their desired position." },
  { question: "Can I see which pages have been moved?", answer: "Yes. If a page has been moved from its original position, the original position number is shown below the page label in blue." },
  { question: "Does reordering affect page content?", answer: "No. Pages are copied exactly as they are. Only the order changes — no content is modified." },
  { question: "Is my file processed locally?", answer: "Yes. All reordering happens in your browser. Your file never leaves your device." },
];

interface PageItem {
  originalIndex: number;
  label: string;
}

export default function ReorderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setPages(
        Array.from({ length: count }, (_, i) => ({
          originalIndex: i,
          label: `Page ${i + 1}`,
        }))
      );
      setFile(f);
      setError(null);
    } catch {
      setError("Could not read this PDF.");
    }
  }, []);

  const movePage = useCallback((index: number, direction: -1 | 1) => {
    setPages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const apply = useCallback(async () => {
    if (!file || pages.length === 0) return;

    setProcessing(true);
    setError(null);

    try {
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      const newDoc = await PDFDocument.create();
      const newOrder = pages.map((p) => p.originalIndex);
      const copiedPages = await newDoc.copyPages(srcDoc, newOrder);
      for (const page of copiedPages) newDoc.addPage(page);

      const pdfBytes = await newDoc.save();
      const name = file.name.replace(/\.pdf$/i, "");
      saveAs(uint8ToBlob(pdfBytes), `${name}-reordered.pdf`);
    } catch (err) {
      setError("Failed to reorder pages.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }, [file, pages]);

  return (
    <ToolLayout
      title="Reorder PDF Pages"
      description="Rearrange the page order of your PDF document."
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
              <p className="text-xs text-muted">{pages.length} pages</p>
            </div>
            <button
              onClick={() => { setFile(null); setPages([]); setError(null); }}
              className="text-sm text-muted hover:text-foreground"
            >
              Change file
            </button>
          </div>

          <div className="space-y-2">
            {pages.map((page, i) => (
              <div
                key={`${page.originalIndex}-${i}`}
                className="file-item flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3"
              >
                <span className="text-xs text-muted font-mono w-6 text-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{page.label}</p>
                  {page.originalIndex !== i && (
                    <p className="text-xs text-primary">was position {page.originalIndex + 1}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => movePage(i, -1)}
                    disabled={i === 0}
                    className="p-1 text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => movePage(i, 1)}
                    disabled={i === pages.length - 1}
                    className="p-1 text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={apply}
              disabled={processing}
              className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? "Reordering..." : "Reorder & download"}
            </button>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
      <Faq items={faqItems} />
    </ToolLayout>
  );
}
