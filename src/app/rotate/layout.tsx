import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rotate PDF Pages Online — Free & Private",
  description:
    "Rotate PDF pages online for free. Rotate individual pages or all pages at once by 90°, 180°, or 270°. 100% browser-based.",
  keywords: ["rotate PDF", "rotate PDF pages", "turn PDF", "PDF rotation", "free PDF rotate"],
};

export default function RotateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
