import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "PDFBolt privacy policy. Your files never leave your browser.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-muted mb-6">Last updated: November 19, 2026</p>

      <div className="prose prose-sm prose-invert max-w-none space-y-6 text-foreground/80 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Summary</h2>
          <p>
            PDFBolt is a privacy-first PDF tool. <strong>Your files are never uploaded to any server.</strong> All
            PDF processing happens entirely in your web browser using client-side JavaScript. We have no access
            to your documents.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">File Processing</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>All PDF operations (merge, split, compress, convert, etc.) run locally in your browser.</li>
            <li>Your files are never transmitted over the internet.</li>
            <li>No file data is stored, cached, or logged by PDFBolt.</li>
            <li>Once you close or refresh the page, all file data is cleared from memory.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Analytics</h2>
          <p>
            We use Google Analytics to understand how visitors use the site (which pages are visited, how long
            sessions last, etc.). Google Analytics collects anonymous usage data such as:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Pages viewed</li>
            <li>Time spent on pages</li>
            <li>Browser and device type</li>
            <li>Approximate geographic region</li>
          </ul>
          <p>
            Google Analytics does <strong>not</strong> have access to your PDF files or their contents.
            You can opt out of Google Analytics by using a browser extension like{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              Google Analytics Opt-out
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Cookies</h2>
          <p>
            PDFBolt itself does not set any cookies. Google Analytics may set cookies to distinguish
            unique visitors. No cookies are used for advertising or tracking across other websites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">No Account Required</h2>
          <p>
            PDFBolt does not require registration or login. We do not collect personal information
            such as names, email addresses, or payment details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Third-Party Services</h2>
          <p>
            The site is hosted on Vercel. Vercel may collect standard server logs (IP addresses, request
            timestamps) as part of their hosting infrastructure. See{" "}
            <a href="https://vercel.com/legal/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              Vercel&apos;s Privacy Policy
            </a>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Changes</h2>
          <p>
            We may update this policy from time to time. Changes will be reflected on this page
            with an updated date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
          <p>
            If you have questions about this privacy policy, you can reach us via our{" "}
            <a href="https://github.com/Freepdftools57/pdfbolt/issues" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              GitHub repository
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
