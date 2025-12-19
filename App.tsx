import React, { useState, useEffect } from 'react';
import { GameState, GameScreen, Entity, Skill, EntityType, Position, SkillType, Item, ItemType, Level, CharacterCustomization, Achievement, PowerUpType, ActiveEffect } from './types';
import { INITIAL_STATE, LOCATIONS, LORE_POEM, BLACK_CAT, ALGORITHM_KING, BOSS_QUEST, EXPLORATION_BANTER } from './constants';
import { Exploration } from './components/Exploration';
import { Combat } from './components/Combat';
import { SkillTree } from './components/SkillTree';
import { Shop } from './components/Shop';
import { GameLayout } from './components/GameLayout';
import { LevelSelect } from './components/LevelSelect';
import { Achievements } from './components/Achievements';
import { Customization } from './components/Customization';
import { generateDialogue } from './services/geminiService';
import { audioService, SFX, MUSIC } from './services/audioService';
import { X, MessageSquare, Heart, Hand } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [dialogueText, setDialogueText] = useState<string | null>(null);
  const [dialogueInput, setDialogueInput] = useState('');
  const [isLoadingDialogue, setIsLoadingDialogue] = useState(false);
  const [activeBanter, setActiveBanter] = useState<string | null>(null);

  // --- Banter System ---
  useEffect(() => {
    // Only trigger banter in Exploration mode and if companion exists
    if (gameState.screen !== GameScreen.EXPLORATION || !gameState.companion) {
        setActiveBanter(null);
        return;
    }

    const interval = setInterval(() => {
        // 20% chance every 10 seconds to trigger banter if not already chatting
        if (Math.random() < 0.2 && !activeBanter && !gameState.activeNpcId) {
            // Filter available banter based on friendship level
            const currentLevel = gameState.companion?.friendshipLevel || 0;
            const availableBanter = EXPLORATION_BANTER.filter(b => b.reqLevel <= currentLevel);
            
            if (availableBanter.length > 0) {
                const randomLine = availableBanter[Math.floor(Math.random() * availableBanter.length)];
                setActiveBanter(randomLine.text);
                // Hide after 5 seconds
                setTimeout(() => setActiveBanter(null), 5000);
            }
        }
    }, 10000);

    return () => clearInterval(interval);
  }, [gameState.screen, gameState.companion, activeBanter, gameState.activeNpcId]);


  // --- Helpers ---

  const increaseFriendship = (amount: number) => {
    setGameState(prev => {
        const catIndex = prev.party.findIndex(p => p.id === 'black_cat');
        if (catIndex === -1) return prev;

        const newParty = [...prev.party];
        const cat = { ...newParty[catIndex] };
        
        const oldLevel = cat.friendshipLevel || 1;
        const currentXp = (cat.friendshipXp || 0) + amount;
        
        let newLevel = oldLevel;
        let logMsg = null;

        // Simple threshold: 100 XP per level
        if (currentXp >= 100 * oldLevel) {
            newLevel++;
            logMsg = `Friendship Bond Level Up! The Cat trusts you more (Lvl ${newLevel}).`;
        }

        cat.friendshipXp = currentXp;
        cat.friendshipLevel = newLevel;
        newParty[catIndex] = cat;

        const newLog = logMsg ? [logMsg, ...prev.log] : prev.log;

        return {
            ...prev,
            party: newParty,
            companion: cat,
            log: newLog
        };
    });
  };

  // --- Actions ---

  const handleUpdatePosition = (pos: Position) => {
      setGameState(prev => ({ ...prev, playerPosition: pos }));
  };

  const handleMove = (locationId: string) => {
    // Legacy move handler for Boss Node triggers or direct travel
    if (locationId === 'boss_arena') {
        // Trigger fight immediately for drama
        const boss = { ...ALGORITHM_KING };
        setGameState(prev => ({
            ...prev,
            currentLocationId: locationId,
            screen: GameScreen.COMBAT,
            activeEnemy: boss
        }));
        return;
    }
  };

  const handleInteractNPC = async (npcId: string) => {
    // Special Interaction: Finding the Black Cat
    if (npcId === 'black_cat_npc') {
        // Safe check to prevent adding duplicates if race condition occurs
        const alreadyHasCat = gameState.party.some(p => p.id === BLACK_CAT.id);

        if (!alreadyHasCat) {
            setDialogueText("The black cat looks at you. 'You look like a walking syntax error. Want to team up and break some stuff?' (Companion Joined!)");
            
            // Complete first quest
            let rewardXp = 0;
            const updatedQuests = gameState.quests.map(q => {
                if (q.id === 'find_cat') {
                    rewardXp = q.rewardFriendshipXp || 0;
                    return { ...q, completed: true };
                }
                return q;
            });
            
            // Add boss quest
            if (!updatedQuests.some(q => q.id === BOSS_QUEST.id)) {
                updatedQuests.push(BOSS_QUEST);
            }

            // Initialize Cat with Friendship Reward from Quest
            const initialCat = { ...BLACK_CAT, friendshipXp: rewardXp };
            // Recalculate level if reward was big
            let newLevel = 1;
            if (rewardXp >= 100) newLevel = 2; // Simple check for first quest jump
            initialCat.friendshipLevel = newLevel;

            setGameState(prev => ({
                ...prev,
                companion: initialCat,
                party: [...prev.party, initialCat],
                quests: updatedQuests,
                subscribers: prev.subscribers + 100,
                activeNpcId: npcId,
                log: [`Joined by Black Cat. Gained ${rewardXp} Friendship XP.`, ...prev.log]
            }));
            return;
        } else {
             // Already have cat, just talk
             setDialogueText(null); // Reset to load fresh prompt or default
        }
    }

    if (npcId === 'algo_king_npc') {
        setDialogueText("Algorithm King: 'YOUR METRICS ARE INSUFFICIENT. PREPARE FOR DELETION.'");
        setGameState(prev => ({...prev, activeNpcId: npcId}));
        return;
    }

    setGameState(prev => ({
        ...prev,
        activeNpcId: npcId
    }));
    if (npcId !== 'black_cat_npc') setDialogueText(null); // Reset for manual chat unless we just set it
  };

  const handleSendChat = async () => {
    if (!dialogueInput.trim() || !gameState.activeNpcId) return;
    
    setIsLoadingDialogue(true);
    
    let npcName = "Unknown";
    if (gameState.activeNpcId === 'black_cat_npc') npcName = "Black Cat";
    if (gameState.activeNpcId === 'algo_king_npc') npcName = "Algorithm King";
    if (gameState.activeNpcId === 'barkeep_vpn') npcName = "Barkeep VPN";

    const response = await generateDialogue({
        npcName,
        playerInput: dialogueInput,
        history: []
    });

    setDialogueText(response);
    setIsLoadingDialogue(false);
    setDialogueInput('');

    // Reward Friendship for talking to the cat
    if (gameState.activeNpcId === 'black_cat_npc') {
        // Small XP boost for chatting (Dialogue Choice: Talk)
        increaseFriendship(5);
    }
  };

  const handlePetCat = () => {
      setDialogueText("*Purrrr...* The Black Cat nudges your hand. 'Not bad, for a bot.'");
      increaseFriendship(15); // Larger boost for "Action"
  };

  const handleFight = (enemyType: string, enemyId?: string) => {
    // Generate a mob based on type (simplified)
    const enemy: Entity = {
        id: `enemy_${Date.now()}`,
        name: enemyType.replace('_', ' ').toUpperCase(),
        type: EntityType.ENEMY,
        maxHp: 50 + (gameState.player.level * 10),
        currentHp: 50 + (gameState.player.level * 10),
        level: gameState.player.level,
        xp: 20 * gameState.player.level,
        maxXp: 0,
        attack: 8 + (gameState.player.level * 2),
        defense: 2,
        avatar: `https://picsum.photos/seed/${enemyType}/200/200`,
        skills: []
    };

    // If it was a specific map enemy, remove it from map
    let updatedMapEnemies = gameState.mapEnemies;
    if (enemyId) {
        updatedMapEnemies = gameState.mapEnemies.filter(e => e.id !== enemyId);
    }

    setGameState(prev => ({
        ...prev,
        screen: GameScreen.COMBAT,
        activeEnemy: enemy,
        mapEnemies: updatedMapEnemies
    }));
  };

  const handleCombatTurnEnd = (updatedParty: Entity[], updatedEnemy: Entity, log: string[]) => {
      // Handled internally in Combat component usually, but synced here if needed
  };

  const handleVictory = () => {
    if (!gameState.activeEnemy) return;

    // Boss Defeated?
    if (gameState.activeEnemy.type === EntityType.BOSS) {
         setGameState(prev => ({
            ...prev,
            screen: GameScreen.VICTORY
        }));
        return;
    }

    // Reward
    const gainedXp = gameState.activeEnemy.xp;
    const gainedSubs = Math.floor(Math.random() * 50) + 10;
    
    // Increase Friendship on Victory (Cooperative Action)
    increaseFriendship(25);

    const newParty = gameState.party.map(member => {
        let newXp = member.xp + gainedXp;
        let newLevel = member.level;
        let newMaxXp = member.maxXp;
        let newMaxHp = member.maxHp;
        let newAtk = member.attack;

        if (newXp >= newMaxXp) {
            newLevel++;
            newXp = newXp - newMaxXp;
            newMaxXp = Math.floor(newMaxXp * 1.5);
            newMaxHp += 20;
            newAtk += 5;
            // Full heal on level up
            member.currentHp = newMaxHp;
        }

        return {
            ...member,
            xp: newXp,
            level: newLevel,
            maxXp: newMaxXp,
            maxHp: newMaxHp,
            attack: newAtk
        };
    });
    
    // Spawn a new glitch somewhere random to keep map populated
    const newEnemy = {
        id: `glitch_${Date.now()}`,
        type: ['bug_mite', 'youtube_minion', 'troll_bot'][Math.floor(Math.random() * 3)],
        x: 400 + Math.random() * 1000,
        y: 400 + Math.random() * 800
    };

    setGameState(prev => ({
        ...prev,
        screen: GameScreen.EXPLORATION,
        activeEnemy: null,
        party: newParty,
        player: newParty[0], // Sync player ref
        subscribers: prev.subscribers + gainedSubs,
        log: [...prev.log, `Victory! Gained ${gainedXp} XP and ${gainedSubs} Subs.`],
        mapEnemies: [...prev.mapEnemies, newEnemy]
    }));
  };

  const handleDefeat = () => {
    setGameState(prev => ({
        ...prev,
        screen: GameScreen.GAME_OVER
    }));
  };

  // Updated to handle both Player and Companion skill unlocks and PASSIVES
  const handleUnlockSkill = (skill: Skill, entityId: string) => {
    setGameState(prev => {
        // Update the party array with the unlocked skill
        const newParty = prev.party.map(p => {
            if (p.id === entityId) {
                // Check if skill exists in the list (Black Cat has them locked initially, Player does not have them)
                const hasSkill = p.skills.some(s => s.id === skill.id);
                
                let updatedSkills;
                if (hasSkill) {
                     updatedSkills = p.skills.map(s => s.id === skill.id ? { ...s, unlocked: true } : s);
                } else {
                     updatedSkills = [...p.skills, { ...skill, unlocked: true }];
                }
                
                let updatedEntity = { ...p, skills: updatedSkills };
                
                // If it's a PASSIVE skill, apply stat boosts immediately
                if (skill.type === SkillType.PASSIVE && skill.statBonus) {
                     if (skill.statBonus.stat === 'ATK') {
                         updatedEntity.attack += skill.statBonus.value;
                     } else if (skill.statBonus.stat === 'DEF') {
                         updatedEntity.defense += skill.statBonus.value;
                     } else if (skill.statBonus.stat === 'HP') {
                         updatedEntity.maxHp += skill.statBonus.value;
                         updatedEntity.currentHp += skill.statBonus.value;
                     }
                }
                return updatedEntity;
            }
            return p;
        });

        // Sync helper references
        const newPlayer = newParty.find(p => p.type === EntityType.PLAYER)!;
        const newCompanion = newParty.find(p => p.type === EntityType.COMPANION) || null;

        return {
            ...prev,
            party: newParty,
            player: newPlayer,
            companion: newCompanion
        };
    });
  };

  const handleRest = () => {
      // Inn costs 50 subs to rest? Let's make it free for now or simple
      setGameState(prev => ({
          ...prev,
          party: prev.party.map(p => ({ ...p, currentHp: p.maxHp })),
          log: [...prev.log, "System cache cleared. HP restored."]
      }));
  };

  // --- Item / Shop Logic ---
  
  const handleBuyItem = (item: Item) => {
      setGameState(prev => {
          if (prev.subscribers < item.cost) return prev;
          
          return {
              ...prev,
              subscribers: prev.subscribers - item.cost,
              inventory: [...prev.inventory, item],
              log: [`Purchased ${item.name} for ${item.cost} Subs.`, ...prev.log]
          };
      });
  };

  const handleUseItem = (item: Item, index: number) => {
      setGameState(prev => {
          let newParty = [...prev.party];
          // Default: Use on Player (Entity 0)
          const target = newParty[0]; 
          let msg = "";

          if (item.type === ItemType.CONSUMABLE) {
              if (item.statAffected === 'HP') {
                  target.currentHp = Math.min(target.maxHp, target.currentHp + item.effectValue);
                  msg = `Used ${item.name}. Restored ${item.effectValue} HP.`;
              }
          } else if (item.type === ItemType.UPGRADE) {
              if (item.statAffected === 'ATK') {
                  target.attack += item.effectValue;
                  msg = `System Upgrade! ATK increased by ${item.effectValue}.`;
              } else if (item.statAffected === 'DEF') {
                  target.defense += item.effectValue;
                  msg = `System Upgrade! DEF increased by ${item.effectValue}.`;
              }
          }

          // Remove item from inventory (using index to remove specific instance)
          const newInventory = prev.inventory.filter((_, i) => i !== index);

          return {
              ...prev,
              party: newParty,
              player: newParty[0], // Sync
              inventory: newInventory,
              log: [msg, ...prev.log]
          };
      });
  };

  // --- New Feature Handlers ---

  const handleSelectLevel = (level: Level) => {
    audioService.playSFX(SFX.MENU_SELECT);
    if (level.music) {
      audioService.playMusic(level.music);
    }
    
    setGameState(prev => ({
      ...prev,
      currentLevel: level,
      screen: GameScreen.EXPLORATION,
      levelStartTime: Date.now()
    }));
  };

  const handleCompleteLevel = (levelId: string) => {
    audioService.playSFX(SFX.LEVEL_COMPLETE);
    
    setGameState(prev => {
      const levels = prev.levels || [];
      const currentLevelIndex = levels.findIndex(l => l.id === levelId);
      
      // Mark level as completed
      const updatedLevels = levels.map((level, idx) => {
        if (level.id === levelId) {
          return { ...level, completed: true };
        }
        // Unlock next level
        if (idx === currentLevelIndex + 1) {
          return { ...level, unlocked: true };
        }
        return level;
      });

      // Update achievements
      const achievements = [...prev.achievements];
      const firstLevelAch = achievements.find(a => a.id === 'first_level');
      const allLevelsAch = achievements.find(a => a.id === 'all_levels');
      
      const completedCount = updatedLevels.filter(l => l.completed).length;
      
      if (firstLevelAch && !firstLevelAch.unlocked && completedCount >= 1) {
        firstLevelAch.unlocked = true;
        firstLevelAch.progress = 1;
        audioService.playSFX(SFX.ACHIEVEMENT);
      }
      
      if (allLevelsAch) {
        allLevelsAch.progress = completedCount;
        if (completedCount >= allLevelsAch.target && !allLevelsAch.unlocked) {
          allLevelsAch.unlocked = true;
          audioService.playSFX(SFX.ACHIEVEMENT);
        }
      }

      return {
        ...prev,
        levels: updatedLevels,
        achievements,
        subscribers: prev.subscribers + 500
      };
    });
  };

  const handleCollectPowerUp = (powerUpType: PowerUpType, duration: number, value: number) => {
    audioService.playSFX(SFX.POWERUP);
    
    const endTime = Date.now() + (duration * 1000);
    const newEffect: ActiveEffect = {
      type: powerUpType,
      endTime,
      value
    };

    setGameState(prev => ({
      ...prev,
      activeEffects: [...prev.activeEffects, newEffect]
    }));

    // Update achievement
    setGameState(prev => {
      const achievements = [...prev.achievements];
      const collectorAch = achievements.find(a => a.id === 'collector');
      if (collectorAch && !collectorAch.unlocked) {
        collectorAch.progress += 1;
        if (collectorAch.progress >= collectorAch.target) {
          collectorAch.unlocked = true;
          audioService.playSFX(SFX.ACHIEVEMENT);
        }
      }
      return { ...prev, achievements };
    });
  };

  const handleSaveCustomization = (customizations: CharacterCustomization[]) => {
    audioService.playSFX(SFX.BUTTON_CLICK);
    setGameState(prev => ({
      ...prev,
      customizations
    }));
  };

  // Clean up expired power-up effects
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setGameState(prev => ({
        ...prev,
        activeEffects: prev.activeEffects.filter(effect => effect.endTime > now)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // --- Views ---

  const renderContent = () => {
    switch (gameState.screen) {
        case GameScreen.INTRO:
            return (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
                    <h1 className="text-6xl font-black text-neon-green mb-8 glitch-text">GLITCH PROTOCOL</h1>
                    <div className="font-mono text-gray-300 whitespace-pre-line mb-8 italic">
                        {LORE_POEM}
                    </div>
                    <button 
                        onClick={() => setGameState(prev => ({ ...prev, screen: GameScreen.LEVEL_SELECT }))}
                        className="px-8 py-4 bg-neon-blue text-black font-bold text-xl hover:scale-105 transition transform shadow-[0_0_20px_rgba(0,255,255,0.6)] mb-4"
                    >
                        INITIATE SEQUENCE
                    </button>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setGameState(prev => ({ ...prev, screen: GameScreen.ACHIEVEMENTS }))}
                            className="px-8 py-4 bg-neon-pink text-black font-bold text-xl hover:scale-105 transition transform shadow-[0_0_20px_rgba(255,0,255,0.6)]"
                        >
                            ACHIEVEMENTS
                        </button>
                        <button 
                            onClick={() => setGameState(prev => ({ ...prev, screen: GameScreen.CUSTOMIZATION }))}
                            className="px-8 py-4 bg-purple-600 text-white font-bold text-xl hover:scale-105 transition transform shadow-[0_0_20px_rgba(128,0,255,0.6)]"
                        >
                            CUSTOMIZE
                        </button>
                    </div>
                </div>
            );
        
        case GameScreen.EXPLORATION:
            return (
                <Exploration 
                    gameState={gameState}
                    activeBanter={activeBanter}
                    onMove={handleMove}
                    onInteractNPC={handleInteractNPC}
                    onFight={handleFight}
                    onEnterShop={() => setGameState(prev => ({ ...prev, screen: GameScreen.SHOP }))} 
                    onRest={handleRest}
                    onOpenSkills={() => setGameState(prev => ({...prev, screen: GameScreen.SKILL_TREE}))}
                    onUpdatePosition={handleUpdatePosition}
                    onUseItem={handleUseItem}
                    onCollectPowerUp={handleCollectPowerUp}
                    onObstacleHit={(damage) => {
                        setGameState(prev => {
                            const newParty = [...prev.party];
                            newParty[0].currentHp = Math.max(0, newParty[0].currentHp - damage);
                            return {
                                ...prev,
                                party: newParty,
                                player: newParty[0],
                                log: [`Hit obstacle! -${damage} HP`, ...prev.log]
                            };
                        });
                    }}
                />
            );

        case GameScreen.SHOP:
            return (
                <Shop 
                    gameState={gameState}
                    onBuy={handleBuyItem}
                    onClose={() => setGameState(prev => ({ ...prev, screen: GameScreen.EXPLORATION }))}
                />
            );

        case GameScreen.COMBAT:
            return (
                <Combat 
                    gameState={gameState}
                    enemy={gameState.activeEnemy!}
                    onTurnEnd={handleCombatTurnEnd}
                    onVictory={handleVictory}
                    onDefeat={handleDefeat}
                />
            );
        
        case GameScreen.SKILL_TREE:
            return (
                <SkillTree 
                    gameState={gameState}
                    onUnlock={handleUnlockSkill}
                    onClose={() => setGameState(prev => ({...prev, screen: GameScreen.EXPLORATION}))}
                />
            );
        
        case GameScreen.GAME_OVER:
            return (
                <div className="flex flex-col items-center justify-center h-full bg-red-950/50">
                    <h2 className="text-6xl text-red-500 font-bold mb-4">SYSTEM CRASH</h2>
                    <p className="text-xl mb-8">The Algorithm deleted you.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 border border-white hover:bg-white hover:text-black transition"
                    >
                        REBOOT
                    </button>
                </div>
            );
        
        case GameScreen.VICTORY:
            return (
                <div className="flex flex-col items-center justify-center h-full bg-green-950/50">
                    <h2 className="text-6xl text-neon-green font-bold mb-4">VIRAL STATUS ACHIEVED</h2>
                    <p className="text-xl mb-8 max-w-lg text-center">
                        You defeated the Algorithm King. The feed is yours. The Black Cat purrs in 8-bit.
                        <br/><br/>
                        "Now we roam the servers, a party of two..."
                    </p>
                    <button 
                         onClick={() => window.location.reload()}
                         className="px-6 py-2 border border-white hover:bg-white hover:text-black transition"
                    >
                        NEW GAME PLUS
                    </button>
                </div>
            );
        
        case GameScreen.LEVEL_SELECT:
            return (
                <LevelSelect 
                    gameState={gameState}
                    onSelectLevel={handleSelectLevel}
                    onBack={() => setGameState(prev => ({ ...prev, screen: GameScreen.INTRO }))}
                />
            );
        
        case GameScreen.ACHIEVEMENTS:
            return (
                <Achievements 
                    gameState={gameState}
                    onClose={() => setGameState(prev => ({ ...prev, screen: GameScreen.INTRO }))}
                />
            );
        
        case GameScreen.CUSTOMIZATION:
            return (
                <Customization 
                    gameState={gameState}
                    onSaveCustomization={handleSaveCustomization}
                    onClose={() => setGameState(prev => ({ ...prev, screen: GameScreen.EXPLORATION }))}
                />
            );

        default:
            return <div>Error: Screen not found</div>;
    }
  };

  return (
    <GameLayout gameState={gameState}>
        {renderContent()}

        {/* Modal for Dialogue */}
        {gameState.activeNpcId && gameState.screen === GameScreen.EXPLORATION && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="bg-panel-bg border-2 border-neon-blue w-full max-w-lg p-6 rounded shadow-2xl relative">
                    <button 
                        onClick={() => {
                            setGameState(prev => ({...prev, activeNpcId: null}));
                            setDialogueText(null);
                        }}
                        className="absolute top-2 right-2 text-gray-500 hover:text-white"
                    >
                        <X />
                    </button>

                    <h3 className="text-xl text-neon-pink font-bold mb-4">
                        Chatting with: {gameState.activeNpcId === 'black_cat_npc' ? 'Black Cat' : 'NPC'}
                    </h3>

                    <div className="bg-gray-900 p-4 rounded min-h-[150px] mb-4 text-gray-200 border border-gray-700">
                        {isLoadingDialogue ? (
                            <span className="animate-pulse">Generating response...</span>
                        ) : (
                            dialogueText || "Say something to start the conversation..."
                        )}
                    </div>
                    
                    {/* Interactive Dialogue Actions */}
                    {gameState.activeNpcId === 'black_cat_npc' && (
                        <div className="flex gap-2 mb-4">
                            <button 
                                onClick={handlePetCat}
                                className="px-3 py-1 bg-pink-900/40 border border-pink-500 text-pink-300 rounded hover:bg-pink-900/60 flex items-center gap-1 text-sm"
                            >
                                <Heart size={14} /> Pet
                            </button>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 bg-black border border-gray-600 p-2 text-white focus:border-neon-blue outline-none"
                            placeholder="Type your message..."
                            value={dialogueInput}
                            onChange={(e) => setDialogueInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                        />
                        <button 
                            onClick={handleSendChat}
                            disabled={isLoadingDialogue}
                            className="bg-blue-600 hover:bg-blue-500 p-2 rounded text-white"
                        >
                            <MessageSquare />
                        </button>
                    </div>
                </div>
            </div>
        )}
    </GameLayout>
  );
}
