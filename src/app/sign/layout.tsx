import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign PDF Online — Free & Private",
  description:
    "Add your signature to PDF documents for free. Draw or type your signature — all processed in your browser. No account needed.",
  keywords: ["sign PDF", "add signature to PDF", "PDF signature", "e-sign PDF", "free PDF signer"],
};

export default function SignLayout({ children }: { children: React.ReactNode }) {
  return children;
}
