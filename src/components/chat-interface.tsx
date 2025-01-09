"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { ArrowRightIcon, Pencil, Plus, Sparkles, UserRound, Youtube } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useChatContext } from "./ChatContext";
import FormattedText from "@/utils/format-text";

export default function ChatInterface() {
  const { input, handleInputChange, messages, isLoading, handleSubmit } =
    useChatContext();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dispatch certain keys to command input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        if (e.shiftKey) {
          // Add a new line
          e.preventDefault();
          const target = e.target as HTMLTextAreaElement;
          const { selectionStart, selectionEnd, value } = target;
          target.value =
            value.substring(0, selectionStart) +
            "\n" +
            value.substring(selectionEnd);
          target.selectionStart = target.selectionEnd = selectionStart + 1;
        } else {
          // Submit the form
          e.preventDefault();
          handleSubmit();
        }
      }
    },
    [handleSubmit]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen bg-pink-50 text-gray-900 p-4 w-full flex flex-col items-center">
      <div className="flex flex-col w-full max-w-3xl space-y-2 pb-10 items-center">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl w-full space-y-6 pb-5 items-start"
          >
            {msg.role === "assistant" && (
              <div className="flex items-center gap-3 -mb-2">
                <Sparkles className="w-5 h-5 opacity-40 color-pink-200" />
                <p>Answer</p>
              </div>
            )}
            <div className="flex items-start gap-3 w-full">
              <UserRound
                className={`"w-5 h-5 opacity-40 color-pink-200" ${
                  msg.role === "user" ? "flex" : "hidden"
                }`}
              />

              <div className="w-full">
                {FormattedText({ content: msg.content })}
              </div>
              {/* {msg.role === "user" && (
                <button className="ml-auto opacity-40 hover:opacity-100">
                  <Pencil className="w-4 h-4" />
                </button>
              )} */}
            </div>

            {msg.role === "assistant" && msg?.toolInvocations && (
              <div className="space-y-3 pb-20">
                {/* YouTube Results */}
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 flex items-center gap-2 bg-gray-50">
                    <Youtube className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">
                      YouTube Results
                    </span>
                    <span className="text-xs text-gray-400">
                      {msg?.toolInvocations[0]?.result?.results?.results.length}{" "}
                      videos
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 p-4">
                    {msg?.toolInvocations[0]?.result?.results?.results?.map(
                      (result, i) => (
                        <a
                          key={i}
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <Youtube className="w-4 h-4 text-red-500" />
                          <span className="truncate">{result.title}</span>
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
            {isLoading && (
              <p className="text-xl">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                >
                  •
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5,
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                >
                  •
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5,
                    ease: "easeInOut",
                    delay: 0.4,
                  }}
                >
                  •
                </motion.span>
              </p>
            )}

            <div ref={messagesEndRef} />
          </motion.div>
        ))}
      </div>
      {/* Input */}
      <div className="fixed bottom-4 w-full">
        <div className="flex gap-2 max-w-3xl mx-auto items-center bg-white rounded-full p-2 border border-gray-200 shadow-sm">
        <style>
        {`
          @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
          }
          .rotate {
        animation: rotate 10s linear infinite;
          }
        `}
      </style>
      <img src="/assets/cake.svg" alt="Cake" className="w-7 h-7 rotate ml-1" />
          <Input
            placeholder="Ask for more recipes or youtube videos..."
            value={input}
            onChange={handleInputChange}
            className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
                (e.target as HTMLInputElement).value = "";
              }
            }}
          />
           <button className="bg-pink-500 mr-1 text-white p-2 rounded-full hover:bg-pink-600 transition-all duration-400 ease-in-out -rotate-45 hover:rotate-0 active:scale-95"   onClick={() => {
              const input = document.querySelector("input") as HTMLInputElement;
              handleSubmit();
              input.value = "";
            }}>
            <ArrowRightIcon className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  );
}
