import React from 'react';
import { X, ChefHat, Heart, Crown, LogOut } from 'lucide-react';
import { User } from '@/types/user';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user: User | null;
}

const ProfileModal = ({ isOpen, onClose, isAuthenticated, user }: ProfileModalProps) => {
  if (!isOpen) return null;

  const handleLogin = () => {
    console.log('Login clicked');
  };

  const handleSignup = () => {
    console.log('Signup clicked');
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            {isAuthenticated ? '🍥 Profile' : '🍥 Welcome'}
          </h3>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isAuthenticated && user ? (
          <div className="space-y-6">
            <div className="flex flex-col text-center items-center gap-4">
                <div className='rounded-full w-18 h-18 border-2 border-pink-400 overflow-hidden flex justify-center'>
              <img
                src={user.profilePicture}
                alt={user.displayName}
                className="w-16 h-16 rounded-full object-cover border-2 border-transparent"
              />
              </div>
              <div>
                <h4 className="font-semibold text-lg">{user.displayName}</h4>
                <p className="text-gray-600">@{user.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-pink-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-pink-600 mb-1">
                  <ChefHat className="w-4 h-4" />
                  <span className="font-medium">Recipes</span>
                </div>
                <p className="text-2xl font-bold text-pink-700">{user.recipeCount}</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-pink-600 mb-1">
                  <Heart className="w-4 h-4" />
                  <span className="font-medium">Likes</span>
                </div>
                <p className="text-2xl font-bold text-pink-700">{user.likesCount}</p>
              </div>
            </div>

            <div className="border-t border-b py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-pink-600" />
                  <span className="font-medium">Current Plan</span>
                </div>
                <span className="capitalize bg-pink-100 px-3 py-1 rounded-full text-pink-700">
                  {user.subscriptionPlan}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Log out</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full bg-pink-500 text-white py-3 rounded-xl font-medium hover:bg-pink-600 transition-colors"
            >
              Log in
            </button>
            <button
              onClick={handleSignup}
              className="w-full bg-pink-100 text-pink-700 py-3 rounded-xl font-medium hover:bg-pink-200 transition-colors"
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;