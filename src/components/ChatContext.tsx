/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { Message, useChat } from "ai/react";
import { ChatRequestOptions } from "ai";

interface ChatContextProps {
  messages: Message[];
  suggestions: Array<string[]>;
  youtubeResults: Array<[]>;
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleAgentFunctions: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  isLoading: boolean;
  append: (message: Message) => void;
  reload: () => void;
  stop: () => void;
  data: any;
  showFullChat: boolean;
  setShowFullChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tbti_user, setTbti_user] = useState<string | null>(null);
  const [tbti_allergies, setTbti_allergies] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTbti_user(window.localStorage.getItem("tbti_user"));
      setTbti_allergies(window.localStorage.getItem("tbti_allergies"));
    }
  }, []);

  const [suggestions, setSuggestions] = useState<Array<string[]>>([]);
  const [youtubeResults, setYoutubeResults] = useState<Array<[]>>([]);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  const [fetchingYoutubeResults, setFetchingYoutubeResults] = useState(false);

  const handleQuerySuggestions = async () => {
    setFetchingSuggestions(true);
    try {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context: input,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not cool");
      }
      const data = await response.json();
      if (data?.suggestions?.length > 0) {
        setSuggestions((prevSuggestions) => [
          ...prevSuggestions,
          data.suggestions,
        ]);
      } else {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingSuggestions(false);
    }
  };

  const handleYoutubeSearch = async () => {
    setFetchingYoutubeResults(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: input,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not cool");
      }
      const data = await response.json();
      if (data?.results?.length > 0) {
        setYoutubeResults((prevResults) => [...prevResults, data.results]);
      } else {
        setYoutubeResults(data.results);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingYoutubeResults(false);
    }
  };

  const {
    handleSubmit,
    input,
    handleInputChange,
    isLoading,
    messages,
    append,
    reload,
    stop,
    data,
  } = useChat({
    body: {
      model: "deepseek-r1-distill-llama-70b",
      temperature: 0.6,
      preference: tbti_user,
      allergies: tbti_allergies,
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const [showFullChat, setShowFullChat] = useState(false);

  const handleAgentFunctions = () => {
    handleSubmit();
    handleQuerySuggestions();
    handleYoutubeSearch();
  };

  return (
    <ChatContext.Provider
      value={{
        handleAgentFunctions,
        suggestions,
        youtubeResults,
        input,
        handleInputChange,
        isLoading,
        messages,
        showFullChat,
        setShowFullChat,
        append,
        reload,
        stop,
        data,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = (): ChatContextProps => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
