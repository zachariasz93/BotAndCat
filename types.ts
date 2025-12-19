export enum GameScreen {
  INTRO = 'INTRO',
  EXPLORATION = 'EXPLORATION',
  COMBAT = 'COMBAT',
  DIALOGUE = 'DIALOGUE',
  SKILL_TREE = 'SKILL_TREE',
  SHOP = 'SHOP',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
  LEVEL_SELECT = 'LEVEL_SELECT',
  CUSTOMIZATION = 'CUSTOMIZATION',
  ACHIEVEMENTS = 'ACHIEVEMENTS'
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
  UPGRADE = 'UPGRADE',       // Permanent stat boosts
  POWERUP = 'POWERUP'        // Temporary power-ups
}

export enum PowerUpType {
  SPEED_BOOST = 'SPEED_BOOST',
  INVINCIBILITY = 'INVINCIBILITY',
  EXTRA_JUMP = 'EXTRA_JUMP',
  DAMAGE_BOOST = 'DAMAGE_BOOST'
}

export enum ObstacleType {
  SPIKE = 'SPIKE',
  MOVING_SPIKE = 'MOVING_SPIKE',
  PITFALL = 'PITFALL',
  WALL = 'WALL',
  BARRIER = 'BARRIER'
}

export enum AnimationState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  JUMPING = 'JUMPING',
  DAMAGED = 'DAMAGED',
  ATTACKING = 'ATTACKING'
}

export enum LevelTheme {
  CYBER_CITY = 'CYBER_CITY',
  FOREST = 'FOREST',
  DESERT = 'DESERT',
  ARCTIC = 'ARCTIC',
  VOLCANO = 'VOLCANO',
  SPACE = 'SPACE'
}

export enum AchievementType {
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  ITEM_COLLECT = 'ITEM_COLLECT',
  TIME_TRIAL = 'TIME_TRIAL',
  NO_DAMAGE = 'NO_DAMAGE',
  FRIENDSHIP = 'FRIENDSHIP'
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
  powerUpType?: PowerUpType;
  duration?: number; // Duration in seconds for power-ups
}

export interface PowerUp {
  id: string;
  type: PowerUpType;
  x: number;
  y: number;
  collected: boolean;
  duration: number; // Active duration in seconds
  effectValue: number;
}

export interface Obstacle {
  id: string;
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
  damage?: number;
  velocity?: { x: number; y: number }; // For moving obstacles
  pattern?: 'horizontal' | 'vertical' | 'circular';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  unlocked: boolean;
  progress: number;
  target: number;
  icon?: string;
  reward?: string;
}

export interface LevelObjective {
  id: string;
  description: string;
  type: 'reach_point' | 'collect_items' | 'avoid_obstacles' | 'defeat_enemies' | 'time_limit';
  target: number;
  current: number;
  completed: boolean;
}

export interface Level {
  id: string;
  name: string;
  description: string;
  theme: LevelTheme;
  difficulty: number;
  unlocked: boolean;
  completed: boolean;
  objectives: LevelObjective[];
  obstacles: Obstacle[];
  powerUps: PowerUp[];
  story?: string;
  backgroundLayers: string[]; // URLs for parallax layers
  music?: string;
  bestTime?: number;
}

export interface CharacterCustomization {
  entityId: string;
  outfit: string;
  color: string;
  accessory?: string;
}

export interface ActiveEffect {
  type: PowerUpType;
  endTime: number; // Timestamp when effect expires
  value: number;
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
  // Animation and Customization
  animationState?: AnimationState;
  customization?: CharacterCustomization;
  velocity?: Position; // For physics-based movement
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
  // New features
  currentLevel?: Level;
  levels?: Level[];
  achievements: Achievement[];
  activeEffects: ActiveEffect[];
  customizations: CharacterCustomization[];
  audioEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  levelStartTime?: number;
}
