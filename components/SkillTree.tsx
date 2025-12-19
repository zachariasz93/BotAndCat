import React, { useState } from 'react';
import { GameState, Skill, SkillType } from '../types';
import { 
  BASE_ATTACK, HEAL_PATCH, TRASH_POST, FUCK_YOU, PLAYER_PASSIVE_OVERCLOCK,
  CAT_SCRATCH, PURR_THERAPY, CAT_PASSIVE_LUCK, HISS_DEBUFF, CHAOS_SYNC 
} from '../constants';
import { Network, Skull, Zap, Heart, Cat, ShieldCheck, ChevronRight, Lock, ArrowRight } from 'lucide-react';

interface Props {
  gameState: GameState;
  onUnlock: (skill: Skill, entityId: string) => void;
  onClose: () => void;
}

interface SkillNodeProps {
  skill: Skill;
  unlocked: boolean;
  purchasable: boolean;
  requirementLabel: string;
  onUnlock: () => void;
}

const SkillNode: React.FC<SkillNodeProps> = ({ skill, unlocked, purchasable, requirementLabel, onUnlock }) => {
  let Icon = Zap;
  let borderColor = unlocked ? 'border-neon-green' : purchasable ? 'border-neon-blue' : 'border-gray-800';
  let bgColor = unlocked ? 'bg-green-900/20' : purchasable ? 'bg-blue-900/10' : 'bg-gray-900/50';
  let iconColor = unlocked ? 'text-black' : 'text-gray-500';
  let iconBg = unlocked ? 'bg-neon-green' : 'bg-gray-800';
  let shadow = unlocked ? 'shadow-[0_0_15px_rgba(57,255,20,0.3)]' : purchasable ? 'shadow-[0_0_10px_rgba(0,255,255,0.2)]' : '';

  if (skill.type === SkillType.HEAL) Icon = Heart;
  if (skill.type === SkillType.ULTIMATE) Icon = Skull;
  if (skill.id === 'trash_post') Icon = Network;
  if (skill.type === SkillType.TEAM) Icon = Cat;
  if (skill.type === SkillType.PASSIVE) {
      Icon = ShieldCheck;
      if (unlocked) {
          borderColor = 'border-yellow-500';
          bgColor = 'bg-yellow-900/20';
          iconBg = 'bg-yellow-500';
          shadow = 'shadow-[0_0_15px_rgba(255,215,0,0.3)]';
      } else if (purchasable) {
          borderColor = 'border-yellow-600';
      }
  }

  return (
    <div 
        className={`relative flex flex-col items-center w-40 shrink-0 transition-all duration-300 group z-10`}
    >
      {/* Node Circle/Card */}
      <div 
        onClick={() => purchasable && !unlocked && onUnlock()}
        className={`
            w-full p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all duration-300
            ${borderColor} ${bgColor} ${shadow}
            ${purchasable && !unlocked ? 'cursor-pointer hover:scale-105 hover:bg-blue-900/30' : ''} 
            ${!purchasable && !unlocked ? 'opacity-60 grayscale cursor-not-allowed' : ''}
        `}
      >
          <div className={`p-3 rounded-full ${iconBg} ${iconColor} transition-colors`}>
            {unlocked ? <Icon size={24} /> : <Lock size={24} />}
          </div>
          
          <div className="text-center">
              <h3 className={`font-bold text-xs mb-1 ${unlocked ? 'text-white' : 'text-gray-400'}`}>{skill.name}</h3>
              <p className="text-[10px] text-gray-500 leading-tight h-8 overflow-hidden">{skill.description}</p>
          </div>

          {!unlocked && (
            <div className="mt-2 text-[10px] font-mono text-neon-blue bg-black/50 px-2 py-0.5 rounded border border-blue-900/50">
              {requirementLabel}
            </div>
          )}
          
          {unlocked && (
            <div className={`mt-2 text-[10px] font-bold tracking-wider ${skill.type === SkillType.PASSIVE ? 'text-yellow-500' : 'text-neon-green'}`}>
                {skill.type === SkillType.PASSIVE ? 'PASSIVE' : 'ACTIVE'}
            </div>
          )}
      </div>
    </div>
  );
};

