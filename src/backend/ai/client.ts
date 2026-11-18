import OpenAI from "openai";

// Created on first use so builds don't need OPENAI_API_KEY.
let client: OpenAI | null = null;

export const getClient = () =>
  (client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY }));

export const MODERATION_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// The teardown needs real world knowledge (prior art), so it uses a newer
// model than moderation. It runs once per idea.
export const TEARDOWN_MODEL =
  process.env.OPENAI_TEARDOWN_MODEL || "gpt-5.4-mini";

// Reasoning models (gpt-5*, o*) take max_completion_tokens and
// reasoning_effort, and reject a custom temperature.
export const isReasoningModel = (model: string) => /^(gpt-5|o\d)/.test(model);
