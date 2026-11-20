"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { ToolLayout } from "@/components/tool-layout";
import { FileDropZone } from "@/components/file-drop-zone";
import { uint8ToBlob } from "@/lib/pdf-utils";
import { Faq } from "@/components/faq";

const faqItems = [
  { question: "What does 'unlock PDF' mean?", answer: "Some PDFs have restrictions that prevent printing, copying text, or editing. Unlocking removes these restrictions so you can use the PDF freely." },
  { question: "Can this remove a password needed to open a PDF?", answer: "No. If a PDF requires a password to open (view), you must enter that password first. This tool removes owner/restriction passwords, not open passwords." },
  { question: "Is this legal?", answer: "Removing restrictions from PDFs you own or have permission to use is legal. Do not use this tool on files you don't have the right to modify." },
  { question: "Is my file processed locally?", answer: "Yes. The PDF is processed entirely in your browser. It is never uploaded to any server." },
];

export default function UnlockPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setDone(false);
    setError(null);
  }, []);

  const unlock = useCallback(async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);

    try {
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      // Re-create the document without any encryption/restrictions
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      for (const page of pages) {
        newDoc.addPage(page);
      }

      const pdfBytes = await newDoc.save();
      const name = file.name.replace(/\.pdf$/i, "");
      saveAs(uint8ToBlob(pdfBytes), `${name}-unlocked.pdf`);
      setDone(true);
    } catch (err) {
      setError("Failed to unlock this PDF. It may require an open password or be corrupted.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }, [file]);

  return (
    <ToolLayout
      title="Unlock PDF"
      description="Remove restrictions (printing, copying, editing) from PDF files."
    >
      {!file ? (
        <FileDropZone
          accept=".pdf,application/pdf"
          multiple={false}
          onFiles={loadFile}
          label="Drop a restricted PDF here"
          sublabel="or click to browse"
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{file.name}</p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setDone(false);
                setError(null);
              }}
              className="text-sm text-muted hover:text-foreground"
            >
              Change file
            </button>
          </div>

          {done ? (
            <div className="bg-card border border-border rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-success font-medium">PDF unlocked successfully!</p>
              <p className="text-xs text-muted">
                Your file has been downloaded without restrictions.
              </p>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={unlock}
                disabled={processing}
                className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? "Unlocking..." : "Unlock PDF"}
              </button>
            </div>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}

      <Faq items={faqItems} />
    </ToolLayout>
  );
}
