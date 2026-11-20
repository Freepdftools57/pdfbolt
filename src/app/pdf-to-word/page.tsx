"use client";

import { ToolLayout } from "@/components/tool-layout";
import { Faq } from "@/components/faq";

const faqItems = [
  { question: "When will PDF to Word be available?", answer: "This feature is currently in development and will be available soon. Check back regularly for updates." },
  { question: "Will it work offline?", answer: "Yes. Like all PDFBolt tools, PDF to Word conversion will happen entirely in your browser without uploading files." },
  { question: "Will the formatting be preserved?", answer: "We aim to preserve text, images, and basic formatting. Complex layouts may have minor differences in the converted document." },
  { question: "What output format will be used?", answer: "The output will be a DOCX file compatible with Microsoft Word, Google Docs, and other word processors." },
];

export default function PdfToWordPage() {
  return (
    <ToolLayout
      title="PDF to Word"
      description="Convert PDF files to editable Word documents (DOCX)."
    >
      <div className="bg-card border border-border rounded-xl p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">Coming Soon</h2>
        <p className="text-muted max-w-md mx-auto text-sm leading-relaxed">
          PDF to Word conversion is coming in a future update.
          This feature will let you convert PDFs to editable DOCX documents —
          all processed locally in your browser, of course.
        </p>
        <p className="text-xs text-muted">
          In the meantime, you can{" "}
          <a href="/extract-text" className="text-primary hover:underline">extract text from PDF</a>{" "}
          or check out our other{" "}
          <a href="/" className="text-primary hover:underline">free PDF tools</a>.
        </p>
      </div>

      <Faq items={faqItems} />
    </ToolLayout>
  );
}
