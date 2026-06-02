import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, AlertTriangle, MessageCircle, Twitter, Linkedin } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useTranslation } from "react-i18next";
import { ensureArray } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Sehat AI — Support & Help" },
      { name: "description", content: "Reach the Sehat AI team. 24/7 emergency support, FAQ, and chat." },
      { property: "og:title", content: "Contact Sehat AI" },
      { property: "og:description", content: "Support, FAQ, and emergency help." },
    ],
  }),
  component: ContactPage,
});

const faqs = [] as { q: string; a: string }[];

function ContactPage() {
  const { t } = useTranslation(["common", "contact"]);
  const faqsList = ensureArray<{ q: string; a: string }>(t('faqs', { returnObjects: true }));
  const faqItems = faqsList.length && typeof faqsList[0] === 'object' ? faqsList : [];
  const cards = [
    { icon: Phone, title: t('cards.callTitle'), text: t('cards.callText') },
    { icon: Mail, title: t('cards.emailTitle'), text: t('cards.emailText') },
    { icon: MapPin, title: t('cards.officeTitle'), text: t('cards.officeText') },
  ];
  return (
    <div>
      <section className="bg-gradient-mint py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Need Assistance?"
            title="Contact the SehatAI Team"
            subtitle="Reach out for healthcare support, technical assistance, partnerships, or collaboration opportunities anytime."
          />
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div key={c.title} className="rounded-3xl bg-card border border-border p-6 shadow-soft text-center">
              <div className="mx-auto grid place-items-center h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-semibold">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 mt-10 grid lg:grid-cols-3 gap-8">
          <form className="lg:col-span-2 rounded-3xl bg-card border border-border p-7 shadow-soft space-y-4" onSubmit={(e) => e.preventDefault()}>
            <h3 className="font-display text-xl font-bold">{t('form.title')}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t('form.name')}</Label>
                <Input id="name" placeholder={t('form.namePlaceholder')} className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="email">{t('form.email')}</Label>
                <Input id="email" type="email" placeholder={t('form.emailPlaceholder')} className="mt-1.5 rounded-xl" />
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="How can we help?" className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="msg">Message</Label>
              <Textarea id="msg" placeholder="Tell us more…" rows={5} className="mt-1.5 rounded-xl" />
            </div>
            <Button type="submit" className="rounded-full bg-gradient-primary text-primary-foreground shadow-medical">Send Message</Button>
          </form>

          <aside className="space-y-5">
            <div className="rounded-3xl bg-destructive/10 border border-destructive/30 p-6">
              <div className="flex items-center gap-2 text-destructive font-semibold">
                <AlertTriangle className="h-5 w-5" /> Emergency Support
              </div>
              <p className="text-sm text-muted-foreground mt-2">For life-threatening situations, call your local emergency number first.</p>
              <Button className="mt-4 w-full rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground">Emergency Line</Button>
            </div>

            <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
              <h4 className="font-semibold flex items-center gap-2"><MessageCircle className="h-4 w-4 text-primary" /> Follow us</h4>
              <div className="mt-3 flex gap-3 text-muted-foreground">
                <a href="#" className="hover:text-primary"><Twitter className="h-5 w-5" /></a>
                <a href="#" className="hover:text-primary"><Linkedin className="h-5 w-5" /></a>
              </div>
            </div>
          </aside>
        </div>

          <div className="container mx-auto px-4 mt-12">
          <SectionHeading eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
          <div className="max-w-3xl mx-auto mt-8">
              <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="rounded-2xl border border-border bg-card px-5">
                  <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
