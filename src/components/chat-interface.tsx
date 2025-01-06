'use client'

import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Plus, Youtube } from 'lucide-react'

interface YouTubeResult {
  title: string;
  url: string;
}

interface SuggestedQuestion {
  text: string;
  onClick: () => void;
}

interface ChatInterfaceProps {
  question: string;
  answer: string;
  youtubeResults: YouTubeResult[];
  suggestedQuestions: SuggestedQuestion[];
  onAskQuestion: (question: string) => void;
}

export default function ChatInterface({
  question,
  answer,
  youtubeResults,
  suggestedQuestions,
  onAskQuestion
}: ChatInterfaceProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* Question */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 opacity-40">👤</div>
          <p className="text-[15px]">{question}</p>
          <button className="ml-auto opacity-40 hover:opacity-100">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" />
            </svg>
          </button>
        </div>

        {/* Answer */}
        <div className="space-y-4 text-sm leading-relaxed">
          {answer.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* YouTube Results */}
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 flex items-center gap-2 bg-gray-50">
            <Youtube className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-600">YouTube Results</span>
            <span className="text-xs text-gray-400">{youtubeResults.length} videos</span>
          </div>
          
          <div className="flex flex-wrap gap-2 p-4">
            {youtubeResults.map((result, i) => (
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

        {/* Suggested Questions */}
        <div>
          <h3 className="text-sm font-medium mb-3">Suggested questions</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, i) => (
              <button
                key={i}
                onClick={question.onClick}
                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 transition-colors"
              >
                {question.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="sticky bottom-4 mt-8">
          <div className="flex gap-2 items-center bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
            </button>
            <Input
              placeholder="Ask a new question..."
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onAskQuestion((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement;
                onAskQuestion(input.value);
                input.value = '';
              }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.2031 7.95693C14.3837 7.87668 14.5 7.69762 14.5 7.50002C14.5 7.30242 14.3837 7.12336 14.2031 7.04311L1.20308 1.04312ZM4.73178 7.50002L2.19613 3.11550L12.9699 7.50002L2.19613 11.8845L4.73178 7.50002Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

