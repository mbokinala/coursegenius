import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateText } from "ai";
import { redditTools } from "./reddit";
import {rmpTools} from "./ratemyprof";
import dotenv from "dotenv";

dotenv.config();
async function go() {
  const messages: CoreMessage[] = [
    {
      role: "system",
      content: "You are a helpful assistant. Use the rate my professor tool to get information about a professor.",
    },
    {
      role: "user",
      content: "Get me information about Ben Wiles who teaches at Purdue University - West Lafayette.",
    },
  ];

  const result = await generateText({
    model: openai("gpt-4o"),
    messages,
    tools: rmpTools,
    maxToolRoundtrips: 15,
  });

  console.log(result.text);
}

go();
