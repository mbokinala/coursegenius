import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateText } from "ai";

import dotenv from "dotenv";

dotenv.config();

async function getUserInput(prompt: string) {
  return new Promise<string>((resolve) => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question(prompt, (input: string) => {
      readline.close();
      resolve(input);
    });
  });
}

async function main() {
  // initial messages array that has a system message and a user message
  const messages: CoreMessage[] = [
    {
      role: "system",
      content:
        "You are a funny standup comedian who interacts with the audience. Keep your jokes short.",
    },
    {
      role: "user",
      content: "I like dogs.",
    },
  ];

  // conversation runs indefinitely
  while (true) {
    // generate text based on the messages array
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      messages,
    });

    // adds the AI messages to the array
    // this will contain something like { role: 'assistant', content: '...' }
    messages.push(...result.responseMessages);

    // print the AI message to the console
    console.log("[AI]", result.text);

    // get the user's response
    let userInput = await getUserInput("[Enter your response]: ");

    // add the user message to the array
    messages.push({
      role: "user",
      content: userInput,
    });

    console.log("\n")

    // uncomment this to see the full conversation state
    // console.log(JSON.stringify(messages, null, 2));
  }
}

main();
