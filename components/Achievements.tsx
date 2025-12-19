import React from 'react';
import { GameState, Achievement } from '../types';
import { Trophy, Lock, Check } from 'lucide-react';
import * as Icons from 'lucide-react';

interface Props {
  gameState: GameState;
  onClose: () => void;
}

export const Achievements: React.FC<Props> = ({ gameState, onClose }) => {
  const achievements = gameState.achievements || [];
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const getIcon = (iconName?: string) => {
    if (!iconName) return Trophy;
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Trophy;
  };

  return (
    <div className="h-full flex flex-col bg-black text-white p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-neon-green mb-4 glitch-text">ACHIEVEMENTS</h1>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="text-neon-blue">{unlockedCount} / {totalCount}</span>
          </div>
          <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-neon-blue to-neon-green transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {achievements.map(achievement => {
          const Icon = getIcon(achievement.icon);
          const achievementProgress = achievement.target > 0 
            ? (achievement.progress / achievement.target) * 100 
            : 0;

          return (
            <div
              key={achievement.id}
              className={`relative border-2 rounded-lg p-4 transition-all duration-300 ${
                achievement.unlocked
                  ? 'border-neon-green bg-green-900/20'
                  : 'border-gray-700 bg-gray-900/50'
              }`}
            >
              {/* Icon */}
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  achievement.unlocked 
                    ? 'bg-neon-green/20 border-2 border-neon-green' 
                    : 'bg-gray-800 border-2 border-gray-700'
                }`}>
                  {achievement.unlocked ? (
                    <Icon className="text-neon-green" size={32} />
                  ) : (
                    <Lock className="text-gray-600" size={32} />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                    {achievement.name}
                    {achievement.unlocked && (
                      <Check className="text-neon-green" size={20} />
                    )}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                  
                  {/* Progress */}
                  {!achievement.unlocked && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress} / {achievement.target}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-neon-blue transition-all duration-500"
                          style={{ width: `${achievementProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Reward */}
                  {achievement.reward && (
                    <div className={`mt-2 text-xs ${
                      achievement.unlocked ? 'text-yellow-400' : 'text-gray-600'
                    }`}>
                      <span className="font-bold">Reward:</span> {achievement.reward}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={onClose}
        className="px-6 py-3 bg-gray-800 border border-gray-600 hover:bg-gray-700 transition self-start"
      >
        ← Back
      </button>
    </div>
  );
};
