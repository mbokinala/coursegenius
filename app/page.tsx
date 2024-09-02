'use client';

import image from 'next/image';
import Chat from './app/Chat';

export default function Home() {
  return (
    <main className = "App">
      <div className = 'container'>
        <div className = 'header'>
          <image src = '/favicon.ico' alt = 'logo' />
        </div>
        <Chat />
      </div>
    </main>
  );
}
