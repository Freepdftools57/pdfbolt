import { JsonLd } from "@/components/json-ld";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  items: FaqItem[];
}

export function Faq({ items }: FaqProps) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />
      <div className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {items.map((item, i) => (
            <details
              key={i}
              className="bg-card border border-border rounded-lg group"
            >
              <summary className="px-5 py-4 text-sm font-medium cursor-pointer list-none flex items-center justify-between hover:text-primary transition-colors">
                {item.question}
                <svg
                  className="w-4 h-4 text-muted shrink-0 ml-4 group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-4 text-sm text-muted leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
