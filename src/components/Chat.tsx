"use client"

import { ArrowRightIcon } from "lucide-react";
import { useChatContext } from "./ChatContext";
import { useCallback } from "react";

interface ChatInputProps {
  setIsMoodModalOpen: (isOpen: boolean) => void;
  setShowChat: (isOpen: boolean) => void;
}

const ChatInput = ({ setIsMoodModalOpen, setShowChat }: ChatInputProps) => {

  const { input, handleInputChange, handleAgentFunctions } = useChatContext();

  const onSubmit = () => {
    handleAgentFunctions();
    setShowChat(true)
  }

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
            handleAgentFunctions();
            setShowChat(true)
          }
        }
      },
      [handleAgentFunctions, setShowChat]
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative max-w-3xl mx-auto">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me for recipe suggestions..."
            className="w-full pl-6 pr-4 py-4 bg-white border-0 rounded-full shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none overflow-hidden transition-transform duration-500 ease-in-out"
            style={{ minHeight: "50px", height: "auto" }}
            onKeyDown={handleKeyDown}
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
          {/* <button className="bg-pink-100 text-pink-700 px-3 py-3 rounded-full hover:bg-pink-200 transition-all duration-400 active:scale-95">
            <Camera />
          </button> */}
          </div>
          <button className="bg-pink-500 text-white px-3 py-3 rounded-full hover:bg-pink-600 transition-all duration-400 ease-in-out -rotate-45 hover:rotate-0 active:scale-95" onClick={onSubmit}>
            <ArrowRightIcon />
          </button>
        </div>
    </div>
  );
};

export default ChatInput;
