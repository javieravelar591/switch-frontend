import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import { FiSend, FiShoppingBag } from "react-icons/fi";
import withAuth from "@/components/hoc/withAuth";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const history = [...messages];
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok || !res.body) {
        const err = new Error("Request failed") as any;
        err.status = res.status;
        throw err;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const { text } = JSON.parse(data);
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: updated[updated.length - 1].content + text,
              };
              return updated;
            });
          } catch {}
        }
      }
    } catch (err: any) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content:
            err?.status === 401
              ? "You need to be logged in to use the personal shopper."
              : err?.status === 429
              ? "You're sending messages too fast. Please wait a moment and try again."
              : "Sorry, something went wrong. Please try again.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Head>
        <title>Personal Shopper | Switch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="flex flex-col h-[calc(100vh-57px)] bg-[#0a0a0a]">

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <FiShoppingBag className="text-indigo-400" size={22} />
            </div>
            <div>
              <h1 className="text-white text-xl font-semibold mb-1">Your Personal Shopper</h1>
              <p className="text-zinc-500 text-sm max-w-sm">
                Tell me your style, a vibe, or a brand you love — I'll find what fits you.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {[
                "Find me Japanese streetwear brands",
                "Something like Rick Owens but cheaper",
                "Luxury brands from Paris",
                "Technical outdoor brands with style",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-3 py-1.5 text-xs rounded-full border border-zinc-800 text-zinc-400 hover:border-indigo-500/50 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto py-6">
            <div className="max-w-2xl mx-auto px-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <>
                        {msg.content === "" && loading && i === messages.length - 1 ? (
                          <span className="inline-flex gap-1 items-center text-zinc-500">
                            <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
                            <span className="animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
                            <span className="animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
                          </span>
                        ) : (
                          <ReactMarkdown
                            components={{
                              a: ({ href, children }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-400 underline underline-offset-2 hover:text-indigo-300 transition-colors"
                                >
                                  {children}
                                </a>
                              ),
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                              li: ({ children }) => <li>{children}</li>,
                              strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        )}
                      </>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-zinc-800/60 px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about brands, styles, or vibes..."
              rows={1}
              className="flex-1 resize-none bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-colors max-h-32 overflow-y-auto"
              style={{ lineHeight: "1.5" }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <FiSend size={15} />
            </button>
          </div>
          <p className="text-center text-zinc-700 text-xs mt-2">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </>
  );
}

export default withAuth(ChatPage);
