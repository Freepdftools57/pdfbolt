"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { FileDropZone } from "@/components/file-drop-zone";
import { Faq } from "@/components/faq";

const faqItems = [
  { question: "What kind of text can be extracted?", answer: "PDFBolt extracts all selectable text from your PDF. This includes text from documents, forms, and reports. It cannot extract text from scanned images (OCR is not supported)." },
  { question: "Can I copy the extracted text?", answer: "Yes. You can copy all extracted text to your clipboard with one click, or download it as a .txt file." },
  { question: "Does it preserve formatting?", answer: "The text is extracted as plain text. Page breaks are marked with page numbers. Original formatting like fonts, colors, and layout is not preserved." },
  { question: "Is my file processed locally?", answer: "Yes. Text extraction runs entirely in your browser. Your PDF never leaves your device." },
];

export default function ExtractTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extract = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;

    setFile(f);
    setProcessing(true);
    setProgress(0);
    setText("");
    setError(null);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      const bytes = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;

      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      setText(fullText.trim());
    } catch (err) {
      setError("Failed to extract text from this PDF.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }, []);

  const copyText = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  const downloadText = useCallback(() => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (file?.name?.replace(/\.pdf$/i, "") || "extracted") + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [text, file]);

  return (
    <ToolLayout
      title="Extract Text from PDF"
      description="Pull all text content out of a PDF file."
    >
      {!text && !processing ? (
        <FileDropZone
          accept=".pdf,application/pdf"
          multiple={false}
          onFiles={extract}
          label="Drop a PDF file here"
          sublabel="or click to browse"
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{file?.name}</p>
            </div>
            <button
              onClick={() => { setFile(null); setText(""); setError(null); }}
              className="text-sm text-muted hover:text-foreground"
            >
              Change file
            </button>
          </div>

          {processing && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-sm text-muted">{progress}%</span>
            </div>
          )}

          {text && (
            <>
              <textarea
                readOnly
                value={text}
                className="w-full h-80 px-4 py-3 bg-card border border-border rounded-lg text-sm font-mono focus:outline-none resize-y"
              />

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">
                  {text.length.toLocaleString()} characters
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={copyText}
                    className="px-4 py-2 text-sm text-muted hover:text-foreground border border-border rounded-lg hover:bg-card-hover transition-colors"
                  >
                    {copied ? "Copied!" : "Copy to clipboard"}
                  </button>
                  <button
                    onClick={downloadText}
                    className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
                  >
                    Download as .txt
                  </button>
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
      <Faq items={faqItems} />
    </ToolLayout>
  );
}
