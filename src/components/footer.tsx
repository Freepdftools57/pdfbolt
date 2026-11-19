import Link from "next/link";
import { tools } from "@/lib/tools";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              PDF<span className="text-primary">Bolt</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Free online PDF tools that respect your privacy. All processing
              happens in your browser — your files never leave your device.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted">
              Tools
            </h3>
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.href}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted">
              Privacy
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Your files are processed 100% locally in your web browser using
              JavaScript. Nothing is uploaded to any server. We don&apos;t collect,
              store, or have access to your files.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted">
          &copy; 2026 PDFBolt. All tools are free and open to use.
        </div>
      </div>
    </footer>
  );
}
