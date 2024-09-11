"use server";
import kv from '@vercel/kv';
import {openai } from "@ai-sdk/openai";
import { CoreMessage, generateText } from "ai";
import { convertToCoreMessages, streamText } from "ai";
import { redditTools } from "./reddit";
import { rmpTools } from "./ratemyprof";
import dotenv from "dotenv";
import { Ratelimit } from '@upstash/ratelimit';
import { NextRequest } from 'next/server';
import {z} from 'zod'; 
//import OpenAI from "openai";
//const openai = new OpenAI();

dotenv.config();
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.tokenBucket(5, "10 s", 10),
  analytics: true,
});


export const runtime = 'edge';  
export async function POST(req: NextRequest) {

  const ip = req.ip ?? 'ip'; // Update the type of 'req' to Request and access the 'ip' property
  const { success, remaining } = await ratelimit.limit(ip);
  if (!success) {
    return new Response('Ratelimited!', { status: 429 });
  }
  const { messages, customKey } = await req.json();
  console.log('messages:', messages);

  const result = await streamText({
    experimental_toolCallStreaming: true,
    model: openai("gpt-4o"),
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant. Search a unversity's subreddit using only reddit tools for information about a class and its professor. \
        make sure to search by class' full title alone in case theres no results. As a rule of thumb, summarize the information you find about the class or prof. Keep it Succint and formatted",
    },
    ...messages,
    ],
    tools: redditTools,
    maxToolRoundtrips: 15,
  });
  return result.toDataStreamResponse();
}
/*async function go() {
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
  ];*/
  /*while(true) {
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

go();*/
