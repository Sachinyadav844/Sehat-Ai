import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import ErrorBoundary from '@/components/system/ErrorBoundary';

/**
 * 404 Not Found page component
 * Displayed when a route doesn't exist in the application
 */
function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-section px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-medical"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Global error boundary component
 * Catches unexpected errors during page rendering
 */
// Using ErrorBoundary component from components/system

/**
 * Root route configuration
 * Provides context and setup for the entire application
 */
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#12C7B5" },
      { title: "Sehat AI — AI Healthcare Platform" },
      {
        name: "description",
        content:
          "Real-time AI doctor with symptom analysis, hospital matching, appointment booking, and medical reports.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Sehat AI" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorBoundary,
});

/**
 * Root HTML shell
 * Sets up the basic HTML structure for the application
 */
function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Root application component
 * Wraps the entire app with required providers and layout
 */
function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </I18nextProvider>
    </QueryClientProvider>
  );
}
