import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word to PDF Converter — Free & Private",
  description:
    "Convert Word documents (DOCX) to PDF for free. Coming soon — all processing will happen in your browser.",
  keywords: ["Word to PDF", "DOCX to PDF", "convert Word to PDF", "free Word to PDF converter"],
};

export default function WordToPdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
