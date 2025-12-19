import React, { useState } from 'react';
import { GameState, CharacterCustomization, EntityType } from '../types';
import { Palette, Shirt, Sparkles } from 'lucide-react';

interface Props {
  gameState: GameState;
  onSaveCustomization: (customizations: CharacterCustomization[]) => void;
  onClose: () => void;
}

const OUTFITS = {
  PLAYER: ['default', 'cyber_ninja', 'hacker_elite', 'glitch_master'],
  COMPANION: ['default', 'royal_cat', 'cyber_cat', 'ninja_cat']
};

const COLORS = [
  { name: 'Default', value: '#ffffff' },
  { name: 'Neon Blue', value: '#00ffff' },
  { name: 'Neon Green', value: '#39ff14' },
  { name: 'Neon Pink', value: '#ff00ff' },
  { name: 'Red', value: '#ff0000' },
  { name: 'Purple', value: '#9d00ff' },
  { name: 'Gold', value: '#ffd700' },
  { name: 'Silver', value: '#c0c0c0' }
];

export const Customization: React.FC<Props> = ({ gameState, onSaveCustomization, onClose }) => {
  const [selectedEntity, setSelectedEntity] = useState<'player' | 'companion'>('player');
  const [playerCustomization, setPlayerCustomization] = useState<CharacterCustomization>(
    gameState.customizations.find(c => c.entityId === gameState.player.id) || {
      entityId: gameState.player.id,
      outfit: 'default',
      color: '#ffffff'
    }
  );
  const [companionCustomization, setCompanionCustomization] = useState<CharacterCustomization>(
    gameState.customizations.find(c => c.entityId === gameState.companion?.id || 'black_cat') || {
      entityId: gameState.companion?.id || 'black_cat',
      outfit: 'default',
      color: '#ffffff'
    }
  );

  const handleSave = () => {
    const customizations = [playerCustomization];
    if (gameState.companion) {
      customizations.push(companionCustomization);
    }
    onSaveCustomization(customizations);
    onClose();
  };

  // Validate selectedEntity and ensure companion exists when selected
  const safeSelectedEntity = (selectedEntity === 'companion' && !gameState.companion) 
    ? 'player' 
    : selectedEntity;
  
  const currentCustomization = safeSelectedEntity === 'player' ? playerCustomization : companionCustomization;
  const setCurrentCustomization = safeSelectedEntity === 'player' ? setPlayerCustomization : setCompanionCustomization;
  const outfits = safeSelectedEntity === 'player' ? OUTFITS.PLAYER : OUTFITS.COMPANION;

  return (
    <div className="h-full flex flex-col bg-black text-white p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-neon-green mb-2 glitch-text">CUSTOMIZATION</h1>
        <p className="text-gray-400">Personalize your characters</p>
      </div>

      {/* Entity Selector */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setSelectedEntity('player')}
          className={`flex-1 py-4 px-6 border-2 rounded-lg transition ${
            selectedEntity === 'player'
              ? 'border-neon-blue bg-blue-900/30 text-white'
              : 'border-gray-700 bg-gray-900/30 text-gray-400 hover:border-gray-600'
          }`}
        >
          <div className="text-xl font-bold">{gameState.player.name}</div>
          <div className="text-sm">The Bot</div>
        </button>
        
        {gameState.companion && (
          <button
            onClick={() => setSelectedEntity('companion')}
            className={`flex-1 py-4 px-6 border-2 rounded-lg transition ${
              selectedEntity === 'companion'
                ? 'border-neon-pink bg-pink-900/30 text-white'
                : 'border-gray-700 bg-gray-900/30 text-gray-400 hover:border-gray-600'
            }`}
          >
            <div className="text-xl font-bold">{gameState.companion.name}</div>
            <div className="text-sm">Your Companion</div>
          </button>
        )}
      </div>

      {/* Preview */}
      <div className="mb-8 p-8 border-2 border-gray-700 rounded-lg bg-gray-900/50 flex items-center justify-center">
        <div className="text-center">
          <div 
            className="w-48 h-48 rounded-lg mb-4 mx-auto border-4 transition-all duration-300"
            style={{ 
              borderColor: currentCustomization.color,
              boxShadow: `0 0 30px ${currentCustomization.color}40`
            }}
          >
            <img 
              src={selectedEntity === 'player' ? gameState.player.avatar : gameState.companion?.avatar || ''}
              alt="Character Preview"
              className="w-full h-full rounded object-cover"
              style={{ filter: `hue-rotate(${getHueRotationDegrees(currentCustomization.color)}deg)` }}
            />
          </div>
          <div className="text-xl font-bold mb-1" style={{ color: currentCustomization.color }}>
            {selectedEntity === 'player' ? gameState.player.name : gameState.companion?.name || 'Companion'}
          </div>
          <div className="text-sm text-gray-400">{currentCustomization.outfit.replace('_', ' ').toUpperCase()}</div>
        </div>
      </div>

      {/* Outfit Selection */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Shirt className="text-neon-blue" />
          <h3 className="text-xl font-bold">Outfit</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {outfits.map(outfit => (
            <button
              key={outfit}
              onClick={() => setCurrentCustomization({ ...currentCustomization, outfit })}
              className={`py-3 px-4 border-2 rounded-lg transition ${
                currentCustomization.outfit === outfit
                  ? 'border-neon-blue bg-blue-900/30 text-white'
                  : 'border-gray-700 bg-gray-900/30 text-gray-400 hover:border-gray-600'
              }`}
            >
              {outfit.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="text-neon-pink" />
          <h3 className="text-xl font-bold">Color</h3>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {COLORS.map(color => (
            <button
              key={color.value}
              onClick={() => setCurrentCustomization({ ...currentCustomization, color: color.value })}
              className={`h-16 rounded-lg border-2 transition hover:scale-110 ${
                currentCustomization.color === color.value
                  ? 'border-white ring-4 ring-white/50'
                  : 'border-gray-700'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {currentCustomization.color === color.value && (
                <Sparkles className="mx-auto text-white drop-shadow-lg" size={24} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button 
          onClick={handleSave}
          className="flex-1 px-6 py-3 bg-neon-green text-black font-bold hover:scale-105 transition shadow-[0_0_20px_rgba(57,255,20,0.5)]"
        >
          Save Changes
        </button>
        <button 
          onClick={onClose}
          className="px-6 py-3 bg-gray-800 border border-gray-600 hover:bg-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Helper function to safely calculate hue rotation degrees
function getHueRotationDegrees(color: string): number {
  const colorIndex = COLORS.findIndex(c => c.value === color);
  // Return 0 degrees if color not found in COLORS array (prevents negative values)
  return colorIndex >= 0 ? colorIndex * 45 : 0;
}
