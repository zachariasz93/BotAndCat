export enum GameScreen {
  INTRO = 'INTRO',
  EXPLORATION = 'EXPLORATION',
  COMBAT = 'COMBAT',
  DIALOGUE = 'DIALOGUE',
  SKILL_TREE = 'SKILL_TREE',
  SHOP = 'SHOP',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export enum EntityType {
  PLAYER = 'PLAYER',
  COMPANION = 'COMPANION',
  ENEMY = 'ENEMY',
  BOSS = 'BOSS'
}

export enum SkillType {
  ATTACK = 'ATTACK',
  HEAL = 'HEAL',
  BUFF = 'BUFF',
  ULTIMATE = 'ULTIMATE',
  TEAM = 'TEAM',
  PASSIVE = 'PASSIVE'
}

export enum ItemType {
  CONSUMABLE = 'CONSUMABLE', // Potions, etc.
  UPGRADE = 'UPGRADE'       // Permanent stat boosts
}

export interface Item {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: ItemType;
  effectValue: number; // HP amount or Stat amount
  statAffected?: 'HP' | 'ATK' | 'DEF'; 
  icon?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  cost: number; // AP or Mana cost
  damage?: number;
  heal?: number;
  type: SkillType;
  unlocked: boolean;
  requiredLevel: number; // Or required Friendship Level for companions
  isUlt?: boolean;
  statBonus?: {
    stat: 'HP' | 'ATK' | 'DEF';
    value: number;
  };
}

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  maxHp: number;
  currentHp: number;
  level: number;
  xp: number; // Current XP for players, reward XP for enemies
  maxXp: number; // XP needed for next level
  attack: number;
  defense: number;
  avatar: string; // URL
  skills: Skill[];
  // Friendship System
  friendshipXp?: number;
  friendshipLevel?: number;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  image: string;
  x: number; // Map X coordinate
  y: number; // Map Y coordinate
  connections: string[]; // IDs of connected locations
  enemies: string[]; // IDs of potential enemies
  npcs: string[]; // IDs of NPCs present
  hasShop?: boolean;
  hasInn?: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  rewardSubscribers: number;
  rewardFriendshipXp?: number;
}

export interface GameState {
  screen: GameScreen;
  player: Entity;
  playerPosition: Position; // Player's position on the 2D map
  companion: Entity | null; // The Black Cat
  party: Entity[];
  subscribers: number; // Currency
  inventory: Item[]; // Changed from string[] to Item[]
  currentLocationId: string;
  quests: Quest[];
  log: string[]; // Combat/Action log
  activeEnemy: Entity | null;
  activeNpcId: string | null;
  mapEnemies: { id: string, type: string, x: number, y: number }[]; // Visible enemies on map
}
