import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF — Free & Private",
  description:
    "Add page numbers to PDF documents for free. Choose position, format, and starting number. All processed in your browser.",
  keywords: ["add page numbers to PDF", "PDF page numbers", "number PDF pages", "free PDF page numbering"],
};

export default function PageNumbersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
