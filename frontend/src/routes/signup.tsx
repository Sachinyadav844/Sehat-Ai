import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Stethoscope } from "lucide-react";
import team from "@/assets/team-doctors.jpg";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — Sehat AI" },
      { name: "description", content: "Create your Sehat AI account and meet your AI doctor." },
      { property: "og:title", content: "Sign Up — Sehat AI" },
      { property: "og:description", content: "Create a Sehat AI account." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { t } = useTranslation(["common", "auth"]);
  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img src={team} alt="Healthcare team" loading="lazy" width={1280} height={800} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/40 to-transparent" />
      </div>
      <div className="flex items-center justify-center p-8 bg-background">
        <form className="w-full max-w-md space-y-5" onSubmit={(e) => e.preventDefault()}>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-primary text-primary-foreground"><Stethoscope className="h-5 w-5" /></span>
            <span className="font-display font-bold text-lg">Sehat<span className="text-primary">Agent</span></span>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold">{t('auth.createAccountTitle')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t('auth.createAccountDesc')}</p>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="first">{t('form.firstName')}</Label>
                <Input id="first" placeholder={t('form.firstNamePlaceholder')} className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="last">{t('form.lastName')}</Label>
                <Input id="last" placeholder={t('form.lastNamePlaceholder')} className="mt-1.5 rounded-xl" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">{t('form.email')}</Label>
              <Input id="email" type="email" placeholder={t('form.emailPlaceholder')} className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="password">{t('form.password')}</Label>
              <Input id="password" type="password" placeholder={t('form.passwordPlaceholder')} className="mt-1.5 rounded-xl" />
            </div>
          </div>
          <Button type="submit" className="w-full rounded-full bg-gradient-primary text-primary-foreground shadow-medical h-11">{t('buttons.createAccount')}</Button>
          <p className="text-sm text-muted-foreground text-center">
            {t('auth.alreadyHaveAccount')} <Link to="/login" className="text-primary font-semibold">{t('auth.signIn')}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
