import React from 'react';
import { X } from 'lucide-react';

interface MoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mood: string) => void;
}

const MoodModal = ({ isOpen, onClose, onSubmit }: MoodModalProps) => {
  if (!isOpen) return null;

  const moods = [
    { emoji: "😊", text: "Happy", description: "Looking for something fun and celebratory" },
    { emoji: "😴", text: "Tired", description: "Need quick and easy comfort food" },
    { emoji: "🤒", text: "Under the weather", description: "Something healthy and nourishing" },
    { emoji: "💪", text: "Energetic", description: "Ready to tackle a challenging recipe" },
    { emoji: "😍", text: "In Love", description: "Something romantic and special" },
    { emoji: "🤔", text: "Indecisive", description: "Surprise me with anything" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">How are you feeling?</h3>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {moods.map((mood) => (
            <button
              key={mood.text}
              onClick={() => onSubmit(mood.text)}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-pink-50 transition-colors text-left"
            >
              <span className="text-2xl">{mood.emoji}</span>
              <div>
                <p className="font-medium">{mood.text}</p>
                <p className="text-sm text-gray-600">{mood.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodModal;