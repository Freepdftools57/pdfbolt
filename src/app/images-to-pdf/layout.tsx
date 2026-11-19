import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Images to PDF Converter — Free & Private",
  description:
    "Convert JPG, PNG, or WebP images to PDF for free. Arrange pages, choose page size — all processed in your browser.",
  keywords: ["images to PDF", "JPG to PDF", "PNG to PDF", "convert images to PDF", "free image to PDF"],
};

export default function ImagesToPdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
