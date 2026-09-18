export type Faq = { question: string; answer: string };

// Generates FAQPage JSON-LD from the exact same data rendered on the page —
// per Google's structured-data guidelines, the markup must match visible
// content, so every caller must pass the same array it renders.
export function buildFaqSchema(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}
