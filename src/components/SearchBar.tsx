import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="relative max-w-3xl mx-auto">
      <input
        type="text"
        placeholder="Search for recipes, ingredients, or chefs..."
        className="w-full pl-12 pr-4 py-4 bg-white border-0 rounded-2xl shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
      <Search className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
    </div>
  );
};

export default SearchBar;