import { Link } from "@tanstack/react-router";
import { Stethoscope, Menu, Globe } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { t, i18n } = useTranslation(["common"]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const lang = (i18n.language || 'en') as string;

  const links = [
    { to: "/", label: t('nav.home') },
    { to: "/ai-doctor", label: t('nav.aiDoctor') },
    { to: "/consult", label: t('nav.consult') },
    { to: "/reports", label: t('nav.reports') },
    { to: "/dashboard", label: t('nav.dashboard') },
    { to: "/about", label: t('nav.about') },
    { to: "/contact", label: t('nav.contact') },
  ] as const;

  const langLabel: Record<string, string> = { en: "EN", hi: "हि", ur: "اُر", bn: "বাংলা", ta: "தமிழ்", te: "తెలుగు" };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-primary text-primary-foreground shadow-medical">
            <Stethoscope className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display font-bold text-lg tracking-tight">
            Sehat<span className="text-primary">Agent</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-full transition-colors"
              activeProps={{ className: "px-3 py-2 text-sm font-medium text-primary bg-mint rounded-full" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full gap-1.5">
                <Globe className="h-4 w-4" />
                {langLabel[lang]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => i18n.changeLanguage('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => i18n.changeLanguage('hi')}>हिन्दी</DropdownMenuItem>
              <DropdownMenuItem onClick={() => i18n.changeLanguage('ur')}>اردو</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/login">
            <Button variant="ghost" size="sm" className="rounded-full">{t('nav.login')}</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="rounded-full bg-gradient-primary text-primary-foreground shadow-medical hover:opacity-90">
              {t('nav.signup')}
            </Button>
          </Link>
        </div>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open mobile menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-2 mt-8">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary rounded-xl hover:bg-mint"
                >
                  {l.label}
                </Link>
              ))}
              <div className="border-t border-border my-3" />
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full rounded-full">{t('nav.login')}</Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-full bg-gradient-primary text-primary-foreground">{t('nav.signup')}</Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
