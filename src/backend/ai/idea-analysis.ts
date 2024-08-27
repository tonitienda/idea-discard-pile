import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store your API key in environment variables
});

interface IdeaCompletion {
  spam: number;
  offensive: number;
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
      Analyze the following idea and return the data in json format:

      "${ideaText}"

      1. spam: 
      Based on the text, what is the probability that this idea is spam? Give a value between 0 and 1.

      2. offensice:
      Based on the text, what is the probability that this idea is offensive? Give a value between 0 and 1.

      3. tags:
      Suggest relevant tags for this idea. Provide 3-5 tags that best describe the content. Ideally 1 word.
      Example: technology, innovation, design, cooking, mobile, web, vr, sustainability, nutrition, health, collaboratioh, etc.

      4. title:
      Generate a concise and descriptive title for this idea with around 2-5 words.
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
