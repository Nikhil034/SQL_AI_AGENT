"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ToolState =
  | "input-streaming"
  | "input-available"
  | "approval-requested"
  | "approval-responded"
  | "output-available"
  | "output-error"
  | "output-denied";

function ToolStatus({
  label,
  state,
  errorText,
}: {
  label: string;
  state: ToolState;
  errorText?: string;
}) {
  if (state === "output-error") {
    return (
      <p className="rounded-md border border-red-900/60 bg-red-950/30 px-3 py-2 text-sm text-red-200">
        {label} failed: {errorText ?? "Please try again."}
      </p>
    );
  }

  if (state === "output-denied") {
    return (
      <p className="rounded-md border border-amber-800/60 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
        {label} was not permitted.
      </p>
    );
  }

  const complete = state === "output-available";

  return (
    <p className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300">
      <span aria-hidden="true">{complete ? "✓" : "…"}</span> {label}
      {complete ? " complete" : "…"}
    </p>
  );
}

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Sales data assistant</h1>

      <section className="flex flex-1 flex-col gap-5" aria-live="polite">
      {messages.map((message) => (
        <article
          key={message.id}
          className={
            message.role === "user"
              ? "ml-auto max-w-[85%] rounded-2xl bg-blue-600 px-4 py-3 text-white"
              : "max-w-[85%] space-y-3 rounded-2xl bg-zinc-900 px-4 py-3 text-zinc-100"
          }
        >
          <p className="text-xs font-medium uppercase tracking-wide opacity-70">
            {message.role === "user" ? "You" : "Data assistant"}
          </p>

          {message.parts.map((part, i) => {
            if (part.type === "text") {
              return (
                <ReactMarkdown
                  key={`${message.id}-${i}`}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => (
                      <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">
                        {children}
                      </ol>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                  }}
                >
                  {part.text}
                </ReactMarkdown>
              );
            }

            if (part.type === "tool-readdb") {
              return (
                <ToolStatus
                  key={part.toolCallId}
                  label="Reading the database schema"
                  state={part.state}
                  errorText={part.errorText}
                />
              );
            }

            if (part.type === "tool-getdata") {
              return (
                <ToolStatus
                  key={part.toolCallId}
                  label="Checking your sales data"
                  state={part.state}
                  errorText={part.errorText}
                />
              );
            }

            return null;
          })}
        </article>
      ))}

      {status === "submitted" || status === "streaming" ? (
        <p className="text-sm text-zinc-400">Preparing your answer…</p>
      ) : null}
      {error ? (
        <p className="rounded-md border border-red-900/60 bg-red-950/30 px-3 py-2 text-sm text-red-200">
          The assistant could not complete that request. Please try again.
        </p>
      ) : null}
      </section>

      <form
        className="sticky bottom-0 mt-6 flex gap-2 bg-black py-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim() || status !== "ready") return;
          sendMessage({ text: input });
          setInput("");
        }}
      >
        <input
          className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-900 p-3 outline-none focus:border-blue-400"
          value={input}
          placeholder="Ask about sales, orders, products, or stock..."
          onChange={(e) => setInput(e.currentTarget.value)}
          disabled={status !== "ready"}
        />
        <button
          className="rounded-lg bg-blue-600 px-4 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer"
          type="submit"
          disabled={!input.trim() || status !== "ready"}
        >
          Send
        </button>
      </form>
    </main>
  );
}
