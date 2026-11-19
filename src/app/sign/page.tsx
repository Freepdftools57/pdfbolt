"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { ToolLayout } from "@/components/tool-layout";
import { FileDropZone } from "@/components/file-drop-zone";
import { uint8ToBlob } from "@/lib/pdf-utils";

type SignMode = "draw" | "type";

export default function SignPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [targetPage, setTargetPage] = useState(1);
  const [mode, setMode] = useState<SignMode>("draw");
  const [typedName, setTypedName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode !== "draw") return;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#1a2235";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#e4e8f1";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [mode, file]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDraw = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#1a2235";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const apply = useCallback(async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);

    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const page = doc.getPages()[targetPage - 1];
      const { width, height } = page.getSize();

      if (mode === "draw") {
        const canvas = canvasRef.current!;
        const pngBlob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b!), "image/png")
        );
        const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
        const sigImage = await doc.embedPng(pngBytes);

        const sigWidth = 200;
        const sigHeight = (sigWidth / canvas.width) * canvas.height;

        page.drawImage(sigImage, {
          x: width - sigWidth - 50,
          y: 50,
          width: sigWidth,
          height: sigHeight,
        });
      } else {
        if (!typedName.trim()) {
          setError("Please type your name.");
          setProcessing(false);
          return;
        }

        const { StandardFonts, rgb } = await import("pdf-lib");
        const font = await doc.embedFont(StandardFonts.CourierOblique);

        page.drawText(typedName, {
          x: width - 250,
          y: 60,
          size: 24,
          font,
          color: rgb(0.1, 0.1, 0.4),
        });
      }

      const pdfBytes = await doc.save();
      const name = file.name.replace(/\.pdf$/i, "");
      saveAs(uint8ToBlob(pdfBytes), `${name}-signed.pdf`);
    } catch (err) {
      setError("Failed to add signature.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }, [file, mode, targetPage, typedName]);

  return (
    <ToolLayout
      title="Sign PDF"
      description="Add your signature to a PDF document. Draw or type it."
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Signature type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode("draw")}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                    mode === "draw"
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-border text-muted hover:text-foreground hover:bg-card-hover"
                  }`}
                >
                  Draw
                </button>
                <button
                  onClick={() => setMode("type")}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                    mode === "type"
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-border text-muted hover:text-foreground hover:bg-card-hover"
                  }`}
                >
                  Type
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Place on page</label>
              <input
                type="number"
                min={1}
                max={pageCount}
                value={targetPage}
                onChange={(e) => setTargetPage(Math.max(1, Math.min(pageCount, parseInt(e.target.value) || 1)))}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {mode === "draw" ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Draw your signature below</label>
                <button onClick={clearCanvas} className="text-xs text-muted hover:text-foreground">
                  Clear
                </button>
              </div>
              <canvas
                ref={canvasRef}
                width={500}
                height={150}
                className="w-full border border-border rounded-lg cursor-crosshair touch-none"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">Type your name</label>
              <input
                type="text"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors font-mono italic text-lg"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={apply}
              disabled={processing}
              className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? "Signing..." : "Sign & download"}
            </button>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      )}
    </ToolLayout>
  );
}
