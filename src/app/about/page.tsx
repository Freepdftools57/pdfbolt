import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PDFBolt",
  description: "PDFBolt is a free, privacy-first PDF toolkit. All processing happens in your browser.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">About PDFBolt</h1>

      <div className="prose prose-sm prose-invert max-w-none space-y-6 text-foreground/80 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">What is PDFBolt?</h2>
          <p>
            PDFBolt is a free collection of PDF tools that run entirely in your web browser.
            Merge, split, compress, convert, watermark, sign, and more — without uploading
            a single file to any server.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Why PDFBolt?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>100% Private</strong> — Your files never leave your device. All processing
              is done locally using JavaScript in your browser.
            </li>
            <li>
              <strong>Completely Free</strong> — No sign-up, no limits, no watermarks. Every tool
              is fully available at no cost.
            </li>
            <li>
              <strong>No Installation</strong> — Works in any modern browser. No software to download,
              no plugins to install.
            </li>
            <li>
              <strong>Fast</strong> — Because everything runs locally, there are no upload/download
              delays. Processing is instant on modern devices.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">How It Works</h2>
          <p>
            PDFBolt uses modern browser APIs and open-source JavaScript libraries to handle PDF
            operations directly on your computer. When you drop a file into one of our tools,
            it stays in your browser&apos;s memory, gets processed, and the result is downloaded
            back to your device. No internet connection is needed after the page loads.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Open Source</h2>
          <p>
            PDFBolt is open source. You can view the code, report issues, or contribute on our{" "}
            <a
              href="https://github.com/Freepdftools57/pdfbolt"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub repository
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
          <p>
            Have a question, suggestion, or found a bug? Open an issue on{" "}
            <a
              href="https://github.com/Freepdftools57/pdfbolt/issues"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>{" "}
            and we&apos;ll get back to you.
          </p>
        </section>
      </div>
    </div>
  );
}
