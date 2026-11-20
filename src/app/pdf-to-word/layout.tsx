import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Word Converter — Free & Private",
  description:
    "Convert PDF files to Word documents (DOCX) for free. Coming soon — all processing will happen in your browser.",
  keywords: ["PDF to Word", "PDF to DOCX", "convert PDF to Word", "free PDF to Word converter"],
};

export default function PdfToWordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
