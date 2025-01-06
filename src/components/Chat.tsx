"use client"

import { ArrowRightIcon, Camera } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  setIsMoodModalOpen: (isOpen: boolean) => void;
}

const ChatInput = ({ setIsMoodModalOpen }: ChatInputProps) => {
  const [query, setQuery] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="relative max-w-3xl mx-auto">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me for recipe suggestions..."
          className="w-full pl-6 pr-4 py-4 bg-white border-0 rounded-full shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none overflow-hidden transition-transform duration-500 ease-in-out"
          style={{ minHeight: "50px", height: "auto" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = target.scrollHeight + "px";
          }}
          onFocus={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.classList.remove("rounded-full");
            target.classList.add("rounded-2xl");
          }}
          onBlur={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.classList.remove("rounded-2xl");
            target.classList.add("rounded-full");
          }}
        />
      </div>

      <div className="mt-4 text-center mx-auto justify-between flex max-w-3xl">
        <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMoodModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 transition-all  duration-400 active:scale-95"
        >
          I&apos;m feeling lucky
        </button>
        <button className="bg-pink-100 text-pink-700 px-3 py-3 rounded-full hover:bg-pink-200 transition-all duration-400 active:scale-95">
          <Camera />
        </button>
        </div>
        <button className="bg-pink-500 text-white px-3 py-3 rounded-full hover:bg-pink-600 transition-all duration-400 ease-in-out -rotate-45 hover:rotate-0 active:scale-95">
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
