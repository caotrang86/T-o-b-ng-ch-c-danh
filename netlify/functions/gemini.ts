import type { Handler } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";

type ReqBody = {
  prompt?: string;
  model?: string; // optional override
};

const json = (statusCode: number, body: unknown, extraHeaders: Record<string, string> = {}) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    ...extraHeaders,
  },
  body: JSON.stringify(body),
});

export const handler: Handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") return json(204, "");

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json(500, { error: "Missing GEMINI_API_KEY on server" });
  }

  let body: ReqBody;
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const prompt = (body.prompt || "").trim();
  if (!prompt) return json(400, { error: "prompt is required" });

  // Limit payload size
  if (prompt.length > 8000) return json(413, { error: "prompt too long" });

  const model = body.model?.trim() || "gemini-2.0-flash";

  try {
    const ai = new GoogleGenAI({ apiKey });

    const resp = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // Return text to frontend
    const text = resp.text ?? "";

    return json(200, { text, model });
  } catch (err: any) {
    // Do not leak sensitive details
    return json(500, {
      error: "Gemini request failed",
      detail: err?.message ? String(err.message) : "unknown",
    });
  }
};