import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SimpleTool } from "@/components/simple-tool";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — Workplace AI" }] }),
  component: () => (
    <PageShell
      icon={FileText}
      title="Meeting Notes Summarizer"
      description="Paste raw notes or a transcript and get a clean summary with decisions and action items."
    >
      <SimpleTool
        systemPrompt={`You summarize meeting notes for busy professionals. Return markdown with these sections in order:\n## Summary (3-5 sentences)\n## Key Decisions (bulleted)\n## Action Items (table with columns: Owner | Task | Due)\n## Open Questions (bulleted)\nIf information is missing for a section, write "None noted." Do not invent owners or dates.`}
        inputLabel="Meeting notes or transcript"
        placeholder="Paste raw notes, bullet points, or a meeting transcript here…"
        ctaLabel="Summarize Meeting"
      />
    </PageShell>
  ),
});