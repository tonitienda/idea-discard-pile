import { getClient } from "./client";

// True when OpenAI's moderation endpoint flags the text. Throws if the
// endpoint can't be reached, so callers can refuse rather than publish
// unchecked text.
export async function isCommentFlagged(text: string): Promise<boolean> {
  const result = await getClient().moderations.create({
    model: "omni-moderation-latest",
    input: text,
  });
  return result.results.some((r) => r.flagged);
}
