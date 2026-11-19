import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF Files Online — Free & Private",
  description:
    "Merge multiple PDF files into one document for free. Files are processed in your browser and never uploaded to any server. 100% private.",
  keywords: ["merge PDF", "combine PDF", "join PDF", "merge PDF online", "free PDF merge"],
};

export default function MergeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
