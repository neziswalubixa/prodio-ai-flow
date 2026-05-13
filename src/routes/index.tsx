import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Mail, FileText, ListTodo, Search, MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import { AIDisclaimer } from "@/components/page-shell";

export const Route = createFileRoute("/")({
  component: Index,
});

const tools = [
  { title: "Smart Email Generator", desc: "Draft polished emails in seconds.", url: "/email", icon: Mail, hint: "Reply to a client, write a follow-up…" },
  { title: "Meeting Notes Summarizer", desc: "Turn raw notes into action items.", url: "/meetings", icon: FileText, hint: "Paste transcript or notes" },
  { title: "AI Task Planner", desc: "Break a goal into a clear plan.", url: "/tasks", icon: ListTodo, hint: "Ship Q3 launch in 4 weeks" },
  { title: "AI Research Assistant", desc: "Get structured briefings on any topic.", url: "/research", icon: Search, hint: "Competitive landscape for…" },
  { title: "AI Chatbot", desc: "Open-ended conversational assistant.", url: "/chat", icon: MessageSquare, hint: "Ask anything" },
];

function Index() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
      <div className="rounded-xl border border-border bg-gradient-to-br from-card to-muted/40 p-6 md:p-10 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium mb-4">
          <Sparkles className="h-3.5 w-3.5" /> Productivity, automated
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground max-w-2xl">
          Your AI workplace, ready to do the busywork.
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Five specialized AI tools to draft emails, summarize meetings, plan tasks, research topics, and chat — all in one clean workspace.
        </p>
      </div>

      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Tools</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.url}
            to={t.url}
            className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <t.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
            <h3 className="font-semibold text-foreground">{t.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
            <p className="text-xs text-muted-foreground/70 mt-3 italic">e.g. {t.hint}</p>
          </Link>
        ))}
      </div>
      <AIDisclaimer />
    </div>
  );
}
