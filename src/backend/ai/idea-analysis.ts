import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store your API key in environment variables
});

interface IdeaAIAnalysis {
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

export const analyzeIdea = async (
  ideaText: string,
  user: string
): Promise<IdeaAIAnalysis | null> => {
  const response = await client.chat.completions.create({
    model: "gpt-4-turbo", // You can choose the model that suits your needs
    messages: [
      {
        role: "user",
        content: `
Evaluate: "${ideaText}"

Return JSON:
- ideaProbability: (0-1)
- spamProbability: (0-1)
- offensiveProbability: (0-1)
- relevanceProbability: (0-1)
- sentiment: "positive", "neutral", or "negative"
- uniquenessProbability: (0-1)
- clarityProbability: (0-1)
- culturalSensitivity: (0-1)
- engagementPotential: (0-1)
- tags: ~3-8 tags ["tag1", "tag2", ...]
- title: "2-5 word title"

Make sure the JSON is fully formed and closed properly.

 `,
      },
    ],
    // json format
    response_format: { type: "json_object" },
    max_tokens: 150,
    temperature: 0.5,
    user,
  });

  let output = response.choices[0].message.content;

  if (!output) {
    throw new Error("Failed to generate analysis");
  }

  const ideaAIAnalysis = JSON.parse(output);

  // TODO - NEXT STEP, is SPAM >= 5 or OFFENSIVE >= 5
  // Request rationale about why it is spam or offensive
  return ideaAIAnalysis as IdeaAIAnalysis;
};
