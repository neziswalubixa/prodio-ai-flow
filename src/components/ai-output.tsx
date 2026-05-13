import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, Eye, Pencil } from "lucide-react";
import { toast } from "sonner";

export function AIOutput({ value, onChange, loading }: { value: string; onChange: (v: string) => void; loading?: boolean }) {
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (value && mode === "edit") return;
  }, [value, mode]);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading && !value) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 min-h-[240px]">
        <div className="space-y-2 animate-pulse">
          <div className="h-3 w-3/4 bg-muted rounded" />
          <div className="h-3 w-full bg-muted rounded" />
          <div className="h-3 w-5/6 bg-muted rounded" />
          <div className="h-3 w-2/3 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!value) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground min-h-[240px] grid place-items-center">
        Output will appear here.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-3 py-2 bg-muted/30">
        <div className="flex gap-1">
          <Button size="sm" variant={mode === "preview" ? "secondary" : "ghost"} onClick={() => setMode("preview")} className="h-7 text-xs">
            <Eye className="h-3.5 w-3.5 mr-1" /> Preview
          </Button>
          <Button size="sm" variant={mode === "edit" ? "secondary" : "ghost"} onClick={() => setMode("edit")} className="h-7 text-xs">
            <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
          </Button>
        </div>
        <Button size="sm" variant="ghost" onClick={copy} className="h-7 text-xs">
          {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      {mode === "preview" ? (
        <div className="prose prose-sm max-w-none p-5 prose-headings:font-semibold prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-code:text-foreground">
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[320px] border-0 rounded-none focus-visible:ring-0 font-mono text-sm"
        />
      )}
    </div>
  );
}