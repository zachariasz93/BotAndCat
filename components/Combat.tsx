import React, { useState, useEffect } from 'react';
import { GameState, Entity, Skill, SkillType } from '../types';
import { COMBAT_BANTER } from '../constants';
import { Shield, Sword, Heart, Zap, Users } from 'lucide-react';

interface Props {
  gameState: GameState;
  enemy: Entity;
  onTurnEnd: (updatedPlayerParty: Entity[], updatedEnemy: Entity, log: string[]) => void;
  onVictory: () => void;
  onDefeat: () => void;
}

export const Combat: React.FC<Props> = ({ gameState, enemy, onTurnEnd, onVictory, onDefeat }) => {
  const [turn, setTurn] = useState<'PLAYER' | 'ENEMY'>('PLAYER');
  const [combatLog, setCombatLog] = useState<string[]>(['Combat Initiated!']);
  const [localParty, setLocalParty] = useState<Entity[]>(gameState.party);
  const [localEnemy, setLocalEnemy] = useState<Entity>(enemy);
  const [animating, setAnimating] = useState(false);
  const [banter, setBanter] = useState<string | null>(null);
  const [actingIndex, setActingIndex] = useState<number | null>(null);

  // Trigger banter helper
  const triggerBanter = (type: keyof typeof COMBAT_BANTER) => {
      if (Math.random() < 0.5) { // 50% chance
          const currentLevel = gameState.companion?.friendshipLevel || 0;
          const lines = COMBAT_BANTER[type];
          const availableLines = lines.filter(l => l.reqLevel <= currentLevel);
          
          if (availableLines.length > 0) {
              const line = availableLines[Math.floor(Math.random() * availableLines.length)];
              setBanter(line.text);
              setTimeout(() => setBanter(null), 3000);
          }
      }
  };

  // Check win/loss conditions
  useEffect(() => {
    if (localEnemy.currentHp <= 0) {
      triggerBanter('VICTORY');
      setTimeout(onVictory, 1500);
    } else if (localParty.every(p => p.currentHp <= 0)) {
      setTimeout(onDefeat, 1000);
    } else if (turn === 'ENEMY' && localEnemy.currentHp > 0) {
      const timer = setTimeout(handleEnemyTurn, 1000);
      return () => clearTimeout(timer);
    }
  }, [localEnemy, localParty, turn]);

  // Check low HP banter
  useEffect(() => {
     if (localParty[0].currentHp < localParty[0].maxHp * 0.3 && turn === 'PLAYER') {
         triggerBanter('LOW_HP');
     }
  }, [localParty, turn]);

  const addLog = (msg: string) => {
    setCombatLog(prev => [msg, ...prev].slice(0, 5));
  };

  const handlePlayerAction = (skill: Skill, attackerIndex: number) => {
    if (turn !== 'PLAYER' || animating) return;
    setAnimating(true);
    setActingIndex(attackerIndex);

    const attacker = localParty[attackerIndex];
    let damage = 0;
    const newEnemy = { ...localEnemy };
    const newParty = [...localParty];

    addLog(`${attacker.name} used ${skill.name}!`);

    setTimeout(() => {
      if (skill.type === SkillType.HEAL) {
        const healAmount = skill.heal || 20;
        newParty[attackerIndex].currentHp = Math.min(newParty[attackerIndex].maxHp, newParty[attackerIndex].currentHp + healAmount);
        addLog(`Recovered ${healAmount} HP.`);
        triggerBanter('HEAL');
      } else {
        // Attack Logic
        let effectiveDefense = newEnemy.defense;
        if (skill.id === 'fuck_you') {
            effectiveDefense = 0; // Ignore defense
            addLog("DEFENSE IGNORED. CRITICAL ERROR INJECTED.");
            triggerBanter('CRIT');
        }
        
        const baseDmg = skill.damage || 10;
        damage = Math.max(1, (attacker.attack + baseDmg) - effectiveDefense);
        
        // Bonus damage for team skills based on bond if applicable
        if (skill.type === SkillType.TEAM && attacker.friendshipLevel) {
            damage += (attacker.friendshipLevel * 5);
            addLog(`Synergy Bonus! +${attacker.friendshipLevel * 5} dmg.`);
        }
        
        newEnemy.currentHp = Math.max(0, newEnemy.currentHp - damage);
        addLog(`Dealt ${damage} damage to ${newEnemy.name}!`);
      }

      setLocalParty(newParty);
      setLocalEnemy(newEnemy);
      setAnimating(false);
      setActingIndex(null);
      
      if (newEnemy.currentHp > 0) {
          // Companion Turn (Automated & Smart)
          const companion = newParty.find(p => p.type === 'COMPANION');
          const player = newParty.find(p => p.type === 'PLAYER');

          if (companion && companion.currentHp > 0) {
              const compIndex = newParty.findIndex(p => p.id === companion.id);
              
              setTimeout(() => {
                  setActingIndex(compIndex); // Animate Companion
                  const availableSkills = companion.skills.filter(s => s.unlocked);
                  let chosenSkill = companion.skills[0]; // Default scratch

                  // --- Smart AI Logic ---
                  const playerLowHp = player && player.currentHp < player.maxHp * 0.4;
                  const hasHeal = availableSkills.find(s => s.type === SkillType.HEAL);
                  const hasBuff = availableSkills.find(s => s.type === SkillType.BUFF);
                  const hasTeam = availableSkills.find(s => s.type === SkillType.TEAM);

                  if (playerLowHp && hasHeal) {
                      chosenSkill = hasHeal; // Prioritize Heal
                  } else if (newEnemy.currentHp > 100 && hasTeam) {
                      chosenSkill = hasTeam; // Big damage for big enemy
                  } else if (Math.random() > 0.7 && hasBuff) {
                      chosenSkill = hasBuff; // Occasional debuff/buff
                  } else {
                      // Random attack otherwise
                      const attacks = availableSkills.filter(s => s.type === SkillType.ATTACK);
                      if (attacks.length > 0) chosenSkill = attacks[Math.floor(Math.random() * attacks.length)];
                  }

                  // Execute Companion Action
                  if (chosenSkill.type === SkillType.HEAL) {
                       const target = playerLowHp ? player : companion;
                       const healAmt = chosenSkill.heal || 20;
                       target.currentHp = Math.min(target.maxHp, target.currentHp + healAmt);
                       addLog(`${companion.name} uses ${chosenSkill.name} on ${target.name}! (+${healAmt} HP)`);
                       triggerBanter('HEAL');
                  } else if (chosenSkill.type === SkillType.BUFF) {
                       // Implementing 'Hiss' as a defense reducer
                       newEnemy.defense = Math.max(0, newEnemy.defense - 2);
                       addLog(`${companion.name} uses ${chosenSkill.name}! Enemy Defense weakened.`);
                  } else {
                       const compDmg = Math.max(1, (companion.attack + (chosenSkill.damage || 5)) - newEnemy.defense);
                       newEnemy.currentHp = Math.max(0, newEnemy.currentHp - compDmg);
                       addLog(`${companion.name} used ${chosenSkill.name} for ${compDmg} dmg!`);
                  }
                  
                  setLocalEnemy({...newEnemy});
                  setLocalParty([...newParty]); // Trigger update

                  setTimeout(() => {
                      setActingIndex(null);
                       if (newEnemy.currentHp <= 0) {
                           // Victory handled by useEffect
                       } else {
                           setTurn('ENEMY');
                       }
                  }, 500);

              }, 1000);
          } else {
              setTurn('ENEMY');
          }
      }
    }, 600);
  };

  const handleEnemyTurn = () => {
    setAnimating(true);
    const newParty = [...localParty];
    
    // Pick a random living target
    const livingTargets = newParty.filter(p => p.currentHp > 0);
    if (livingTargets.length === 0) return;

    const targetIndex = Math.floor(Math.random() * livingTargets.length);
    const target = livingTargets[targetIndex];
    const realIndex = newParty.findIndex(p => p.id === target.id);

    // Enemy Attack
    const damage = Math.max(1, localEnemy.attack - target.defense);
    newParty[realIndex].currentHp = Math.max(0, newParty[realIndex].currentHp - damage);
    
    addLog(`${localEnemy.name} attacks ${target.name} for ${damage} damage!`);

    setTimeout(() => {
        setLocalParty(newParty);
        setAnimating(false);
        setTurn('PLAYER');
    }, 800);
  };

  return (
    <div className="h-full flex flex-col bg-black text-white p-4 font-mono relative overflow-hidden">
      {/* Background Glitch effects */}
      <div className="absolute inset-0 bg-red-900/10 pointer-events-none z-0"></div>

      {/* Combat Banter Bubble */}
      {banter && (
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-white text-black p-3 rounded-lg font-bold border-2 border-neon-pink shadow-[5px_5px_0px_#ff00ff] z-50 animate-bounce text-center min-w-[200px]">
              {banter}
          </div>
      )}
      
      {/* Top Bar: Enemy */}
      <div className="flex justify-center items-center py-8 z-10">
        <div className={`relative ${animating && turn === 'PLAYER' ? 'animate-pulse' : ''}`}>
           <img src={localEnemy.avatar} alt="Enemy" className="w-40 h-40 border-4 border-red-600 rounded-lg shadow-[0_0_20px_rgba(255,0,0,0.5)]" />
           <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 px-4 py-1 border border-red-500 whitespace-nowrap">
             <span className="font-bold text-red-500">{localEnemy.name}</span>
             <div className="w-32 h-2 bg-gray-700 mt-1">
               <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${(localEnemy.currentHp / localEnemy.maxHp) * 100}%` }}></div>
             </div>
           </div>
        </div>
      </div>

      {/* Center: Log */}
      <div className="flex-1 flex flex-col items-center justify-center my-4 z-10">
         <div className="bg-black/80 border border-gray-700 p-4 w-full max-w-md h-32 overflow-hidden flex flex-col justify-end">
            {combatLog.map((log, i) => (
                <p key={i} className={`text-sm ${i === 0 ? 'text-white font-bold' : 'text-gray-500'}`}>{`> ${log}`}</p>
            ))}
         </div>
      </div>

      {/* Bottom: Player Party */}
      <div className="grid grid-cols-2 gap-4 pb-4 z-10">
        {localParty.map((member, idx) => (
          <div 
            key={member.id} 
            className={`bg-gray-900 p-4 border-2 rounded transition-all duration-300 transform 
                ${member.currentHp <= 0 ? 'border-gray-800 opacity-50 grayscale' : 'border-neon-blue'}
                ${actingIndex === idx ? '-translate-y-4 shadow-[0_0_30px_#00ffff] brightness-125 z-20' : ''}
            `}
          >
             <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold">{member.name}</h3>
                 <div className="text-xs text-neon-green">{member.currentHp}/{member.maxHp} HP</div>
             </div>
             
             {/* Action Buttons (Only for Player character for now) */}
             {member.type === 'PLAYER' && member.currentHp > 0 && turn === 'PLAYER' && (
                 <div className="grid grid-cols-2 gap-2 mt-2">
                     {member.skills.map(skill => (
                         <button 
                            key={skill.id}
                            disabled={animating}
                            onClick={() => handlePlayerAction(skill, idx)}
                            className={`px-2 py-2 text-xs border rounded transition hover:bg-white/10 text-left flex items-center gap-1
                                ${skill.isUlt ? 'border-neon-pink text-neon-pink col-span-2 justify-center font-bold text-sm bg-pink-900/20' : 
                                  skill.type === SkillType.TEAM ? 'border-orange-500 text-orange-400 bg-orange-900/20' : 'border-gray-600'}
                            `}
                         >
                            {skill.type === SkillType.ATTACK && <Sword size={12} />}
                            {skill.type === SkillType.HEAL && <Heart size={12} />}
                            {skill.type === SkillType.TEAM && <Users size={12} />}
                            {skill.isUlt && <Zap size={14} className="animate-pulse" />}
                            {skill.name}
                         </button>
                     ))}
                 </div>
             )}
             {member.type === 'COMPANION' && (
                 <div className="text-xs text-gray-500 italic mt-2">AI Status: {animating && turn === 'PLAYER' ? 'Thinking...' : 'Ready'}</div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
};
