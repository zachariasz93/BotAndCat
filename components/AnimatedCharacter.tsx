import React, { useEffect, useState } from 'react';
import { Entity, AnimationState } from '../types';

interface Props {
  entity: Entity;
  size?: number;
  showLevel?: boolean;
}

export const AnimatedCharacter: React.FC<Props> = ({ entity, size = 48, showLevel = false }) => {
  const [frame, setFrame] = useState(0);
  const animState = entity.animationState || AnimationState.IDLE;

  // Validate animation state is a valid enum value
  const validAnimState = Object.values(AnimationState).includes(animState) 
    ? animState 
    : AnimationState.IDLE;

  // Simple frame animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % 4);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Animation effects based on state
  const getAnimationClass = () => {
    switch(validAnimState) {
      case AnimationState.RUNNING:
        return 'animate-bounce';
      case AnimationState.JUMPING:
        return 'animate-pulse';
      case AnimationState.DAMAGED:
        return 'animate-ping';
      case AnimationState.ATTACKING:
        return 'animate-pulse-fast';
      case AnimationState.IDLE:
      default:
        return '';
    }
  };

  // Color tint based on animation state
  const getFilterClass = () => {
    switch(validAnimState) {
      case AnimationState.DAMAGED:
        return 'brightness-150 hue-rotate-[340deg]'; // Red tint
      case AnimationState.ATTACKING:
        return 'brightness-125 contrast-125';
      default:
        return '';
    }
  };

  // Border color based on entity type
  const getBorderColor = () => {
    switch(entity.type) {
      case 'PLAYER':
        return 'border-neon-green shadow-[0_0_15px_#39ff14]';
      case 'COMPANION':
        return 'border-neon-pink shadow-[0_0_10px_#ff00ff]';
      case 'ENEMY':
        return 'border-red-500 shadow-[0_0_10px_#ff0000]';
      case 'BOSS':
        return 'border-purple-500 shadow-[0_0_20px_#9d00ff]';
      default:
        return 'border-gray-500';
    }
  };

  // Apply customization if available
  const customization = entity.customization;
  const style: React.CSSProperties = {
    filter: customization?.color !== '#ffffff' 
      ? `hue-rotate(${getHueRotation(customization?.color || '#ffffff')}deg)` 
      : undefined
  };

  return (
    <div className="relative">
      <div className={`relative ${getAnimationClass()}`}>
        <img 
          src={entity.avatar}
          className={`rounded-full border-2 ${getBorderColor()} ${getFilterClass()} transition-all duration-200`}
          style={{ width: size, height: size, ...style }}
          alt={entity.name}
        />
        
        {/* HP Bar indicator */}
        {entity.currentHp < entity.maxHp && (
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                entity.currentHp / entity.maxHp > 0.5 ? 'bg-green-500' :
                entity.currentHp / entity.maxHp > 0.25 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${(entity.currentHp / entity.maxHp) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Level badge */}
      {showLevel && (
        <div className="absolute -top-2 -right-2 bg-black/90 px-1.5 py-0.5 rounded text-[8px] font-bold border border-gray-600 text-neon-blue">
          Lv{entity.level}
        </div>
      )}

      {/* Outfit indicator (if customized) */}
      {customization?.outfit && customization.outfit !== 'default' && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[6px] bg-purple-900/80 px-1 rounded text-purple-200 whitespace-nowrap">
          {customization.outfit.replace('_', ' ').toUpperCase()}
        </div>
      )}
    </div>
  );
};

// Helper to get hue rotation for color tinting
function getHueRotation(hexColor: string): number {
  // Validate hex color format
  if (!hexColor || typeof hexColor !== 'string') {
    return 0;
  }
  
  // Normalize color to lowercase for comparison
  const normalizedColor = hexColor.toLowerCase();
  
  // Simple mapping of common colors to hue degrees
  const colorMap: Record<string, number> = {
    '#ffffff': 0,      // white - no rotation
    '#00ffff': 180,    // cyan
    '#39ff14': 120,    // neon green
    '#ff00ff': 300,    // magenta
    '#ff0000': 0,      // red
    '#9d00ff': 270,    // purple
    '#ffd700': 50,     // gold
    '#c0c0c0': 0,      // silver
  };
  
  // Return mapped value or 0 for unknown colors
  return colorMap[normalizedColor] || 0;
}
