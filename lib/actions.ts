import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateText } from "ai";
import { redditTools } from "./reddit";
import dotenv from "dotenv";

dotenv.config();
async function go() {
  const messages: CoreMessage[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant. You should always use the reddit tools to answer questions about universities. Choose subreddits with more members when there are multiple. Consult the comments where appropriate",
    },
    {
      role: "user",
      content: "get me info about mccutcheon hall at purdue",
    },
  ];

  const result = await generateText({
    model: openai("gpt-4o"),
    messages,
    tools: redditTools,
    maxToolRoundtrips: 15,
  });

  console.log(result.text);
}

go();
