"use client"

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Message, useChat } from "ai/react";
import { ChatRequestOptions } from 'ai';

interface ChatContextProps {
    messages: Message[]
    input: string
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void
    handleSubmit: (event?: {
        preventDefault?: () => void;
    }, chatRequestOptions?: ChatRequestOptions) => void
    isLoading: boolean
    append: (message: Message) => void
    reload: () => void
    stop: () => void
    showFullChat: boolean
    setShowFullChat: React.Dispatch<React.SetStateAction<boolean>>
  }

const ChatContext = createContext<ChatContextProps | undefined>(undefined);



export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    if(typeof window === 'undefined') return;
  })
  const tbti_user = window.localStorage.getItem("tbti_user");
  const tbti_allergies = window.localStorage.getItem("tbti_allergies");
    const { handleSubmit, input, handleInputChange, isLoading, messages, append, reload, stop  } = useChat({
        body: {
          model: "llama3-70b-8192",
          temperature: 0.5,
          preference: tbti_user,
          allergies: tbti_allergies,
        },
        onError: (error) => {
          console.error(error);
        },
      });
     useEffect(() => {
      if (messages.length > 0) {
        window.localStorage.setItem("tbti_chat", JSON.stringify(messages));
      }
     }, [messages]);
      const [showFullChat, setShowFullChat] = useState(false)


    return (
        <ChatContext.Provider value={{ handleSubmit, input, handleInputChange, isLoading, messages, showFullChat, setShowFullChat, append, reload, stop }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = (): ChatContextProps => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};