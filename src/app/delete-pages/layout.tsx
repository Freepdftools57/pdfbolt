import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Pages from PDF — Free & Private",
  description:
    "Remove unwanted pages from PDF files for free. Select pages to delete — all processed in your browser. 100% private.",
  keywords: ["delete PDF pages", "remove pages from PDF", "PDF page remover", "free PDF editor"],
};

export default function DeletePagesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
