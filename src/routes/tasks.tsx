import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ListTodo, Wand2, RefreshCw, Copy, Check, Clock } from "lucide-react";
import { runAI } from "@/lib/ai.functions";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner — Workflow AI" }] }),
  component: TasksPage,
});

const EXAMPLE = `- Finish Q2 report draft (due Friday)
- Reply to client emails from yesterday
- Prep slides for Monday board meeting
- Review pull requests from the eng team
- Schedule onboarding call with new hire
- Quick gym session
- Read industry newsletter
- Plan next sprint backlog`;

type Task = {
  title: string;
  priority: "High" | "Medium" | "Low";
  estimate: string;
  day: string;
  rationale?: string;
};

function TasksPage() {
  const ai = useServerFn(runAI);
  const [input, setInput] = useState(EXAMPLE);
  const [horizon, setHorizon] = useState("daily");
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!input.trim()) {
      toast.error("Add some tasks first.");
      return;
    }
    setLoading(true);
    setTasks(null);
    const res = await ai({
      data: {
        messages: [
          {
            role: "system",
            content:
              'You are a productivity planner. Auto-prioritize tasks based on urgency and deadlines. Respond with ONLY valid JSON (no markdown fences). Schema: {"tasks": [{"title": string, "priority": "High"|"Medium"|"Low", "estimate": string (e.g. "30m", "2h"), "day": string (e.g. "Today AM", "Today PM", "Tomorrow", "Mon", "Tue"...), "rationale": string (one short sentence)}]}. For daily: schedule across Today AM/PM and Tomorrow. For weekly: schedule across Mon-Fri. Order high priority first.',
          },
          { role: "user", content: `Plan horizon: ${horizon}\nTasks:\n${input}` },
        ],
      },
    });
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    try {
      const cleaned = res.content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleaned) as { tasks: Task[] };
      setTasks(parsed.tasks);
    } catch {
      toast.error("Could not parse AI response.");
    }
  };

  const copy = async () => {
    if (!tasks) return;
    const text = tasks
      .map((t) => `[${t.priority}] ${t.day} • ${t.estimate} — ${t.title}`)
      .join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  const priorityColor = (p: Task["priority"]) => {
    if (p === "High") return "bg-destructive/15 text-destructive border-destructive/30";
    if (p === "Medium") return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
    return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
  };

  // Group tasks by day in original order
  const grouped = tasks
    ? tasks.reduce<Record<string, Task[]>>((acc, t) => {
        (acc[t.day] ||= []).push(t);
        return acc;
      }, {})
    : null;

  return (
    <PageShell
      icon={ListTodo}
      title="AI Task Planner"
      description="Drop in your tasks — get an auto-prioritized schedule with time estimates."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tasks">Your tasks</Label>
            <Textarea
              id="tasks"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[260px] font-mono text-sm"
              placeholder="One task per line. Mention deadlines or urgency where you can."
            />
          </div>
          <div className="space-y-2">
            <Label>Plan horizon</Label>
            <Select value={horizon} onValueChange={setHorizon}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily (today / tomorrow)</SelectItem>
                <SelectItem value="weekly">Weekly (Mon–Fri)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={run} disabled={loading} className="flex-1">
              <Wand2 className="h-4 w-4 mr-2" /> {loading ? "Planning…" : "Plan my schedule"}
            </Button>
            {tasks && (
              <Button onClick={run} disabled={loading} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" /> Regenerate
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {loading && (
            <div className="p-6 space-y-2 animate-pulse">
              <div className="h-3 w-3/4 bg-muted rounded" />
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-5/6 bg-muted rounded" />
            </div>
          )}
          {!loading && !tasks && (
            <div className="p-10 text-center text-sm text-muted-foreground min-h-[240px] grid place-items-center">
              Your prioritized schedule will appear here.
            </div>
          )}
          {grouped && (
            <div>
              <div className="flex items-center justify-between border-b border-border px-3 py-2 bg-muted/30">
                <span className="text-xs font-medium text-muted-foreground px-2">
                  {tasks!.length} tasks scheduled
                </span>
                <Button size="sm" variant="ghost" onClick={copy} className="h-7 text-xs">
                  {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="divide-y divide-border">
                {Object.entries(grouped).map(([day, items]) => (
                  <div key={day} className="p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      {day}
                    </div>
                    <div className="space-y-2">
                      {items.map((t, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 rounded-md border border-border bg-background/50 p-3"
                        >
                          <Badge variant="outline" className={priorityColor(t.priority)}>
                            {t.priority}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground">{t.title}</div>
                            {t.rationale && (
                              <div className="text-xs text-muted-foreground mt-0.5">{t.rationale}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                            <Clock className="h-3 w-3" /> {t.estimate}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
