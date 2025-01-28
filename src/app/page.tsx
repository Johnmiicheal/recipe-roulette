"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
// import RecipeCard from "../components/RecipeCard";
import TikTokVideo from "../components/TikTokVideo";
// import BottomNav from "../components/BottomNav";
import MoodModal from "../components/MoodModal";
import { tiktokVideos } from "./data/mockData";
import ProfileModal from "../components/ProfileModal";
import { mockAuthState } from "./data/mockAuth";
import ChatInput from "../components/Chat";
import ChatInterface from "@/components/chat-interface";
import { ChatProvider, useChatContext } from "@/components/ChatContext";
import { PreferenceModal } from "@/components/PreferenceModal";

function App() {
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { messages } = useChatContext()


  useEffect(() => {
    const user = localStorage.getItem("tbti_user");
    const allergies = localStorage.getItem("tbti_allergies");
      if(messages?.length > 0) {
        setShowChat(true)
      }

    if (!user || !allergies) {
      setIsPreferenceModalOpen(true);
    }
  }, []);


  const handleMoodSubmit = () => {
    setIsMoodModalOpen(false);
    setShowChat(true);
  };


  return (
    <ChatProvider>
      {showChat ? (
        <ChatInterface />
      ) : (
        <div className="bg-white">
          <div className="p-2">
            <div className="min-h-screen pb-20 bg-pink-50 rounded-xl">
              <main>
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-6">
                  <ChatInput setIsMoodModalOpen={setIsMoodModalOpen} setShowChat={setShowChat} />
                  {/* <section className="mt-[100px]">
                    <h2 className="text-3xl font-bold mb-6">
                      Trending Recipes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {trendingRecipes.map((recipe, index) => (
                        <RecipeCard key={index} {...recipe} />
                      ))}
                    </div>
                  </section> */}

                  <section className="mt-16">
                    <h2 className="text-3xl font-bold mb-6">
                      Popular on TikTok
                    </h2>
                    <div
                      className="flex w-full gap-6 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hidden"
                      style={{ cursor: "pointer" }}
                      onMouseDown={(e) => {
                        const container = e.currentTarget;
                        container.style.cursor = "grabbing";
                        container.style.userSelect = "none";
                        const startX = e.pageX - container.offsetLeft;
                        const scrollLeft = container.scrollLeft;

                        const onMouseMove = (e: MouseEvent) => {
                          const x = e.pageX - container.offsetLeft;
                          const walk = (x - startX) * 2; // scroll-fast
                          container.scrollLeft = scrollLeft - walk;
                        };

                        const onMouseUp = () => {
                          container.style.cursor = "pointer";
                          container.style.removeProperty("user-select");
                          window.removeEventListener("mousemove", onMouseMove);
                          window.removeEventListener("mouseup", onMouseUp);
                        };

                        window.addEventListener("mousemove", onMouseMove);
                        window.addEventListener("mouseup", onMouseUp);
                      }}
                    >
                      <div className="flex-shrink-0 flex gap-6">
                        {tiktokVideos.map((video, index) => (
                          <TikTokVideo key={index} {...video} />
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              </main>

              <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                isAuthenticated={mockAuthState.isAuthenticated}
                user={mockAuthState.user}
              />
              <MoodModal
                isOpen={isMoodModalOpen}
                onClose={() => setIsMoodModalOpen(false)}
                onSubmit={handleMoodSubmit}
              />
              <PreferenceModal isOpen={isPreferenceModalOpen} onClose={() => setIsPreferenceModalOpen(false)} />
            </div>
          </div>
          {/* <BottomNav onProfileClick={() => setIsProfileModalOpen(true)} /> */}
        </div>
      )}
    </ChatProvider>
  );
}

export default App;
