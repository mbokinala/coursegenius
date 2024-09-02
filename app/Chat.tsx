'use client'
import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';

const Chat = () => {
    const { messages, handleInputChange, handleSubmit } = useChat({
      keepLastMessageOnError: true,
    });
    const chatCointainer = useRef<HTMLDivElement>(null);
    const scroll = () => {
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
            /* insert image here */
          <div style = {{width: '100%', marginLeft: '16px'}}>
            <p className = 'message'>{message.content}</p>
            {index < messages.length - 1 && <div className = 'divider'/>}
          </div>
        </div>
        ))}
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
  );
}
export default Chat;