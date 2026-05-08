import AnimatedSection from '@/components/AnimatedSection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQ_ITEMS } from '@/lib/landingData';

export default function FAQSection() {
  return (
    <section id="faq" className="bg-background py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-foreground mb-3">
            Questions fréquentes
          </h2>
          <p className="text-slate-500 text-base">
            Tout ce que vous devez savoir sur l'examen civique 2026.
          </p>
        </div>

        {/* Accordion */}
        <AnimatedSection>
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible defaultValue="item-0">
              {FAQ_ITEMS.map((item, i) => (
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
