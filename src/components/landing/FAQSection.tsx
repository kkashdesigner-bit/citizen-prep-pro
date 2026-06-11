import AnimatedSection from '@/components/AnimatedSection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { FAQ_COUNT } from '@/lib/landingData';

export default function FAQSection() {
  const { t } = useLanguage();
  const faqItems = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    q: t(`faq.q${i + 1}`),
    a: t(`faq.a${i + 1}`),
  }));
  return (
    <section id="faq" className="bg-background py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-foreground mb-3">
            {t('landing.faq.title')}
          </h2>
          <p className="text-slate-500 text-base">
            {t('landing.faq.subtitle')}
          </p>
        </div>

        {/* Accordion */}
        <AnimatedSection>
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible defaultValue="item-0">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-slate-200">
                  <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-[#0055A4] py-4 text-sm sm:text-base">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-4">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
