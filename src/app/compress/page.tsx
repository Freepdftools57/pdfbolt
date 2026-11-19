"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { ToolLayout } from "@/components/tool-layout";
import { FileDropZone } from "@/components/file-drop-zone";
import { uint8ToBlob, formatFileSize } from "@/lib/pdf-utils";

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{
    originalSize: number;
    compressedSize: number;
    blob: Blob;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setError(null);
  }, []);

  const compress = useCallback(async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);

    try {
      const bytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      // Re-create the document to strip unused objects, metadata bloat, etc.
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      for (const page of pages) {
        newDoc.addPage(page);
      }

      // Save without object streams overhead for smaller output
      const compressedBytes = await newDoc.save({
        useObjectStreams: false,
        addDefaultPage: false,
      });

      const blob = uint8ToBlob(compressedBytes);

      setResult({
        originalSize: file.size,
        compressedSize: compressedBytes.length,
        blob,
      });
    } catch (err) {
      setError("Failed to compress this PDF. It may be corrupted or encrypted.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }, [file]);

  const download = useCallback(() => {
    if (!result) return;
    const name = file?.name?.replace(/\.pdf$/i, "") || "compressed";
    saveAs(result.blob, `${name}-compressed.pdf`);
  }, [result, file]);

  const reduction = result
    ? Math.max(0, Math.round((1 - result.compressedSize / result.originalSize) * 100))
    : 0;

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce PDF file size by stripping unused data. Processing happens in your browser."
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
              <p className="text-xs text-muted">{formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setResult(null);
                setError(null);
              }}
              className="text-sm text-muted hover:text-foreground"
            >
              Change file
            </button>
          </div>

          {!result ? (
            <div className="flex justify-end">
              <button
                onClick={compress}
                disabled={processing}
                className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? "Compressing..." : "Compress PDF"}
              </button>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 text-center space-y-4">
              <div className="flex items-center justify-center gap-6">
                <div>
                  <p className="text-xs text-muted mb-1">Original</p>
                  <p className="text-lg font-semibold">{formatFileSize(result.originalSize)}</p>
                </div>
                <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <div>
                  <p className="text-xs text-muted mb-1">Compressed</p>
                  <p className="text-lg font-semibold text-success">{formatFileSize(result.compressedSize)}</p>
                </div>
              </div>

              {reduction > 0 ? (
                <p className="text-sm text-success">
                  Reduced by {reduction}%
                </p>
              ) : (
                <p className="text-sm text-muted">
                  This PDF is already well optimized. Size reduction was minimal.
                </p>
              )}

              <button
                onClick={download}
                className="px-6 py-2 text-sm font-medium bg-success hover:opacity-90 text-white rounded-lg transition-opacity"
              >
                Download compressed PDF
              </button>
            </div>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
    </ToolLayout>
  );
}
