"use client";

import { useState, useCallback } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import { ToolLayout } from "@/components/tool-layout";
import { FileDropZone } from "@/components/file-drop-zone";
import { uint8ToBlob } from "@/lib/pdf-utils";
import { Faq } from "@/components/faq";

const faqItems = [
  { question: "Where can I place page numbers?", answer: "You can place numbers in six positions: top-left, top-center, top-right, bottom-left, bottom-center, or bottom-right." },
  { question: "What number formats are available?", answer: "Three formats: standard numbers (1, 2, 3), Roman numerals (i, ii, iii), and dashed format (- 1 -, - 2 -, - 3 -)." },
  { question: "Can I start numbering from a specific page?", answer: "Yes. Use the 'Start from' field to set any starting number. For example, set it to 3 if you want the first page to show '3'." },
  { question: "Is my PDF processed locally?", answer: "Yes. Everything runs in your browser. Your file never leaves your device." },
];

type Position = "bottom-center" | "bottom-left" | "bottom-right" | "top-center" | "top-left" | "top-right";
type NumberFormat = "numeric" | "roman" | "dashed";

function toRoman(num: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let result = "";
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) {
      result += syms[i];
      num -= vals[i];
    }
  }
  return result.toLowerCase();
}

function formatNumber(n: number, fmt: NumberFormat): string {
  if (fmt === "roman") return toRoman(n);
  if (fmt === "dashed") return `- ${n} -`;
  return String(n);
}

export default function PageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [startNum, setStartNum] = useState(1);
  const [numberFormat, setNumberFormat] = useState<NumberFormat>("numeric");
  const [fontSize, setFontSize] = useState(12);
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
    if (!file) return;

    setProcessing(true);
    setError(null);

    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const margin = 36;

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const numText = formatNumber(startNum + i, numberFormat);
        const textWidth = font.widthOfTextAtSize(numText, fontSize);

        let x: number;
        let y: number;

        switch (position) {
          case "bottom-left":
            x = margin;
            y = margin;
            break;
          case "bottom-center":
            x = (width - textWidth) / 2;
            y = margin;
            break;
          case "bottom-right":
            x = width - margin - textWidth;
            y = margin;
            break;
          case "top-left":
            x = margin;
            y = height - margin - fontSize;
            break;
          case "top-center":
            x = (width - textWidth) / 2;
            y = height - margin - fontSize;
            break;
          case "top-right":
            x = width - margin - textWidth;
            y = height - margin - fontSize;
            break;
        }

        page.drawText(numText, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      }

      const pdfBytes = await doc.save();
      const name = file.name.replace(/\.pdf$/i, "");
      saveAs(uint8ToBlob(pdfBytes), `${name}-numbered.pdf`);
    } catch (err) {
      setError("Failed to add page numbers.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }, [file, position, startNum, numberFormat, fontSize]);

  const positions: { value: Position; label: string }[] = [
    { value: "bottom-left", label: "Bottom left" },
    { value: "bottom-center", label: "Bottom center" },
    { value: "bottom-right", label: "Bottom right" },
    { value: "top-left", label: "Top left" },
    { value: "top-center", label: "Top center" },
    { value: "top-right", label: "Top right" },
  ];

  return (
    <ToolLayout
      title="Add Page Numbers"
      description="Insert page numbers on every page of your PDF."
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

          <div>
            <label className="block text-sm font-medium mb-2">Position</label>
            <div className="grid grid-cols-3 gap-2">
              {positions.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPosition(p.value)}
                  className={`py-2 text-xs rounded-lg border transition-colors ${
                    position === p.value
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-border text-muted hover:text-foreground hover:bg-card-hover"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Format</label>
              <div className="flex gap-2">
                {([
                  ["numeric", "1, 2, 3"],
                  ["roman", "i, ii, iii"],
                  ["dashed", "- 1 -"],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setNumberFormat(value)}
                    className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
                      numberFormat === value
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border text-muted hover:text-foreground hover:bg-card-hover"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Start from</label>
              <input
                type="number"
                min={1}
                value={startNum}
                onChange={(e) => setStartNum(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Size ({fontSize}px)</label>
              <input
                type="range"
                min={8}
                max={24}
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={apply}
              disabled={processing}
              className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? "Adding numbers..." : "Add page numbers & download"}
            </button>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
      <Faq items={faqItems} />
    </ToolLayout>
  );
}
