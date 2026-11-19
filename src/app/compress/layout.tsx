import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF Online — Free & Private",
  description:
    "Compress and reduce PDF file size for free. All processing happens in your browser — your files stay 100% private.",
  keywords: ["compress PDF", "reduce PDF size", "shrink PDF", "PDF compressor", "free PDF compression"],
};

export default function CompressLayout({ children }: { children: React.ReactNode }) {
  return children;
}
