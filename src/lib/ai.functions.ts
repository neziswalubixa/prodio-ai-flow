import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Message = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().min(1).max(20000),
});

const Input = z.object({
  messages: z.array(Message).min(1).max(40),
  model: z.string().default("google/gemini-2.5-flash"),
});

export const runAI = createServerFn({ method: "POST" })
  .inputValidator((input) => Input.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not configured. Add LOVABLE_API_KEY." };
    }

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: data.model,
          messages: data.messages,
        }),
      });

      if (res.status === 429) {
        return { ok: false as const, error: "Rate limit reached. Please wait a moment and try again." };
      }
      if (res.status === 402) {
        return { ok: false as const, error: "AI credits exhausted. Add credits in your workspace usage settings." };
      }
      if (!res.ok) {
        const text = await res.text();
        console.error("AI gateway error", res.status, text);
        return { ok: false as const, error: `AI service error (${res.status}).` };
      }

      const json = await res.json();
      const content: string = json?.choices?.[0]?.message?.content ?? "";
      return { ok: true as const, content };
    } catch (err) {
      console.error("AI request failed", err);
      return { ok: false as const, error: "Failed to reach AI service. Try again." };
    }
  });