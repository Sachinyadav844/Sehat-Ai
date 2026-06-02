import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, Star, Clock, Hospital, CalendarCheck, Search, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useTranslation } from "react-i18next";
import { ensureArray } from '@/lib/utils';
import hospital from "@/assets/hospital.jpg";

export const Route = createFileRoute("/consult")({
  head: () => ({
    meta: [
      { title: "Consult — Hospitals, Doctors & Appointments | Sehat AI" },
      { name: "description", content: "AI-matched hospitals, specialists, and appointments — booked autonomously." },
      { property: "og:title", content: "Consult — Sehat AI" },
      { property: "og:description", content: "Autonomous hospital matching and appointment booking." },
    ],
  }),
  component: ConsultPage,
});

const hospitals = [
  { name: "City Care Hospital", distance: "2.1 km", rating: 4.8, wait: "12 min", emergency: true },
  { name: "Green Valley Medical", distance: "3.4 km", rating: 4.6, wait: "20 min", emergency: false },
  { name: "Sunrise Specialty Center", distance: "5.0 km", rating: 4.9, wait: "8 min", emergency: true },
];

const doctors = [
  { name: "Dr. Maria Khan", specialty: "General Physician", rating: 4.9 },
  { name: "Dr. Alex Lee", specialty: "Pulmonologist", rating: 4.8 },
  { name: "Dr. Ayesha Rahim", specialty: "ENT Specialist", rating: 4.7 },
  { name: "Dr. Sanjay Patel", specialty: "Internal Medicine", rating: 4.9 },
];

const activities = [
  "AI searching nearest hospitals…",
  "AI checking real-time appointment slots…",
  "AI matching specialist to your symptoms…",
  "AI confirming insurance and pricing…",
  "AI booking appointment automatically…",
];

function ConsultPage() {
  const { t } = useTranslation(["common", "consult"]);
  const activitiesList = ensureArray<string>(t("activities", { returnObjects: true }));
  const activityItems = activitiesList.length && typeof activitiesList[0] === 'string' && !activitiesList[0].startsWith('activities') ? activitiesList : activities;
  return (
    <div>
      <section className="bg-gradient-mint py-14">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Smart Healthcare Coordination"
            title="Consult Doctors & Book Appointments"
            subtitle="Get nearby hospital recommendations, specialist matching, and automated appointment scheduling based on your symptoms and health condition."
          />
        </div>
      </section>

      <section className="py-14 bg-background">
        <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-3">
          {/* Hospitals */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="font-display text-xl font-bold flex items-center gap-2"><Hospital className="h-5 w-5 text-primary" /> {t("nearestHospitals")}</h3>
            {hospitals.map((h) => (
              <motion.div key={h.name} whileHover={{ y: -3 }} className="rounded-3xl bg-card border border-border p-5 shadow-soft flex gap-5 items-center">
                <img src={hospital} alt={h.name} loading="lazy" width={120} height={120} className="rounded-2xl w-28 h-28 object-cover hidden sm:block" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold">{h.name}</h4>
                      <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {h.distance}</span>
                        <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" /> {h.rating}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t('waitPrefix', { wait: h.wait })}</span>
                      </div>
                    </div>
                    {h.emergency && <span className="rounded-full bg-destructive/10 text-destructive text-[10px] font-semibold uppercase tracking-wider px-2 py-1">{t('emergency')}</span>}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="rounded-full bg-gradient-primary text-primary-foreground">{t('bookNow')}</Button>
                    <Button size="sm" variant="outline" className="rounded-full">{t('viewDetails')}</Button>
                  </div>
                </div>
              </motion.div>
            ))}

            <h3 className="font-display text-xl font-bold flex items-center gap-2 mt-10"><CalendarCheck className="h-5 w-5 text-primary" /> {t('recommendedDoctors')}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {doctors.map((d) => (
                <div key={d.name} className="rounded-3xl bg-card border border-border p-5 shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center h-12 w-12 rounded-full bg-gradient-primary text-primary-foreground font-bold">
                      {d.name.split(" ")[1][0]}
                    </div>
                    <div>
                      <div className="font-semibold">{d.name}</div>
                      <div className="text-xs text-muted-foreground">{d.specialty}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-warning"><Star className="h-3.5 w-3.5 fill-warning" /> {d.rating}</span>
                    <Button size="sm" className="rounded-full bg-gradient-primary text-primary-foreground">{t('bookNow')}</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI activity sidebar */}
          <aside className="space-y-5">
            <div className="rounded-3xl bg-gradient-primary text-primary-foreground p-5 shadow-medical">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold">
                <Sparkles className="h-4 w-4" /> {t('aiActivityTitle')}
              </div>
              <ul className="mt-4 space-y-3">
                {activityItems.map((a, i) => (
                  <motion.li
                    key={a}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.4, duration: 0.4 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <Search className="h-4 w-4 mt-0.5 shrink-0" /> {a}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-card border border-border p-5 shadow-soft">
              <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-3">Booking Confirmation</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Hospital: City Care</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Doctor: Dr. Maria Khan</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Today · 3:30 PM</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Est. wait 12 min</div>
              </div>
              <Button className="w-full mt-4 rounded-full bg-gradient-primary text-primary-foreground">Confirm</Button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
