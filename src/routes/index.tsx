import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListTodo, Search, MessageSquare, Sparkles, ArrowRight, Plus } from "lucide-react";
import { AIDisclaimer } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

const tools = [
  { title: "Smart Email Generator", desc: "Generate professional workplace emails instantly using AI prompts.", url: "/email", icon: Mail },
  { title: "Meeting Notes Summarizer", desc: "Convert meeting transcripts into concise summaries and action items.", url: "/meetings", icon: FileText },
  { title: "AI Task Planner", desc: "Organize goals into smart, actionable productivity plans.", url: "/tasks", icon: ListTodo },
  { title: "AI Research Assistant", desc: "Get quick AI-powered insights and research summaries.", url: "/research", icon: Search },
  { title: "AI Chatbot Interface", desc: "Interactive AI assistant for workplace productivity support.", url: "/chat", icon: MessageSquare },
];

const stats: [string, string][] = [
  ["Tasks Completed", "128"],
  ["AI Generations", "542"],
  ["Meetings Summarized", "34"],
  ["Saved Research Docs", "18"],
];

function Index() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Productivity, automated
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
            AI Workplace Productivity Assistant
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Automate workplace tasks with AI-powered productivity tools designed for modern professionals.
          </p>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <Link to="/chat">
            <Plus className="h-4 w-4 mr-2" /> New AI Task
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-12">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground mt-2" style={{ fontFamily: "var(--font-display)" }}>
              {value}
            </h3>
          </div>
        ))}
      </section>

      {/* Tools */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-foreground">AI Productivity Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.url}
              to={tool.url}
              className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                  <tool.icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="font-semibold text-foreground">{tool.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 flex-1">{tool.desc}</p>
              <span className="text-xs font-medium text-primary mt-4 inline-flex items-center gap-1">
                Open tool <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <AIDisclaimer />
    </div>
  );
}
