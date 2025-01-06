import React from 'react';
import { Clock, Heart, User } from 'lucide-react';

interface RecipeCardProps {
  title: string;
  author: string;
  time: string;
  image: string;
  likes: number;
}

const RecipeCard = ({ title, author, time, image, likes }: RecipeCardProps) => {
  return (
    <div className="group bg-white rounded-2xl w-full h-[360px] overflow-hidden items-center flex flex-col justify-center shadow-sm hover:shadow-md transition-all duration-300 relative">
      <img src={image} alt={title} className="w-full h-full  object-cover transition-transform duration-300 group-hover:scale-110" />
      <div className="p-6 bg-white w-full absolute bottom-0 transition-ease duration-500 group-hover:w-[95%] group-hover:rounded-xl group-hover:bottom-2 ease-in-out">
      <h3 className="font-semibold text-xl mb-3 group-hover:text-pink-600 transition-colors ">{title}</h3>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
        <User className="w-4 h-4" />
        <span>{author}</span>
        </div>
        <div className="flex items-center gap-1.5">
        <Clock className="w-4 h-4" />
        <span>{time}</span>
        </div>
        <div className="flex items-center gap-1.5 contain" style={{ transition: 'all 0.3s' }}>
        <Heart className="w-4 h-4" />
        <span>{likes.toLocaleString()}</span>
        </div>
      </div>
      </div>
    </div>
  );
};

export default RecipeCard;