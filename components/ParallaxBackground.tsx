import React, { useEffect, useState } from 'react';
import { LevelTheme } from '../types';

interface Props {
  theme: LevelTheme;
  layers?: string[];
  scrollX: number;
  scrollY: number;
}

export const ParallaxBackground: React.FC<Props> = ({ theme, layers, scrollX, scrollY }) => {
  // Default layers based on theme
  const getDefaultLayers = (theme: LevelTheme) => {
    const seed = theme.toLowerCase();
    return [
      `https://picsum.photos/seed/${seed}1/1920/1080`,
      `https://picsum.photos/seed/${seed}2/1920/1080`,
      `https://picsum.photos/seed/${seed}3/1920/1080`
    ];
  };

  const backgroundLayers = layers || getDefaultLayers(theme);
  
  // Define parallax speed for each layer (slower for background layers)
  const parallaxSpeeds = [0.2, 0.5, 0.8];

  // Get theme-specific gradient overlay
  const getThemeGradient = (theme: LevelTheme) => {
    switch(theme) {
      case LevelTheme.CYBER_CITY:
        return 'linear-gradient(to bottom, rgba(0,0,139,0.3), rgba(75,0,130,0.3))';
      case LevelTheme.FOREST:
        return 'linear-gradient(to bottom, rgba(34,139,34,0.3), rgba(0,100,0,0.3))';
      case LevelTheme.DESERT:
        return 'linear-gradient(to bottom, rgba(255,165,0,0.2), rgba(255,140,0,0.2))';
      case LevelTheme.ARCTIC:
        return 'linear-gradient(to bottom, rgba(0,191,255,0.2), rgba(135,206,250,0.2))';
      case LevelTheme.VOLCANO:
        return 'linear-gradient(to bottom, rgba(178,34,34,0.3), rgba(255,69,0,0.3))';
      case LevelTheme.SPACE:
        return 'linear-gradient(to bottom, rgba(25,25,112,0.5), rgba(0,0,0,0.8))';
      default:
        return 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.3))';
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Parallax Layers */}
      {backgroundLayers.map((layer, index) => (
        <div
          key={index}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${layer})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate(${-scrollX * parallaxSpeeds[index]}px, ${-scrollY * parallaxSpeeds[index]}px)`,
            transition: 'transform 0.1s linear',
            zIndex: index,
            opacity: 0.7 - (index * 0.1)
          }}
        />
      ))}
      
      {/* Theme Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: getThemeGradient(theme),
          zIndex: backgroundLayers.length
        }}
      />

      {/* Atmospheric Effects */}
      {theme === 'SPACE' && (
        <div className="absolute inset-0 z-50">
          {/* Stars */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random()
              }}
            />
          ))}
        </div>
      )}
      
      {theme === 'VOLCANO' && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          {/* Embers */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-orange-500 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: '0%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
