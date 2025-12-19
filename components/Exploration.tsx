import React, { useState } from 'react';
import { GameState, Position, Location, Item } from '../types';
import { WorldMap } from './WorldMap';
import { Inventory } from './Inventory';
import { Heart, Briefcase } from 'lucide-react';

interface Props {
  gameState: GameState;
  activeBanter?: string | null;
  onMove: (locationId: string) => void;
  onInteractNPC: (npcId: string) => void;
  onFight: (enemyType: string, enemyId?: string) => void;
  onEnterShop: () => void;
  onRest: () => void;
  onOpenSkills: () => void;
  onUpdatePosition: (pos: Position) => void;
  onUseItem: (item: Item, index: number) => void;
}

export const Exploration: React.FC<Props> = ({ 
  gameState, activeBanter, onMove, onInteractNPC, onFight, onEnterShop, onRest, onOpenSkills, onUpdatePosition, onUseItem
}) => {
  const [showInventory, setShowInventory] = useState(false);
  
  const handleMapInteract = (type: 'NPC' | 'SHOP' | 'INN' | 'BOSS', id: string) => {
      if (type === 'NPC') onInteractNPC(id);
      if (type === 'SHOP') onEnterShop();
      if (type === 'INN') onRest();
      if (type === 'BOSS') onMove('boss_arena'); // Trigger boss flow
  };

  const handleMapFight = (enemyId: string, type: string) => {
      onFight(type, enemyId);
  };

  return (
    <div className="w-full h-full relative">
        <WorldMap 
            gameState={gameState}
            onUpdatePosition={onUpdatePosition}
            onInteract={handleMapInteract}
            onFight={handleMapFight}
            onOpenSkills={onOpenSkills}
        />

        {/* HUD Overlay - Party Status */}
        <div className="absolute top-4 left-4 w-64 pointer-events-none z-10">
            <div className="bg-black/60 backdrop-blur-md p-3 rounded border border-gray-700 pointer-events-auto">
                <h3 className="text-neon-pink text-xs font-bold mb-2">PARTY_STATUS_V2.0</h3>
                <div className="space-y-2">
                {gameState.party.map(member => (
                    <div key={member.id} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <img src={member.avatar} className="w-8 h-8 rounded bg-gray-600" alt={member.name} />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between text-[10px] text-white">
                                    <span className="truncate">{member.name}</span>
                                    <span>{member.currentHp}/{member.maxHp}</span>
                                </div>
                                <div className="w-full bg-gray-800 h-1.5 rounded mt-0.5">
                                    <div 
                                    className="bg-green-500 h-full rounded transition-all duration-300" 
                                    style={{ width: `${(member.currentHp / member.maxHp) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        {/* Friendship Indicator for Companion */}
                        {member.type === 'COMPANION' && member.friendshipLevel && (
                             <div className="flex items-center gap-1 pl-10">
                                <Heart size={10} className="text-red-500 fill-red-500" />
                                <span className="text-[9px] text-red-300">Bond Lvl {member.friendshipLevel} ({(member.friendshipXp || 0) % 100} / 100 XP)</span>
                             </div>
                        )}
                    </div>
                ))}
                </div>
            </div>

            {/* Active Quest */}
            {gameState.quests.some(q => !q.completed) && (
                <div className="mt-2 bg-yellow-900/80 backdrop-blur-md p-3 rounded border border-yellow-700 pointer-events-auto">
                    {gameState.quests.filter(q => !q.completed).map(q => (
                        <div key={q.id}>
                            <p className="text-[10px] font-bold text-yellow-500">ACTIVE: {q.title}</p>
                            <p className="text-[10px] text-gray-300 mt-1">{q.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Ambient Banter Bubble */}
        {activeBanter && (
             <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 animate-fade-in-up">
                 <div className="bg-white text-black px-4 py-2 rounded-lg border-2 border-neon-blue shadow-[4px_4px_0px_#00ffff] font-mono text-xs font-bold relative">
                    <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-white border-r-[8px] border-r-transparent"></div>
                    {activeBanter}
                 </div>
             </div>
        )}

        {/* Inventory Toggle Button */}
        <div className="absolute bottom-20 right-4 z-10">
             <button 
                onClick={() => setShowInventory(!showInventory)}
                className="bg-black/80 p-3 rounded-full border border-gray-600 text-white hover:border-neon-blue hover:text-neon-blue transition shadow-lg"
             >
                 <Briefcase size={20} />
             </button>
        </div>

        {/* Inventory Modal */}
        {showInventory && (
            <Inventory 
                gameState={gameState}
                onUse={(item, idx) => {
                    onUseItem(item, idx);
                    // Optional: Close on use? Or keep open? keeping open for multiple uses
                }}
                onClose={() => setShowInventory(false)}
            />
        )}
    </div>
  );
};
