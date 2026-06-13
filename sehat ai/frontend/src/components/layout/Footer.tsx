import { Link } from "@tanstack/react-router";
import { Stethoscope, Twitter, Linkedin, Github, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const PRODUCT_LINKS = [
  { to: "/ai-doctor", label: "AI Doctor" },
  { to: "/consult", label: "Consult" },
  { to: "/reports", label: "Reports" },
  { to: "/dashboard", label: "Dashboard" },
];

const COMPANY_LINKS = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const SOCIAL_LINKS = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Mail, href: "#", label: "Email" },
];

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Application footer component
 * Contains navigation links, company info, and social links
 */
export function Footer() {
  const { t } = useTranslation(["common"]);
  const productLinks = [
    { to: "/ai-doctor", label: t('nav.aiDoctor') },
    { to: "/consult", label: t('nav.consult') },
    { to: "/reports", label: t('nav.reports') },
    { to: "/dashboard", label: t('nav.dashboard') },
  ];
  const companyLinks = [
    { to: "/about", label: t('nav.about') },
    { to: "/contact", label: t('nav.contact') },
  ];
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-section">
      <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        {/* Brand Section */}
        <div>
          <Link to="/" className="flex items-center gap-2 inline-block">
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-primary text-primary-foreground">
              <Stethoscope className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display font-bold text-lg">
              Sehat
              <span className="text-primary">Agent</span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">{t('footer.aboutText')}</p>
        </div>

        {/* Product Links */}
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">{t('footer.product')}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {productLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="hover:text-primary transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">{t('footer.company')}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {companyLinks.map(({ to, label }) => (
              <li key={to}><Link to={to} className="hover:text-primary transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">
            Connect
          </h4>
          <div className="flex gap-3 text-muted-foreground">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="hover:text-primary transition-colors"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {CURRENT_YEAR} Sehat AI. All rights reserved.
      </div>
    </footer>
  );
}
