import { google } from '@ai-sdk/google';
import {
  streamText,
  convertToModelMessages,
  type UIMessage,
} from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  console.log("User message:",messages);

  const result = streamText({
    model: google('gemini-3.8-flash'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}