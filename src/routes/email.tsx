import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Wand2 } from "lucide-react";
import { runAI } from "@/lib/ai.functions";
import { PageShell, AIDisclaimer } from "@/components/page-shell";
import { AIOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — Workplace AI" }] }),
  component: EmailPage,
});

function EmailPage() {
  const ai = useServerFn(runAI);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!purpose.trim()) {
      toast.error("Please describe what the email is about.");
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
              "You are an expert business email writer. Always return ONLY the email itself in markdown, including a subject line on the first line as **Subject:** ... then a blank line, then the body. Do not add commentary.",
          },
          {
            role: "user",
            content: `Write a ${tone} email of ${length} length.\nRecipient: ${recipient || "the recipient"}\nPurpose / context:\n${purpose}`,
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
            <Label>Recipient</Label>
            <Input placeholder="e.g. Acme Co. procurement team" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>What is the email about?</Label>
            <Textarea
              placeholder="Follow up on the proposal sent last week and ask if they have questions before the Friday meeting…"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="min-h-[140px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            <Wand2 className="h-4 w-4 mr-2" /> {loading ? "Generating…" : "Generate Email"}
          </Button>
        </div>
        <AIOutput value={output} onChange={setOutput} loading={loading} />
      </div>
      <AIDisclaimer />
    </PageShell>
  );
}