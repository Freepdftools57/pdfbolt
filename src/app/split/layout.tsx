import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split PDF Online — Free & Private",
  description:
    "Split PDF files by page ranges or extract individual pages for free. 100% processed in your browser — your files stay private.",
  keywords: ["split PDF", "extract PDF pages", "separate PDF", "split PDF online", "free PDF split"],
};

export default function SplitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
