"use client";

import { useState } from "react";
import type { HomepageFaq, HomepageSetting } from "@/lib/types";
import { pickLocalizedText } from "@/lib/i18n/localized-field";
import { useLocale } from "@/components/LocaleProvider";

export function HomeFaq({
  settings,
  faqs,
}: {
  settings: HomepageSetting;
  faqs: HomepageFaq[];
}) {
  const locale = useLocale();
  const title = pickLocalizedText(locale, settings.faqTitle, settings.faqTitleEn);
  const subtitle = pickLocalizedText(locale, settings.faqSubtitle, settings.faqSubtitleEn);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="border-t border-neutral-100 bg-[#F5F5F5] py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{title}</h2>
        <p className="mt-2 text-neutral-600">{subtitle}</p>
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => {
            const q = pickLocalizedText(locale, faq.question, faq.questionEn);
            const a = pickLocalizedText(locale, faq.answer, faq.answerEn);
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-neutral-900">{q}</span>
                  <span className="shrink-0 text-xl text-neutral-900">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen ? (
                  <div className="border-t border-neutral-100 px-5 py-4 text-sm leading-relaxed text-neutral-600">
                    {a}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
