"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Faq } from "@/components/faq";

const faqItems = [
  { question: "When will Word to PDF be available?", answer: "This feature is currently in development and will be available soon. Check back regularly for updates." },
  { question: "Will it work offline?", answer: "Yes. Like all PDFBolt tools, Word to PDF conversion will happen entirely in your browser without uploading files." },
  { question: "What file formats will be supported?", answer: "We plan to support DOCX files (Microsoft Word 2007 and later). Support for DOC (legacy format) may be added later." },
  { question: "Will the formatting be preserved?", answer: "We aim to preserve text, images, tables, and basic formatting. Complex layouts may have minor differences." },
];

export default function WordToPdfPage() {
  return (
    <ToolLayout
      title="Word to PDF"
      description="Convert Word documents (DOCX) to PDF format."
    >
      <div className="bg-card border border-border rounded-xl p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">Coming Soon</h2>
        <p className="text-muted max-w-md mx-auto text-sm leading-relaxed">
          Word to PDF conversion is coming in a future update.
          This feature will let you convert DOCX documents to PDF —
          all processed locally in your browser, of course.
        </p>
        <p className="text-xs text-muted">
          In the meantime, check out our other{" "}
          <a href="/" className="text-primary hover:underline">free PDF tools</a>.
        </p>
      </div>

      <Faq items={faqItems} />
    </ToolLayout>
  );
}
