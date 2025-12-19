import React from 'react';
import { Item, ItemType, GameState } from '../types';
import { X, Activity, Cpu, Shield, Zap } from 'lucide-react';

interface Props {
  gameState: GameState;
  onUse: (item: Item, index: number) => void;
  onClose: () => void;
}

export const Inventory: React.FC<Props> = ({ gameState, onUse, onClose }) => {
  const getIcon = (iconStr?: string) => {
    switch(iconStr) {
      case 'Cpu': return <Cpu size={20} />;
      case 'Shield': return <Shield size={20} />;
      case 'Zap': return <Zap size={20} />;
      default: return <Activity size={20} />;
    }
  };

  return (
    <div className="absolute top-20 right-4 z-40 w-80 bg-panel-bg border border-gray-600 rounded shadow-xl animate-fade-in">
        <div className="flex justify-between items-center p-3 border-b border-gray-700 bg-gray-900">
            <h3 className="font-bold text-white text-sm">INVENTORY</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={16} /></button>
        </div>
        
        <div className="p-2 max-h-96 overflow-y-auto">
            {gameState.inventory.length === 0 ? (
                <div className="text-center py-8 text-gray-600 text-xs italic">
                    Storage Empty.<br/>Visit Shop.
                </div>
            ) : (
                <div className="space-y-2">
                    {gameState.inventory.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex items-center gap-3 bg-black/50 p-2 rounded border border-gray-800 hover:border-gray-500 transition">
                            <div className="text-gray-400">
                                {getIcon(item.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white truncate">{item.name}</p>
                                <p className="text-[10px] text-gray-500 truncate">{item.description}</p>
                            </div>
                            <button 
                                onClick={() => onUse(item, idx)}
                                className="px-2 py-1 bg-gray-800 text-[10px] text-neon-green border border-gray-700 hover:bg-gray-700 rounded"
                            >
                                USE
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};
