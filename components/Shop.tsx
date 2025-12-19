import React from 'react';
import { Item, ItemType, GameState } from '../types';
import { SHOP_ITEMS } from '../constants';
import { ShoppingBag, X, Zap, Cpu, Shield, Activity, Users } from 'lucide-react';

interface Props {
  gameState: GameState;
  onBuy: (item: Item) => void;
  onClose: () => void;
}

export const Shop: React.FC<Props> = ({ gameState, onBuy, onClose }) => {
  const canAfford = (cost: number) => gameState.subscribers >= cost;

  const getIcon = (iconStr?: string) => {
    switch(iconStr) {
      case 'Cpu': return <Cpu size={20} />;
      case 'Shield': return <Shield size={20} />;
      case 'Zap': return <Zap size={20} />;
      default: return <Activity size={20} />;
    }
  };

  return (
    <div className="absolute inset-0 bg-dark-bg/95 flex flex-col items-center justify-center z-50 p-4">
       <div className="w-full max-w-4xl h-[80vh] bg-panel-bg border border-neon-blue rounded shadow-2xl flex flex-col relative overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900">
             <div className="flex items-center gap-3">
               <ShoppingBag className="text-neon-blue" size={32} />
               <div>
                 <h2 className="text-2xl font-black text-white tracking-widest">DEV_CONSOLE_STORE</h2>
                 <p className="text-xs text-gray-400 font-mono">EXCHANGE_SUBS_FOR_ASSETS</p>
               </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="bg-black border border-neon-pink px-4 py-2 rounded text-neon-pink font-bold font-mono flex items-center gap-2">
                    <Users size={16} />
                    {gameState.subscribers.toLocaleString()} SUBS
                </div>
                <button onClick={onClose} className="p-2 hover:bg-red-500 hover:text-white rounded transition text-gray-500">
                    <X size={24} />
                </button>
             </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SHOP_ITEMS.map(item => (
                  <div key={item.id} className="bg-black border border-gray-700 p-4 rounded hover:border-neon-blue transition group relative flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-full ${item.type === ItemType.UPGRADE ? 'bg-purple-900/30 text-purple-400' : 'bg-green-900/30 text-green-400'}`}>
                              {getIcon(item.icon)}
                          </div>
                          <div className="text-right">
                              <span className="text-lg font-bold text-white block">{item.cost}</span>
                              <span className="text-[10px] text-gray-500">SUBS</span>
                          </div>
                      </div>
                      
                      <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-400 mb-4 flex-1">{item.description}</p>
                      
                      <div className="mt-auto">
                        <button 
                            onClick={() => onBuy(item)}
                            disabled={!canAfford(item.cost)}
                            className={`w-full py-2 font-bold font-mono border rounded transition flex justify-center items-center gap-2
                                ${canAfford(item.cost) 
                                    ? 'border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black' 
                                    : 'border-gray-800 text-gray-600 cursor-not-allowed bg-gray-900'}
                            `}
                        >
                            {canAfford(item.cost) ? 'PURCHASE' : 'INSUFFICIENT FUNDS'}
                        </button>
                      </div>
                  </div>
              ))}
          </div>
          
          {/* Footer */}
          <div className="p-4 bg-gray-900 border-t border-gray-700 text-center text-xs text-gray-500 font-mono">
              NO REFUNDS. ALL TRANSACTIONS FINAL.
          </div>
       </div>
    </div>
  );
};
