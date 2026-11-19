import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Text to PDF — Free & Private",
  description:
    "Add text to PDF files for free. Choose font, size, and position — processed entirely in your browser. No upload needed.",
  keywords: ["add text to PDF", "edit PDF text", "write on PDF", "PDF text editor", "free PDF editor"],
};

export default function AddTextLayout({ children }: { children: React.ReactNode }) {
  return children;
}
