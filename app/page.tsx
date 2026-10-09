import { Suspense } from 'react';
import Chat from './chat';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <Chat />
    </Suspense>
  );
}