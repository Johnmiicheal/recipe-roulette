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
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: (
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
  

  return (
    <ChatContext.Provider
      value={{
        handleSubmit,
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
