import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateText } from "ai";
import { redditTools } from "./reddit";
import { rmpTools } from "./ratemyprof";
import dotenv from "dotenv";

dotenv.config();
async function go() {
  const messages: CoreMessage[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant. Search a unversity's subreddit using only reddit tools for information about a professor. \
        make sure to search by professor's full name and last name alone in case theres no results",
    },
    {
      role: "user",
      content:
        "Get me information about Julie Deeke who teaches at  University of Illinois at Urbana - Champaign. What is the student sentiment about her?",
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
