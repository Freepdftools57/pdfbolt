import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Protect PDF — Free & Private",
  description:
    "Add password protection to PDF files for free. Encrypt your documents directly in your browser. Coming soon to PDFBolt.",
  keywords: ["password protect PDF", "encrypt PDF", "lock PDF", "PDF password", "secure PDF"],
};

export default function ProtectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
