"use client";

import { useState, useCallback } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import { ToolLayout } from "@/components/tool-layout";
import { FileDropZone } from "@/components/file-drop-zone";
import { uint8ToBlob } from "@/lib/pdf-utils";

type FontChoice = "helvetica" | "courier" | "times";

const fontMap: Record<FontChoice, typeof StandardFonts[keyof typeof StandardFonts]> = {
  helvetica: StandardFonts.Helvetica,
  courier: StandardFonts.Courier,
  times: StandardFonts.TimesRoman,
};

export default function AddTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [text, setText] = useState("");
  const [targetPage, setTargetPage] = useState(1);
  const [fontSize, setFontSize] = useState(14);
  const [fontChoice, setFontChoice] = useState<FontChoice>("helvetica");
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(700);
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
      const font = await doc.embedFont(fontMap[fontChoice]);
      const page = doc.getPages()[targetPage - 1];

      const lines = text.split("\n");
      for (let i = 0; i < lines.length; i++) {
        page.drawText(lines[i], {
          x: posX,
          y: posY - i * (fontSize * 1.4),
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
      }

      const pdfBytes = await doc.save();
      const name = file.name.replace(/\.pdf$/i, "");
      saveAs(uint8ToBlob(pdfBytes), `${name}-edited.pdf`);
    } catch (err) {
      setError("Failed to add text to PDF.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }, [file, text, targetPage, fontSize, fontChoice, posX, posY]);

  return (
    <ToolLayout
      title="Add Text to PDF"
      description="Insert text anywhere on your PDF pages."
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
            <label className="block text-sm font-medium mb-2">Text to add</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your text here..."
              rows={4}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors resize-y"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Page</label>
              <input
                type="number"
                min={1}
                max={pageCount}
                value={targetPage}
                onChange={(e) => setTargetPage(Math.max(1, Math.min(pageCount, parseInt(e.target.value) || 1)))}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Font</label>
              <select
                value={fontChoice}
                onChange={(e) => setFontChoice(e.target.value as FontChoice)}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="helvetica">Helvetica</option>
                <option value="courier">Courier</option>
                <option value="times">Times</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Size ({fontSize}px)</label>
              <input
                type="range"
                min={8}
                max={48}
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full accent-primary mt-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Position</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={posX}
                  onChange={(e) => setPosX(parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-2 bg-card border border-border rounded-lg text-xs focus:outline-none focus:border-primary"
                  placeholder="X"
                />
                <input
                  type="number"
                  value={posY}
                  onChange={(e) => setPosY(parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-2 bg-card border border-border rounded-lg text-xs focus:outline-none focus:border-primary"
                  placeholder="Y"
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-muted">
            Position is in PDF points from the bottom-left corner. A4 page is ~595 x 842 points.
          </p>

          <div className="flex justify-end">
            <button
              onClick={apply}
              disabled={processing || !text.trim()}
              className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? "Adding text..." : "Add text & download"}
            </button>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
    </ToolLayout>
  );
}
