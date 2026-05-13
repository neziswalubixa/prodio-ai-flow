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
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles, ShieldAlert } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Workflow AI Assistant — Automate your workday" },
      { name: "description", content: "Automate workplace tasks with AI: emails, meeting summaries, and task planning." },
      { property: "og:title", content: "Workflow AI Assistant" },
      { property: "og:description", content: "Automate your workday with AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        children: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':true;document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark');}})();`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 flex items-center gap-3 border-b border-border bg-background/70 backdrop-blur px-4 sticky top-0 z-10">
              <SidebarTrigger />
              <Link to="/" className="flex items-center gap-2 min-w-0">
                <div className="h-7 w-7 rounded-md grid place-items-center text-white shrink-0" style={{ background: "var(--gradient-brand)" }}>
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="leading-tight min-w-0 hidden sm:block">
                  <div className="text-sm font-semibold text-foreground truncate" style={{ fontFamily: "var(--font-display)" }}>
                    Workflow AI Assistant
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">Automate your workday with AI</div>
                </div>
              </Link>
              <div className="ml-auto flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">AI may need human review</span>
                </div>
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1 min-w-0">
              <Outlet />
            </main>
            <footer className="border-t border-border bg-background/50 px-4 py-3">
              <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Responsible AI: AI-generated content should be reviewed before sending.</span>
                </div>
                <div>© {new Date().getFullYear()} Workflow AI Assistant</div>
              </div>
            </footer>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
