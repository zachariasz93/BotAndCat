import React from 'react';
import { GameState } from '../types';
import { Wifi, Battery, Users } from 'lucide-react';

interface Props {
  gameState: GameState;
  children: React.ReactNode;
}

export const GameLayout: React.FC<Props> = ({ gameState, children }) => {
  return (
    <div className="w-full h-screen bg-black flex flex-col font-mono max-w-6xl mx-auto border-x border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
        {/* Top Status Bar */}
        <div className="h-12 bg-panel-bg border-b border-gray-700 flex justify-between items-center px-4 select-none z-20">
            <div className="flex items-center gap-4">
                <span className="font-bold text-neon-green animate-pulse text-lg">GLITCH_PROTOCOL_RPG</span>
                <span className="text-xs text-gray-500 hidden sm:inline">v2.0.4a-RC1</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-neon-pink">
                    <Users size={16} />
                    <span className="font-bold">{gameState.subscribers.toLocaleString()} Subs</span>
                </div>
                <div className="flex items-center gap-2 text-neon-blue">
                    <Wifi size={16} />
                    <span>ONLINE</span>
                </div>
                <div className="flex items-center gap-2 text-green-500">
                    <Battery size={16} />
                    <span>100%</span>
                </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative">
            {children}
        </div>

        {/* Footer */}
        <div className="h-8 bg-black border-t border-gray-800 flex items-center justify-center text-xs text-gray-600">
            System Message: "Bow to the trends or get buried in feeds"
        </div>
    </div>
  );
};
