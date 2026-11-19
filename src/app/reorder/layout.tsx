import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reorder PDF Pages — Free & Private",
  description:
    "Rearrange PDF pages in any order for free. Move pages up and down to reorder — all processed in your browser.",
  keywords: ["reorder PDF pages", "rearrange PDF", "move PDF pages", "PDF page order", "free PDF reorder"],
};

export default function ReorderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
