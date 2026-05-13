import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail, FileText, ListTodo, Search, MessageSquare,
  Sparkles, ArrowRight, Clock, Zap, Lock,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const tools = [
  { title: "Smart Email Generator", desc: "Draft polished emails in seconds with tone control.", url: "/email", icon: Mail, color: "var(--accent-cyan)" },
  { title: "Meeting Notes Summarizer", desc: "Turn raw transcripts into decisions and action items.", url: "/meetings", icon: FileText, color: "var(--accent-violet)" },
  { title: "AI Task Planner", desc: "Prioritize your day using urgency + importance.", url: "/tasks", icon: ListTodo, color: "var(--accent-pink)" },
  { title: "AI Research Assistant", desc: "Get structured briefings on any topic in minutes.", url: "/research", icon: Search, color: "var(--accent-amber)" },
  { title: "AI Chat", desc: "Open-ended conversational assistant for anything.", url: "/chat", icon: MessageSquare, color: "var(--accent-coral)" },
];

const stats = [
  { icon: Clock, label: "Hours saved per week", value: "8.5h", color: "var(--accent-coral)" },
  { icon: Zap, label: "Faster response time", value: "12×", color: "var(--accent-violet)" },
  { icon: Lock, label: "Editable & private", value: "100%", color: "var(--accent-cyan)" },
];

function Index() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-3xl border border-border p-6 md:p-12"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 backdrop-blur px-3 py-1 text-xs font-medium text-foreground/90">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Powered by AI
        </div>
        <h1
          className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-foreground max-w-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            AI workplace
          </span>{" "}
          assistant
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
          Automate emails, summarize meetings, plan your week, and research smarter — all from one beautifully simple workspace.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-black/30 hover:opacity-95 transition"
            style={{ background: "var(--gradient-brand)" }}
          >
            Start with Email <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 backdrop-blur px-5 py-2.5 text-sm font-medium text-foreground hover:bg-background/60 transition"
          >
            Open AI Chat
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div
              className="h-11 w-11 rounded-xl grid place-items-center shrink-0"
              style={{ backgroundColor: `color-mix(in oklab, ${s.color} 18%, transparent)`, color: s.color }}
            >
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div
                className="text-2xl md:text-3xl font-semibold text-foreground leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1.5">{s.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Tools */}
      <section className="mt-10">
        <h2
          className="text-2xl font-semibold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Productivity tools
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Pick a tool to get started.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
          {tools.map((t) => (
            <Link
              key={t.url}
              to={t.url}
              className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-black/20 transition-all flex flex-col"
            >
              <div
                className="h-11 w-11 rounded-xl grid place-items-center mb-5"
                style={{ backgroundColor: `color-mix(in oklab, ${t.color} 18%, transparent)`, color: t.color }}
              >
                <t.icon className="h-5 w-5" />
              </div>
              <h3
                className="font-semibold text-lg"
                style={{ color: t.color, fontFamily: "var(--font-display)" }}
              >
                {t.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 flex-1">{t.desc}</p>
              <span
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium group-hover:translate-x-0.5 transition-transform"
                style={{ color: t.color }}
              >
                Open tool <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
