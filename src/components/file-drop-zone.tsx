"use client";

import { useCallback, useState, useRef } from "react";

interface FileDropZoneProps {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label: string;
  sublabel?: string;
  maxSizeMB?: number;
}

export function FileDropZone({
  accept,
  multiple = true,
  onFiles,
  label,
  sublabel,
  maxSizeMB = 100,
}: FileDropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndEmit = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;

      const files = Array.from(fileList);
      const maxBytes = maxSizeMB * 1024 * 1024;

      for (const f of files) {
        if (f.size > maxBytes) {
          setError(`File "${f.name}" exceeds ${maxSizeMB}MB limit.`);
          return;
        }
      }

      setError(null);
      onFiles(files);
    },
    [onFiles, maxSizeMB]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      validateAndEmit(e.dataTransfer.files);
    },
    [validateAndEmit]
  );

  return (
    <div
      className={`drop-zone rounded-xl p-10 text-center cursor-pointer ${
        dragOver ? "drag-over" : ""
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => validateAndEmit(e.target.files)}
      />

      <svg
        className="w-12 h-12 mx-auto mb-4 text-muted"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>

      <p className="text-lg font-medium mb-1">{label}</p>
      <p className="text-sm text-muted">
        {sublabel || `or click to browse (max ${maxSizeMB}MB)`}
      </p>

      {error && (
        <p className="mt-3 text-sm text-danger">{error}</p>
      )}
    </div>
  );
}
