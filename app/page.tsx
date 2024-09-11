'use client'
import { useChat } from 'ai/react';
import { Textarea } from "@/components/ui/textarea"
import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Chat(){
  const { messages,input,  handleInputChange, handleSubmit } = useChat({
    keepLastMessageOnError: true,
  });
  return (
      <>
        {messages.map(message => (
          <div key={message.id}>
            {message.role === 'user' ? 'User: ' : 'AI: '}
            {message.content}
          </div>
        ))}
        <form onSubmit={handleSubmit}>
          <input name="prompt" value={input} onChange={handleInputChange} />
          <button type="submit">Submit</button>
        </form>
        
      </>
    );
};
/*<form onSubmit={handleSubmit}>
          <input name="prompt" value={input} onChange={handleInputChange} />
          <button type="submit">Submit</button>
        </form>*/
    //const chatCointainer = useRef<HTMLDivElement>(null);
    /*const scroll = () => {
      const { offsetHeight, scrollHeight, scrollTop} = chatCointainer.current as HTMLDivElement
      if (offsetHeight + scrollTop <= scrollHeight) {
        chatCointainer.current?.scrollTo(0, scrollHeight+200);
      }
    }
  const renderReponse = () => {
    return (
      <div className ="response">
        {messages.map((message, index) => (
          <div key = {message.id} className = {`chat-line   ${message.role == 'user' ? 'user-chat' : 'ai-chat'}`}>
            /* insert image here 
          <div style = {{width: '100%', marginLeft: '16px'}}>
            <p className = 'message'>{message.content}</p>
            {index < messages.length - 1 && <div className = 'divider'/>}
          </div>
        </div>
        ))}
        <form
          onSubmit={event => {
            handleSubmit(event, {
              body: {
                customKey: "You are a helpful assistant. Search a unversity's subreddit using only reddit tools for information about a class and its professor. \
                make sure to search by class' full title alone in case theres no results. As a rule of thumb, summarize the information you find about the class or prof."
              },
            });
          }}
        >
          <input value={input} onChange={handleInputChange} />
        </form>
      </div>
    );
  };
  return  (
    <div ref = {chatCointainer} className = 'chat'>
      {renderReponse()}
      <form onSubmit = {handleSubmit} className = 'mainForm'>
        <input name = "input-field" type = "text" placeholder = "Type a message..." />
        <button type = "submit">Send</button>
      </form>
    </div>
  );*/
//}
/*'use client';

import image from 'next/image';
import Chat from './app/Chat';
*/
