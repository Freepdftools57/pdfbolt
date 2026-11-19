import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Watermark to PDF — Free & Private",
  description:
    "Add text watermarks to PDF pages for free. Customize text, size, color, opacity, and rotation. 100% browser-based — files never leave your device.",
  keywords: ["watermark PDF", "add watermark to PDF", "PDF watermark", "stamp PDF", "free PDF watermark"],
};

export default function WatermarkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
