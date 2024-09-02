"use server";

import { OpenAI, openai } from "@ai-sdk/openai";
import { CoreMessage, generateText } from "ai";
import { convertToCoreMessages, streamText } from "ai";
import { redditTools } from "./reddit";
import { rmpTools } from "./ratemyprof";
import dotenv from "dotenv";
import {z} from 'zod'; 
//import OpenAI from "openai";
//const openai = new OpenAI();

dotenv.config();

export const runtime = 'edge';  
export async function POST(req: Request) {
  const {messages} = await req.json();
  console.log( 'messages:', messages );
  const result = await streamText({
    model: openai("gpt-4o"),
    messages,
    tools: redditTools,
  });
  return result.toAIStreamResponse();
}
async function go() {
  const messages: CoreMessage[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant. Search a unversity's subreddit using only reddit tools for information about a class and its professor. \
        make sure to search by class' full title alone in case theres no results. As a rule of thumb, summarize the information you find about the class or prof.",
    },
    {
      role: "user",
      content:
        "Example",
    },
  ];
  while(true) {
    const result = await generateText({
      model: openai("gpt-4o"),
      messages,
      tools: redditTools,
      maxToolRoundtrips: 15,
    });
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
    
  }
}

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

go();
