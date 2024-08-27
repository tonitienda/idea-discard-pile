import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store your API key in environment variables
});

interface IdeaCompletion {
  spam: number;
  offensive: number;
  suggestedTags: string[];
  title: string;
}

export const completeIdea = async (
  ideaText: string
): Promise<IdeaCompletion> => {
  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo", // You can choose the model that suits your needs
    messages: [
      {
        role: "user",
        content: `
      Analyze the following idea:

      "${ideaText}"

      1. Spam Probability: 
      Based on the text, what is the probability that this idea is spam? Give a value between 0 and 1.

      2. Offensive Probability:
      Based on the text, what is the probability that this idea is offensive? Give a value between 0 and 1.

      3. Suggested Tags:
      Suggest relevant tags for this idea. Provide 3-5 tags that best describe the content. Ideally 1 word.
      Example: technology, innovation, design, cooking, mobile, web, vr, sustainability, nutrition, health, collaboratioh, etc.

      4. Title Suggestion:
      Generate a concise and descriptive title for this idea with around 2  -5 words.
    `,
      },
    ],
    max_tokens: 150,
    temperature: 0.5,
  });

  const output = response.choices[0].message.content;

  if (!output) {
    throw new Error("Failed to generate analysis");
  }

  return parseOutput(output);
};

const parseOutput = (output: string): IdeaCompletion => {
  const lines = output.split("\n").filter((line) => line.trim() !== "");
  const result: Partial<IdeaCompletion> = {};

  lines.forEach((line) => {
    if (line.includes("Spam Probability:")) {
      result.spam = parseFloat(line.split(":")[1].trim());
    } else if (line.includes("Offensive Probability:")) {
      result.offensive = parseFloat(line.split(":")[1].trim());
    } else if (line.includes("Suggested Tags:")) {
      const tags = line.split(":")[1].trim().split(", ");
      result.suggestedTags = tags;
    } else if (line.includes("Title Suggestion:")) {
      result.title = line.split(":")[1].trim();
    }
  });

  if (
    result.spam === undefined ||
    result.offensive === undefined ||
    result.suggestedTags === undefined ||
    result.title === undefined
  ) {
    throw new Error("Failed to parse analysis output");
  }

  return result as IdeaCompletion;
};
