import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Extract Text from PDF — Free & Private",
  description:
    "Extract all text from PDF documents for free. Copy or download text from any PDF — processed entirely in your browser.",
  keywords: ["extract text from PDF", "PDF to text", "copy text from PDF", "PDF text extractor", "free PDF text"],
};

export default function ExtractTextLayout({ children }: { children: React.ReactNode }) {
  return children;
}
