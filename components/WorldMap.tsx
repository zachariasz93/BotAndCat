import React, { useRef, useEffect, useState } from 'react';
import { GameState, Position, Location } from '../types';
import { LOCATIONS, MAP_WIDTH, MAP_HEIGHT } from '../constants';
import { MapPin, MessageCircle, Skull, ShoppingBag, Bed, Zap } from 'lucide-react';

interface Props {
  gameState: GameState;
  onUpdatePosition: (pos: Position) => void;
  onInteract: (type: 'NPC' | 'SHOP' | 'INN' | 'BOSS', id: string) => void;
  onFight: (enemyId: string, type: string) => void;
  onOpenSkills: () => void;
}

const PLAYER_SPEED = 5;
const INTERACTION_RADIUS = 80;
const COMBAT_RADIUS = 40;

export const WorldMap: React.FC<Props> = ({ 
  gameState, onUpdatePosition, onInteract, onFight, onOpenSkills
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());
  
  // Use local state for smooth animation frame updates without re-rendering entire React tree too often
  // However, we sync back to parent periodically or on event
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [nearbyLabel, setNearbyLabel] = useState<string | null>(null);
  
  // Current position ref for the loop
  const posRef = useRef(gameState.playerPosition);

  // Handle Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Disable game input if dialogue is active
        if (gameState.activeNpcId) return; 
        keysPressed.current.add(e.code);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
        // Disable game input if dialogue is active
        if (gameState.activeNpcId) return;

        keysPressed.current.delete(e.code);
        
        if (e.code === 'Space' && nearbyLabel) {
            handleInteraction();
        }
        if (e.code === 'KeyK') {
            onOpenSkills();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyLabel, gameState.activeNpcId]); // Added activeNpcId dependency

  const handleInteraction = () => {
    // Find what we are close to
    const p = posRef.current;
    
    // Check Locations (Shop/Inn/Boss)
    for (const key in LOCATIONS) {
        const loc = LOCATIONS[key];
        const dist = Math.hypot(loc.x - p.x, loc.y - p.y);
        
        if (dist < INTERACTION_RADIUS) {
            if (loc.id === 'boss_arena') {
                 onInteract('BOSS', 'algo_king_npc');
                 return;
            }
            if (loc.hasShop) {
                onInteract('SHOP', loc.id); // Placeholder
                return;
            }
            if (loc.hasInn) {
                onInteract('INN', loc.id);
                return;
            }
            // Check NPCs in this location
            if (loc.npcs.length > 0) {
                 onInteract('NPC', loc.npcs[0]);
                 return;
            }
        }
    }
  };

  // Game Loop
  const update = () => {
    // Pause movement/physics if dialogue is active
    if (gameState.activeNpcId) {
        requestRef.current = requestAnimationFrame(update);
        return;
    }

    const p = posRef.current;
    let dx = 0;
    let dy = 0;

    if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('KeyW')) dy -= PLAYER_SPEED;
    if (keysPressed.current.has('ArrowDown') || keysPressed.current.has('KeyS')) dy += PLAYER_SPEED;
    if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('KeyA')) dx -= PLAYER_SPEED;
    if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('KeyD')) dx += PLAYER_SPEED;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const factor = 0.707; // 1/sqrt(2)
      dx *= factor;
      dy *= factor;
    }

    // Apply movement with bounds
    const newX = Math.max(50, Math.min(MAP_WIDTH - 50, p.x + dx));
    const newY = Math.max(50, Math.min(MAP_HEIGHT - 50, p.y + dy));
    
    posRef.current = { x: newX, y: newY };

    // Update Camera (Center player)
    if (containerRef.current) {
       const viewportW = containerRef.current.clientWidth;
       const viewportH = containerRef.current.clientHeight;
       setCamera({
           x: Math.max(0, Math.min(MAP_WIDTH - viewportW, newX - viewportW / 2)),
           y: Math.max(0, Math.min(MAP_HEIGHT - viewportH, newY - viewportH / 2))
       });
    }

    // Check Interactions / Collisions
    checkCollisions(newX, newY);

    requestRef.current = requestAnimationFrame(update);
  };

  const checkCollisions = (px: number, py: number) => {
      let foundLabel = null;

      // 1. Check Enemies
      for (const enemy of gameState.mapEnemies) {
          const dist = Math.hypot(enemy.x - px, enemy.y - py);
          if (dist < COMBAT_RADIUS) {
              // Trigger combat!
              onFight(enemy.id, enemy.type);
              return; 
          }
      }

      // 2. Check Locations/NPCs
      for (const key in LOCATIONS) {
          const loc = LOCATIONS[key];
          const dist = Math.hypot(loc.x - px, loc.y - py);
          
          if (dist < INTERACTION_RADIUS) {
              if (loc.id === 'boss_arena') foundLabel = "PRESS [SPACE] TO CHALLENGE BOSS";
              else if (loc.hasShop) foundLabel = "PRESS [SPACE] TO OPEN SHOP";
              else if (loc.hasInn) foundLabel = "PRESS [SPACE] TO REST (INN)";
              else if (loc.npcs.length > 0) {
                  const npcId = loc.npcs[0];
                  const npcName = npcId === 'black_cat_npc' ? 'Black Cat' : 'Stranger';
                  foundLabel = `PRESS [SPACE] TO TALK TO ${npcName.toUpperCase()}`;
              } else {
                  foundLabel = loc.name;
              }
          }
      }

      setNearbyLabel(foundLabel);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gameState.mapEnemies, gameState.activeNpcId]); // Dependent on activeNpcId to pause/unpause loop logic

  // Sync position on unmount
  useEffect(() => {
      return () => {
          onUpdatePosition(posRef.current);
      };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden relative bg-black cursor-crosshair">
      
      {/* World Container */}
      <div 
        className="absolute transition-transform duration-75 ease-linear will-change-transform"
        style={{ 
            width: `${MAP_WIDTH}px`, 
            height: `${MAP_HEIGHT}px`,
            transform: `translate3d(${-camera.x}px, ${-camera.y}px, 0)`,
            backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
            backgroundSize: '40px 40px'
        }}
      >
          {/* Map Grid Lines */}
          <div className="absolute inset-0 pointer-events-none border border-gray-800 opacity-20"></div>

          {/* Render Connections */}
          <svg className="absolute inset-0 pointer-events-none w-full h-full opacity-30">
             {Object.values(LOCATIONS).map(loc => 
                loc.connections.map(targetId => {
                    const target = LOCATIONS[targetId];
                    return (
                        <line 
                            key={`${loc.id}-${targetId}`}
                            x1={loc.x} y1={loc.y}
                            x2={target.x} y2={target.y}
                            stroke="#00ffff" strokeWidth="2" strokeDasharray="10 5"
                        />
                    );
                })
             )}
          </svg>

          {/* Render Locations */}
          {Object.values(LOCATIONS).map(loc => (
              <div 
                key={loc.id}
                className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: loc.x, top: loc.y }}
              >
                  {/* Location Circle */}
                  <div className={`w-32 h-32 rounded-full border-2 flex items-center justify-center bg-black/80 backdrop-blur-sm relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]
                      ${loc.id === 'boss_arena' ? 'border-red-600 shadow-red-900/40' : 
                        loc.id === 'start_node' ? 'border-gray-500' : 'border-neon-blue shadow-neon-blue/20'}
                  `}>
                      <img src={loc.image} className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition" />
                      <div className="z-10 text-center p-2">
                          {loc.id === 'boss_arena' ? <Skull className="text-red-500 mx-auto animate-pulse" /> : <MapPin className="text-neon-blue mx-auto" />}
                          <span className="text-[10px] font-bold text-white block mt-1">{loc.name}</span>
                      </div>
                  </div>

                  {/* Icons for features */}
                  <div className="flex gap-2 mt-2">
                      {loc.npcs.length > 0 && <span className="p-1 bg-blue-600 rounded-full"><MessageCircle size={12} /></span>}
                      {loc.hasShop && <span className="p-1 bg-yellow-600 rounded-full"><ShoppingBag size={12} /></span>}
                      {loc.hasInn && <span className="p-1 bg-green-600 rounded-full"><Bed size={12} /></span>}
                  </div>
              </div>
          ))}

          {/* Render Enemies */}
          {gameState.mapEnemies.map(enemy => (
              <div
                key={enemy.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-bounce"
                style={{ left: enemy.x, top: enemy.y }}
              >
                  <div className="w-8 h-8 bg-red-500 rotate-45 border border-white animate-spin-slow"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-bold">GLITCH</div>
              </div>
          ))}

          {/* Render Player */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-75"
            style={{ left: posRef.current.x, top: posRef.current.y }}
          >
              <div className="relative">
                <img 
                    src={gameState.player.avatar} 
                    className="w-12 h-12 rounded-full border-2 border-neon-green shadow-[0_0_15px_#39ff14]"
                />
                {gameState.companion && (
                    <img 
                        src={gameState.companion.avatar}
                        className="w-8 h-8 rounded-full border border-neon-pink absolute -right-4 -bottom-2 shadow-[0_0_10px_#ff00ff]"
                    />
                )}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/70 px-2 py-0.5 rounded text-[10px] whitespace-nowrap border border-gray-600">
                    Lvl {gameState.player.level}
                </div>
              </div>
          </div>
      </div>

      {/* HUD Overlay for Interaction */}
      {nearbyLabel && !gameState.activeNpcId && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/90 border border-neon-blue px-6 py-3 rounded text-white font-mono animate-bounce text-sm shadow-xl z-50">
              {nearbyLabel}
          </div>
      )}

      {/* Controls Hint */}
      <div className="absolute top-4 right-4 bg-black/50 p-2 rounded text-[10px] text-gray-400 font-mono pointer-events-none">
          WASD / ARROWS to Move<br/>
          SPACE to Interact<br/>
          K for Skills
      </div>
    </div>
  );
};
