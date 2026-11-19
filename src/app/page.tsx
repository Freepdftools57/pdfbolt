import Link from "next/link";
import { tools } from "@/lib/tools";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="text-center py-16 md:py-24 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Free PDF Tools,{" "}
          <span className="text-primary">100% Private</span>
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
          Merge, split, compress, and convert PDFs directly in your browser.
          Your files never leave your device — no uploads, no servers, no
          tracking.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-success">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          All processing happens in your browser
        </div>
      </section>

      {/* Tools grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-card-hover transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-card-hover flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <svg
                    className={`w-5 h-5 ${tool.color}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={tool.icon}
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card/50 border-t border-border py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Select your files</h3>
              <p className="text-sm text-muted">
                Drag and drop or browse to select the PDF files you want to process.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Process locally</h3>
              <p className="text-sm text-muted">
                Your files are processed entirely in your browser using JavaScript. Nothing is uploaded anywhere.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Download result</h3>
              <p className="text-sm text-muted">
                Get your processed file instantly. It was generated right on your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why PDFBolt */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Why PDFBolt?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                100% Private
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Unlike other PDF tools, your files never leave your computer. All processing is done locally in your web browser.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Lightning Fast
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                No upload time, no waiting for server processing, no download time. Everything happens instantly on your device.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completely Free
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                All tools are free to use with no hidden costs, no account required, and no limits on the number of files.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Works Offline
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Once the page is loaded, PDFBolt works without an internet connection. Perfect for handling sensitive documents.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
