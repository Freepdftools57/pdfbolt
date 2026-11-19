"use client";

import { ToolLayout } from "@/components/tool-layout";

export default function ProtectPage() {
  return (
    <ToolLayout
      title="Protect PDF"
      description="Add password protection to your PDF files."
    >
      <div className="bg-card border border-border rounded-xl p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">Coming Soon</h2>
        <p className="text-muted max-w-md mx-auto text-sm leading-relaxed">
          PDF password protection is coming in a future update.
          This feature will let you encrypt your PDFs with a password —
          all processed locally in your browser, of course.
        </p>
        <p className="text-xs text-muted">
          In the meantime, check out our other{" "}
          <a href="/" className="text-primary hover:underline">free PDF tools</a>.
        </p>
      </div>
    </ToolLayout>
  );
}
