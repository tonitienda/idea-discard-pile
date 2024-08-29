import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store your API key in environment variables
});

/*

Return JSON:
- ideaProbability: (0-1)
- spamProbability: (0-1)
- spamExplanation: 1-2 short sentences
- offensiveProbability: (0-1)
- relevanceProbability: (0-1)
- sentiment: "positive", "neutral", or "negative"
- uniquenessProbability: (0-1)
- clarityProbability: (0-1)
- culturalSensitivity: (0-1)
- engagementPotential: (0-1)
- tags: ~3-8 tags ["tag1", "tag2", ...]
- title: "2-5 word title"
*/
interface IdeaCompletion {
  ideaProbability: number;
  spamProbability: number;
  spamExplanation: string;
  offensiveProbability: number;
  relevanceProbability: number;
  sentiment: string;
  uniquenessProbability: number;
  clarityProbability: number;
  culturalSensitivity: number;
  engagementPotential: number;
  tags: string[];
  title: string;
}

export const completeIdea = async (
  ideaText: string,
  user: string
): Promise<IdeaCompletion> => {
  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo", // You can choose the model that suits your needs
    messages: [
      {
        role: "user",
        content: `
Evaluate: "${ideaText}"

Return JSON:
- ideaProbability: (0-1)
- spamProbability: (0-1)
- spamExplanation: 1-2 short sentences
- offensiveProbability: (0-1)
- relevanceProbability: (0-1)
- sentiment: "positive", "neutral", or "negative"
- uniquenessProbability: (0-1)
- clarityProbability: (0-1)
- culturalSensitivity: (0-1)
- engagementPotential: (0-1)
- tags: ~3-8 tags ["tag1", "tag2", ...]
- title: "2-5 word title"
 `,
      },
    ],
    // json format
    response_format: { type: "json_object" },
    max_tokens: 150,
    temperature: 0.5,
    user,
  });

  const output = response.choices[0].message.content;

  if (!output) {
    throw new Error("Failed to generate analysis");
  }

  console.log("output", output);

  return JSON.parse(output) as IdeaCompletion;
};