export const SkillTree: React.FC<Props> = ({ gameState, onUnlock, onClose }) => {
  const [activeTab, setActiveTab] = useState<'PLAYER' | 'COMPANION'>('PLAYER');
  
  const player = gameState.player;
  const companion = gameState.companion;

  // Define the progression paths explicitly
  const playerPath = [BASE_ATTACK, HEAL_PATCH, TRASH_POST, PLAYER_PASSIVE_OVERCLOCK, FUCK_YOU];
  const companionPath = [CAT_SCRATCH, PURR_THERAPY, CAT_PASSIVE_LUCK, HISS_DEBUFF, CHAOS_SYNC];

  const activePath = activeTab === 'PLAYER' ? playerPath : companionPath;
  const currentEntity = activeTab === 'PLAYER' ? player : companion;

  const handleUnlock = (skill: Skill, isCompanion: boolean) => {
    const entity = isCompanion ? companion : player;
    if (!entity) return;

    // Check level requirement
    const level = isCompanion ? (entity.friendshipLevel || 1) : entity.level;

    if (level >= skill.requiredLevel) {
      onUnlock(skill, entity.id);
    }
  };

  return (
    <div className="absolute inset-0 bg-dark-bg/98 flex flex-col items-center justify-center z-50 text-white backdrop-blur-sm">
      <div className="w-full max-w-6xl p-6 h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div>
              <h2 className="text-4xl font-black text-neon-blue glitch-text tracking-tighter">KERNEL_ACCESS</h2>
              <p className="text-xs text-gray-400 font-mono mt-1">MODIFY_ENTITY_PARAMETERS</p>
          </div>
          <button onClick={onClose} className="group flex items-center gap-2 px-6 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition rounded">
            <span className="font-bold">EXIT</span>
            <X size={20} className="group-hover:rotate-90 transition-transform"/>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center gap-6 mb-12">
             <button 
                onClick={() => setActiveTab('PLAYER')}
                className={`flex items-center gap-3 px-8 py-4 rounded-lg border-2 transition-all duration-300 ${
                    activeTab === 'PLAYER' 
                    ? 'bg-neon-blue/10 border-neon-blue text-neon-blue shadow-[0_0_20px_rgba(0,255,255,0.2)]' 
                    : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'
                }`}
             >
                 <Zap size={24} />
                 <div className="text-left">
                     <div className="font-bold text-sm">GLITCHED BOT</div>
                     <div className="text-xs opacity-70">Level {player.level}</div>
                 </div>
             </button>

             {companion ? (
                 <button 
                    onClick={() => setActiveTab('COMPANION')}
                    className={`flex items-center gap-3 px-8 py-4 rounded-lg border-2 transition-all duration-300 ${
                        activeTab === 'COMPANION' 
                        ? 'bg-neon-pink/10 border-neon-pink text-neon-pink shadow-[0_0_20px_rgba(255,0,255,0.2)]' 
                        : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'
                    }`}
                 >
                     <Cat size={24} />
                     <div className="text-left">
                         <div className="font-bold text-sm">BLACK CAT</div>
                         <div className="text-xs opacity-70">Friendship {companion.friendshipLevel}</div>
                     </div>
                 </button>
             ) : (
                 <div className="flex items-center gap-3 px-8 py-4 rounded-lg border border-gray-800 bg-gray-900/50 opacity-50 grayscale cursor-not-allowed">
                     <Cat size={24} />
                     <div className="text-left">
                         <div className="font-bold text-sm">???</div>
                         <div className="text-xs">Not Found</div>
                     </div>
                 </div>
             )}
        </div>

        {/* Skill Path Visualizer */}
        <div className="flex-1 flex flex-col justify-center items-center relative bg-black/40 rounded-2xl border border-gray-800 p-8 overflow-x-auto">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
            </div>

            {currentEntity ? (
                <div className="flex items-center min-w-max px-8 relative">
                    {activePath.map((skill, index) => {
                        const isUnlocked = currentEntity.skills.some(s => s.id === skill.id);
                        const currentLevel = activeTab === 'PLAYER' ? currentEntity.level : (currentEntity.friendshipLevel || 1);
                        // A skill is purchasable if it's NOT unlocked AND the previous skill in the chain IS unlocked (or it's the first one)
                        // AND level requirement is met.
                        // Actually, logic in previous step was simpler: just level req. Let's stick to level req for simplicity but
                        // visually show the chain.
                        
                        const prevSkill = index > 0 ? activePath[index - 1] : null;
                        const prevUnlocked = prevSkill ? currentEntity.skills.some(s => s.id === prevSkill.id) : true;
                        
                        // Strict progression: Must have previous skill unlocked + Level Requirement
                        const isPurchasable = !isUnlocked && prevUnlocked && currentLevel >= skill.requiredLevel;
                        
                        const reqLabel = activeTab === 'PLAYER' ? `Lvl ${skill.requiredLevel}` : `Bond ${skill.requiredLevel}`;

                        return (
                            <React.Fragment key={skill.id}>
                                <SkillNode 
                                    skill={skill}
                                    unlocked={isUnlocked}
                                    purchasable={isPurchasable}
                                    requirementLabel={reqLabel}
                                    onUnlock={() => handleUnlock(skill, activeTab === 'COMPANION')}
                                />
                                
                                {/* Connector Arrow */}
                                {index < activePath.length - 1 && (
                                    <div className="w-16 h-1 bg-gray-800 mx-2 relative flex items-center justify-center">
                                        <div 
                                            className={`h-full transition-all duration-500 ease-out ${
                                                isUnlocked 
                                                // If current is unlocked, line to next is partially lit? 
                                                // Better: If NEXT is unlocked, line is full green. 
                                                // If NEXT is purchasable, line is blue.
                                                ? (currentEntity.skills.some(s => s.id === activePath[index+1].id) ? 'w-full bg-neon-green' : 'w-1/2 bg-neon-blue')
                                                : 'w-0'
                                            }`}
                                        />
                                        {/* Arrow Head */}
                                        <div className={`absolute right-0 p-1 rounded-full bg-black border ${
                                            currentEntity.skills.some(s => s.id === activePath[index+1].id) ? 'border-neon-green text-neon-green' : 'border-gray-700 text-gray-700'
                                        }`}>
                                            <ChevronRight size={14} />
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            ) : (
                <div className="text-red-500 font-mono animate-pulse">ERROR: ENTITY NOT LOADED</div>
            )}
        </div>
        
        {/* Footer Info */}
        <div className="mt-6 text-center">
             <div className="inline-block bg-gray-900 px-6 py-3 rounded-full border border-gray-700 text-xs text-gray-400 font-mono">
                 {activeTab === 'PLAYER' 
                    ? "TIP: Defeat enemies and complete quests to increase your System Level."
                    : "TIP: Strengthen your bond with the Black Cat through dialogue and cooperative combat."}
             </div>
        </div>

      </div>
    </div>
  );
};

// Helper Icon for Close button was missing in imports, adding locally or reusing Lucide X
const X = ({size, className}: {size: number, className?: string}) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18"/><path d="m6 6 18 18"/>
    </svg>
);
