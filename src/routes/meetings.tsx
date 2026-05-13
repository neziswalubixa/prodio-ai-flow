import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Wand2, RefreshCw, Copy, Check } from "lucide-react";
import { runAI } from "@/lib/ai.functions";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — Workflow AI" }] }),
  component: MeetingsPage,
});

const EXAMPLE = `Q1 Product Sync — March 14
Attendees: Sara (PM), Liam (Eng Lead), Priya (Design), Noah (QA)

- Sara confirmed the new dashboard ships on April 5
- Liam: backend rate-limit work needs 3 more days, blocking onboarding flow
- Decision: roll back the analytics widget — too noisy for first release
- Priya will send updated empty-state illustrations by Friday
- Noah requested a regression pass before launch; QA window agreed: April 1-3
- Open question: do we need a marketing landing page for launch? Sara to ask Marketing
- Liam to schedule a 30-min architecture review next Wednesday`;

type Plan = {
  summary: string[];
  actions: { task: string; owner: string; deadline: string; status: string }[];
};

function MeetingsPage() {
  const ai = useServerFn(runAI);
  const [notes, setNotes] = useState(EXAMPLE);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [raw, setRaw] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!notes.trim()) {
      toast.error("Paste meeting notes first.");
      return;
    }
    setLoading(true);
    setPlan(null);
    const res = await ai({
      data: {
        messages: [
          {
            role: "system",
            content:
              'You summarize meeting notes. Respond with ONLY valid JSON, no markdown fences. Schema: {"summary": string[3-5], "actions": [{"task": string, "owner": string, "deadline": string, "status": "Not started"|"In progress"|"Blocked"|"Done"}]}. Extract decisions and deadlines. If unknown, use "—".',
          },
          { role: "user", content: notes },
        ],
      },
    });
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setRaw(res.content);
    try {
      const cleaned = res.content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleaned) as Plan;
      setPlan(parsed);
    } catch {
      toast.error("Could not parse AI response. Check raw output.");
    }
  };

  const copy = async () => {
    if (!plan) return;
    const text =
      "Summary:\n" +
      plan.summary.map((s) => `- ${s}`).join("\n") +
      "\n\nAction Items:\n" +
      plan.actions.map((a) => `- [${a.status}] ${a.task} — ${a.owner} (${a.deadline})`).join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  const statusVariant = (s: string) => {
    const v = s.toLowerCase();
    if (v.includes("done")) return "default";
    if (v.includes("blocked")) return "destructive";
    if (v.includes("progress")) return "secondary";
    return "outline";
  };

  return (
    <PageShell
      icon={FileText}
      title="Meeting Notes Summarizer"
      description="Paste raw notes — get a clean summary and an action items table."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Meeting notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[360px] font-mono text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={run} disabled={loading} className="flex-1">
              <Wand2 className="h-4 w-4 mr-2" /> {loading ? "Summarizing…" : "Summarize"}
            </Button>
            {plan && (
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
              <div className="h-3 w-2/3 bg-muted rounded" />
            </div>
          )}
          {!loading && !plan && (
            <div className="p-10 text-center text-sm text-muted-foreground min-h-[240px] grid place-items-center">
              {raw ? "Could not parse output. Try regenerating." : "Summary and action items will appear here."}
            </div>
          )}
          {plan && (
            <Tabs defaultValue="summary" className="w-full">
              <div className="flex items-center justify-between border-b border-border px-3 py-2 bg-muted/30">
                <TabsList>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="actions">Action Items ({plan.actions.length})</TabsTrigger>
                </TabsList>
                <Button size="sm" variant="ghost" onClick={copy} className="h-7 text-xs">
                  {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <TabsContent value="summary" className="p-5 mt-0">
                <ul className="space-y-2 text-sm text-foreground list-disc pl-5">
                  {plan.summary.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="actions" className="p-0 mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plan.actions.map((a, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{a.task}</TableCell>
                        <TableCell>{a.owner}</TableCell>
                        <TableCell>{a.deadline}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </PageShell>
  );
}
