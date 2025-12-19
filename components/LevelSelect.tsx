import React from 'react';
import { GameState, Level } from '../types';
import { Lock, Star, Trophy } from 'lucide-react';

interface Props {
  gameState: GameState;
  onSelectLevel: (level: Level) => void;
  onBack: () => void;
}

export const LevelSelect: React.FC<Props> = ({ gameState, onSelectLevel, onBack }) => {
  const levels = gameState.levels || [];
  
  const getThemeColor = (theme: string) => {
    switch(theme) {
      case 'CYBER_CITY': return 'from-blue-900 to-purple-900';
      case 'FOREST': return 'from-green-900 to-emerald-900';
      case 'DESERT': return 'from-yellow-900 to-orange-900';
      case 'ARCTIC': return 'from-cyan-900 to-blue-900';
      case 'VOLCANO': return 'from-red-900 to-orange-900';
      case 'SPACE': return 'from-purple-900 to-black';
      default: return 'from-gray-900 to-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-white p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-neon-green mb-2 glitch-text">LEVEL SELECT</h1>
        <p className="text-gray-400">Choose your adventure...</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {levels.map((level, index) => (
          <div
            key={level.id}
            className={`relative border-2 rounded-lg p-4 transition-all duration-300 ${
              level.unlocked
                ? 'border-neon-blue hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] cursor-pointer hover:scale-105'
                : 'border-gray-700 opacity-50 cursor-not-allowed'
            }`}
            onClick={() => level.unlocked && onSelectLevel(level)}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getThemeColor(level.theme)} opacity-30 rounded-lg`}></div>
            
            {/* Lock Icon for Locked Levels */}
            {!level.unlocked && (
              <div className="absolute top-2 right-2 z-10">
                <Lock className="text-gray-500" size={24} />
              </div>
            )}

            {/* Completed Badge */}
            {level.completed && (
              <div className="absolute top-2 right-2 z-10">
                <Trophy className="text-yellow-400 fill-yellow-400" size={24} />
              </div>
            )}

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-neon-pink font-bold text-lg">Level {index + 1}</span>
                <div className="flex gap-1">
                  {Array.from({ length: level.difficulty }).map((_, i) => (
                    <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{level.name}</h3>
              <p className="text-sm text-gray-300 mb-3">{level.description}</p>
              
              <div className="text-xs text-gray-400">
                <div>Theme: {level.theme.replace('_', ' ')}</div>
                {level.bestTime && (
                  <div className="text-neon-green">Best Time: {level.bestTime}s</div>
                )}
              </div>

              {/* Objectives Preview */}
              <div className="mt-3 text-xs text-gray-400">
                <div className="font-bold text-gray-300 mb-1">Objectives:</div>
                {level.objectives.slice(0, 2).map(obj => (
                  <div key={obj.id} className="flex items-center gap-1">
                    <span className={obj.completed ? 'text-green-400' : 'text-gray-500'}>
                      {obj.completed ? '✓' : '○'} {obj.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onBack}
        className="px-6 py-3 bg-gray-800 border border-gray-600 hover:bg-gray-700 transition self-start"
      >
        ← Back
      </button>
    </div>
  );
};
