import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Image Converter — Free & Private",
  description:
    "Convert PDF pages to high-quality PNG or JPG images for free. Online tool — files never leave your browser.",
  keywords: ["PDF to image", "PDF to PNG", "PDF to JPG", "convert PDF to image", "free PDF converter"],
};

export default function PdfToImagesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
