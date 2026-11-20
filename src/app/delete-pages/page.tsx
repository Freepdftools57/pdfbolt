"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { ToolLayout } from "@/components/tool-layout";
import { FileDropZone } from "@/components/file-drop-zone";
import { uint8ToBlob } from "@/lib/pdf-utils";
import { Faq } from "@/components/faq";

const faqItems = [
  { question: "How do I select pages to delete?", answer: "After uploading your PDF, you'll see a grid of page numbers. Click on any page number to mark it for deletion. Click again to deselect. Red highlighted pages will be removed." },
  { question: "Can I delete all pages?", answer: "No. A PDF must have at least one page. You'll see an error if you try to select all pages for deletion." },
  { question: "Does this modify my original file?", answer: "No. PDFBolt creates a new PDF without the deleted pages. Your original file remains unchanged on your device." },
  { question: "Is my file sent to a server?", answer: "No. All processing happens locally in your browser. Your PDF never leaves your device." },
];

export default function DeletePagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
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
      setSelected(new Set());
      setError(null);
    } catch {
      setError("Could not read this PDF.");
    }
  }, []);

  const togglePage = useCallback((page: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  }, []);

  const apply = useCallback(async () => {
    if (!file || selected.size === 0) return;
    if (selected.size >= pageCount) {
      setError("You can't delete all pages.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      const keepIndices = Array.from({ length: pageCount }, (_, i) => i).filter(
        (i) => !selected.has(i)
      );

      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(doc, keepIndices);
      for (const page of pages) newDoc.addPage(page);

      const pdfBytes = await newDoc.save();
      const name = file.name.replace(/\.pdf$/i, "");
      saveAs(uint8ToBlob(pdfBytes), `${name}-edited.pdf`);
    } catch (err) {
      setError("Failed to delete pages.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }, [file, selected, pageCount]);

  return (
    <ToolLayout
      title="Delete Pages"
      description="Select and remove unwanted pages from your PDF."
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
              onClick={() => { setFile(null); setPageCount(0); setSelected(new Set()); setError(null); }}
              className="text-sm text-muted hover:text-foreground"
            >
              Change file
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Click pages to mark for deletion
              {selected.size > 0 && (
                <span className="text-danger ml-2">({selected.size} selected)</span>
              )}
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {Array.from({ length: pageCount }, (_, i) => (
                <button
                  key={i}
                  onClick={() => togglePage(i)}
                  className={`py-2 text-sm rounded-lg border transition-colors ${
                    selected.has(i)
                      ? "bg-danger/20 border-danger text-danger line-through"
                      : "border-border text-muted hover:text-foreground hover:bg-card-hover"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelected(new Set())}
              className="text-sm text-muted hover:text-foreground"
            >
              Clear selection
            </button>
            <button
              onClick={apply}
              disabled={processing || selected.size === 0}
              className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? "Deleting..." : `Delete ${selected.size} page${selected.size !== 1 ? "s" : ""} & download`}
            </button>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
      <Faq items={faqItems} />
    </ToolLayout>
  );
}
