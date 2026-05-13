import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Wand2 } from "lucide-react";
import { runAI } from "@/lib/ai.functions";
import { AIOutput } from "@/components/ai-output";
import { AIDisclaimer } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function SimpleTool({
  systemPrompt,
  inputLabel,
  placeholder,
  ctaLabel,
}: {
  systemPrompt: string;
  inputLabel: string;
  placeholder: string;
  ctaLabel: string;
}) {
  const ai = useServerFn(runAI);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!input.trim()) {
      toast.error("Please add some input first.");
      return;
    }
    setLoading(true);
    setOutput("");
    const res = await ai({
      data: {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input },
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
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="space-y-2">
            <Label>{inputLabel}</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="min-h-[280px]"
            />
          </div>
          <Button onClick={run} disabled={loading} className="w-full">
            <Wand2 className="h-4 w-4 mr-2" /> {loading ? "Working…" : ctaLabel}
          </Button>
        </div>
        <AIOutput value={output} onChange={setOutput} loading={loading} />
      </div>
      <AIDisclaimer />
    </>
  );
}