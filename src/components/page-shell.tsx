import { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

export function PageShell({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
      <div className="flex items-start gap-4 mb-8">
        <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export function AIDisclaimer() {
  return (
    <div className="mt-6 flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
      <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
      <span>
        AI-generated content may be inaccurate or incomplete. Always review before using in professional contexts.
      </span>
    </div>
  );
}