"use client"


import React, { useRef } from 'react';
import { Play, Heart, MessageCircle, BookmarkPlus } from 'lucide-react';

interface TikTokVideoProps {
  videoSrc: string;
  title: string;
  author: string;
  views: string;
  likes: string;
}

const TikTokVideo = ({ videoSrc, title, author, views, likes }: TikTokVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };


  return (
    <div 
      className="relative w-[250px] h-[444px] rounded-xl overflow-hidden shadow-lg bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video 
        ref={videoRef}
        src={videoSrc} 
        className="w-full h-full object-cover opacity-90"
        loop
        muted
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <h3 className="text-white font-medium mb-1">{title}</h3>
        <p className="text-white/80 text-sm mb-2">@{author}</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-white">
            <Play className="w-4 h-4" />
            <span className="text-sm">{views}</span>
          </div>
          <div className="flex items-center gap-1 text-white">
            <Heart className="w-4 h-4" />
            <span className="text-sm">{likes}</span>
          </div>
        </div>
      </div>
      <div className="absolute right-4 bottom-20 flex flex-col gap-4">
        <button className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
          <Heart className="w-5 h-5 text-white" />
        </button>
        <button className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
          <MessageCircle className="w-5 h-5 text-white" />
        </button>
        <button className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
          <BookmarkPlus className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default TikTokVideo;