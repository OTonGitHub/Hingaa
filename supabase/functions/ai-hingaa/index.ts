import "jsr:@supabase/functions-js/edge-runtime.d.ts";

declare const Deno: any;

type AiRequest = {
  action: "search_activities" | "magic_fill" | "moderate_activity";
  payload: Record<string, unknown>;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const parseJsonFromText = <T>(text: string): T => {
  const trimmed = text.trim();
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("AI response did not contain valid JSON.");
  }
  return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1)) as T;
};

const callGeminiJson = async <T>(prompt: string) => {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY secret in Supabase Edge Function environment.");
  }

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API request failed: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || typeof text !== "string") {
    throw new Error("Gemini returned an unexpected response structure.");
  }

  return parseJsonFromText<T>(text);
};

const handleSearchActivities = async (payload: Record<string, unknown>) => {
  const query = String(payload.query || "").trim();
  const activities = Array.isArray(payload.activities) ? payload.activities : [];

  const prompt = [
    "You are an activity recommendation engine.",
    `User query: ${query}`,
    `Activities: ${JSON.stringify(activities)}`,
    "Return strict JSON only with shape:",
    '{"matches": string[], "suggestion": string | null}',
    "Rules:",
    "- matches should be IDs from the provided activities only.",
    "- if confidence is low, return empty matches and suggestion text.",
    "- keep suggestion under 120 chars."
  ].join("\n");

  return callGeminiJson<{ matches: string[]; suggestion: string | null }>(prompt);
};

const handleMagicFill = async (payload: Record<string, unknown>) => {
  const input = String(payload.input || "").trim();
  const prompt = [
    "Parse the activity plan and return strict JSON only.",
    `Input: ${input}`,
    "JSON shape:",
    '{"title":"string","description":"string","category":"string","participantLimit":number,"date":"YYYY-MM-DD","time":"HH:MM"}',
    "Rules:",
    "- participantLimit must be between 1 and 100.",
    "- if missing date/time, return empty string for those fields.",
    "- keep title concise (<= 80 chars)."
  ].join("\n");

  return callGeminiJson<{
    title: string;
    description: string;
    category: string;
    participantLimit: number;
    date: string;
    time: string;
  }>(prompt);
};

const handleModeration = async (payload: Record<string, unknown>) => {
  const title = String(payload.title || "").trim();
  const description = String(payload.description || "").trim();

  const prompt = [
    "Evaluate safety for this activity and return strict JSON only.",
    "Disallow: nudity, violence, hate speech, political protest mobilization, bullying, criminal activity, gang activity, drugs, alcohol.",
    `Title: ${title}`,
    `Description: ${description}`,
    'Return: {"safe": boolean, "reason": string | null}'
  ].join("\n");

  return callGeminiJson<{ safe: boolean; reason: string | null }>(prompt);
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, payload } = (await req.json()) as AiRequest;

    let result: unknown;
    if (action === "search_activities") {
      result = await handleSearchActivities(payload || {});
    } else if (action === "magic_fill") {
      result = await handleMagicFill(payload || {});
    } else if (action === "moderate_activity") {
      result = await handleModeration(payload || {});
    } else {
      return new Response(JSON.stringify({ error: "Unknown action" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});
