"use client";

import { MessageCircleQuestion } from "lucide-react";
import { getProductQuestions } from "@/lib/qa";

export function ProductQA({ productId }: { productId: string }) {
  const questions = getProductQuestions(productId);

  return (
    <section className="shell border-t border-line py-14 lg:py-16" id="qa">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow inline-flex items-center gap-2">
          <MessageCircleQuestion className="h-3.5 w-3.5 text-gold" /> Questions &amp; answers
        </p>
        <h2 className="mt-2 font-serif text-3xl">Ask before you buy</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {questions.map((q) => (
            <div key={q.id} className="py-5">
              <p className="font-medium">{q.question}</p>
              <p className="mt-1 text-xs text-ink-muted">
                Asked by {q.author} · {q.date}
              </p>
              {q.answer && (
                <div className="mt-3 rounded-lg bg-canvas-sunk p-4 text-sm text-ink-soft">
                  <p>{q.answer}</p>
                  {q.answeredBy && <p className="mt-2 text-xs text-ink-muted">— {q.answeredBy}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
