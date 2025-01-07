/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Sparkles, UserRound, Youtube } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useChatContext } from "./ChatContext";


export default function ChatInterface() {

  const { input, handleInputChange, messages, isLoading, handleSubmit} = useChatContext();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const youtubeResults: any[] = []
  const suggestedQuestions: any[] = []

  // Dispatch certain keys to command input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (e.shiftKey) {
          // Add a new line
        } else {
          // Submit the form
          e.preventDefault();
          formRef.current?.requestSubmit();
        }
      }
    },
    []
  );
 
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  interface FormattedTextProps {
    content: string;
  }
  
  const FormattedText: React.FC<FormattedTextProps> = ({ content }) => {
    // Split the content into lines, handling all types of newlines (\n, \n\n, multiple \n)
    const lines = content.split(/\n+/);
  
    // Process each line
    const formattedText = lines.map((line, index) => {
      // Check if the line starts with a number (bullet point)
      if (/^\d+\./.test(line)) {
        return (
          <div key={index} className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              {line
                .replace(/^\d+\.\s*/, "")
                .split(" ")
                .map((word, wordIndex) =>
                  word.startsWith("https://") ? (
                    <span key={wordIndex} className="inline-flex items-center">
                      <Link href={word} passHref>
                        <a className="text-pink-500">{word}</a>
                      </Link>
                    </span>
                  ) : (
                    word + " "
                  )
                )}
            </span>
          </div>
        );
      }
  
      // Check if the line is empty (to handle multiple newlines)
      if (line.trim() === "") {
        return <br key={index} />; // Render a line break for empty lines
      }
  
      // Regular line
      return (
        <p key={index} className="mb-4">
          {line.split(" ").map((word, wordIndex) =>
            word.startsWith("https://") ? (
              <span key={wordIndex} className="inline-flex items-center">
                <Link href={word} passHref>
                  <a className="text-pink-500">{word}</a>
                </Link>
              </span>
            ) : (
              word + " "
            )
          )}
        </p>
      );
    });
  
    return <div className="">{formattedText}</div>;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4">
      {messages.map((msg, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-6"
        >
           {msg.role === "assistant" && (
               <div className="flex items-center gap-3 -mb-2">
                <Sparkles className="w-5 h-5 opacity-40 color-pink-200" />
                <p>Answer</p>
                </div>
              )}
          <div className="flex items-start gap-3">
            <UserRound
              className={`"w-5 h-5 opacity-40 color-pink-200" ${
                msg.role === "user" ? "flex" : "hidden"
              }`}
            />

            <div>
              {FormattedText({ content: msg.content })}
              </div>
            {msg.role === "user" && (
              <button className="ml-auto opacity-40 hover:opacity-100">
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </div>

          <div ref={messagesEndRef} />
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

            {msg.role === "assistant" && (
              <div className="space-y-3 mb-4">
                {/* YouTube Results */}
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 flex items-center gap-2 bg-gray-50">
                    <Youtube className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">YouTube Results</span>
                    <span className="text-xs text-gray-400">
                      {youtubeResults?.length} videos
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 p-4">
                    {youtubeResults?.map((result, i) => (
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
                    ))}
                  </div>
                </div>

               
              </div>
            )}
        </motion.div>
      ))}
      {/* Input */}
      <div className="fixed bottom-4 pt-10 mt-8 w-full mx-auto">
        <div className="flex gap-2 max-w-3xl mx-auto items-center bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
          </button>
          <Input
            placeholder="Ask a new question..."
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
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => {
              const input = document.querySelector("input") as HTMLInputElement;
              handleSubmit();
              input.value = "";
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.2031 7.95693C14.3837 7.87668 14.5 7.69762 14.5 7.50002C14.5 7.30242 14.3837 7.12336 14.2031 7.04311L1.20308 1.04312ZM4.73178 7.50002L2.19613 3.11550L12.9699 7.50002L2.19613 11.8845L4.73178 7.50002Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
