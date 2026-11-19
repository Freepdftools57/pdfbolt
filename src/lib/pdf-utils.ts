/**
 * Convert a Uint8Array (from pdf-lib) to a Blob.
 * Handles the TypeScript strict ArrayBufferLike vs ArrayBuffer issue.
 */
export function uint8ToBlob(bytes: Uint8Array, type = "application/pdf"): Blob {
  return new Blob([bytes.buffer.slice(0) as ArrayBuffer], { type });
}

/**
 * Convert a Uint8Array to an ArrayBuffer for use with JSZip.
 */
export function uint8ToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(0) as ArrayBuffer;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}
