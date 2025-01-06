import React from 'react';
import { ChefHat, Home, TrendingUp, Users, BookOpen, Heart } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-8">
          <ChefHat className="w-8 h-8 text-pink-500" />
          <h1 className="text-xl font-bold">RecipeAI</h1>
        </div>
        
        <nav className="space-y-1">
          {[
            { icon: Home, label: 'Home' },
            { icon: TrendingUp, label: 'Trending' },
            { icon: Users, label: 'Famous Chefs' },
            { icon: BookOpen, label: 'My Recipes' },
            { icon: Heart, label: 'Favorites' },
          ].map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-3 w-full px-3 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;