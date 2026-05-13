import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Wand2, RefreshCw } from "lucide-react";
import { runAI } from "@/lib/ai.functions";
import { PageShell } from "@/components/page-shell";
import { AIOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — Workflow AI" }] }),
  component: EmailPage,
});

function EmailPage() {
  const ai = useServerFn(runAI);
  const [recipient, setRecipient] = useState("Acme Co. procurement team");
  const [keyPoints, setKeyPoints] = useState(
    "- Following up on the proposal sent last Tuesday\n- Confirm pricing for the Q2 order\n- Ask if they need any clarifications before Friday's review meeting\n- Offer a quick 15-min call to walk through it",
  );
  const [tone, setTone] = useState("formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!keyPoints.trim()) {
      toast.error("Please add some key points first.");
      return;
    }
    setLoading(true);
    setOutput("");
    const res = await ai({
      data: {
        messages: [
          {
            role: "system",
            content:
              "You are an expert business email writer. Return ONLY the email in markdown. First line MUST be `**Subject:** <subject>`, then a blank line, then the body. Body length 120-180 words. Match the requested tone exactly. Do not add commentary.",
          },
          {
            role: "user",
            content: `Tone: ${tone}\nRecipient: ${recipient || "the recipient"}\nKey points / purpose:\n${keyPoints}`,
          },
        ],
      },
    });
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setOutput(res.content);
  };

  return (
    <PageShell icon={Mail} title="Smart Email Generator" description="Draft polished, on-tone emails from a short brief.">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="points">Key points & purpose</Label>
            <Textarea
              id="points"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              className="min-h-[180px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={generate} disabled={loading} className="flex-1">
              <Wand2 className="h-4 w-4 mr-2" /> {loading ? "Generating…" : "Generate Email"}
            </Button>
            {output && (
              <Button onClick={generate} disabled={loading} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" /> Regenerate
              </Button>
            )}
          </div>
        </div>
        <AIOutput value={output} onChange={setOutput} loading={loading} />
      </div>
    </PageShell>
  );
}
