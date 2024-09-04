import { redditTools } from "@/app/reddit";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages, customKey } = await req.json();
  console.log("messages:", messages);
  const result = await streamText({
    experimental_toolCallStreaming: true,
    model: openai("gpt-4o"),
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Search a unversity's subreddit using only reddit tools for information about a class and its professor. \
          make sure to search by class' full title alone in case theres no results. As a rule of thumb, summarize the information you find about the class or prof.",
      },
      ...messages,
    ],
    tools: redditTools,
    maxToolRoundtrips: 10
  });
  return result.toDataStreamResponse();
}
