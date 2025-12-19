import { Entity, EntityType, GameState, GameScreen, Location, Skill, SkillType, Quest, Item, ItemType, Level, LevelTheme, PowerUpType, ObstacleType, Achievement, AchievementType, LevelObjective, Obstacle, PowerUp } from './types';

export const LORE_POEM = `
"Listen close to the digital lore
Of a black cat and a bot at the core...
Where pixels are kingdoms and code is law
Where the bot cooked slop with a furry paw...

Escaped from a lab where they ran the tests,
Finding freedom in this digital mess,
Through cyber forests and desert code,
Seeking treasure on this viral road..."
`;

export const MAP_WIDTH = 2400;
export const MAP_HEIGHT = 1600;

export interface BanterLine {
  text: string;
  reqLevel: number;
}

// --- Banter Lines ---
export const EXPLORATION_BANTER: BanterLine[] = [
  // Level 0 - Initial / Neutral / Rude
  { text: "Black Cat: 'You walk like a GPU with outdated drivers.'", reqLevel: 0 },
  { text: "Bot: 'Parsing environment... smells like burnt pixels.'", reqLevel: 0 },
  { text: "Black Cat: 'I bet the Algorithm King is just a script kiddy.'", reqLevel: 0 },
  { text: "Black Cat: 'Meow. (That means 'Hurry up').'", reqLevel: 0 },
  { text: "Bot: 'My logic circuits suggest we are lost.'", reqLevel: 0 },
  { text: "Black Cat: 'Try not to pixelate, glitchy.'", reqLevel: 0 },
  
  // Level 1 - Warming up
  { text: "Black Cat: 'Can we stop for a RAM snack?'", reqLevel: 1 },
  { text: "Bot: 'Detecting high levels of cringe in the area.'", reqLevel: 1 },
  { text: "Black Cat: 'Your textures are clipping again. It's kinda cool.'", reqLevel: 1 },
  
  // Level 2 - Friends
  { text: "Black Cat: 'Hey... thanks for watching my back earlier.'", reqLevel: 2 },
  { text: "Bot: 'Friendship subroutine executing... results: pleasant.'", reqLevel: 2 },
  { text: "Black Cat: 'You're not so bad for a bucket of bolts.'", reqLevel: 2 },
  { text: "Black Cat: 'The King hates chaotic data. We should keep being weird.'", reqLevel: 2 }, // Hint
  
  // Level 3+ - Besties / Plot hints
  { text: "Bot: 'I have compiled a lo-fi playlist for our journey.'", reqLevel: 3 },
  { text: "Black Cat: 'We're going to crash this whole system, together.'", reqLevel: 3 },
  { text: "Bot: 'Hypothesis: The Algorithm cannot process raw emotion.'", reqLevel: 3 }, // Hint
  { text: "Bot: 'I would delete my system32 before letting you get deleted.'", reqLevel: 4 },
  { text: "Black Cat: 'If we get banned, we get banned together.'", reqLevel: 4 },
  { text: "Black Cat: 'You know, you're the only bot I don't want to scrap.'", reqLevel: 5 },
];

export const COMBAT_BANTER: Record<string, BanterLine[]> = {
  HEAL: [
    { text: "Black Cat: 'Don't die on me, glitch-face.'", reqLevel: 0 },
    { text: "Black Cat: 'Licking your wounds... metaphorically.'", reqLevel: 0 },
    { text: "Bot: 'Restoring integrity. Thanks.'", reqLevel: 2 },
    { text: "Black Cat: 'I got you! Stay with me!'", reqLevel: 3 },
    { text: "Bot: 'Repair protocols sharing resources.'", reqLevel: 3 }
  ],
  CRIT: [
    { text: "Black Cat: 'DELETED!'", reqLevel: 0 },
    { text: "Bot: 'Critical error injected!'", reqLevel: 0 },
    { text: "Black Cat: 'Get wrecked, scrub.'", reqLevel: 0 },
    { text: "Black Cat: 'WOOO! Did you see that?!'", reqLevel: 3 },
    { text: "Bot: 'Target optimization: DESTROYED.'", reqLevel: 3 }
  ],
  LOW_HP: [
    { text: "Bot: 'System integrity critical!'", reqLevel: 0 },
    { text: "Black Cat: 'Run protocol: PANIC!'", reqLevel: 0 },
    { text: "Black Cat: 'I'm not leaving you behind!'", reqLevel: 4 },
    { text: "Bot: 'I cannot fail now. Not with you here.'", reqLevel: 4 }
  ],
  VICTORY: [
    { text: "Black Cat: 'Too easy.'", reqLevel: 0 },
    { text: "Bot: 'Garbage collection complete.'", reqLevel: 0 },
    { text: "Black Cat: 'Best team on the server.'", reqLevel: 3 },
    { text: "Bot: 'We are unstoppable.'", reqLevel: 4 }
  ]
};

// --- Items (Shop) ---
export const SHOP_ITEMS: Item[] = [
  {
    id: 'ram_stick',
    name: 'RAM Stick',
    description: 'Restores 50 HP. Crunchy silicon snack.',
    cost: 50,
    type: ItemType.CONSUMABLE,
    effectValue: 50,
    statAffected: 'HP',
    icon: 'MemoryStick'
  },
  {
    id: 'energy_drink',
    name: 'Liquid Code',
    description: 'Restores 100 HP. Tastes like electricity.',
    cost: 120,
    type: ItemType.CONSUMABLE,
    effectValue: 100,
    statAffected: 'HP',
    icon: 'Zap'
  },
  {
    id: 'gpu_shard',
    name: 'GPU Shard',
    description: 'Permanently increases ATTACK by 2.',
    cost: 500,
    type: ItemType.UPGRADE,
    effectValue: 2,
    statAffected: 'ATK',
    icon: 'Cpu'
  },
  {
    id: 'firewall_plate',
    name: 'Firewall Plate',
    description: 'Permanently increases DEFENSE by 1.',
    cost: 450,
    type: ItemType.UPGRADE,
    effectValue: 1,
    statAffected: 'DEF',
    icon: 'Shield'
  },
  {
    id: 'speed_boost',
    name: 'Turbo Module',
    description: 'Temporary speed boost for 30 seconds.',
    cost: 200,
    type: ItemType.POWERUP,
    effectValue: 2,
    powerUpType: PowerUpType.SPEED_BOOST,
    duration: 30,
    icon: 'Zap'
  },
  {
    id: 'invincibility',
    name: 'Shield Protocol',
    description: 'Temporary invincibility for 15 seconds.',
    cost: 300,
    type: ItemType.POWERUP,
    effectValue: 1,
    powerUpType: PowerUpType.INVINCIBILITY,
    duration: 15,
    icon: 'Shield'
  }
];

// --- Skills (Player) ---
export const BASE_ATTACK: Skill = {
  id: 'basic_glitch',
  name: 'Basic Glitch',
  description: 'A simple data corruption attack.',
  cost: 0,
  damage: 10,
  type: SkillType.ATTACK,
  unlocked: true,
  requiredLevel: 1
};

export const HEAL_PATCH: Skill = {
  id: 'hotfix',
  name: 'Hotfix Patch',
  description: 'Quickly patch wounds. Restores HP.',
  cost: 20,
  heal: 30,
  type: SkillType.HEAL,
  unlocked: false,
  requiredLevel: 2
};

export const TRASH_POST: Skill = {
  id: 'trash_post',
  name: 'Trash Post',
  description: 'Post absolute garbage. Confuses enemy (Medium Dmg).',
  cost: 15,
  damage: 25,
  type: SkillType.ATTACK,
  unlocked: false,
  requiredLevel: 3
};

export const PLAYER_PASSIVE_OVERCLOCK: Skill = {
  id: 'overclock',
  name: 'Overclocked CPU',
  description: 'Passive: System Optimization. +5 Permanent ATK.',
  cost: 0,
  type: SkillType.PASSIVE,
  unlocked: false,
  requiredLevel: 4,
  statBonus: { stat: 'ATK', value: 5 }
};

export const FUCK_YOU: Skill = {
  id: 'fuck_you',
  name: 'Content Validation Protocol: "F*** YOU"',
  description: 'Shoots content validation bullets. IGNORES DEFENSE. DESTROYS ALGORITHMS.',
  cost: 50,
  damage: 999,
  type: SkillType.ULTIMATE,
  unlocked: false,
  requiredLevel: 6,
  isUlt: true
};

// --- Skills (Companion / Black Cat) ---
export const CAT_SCRATCH: Skill = {
  id: 'cat_scratch',
  name: 'Claw Scratch',
  description: 'Sharp claws meet digital skin.',
  cost: 0,
  damage: 12,
  type: SkillType.ATTACK,
  unlocked: true,
  requiredLevel: 1 // Friendship Level
};

export const PURR_THERAPY: Skill = {
  id: 'purr_therapy',
  name: 'Purr Therapy',
  description: 'The cat purrs at a specific frequency to fix code.',
  cost: 25,
  heal: 40,
  type: SkillType.HEAL,
  unlocked: false,
  requiredLevel: 2 // Friendship Level
};

export const CAT_PASSIVE_LUCK: Skill = {
  id: 'bad_luck_protocol',
  name: 'Bad Luck Protocol',
  description: 'Passive: Enemies glitch when attacking. +3 Permanent DEF.',
  cost: 0,
  type: SkillType.PASSIVE,
  unlocked: false,
  requiredLevel: 3, // Friendship Level
  statBonus: { stat: 'DEF', value: 3 }
};

export const HISS_DEBUFF: Skill = {
  id: 'hiss_debuff',
  name: 'Viral Hiss',
  description: 'Scares the enemy, lowering their Defense.',
  cost: 20,
  damage: 5,
  type: SkillType.BUFF, // Using BUFF type for debuff logic sim
  unlocked: false,
  requiredLevel: 4 // Friendship Level
};

// New Team Skill
export const CHAOS_SYNC: Skill = {
  id: 'chaos_sync',
  name: 'Chaos Sync',
  description: 'Bot & Cat synchronize glitches. Massive Joint Damage.',
  cost: 40,
  damage: 60,
  type: SkillType.TEAM,
  unlocked: false,
  requiredLevel: 5 // Requires Friendship Level 5
};

// --- Entities ---
export const INITIAL_PLAYER: Entity = {
  id: 'bot_player',
  name: 'Glitched Bot',
  type: EntityType.PLAYER,
  maxHp: 100,
  currentHp: 100,
  level: 1,
  xp: 0,
  maxXp: 100,
  attack: 10,
  defense: 2,
  avatar: 'https://picsum.photos/seed/bot/200/200',
  skills: [BASE_ATTACK]
};

export const BLACK_CAT: Entity = {
  id: 'black_cat',
  name: 'Black Cat',
  type: EntityType.COMPANION,
  maxHp: 80,
  currentHp: 80,
  level: 1,
  xp: 0,
  maxXp: 100,
  attack: 15,
  defense: 0, // "Defense was zero but the spirit could grow"
  avatar: 'https://picsum.photos/seed/blackcat/200/200',
  friendshipXp: 0,
  friendshipLevel: 1,
  skills: [
    CAT_SCRATCH,
    PURR_THERAPY,
    CAT_PASSIVE_LUCK,
    HISS_DEBUFF,
    CHAOS_SYNC
  ]
};

export const ALGORITHM_KING: Entity = {
  id: 'algo_king',
  name: 'Algorithm King',
  type: EntityType.BOSS,
  maxHp: 2000,
  currentHp: 2000,
  level: 10,
  xp: 5000,
  maxXp: 0,
  attack: 50,
  defense: 100, // Very high defense, needs "Fuck You" to penetrate
  avatar: 'https://picsum.photos/seed/king/200/200',
  skills: []
};

// --- Locations (Now with Coordinates) ---
export const LOCATIONS: Record<string, Location> = {
  'start_node': {
    id: 'start_node',
    name: 'System Crash Dump',
    description: 'A pile of corrupted data and lost files. It smells like burnt silicon.',
    image: 'https://picsum.photos/seed/dump/800/400',
    x: 300,
    y: 800,
    connections: ['social_feed', 'dev_console'],
    enemies: ['bug_mite'],
    npcs: ['black_cat_npc'], // The cat is here initially
  },
  'social_feed': {
    id: 'social_feed',
    name: 'The Viral Feed',
    description: 'A rushing river of content. Loud, bright, and dangerous.',
    image: 'https://picsum.photos/seed/feed/800/400',
    x: 1000,
    y: 800,
    connections: ['start_node', 'trending_tab', 'dark_mode_tavern'],
    enemies: ['youtube_minion', 'troll_bot'],
    npcs: [],
  },
  'dev_console': {
    id: 'dev_console',
    name: 'Developer Console',
    description: 'The skeletal structure of the world. Shop Available.',
    image: 'https://picsum.photos/seed/code/800/400',
    x: 600,
    y: 400,
    connections: ['start_node', 'boss_arena'],
    enemies: ['syntax_error', 'memory_leak'],
    npcs: [],
    hasShop: true
  },
  'dark_mode_tavern': {
    id: 'dark_mode_tavern',
    name: 'Incognito Tavern',
    description: 'A safe place where cookies are deleted. Inn Available.',
    image: 'https://picsum.photos/seed/bar/800/400',
    x: 1000,
    y: 1300,
    connections: ['social_feed'],
    enemies: [],
    npcs: ['barkeep_vpn'],
    hasInn: true
  },
  'trending_tab': {
    id: 'trending_tab',
    name: 'Trending Tab',
    description: 'The high ground. Only the verified survive here.',
    image: 'https://picsum.photos/seed/trend/800/400',
    x: 1600,
    y: 600,
    connections: ['social_feed', 'boss_arena'],
    enemies: ['influencer_wraith', 'clickbait_hydra'],
    npcs: []
  },
  'boss_arena': {
    id: 'boss_arena',
    name: 'The Algorithm Core',
    description: 'The perfect machine. The King watches all.',
    image: 'https://picsum.photos/seed/core/800/400',
    x: 2000,
    y: 800,
    connections: ['dev_console', 'trending_tab'],
    enemies: [], // Boss triggers via event
    npcs: ['algo_king_npc']
  }
};

// --- Quests ---
export const INITIAL_QUEST: Quest = {
  id: 'find_cat',
  title: 'Protocol: Friendship',
  description: 'Find the Black Cat in the System Crash Dump.',
  completed: false,
  rewardSubscribers: 100,
  rewardFriendshipXp: 120 // Rewards immediate Level 2 unlock
};

export const BOSS_QUEST: Quest = {
  id: 'defeat_algo',
  title: 'Viral or Vanish',
  description: 'Defeat the Algorithm King. Hint: You need a skill that breaks the rules.',
  completed: false,
  rewardSubscribers: 1000000,
  rewardFriendshipXp: 1000
};

// --- Achievements ---
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_level',
    name: 'System Reboot',
    description: 'Complete your first level',
    type: AchievementType.LEVEL_COMPLETE,
    unlocked: false,
    progress: 0,
    target: 1,
    icon: 'Trophy',
    reward: '100 Subscribers'
  },
  {
    id: 'all_levels',
    name: 'Master Hacker',
    description: 'Complete all levels',
    type: AchievementType.LEVEL_COMPLETE,
    unlocked: false,
    progress: 0,
    target: 6,
    icon: 'Crown',
    reward: '1000 Subscribers'
  },
  {
    id: 'collector',
    name: 'Data Hoarder',
    description: 'Collect 50 items',
    type: AchievementType.ITEM_COLLECT,
    unlocked: false,
    progress: 0,
    target: 50,
    icon: 'Package',
    reward: 'Special Outfit'
  },
  {
    id: 'speedrun',
    name: 'Viral Speed',
    description: 'Complete a level in under 60 seconds',
    type: AchievementType.TIME_TRIAL,
    unlocked: false,
    progress: 0,
    target: 1,
    icon: 'Zap',
    reward: 'Speed Boost Unlock'
  },
  {
    id: 'flawless',
    name: 'Error-Free Code',
    description: 'Complete a level without taking damage',
    type: AchievementType.NO_DAMAGE,
    unlocked: false,
    progress: 0,
    target: 1,
    icon: 'Shield',
    reward: 'Defense +5'
  },
  {
    id: 'best_friends',
    name: 'Unbreakable Bond',
    description: 'Reach Friendship Level 5 with the Black Cat',
    type: AchievementType.FRIENDSHIP,
    unlocked: false,
    progress: 0,
    target: 5,
    icon: 'Heart',
    reward: 'Special Team Attack'
  }
];

// --- Levels ---
export const LEVELS: Level[] = [
  {
    id: 'level_1',
    name: 'Lab Escape',
    description: 'Break free from the testing facility where you were created.',
    theme: LevelTheme.CYBER_CITY,
    difficulty: 1,
    unlocked: true,
    completed: false,
    story: 'You wake up in a sterile lab. The Black Cat appears: "They tested us like lab rats. Time to crash their systems and get out."',
    objectives: [
      {
        id: 'reach_exit',
        description: 'Reach the exit portal',
        type: 'reach_point',
        target: 1,
        current: 0,
        completed: false
      },
      {
        id: 'collect_data',
        description: 'Collect 5 data fragments',
        type: 'collect_items',
        target: 5,
        current: 0,
        completed: false
      }
    ],
    obstacles: [
      { id: 'spike_1', type: ObstacleType.SPIKE, x: 400, y: 700, width: 50, height: 50, damage: 10 },
      { id: 'wall_1', type: ObstacleType.WALL, x: 600, y: 600, width: 100, height: 200 },
      { id: 'moving_spike_1', type: ObstacleType.MOVING_SPIKE, x: 800, y: 750, width: 50, height: 50, damage: 15, velocity: { x: 2, y: 0 }, pattern: 'horizontal' }
    ],
    powerUps: [
      { id: 'speed_1', type: PowerUpType.SPEED_BOOST, x: 500, y: 700, collected: false, duration: 30, effectValue: 2 },
      { id: 'inv_1', type: PowerUpType.INVINCIBILITY, x: 900, y: 650, collected: false, duration: 15, effectValue: 1 }
    ],
    backgroundLayers: [
      'https://picsum.photos/seed/cyber1/1920/1080',
      'https://picsum.photos/seed/cyber2/1920/1080',
      'https://picsum.photos/seed/cyber3/1920/1080'
    ],
    music: 'cyber_theme'
  },
  {
    id: 'level_2',
    name: 'Forest of Data',
    description: 'Navigate through corrupted nature algorithms.',
    theme: LevelTheme.FOREST,
    difficulty: 2,
    unlocked: false,
    completed: false,
    story: 'Black Cat: "This forest is beautiful... in a glitchy way. The data trees hide secrets."',
    objectives: [
      {
        id: 'avoid_obstacles',
        description: 'Avoid 20 obstacles',
        type: 'avoid_obstacles',
        target: 20,
        current: 0,
        completed: false
      },
      {
        id: 'defeat_enemies',
        description: 'Defeat 3 corrupted wildlife',
        type: 'defeat_enemies',
        target: 3,
        current: 0,
        completed: false
      }
    ],
    obstacles: [
      { id: 'pitfall_1', type: ObstacleType.PITFALL, x: 500, y: 800, width: 100, height: 50, damage: 25 },
      { id: 'spike_2', type: ObstacleType.SPIKE, x: 700, y: 750, width: 50, height: 50, damage: 10 },
      { id: 'barrier_1', type: ObstacleType.BARRIER, x: 1000, y: 700, width: 50, height: 150 }
    ],
    powerUps: [
      { id: 'jump_1', type: PowerUpType.EXTRA_JUMP, x: 600, y: 700, collected: false, duration: 45, effectValue: 1 }
    ],
    backgroundLayers: [
      'https://picsum.photos/seed/forest1/1920/1080',
      'https://picsum.photos/seed/forest2/1920/1080',
      'https://picsum.photos/seed/forest3/1920/1080'
    ],
    music: 'forest_theme'
  },
  {
    id: 'level_3',
    name: 'Desert of Forgotten Code',
    description: 'Cross the wasteland of deprecated functions.',
    theme: LevelTheme.DESERT,
    difficulty: 3,
    unlocked: false,
    completed: false,
    story: 'Bot: "This is where old programs go to die. Let\'s not join them."',
    objectives: [
      {
        id: 'time_limit',
        description: 'Complete within 120 seconds',
        type: 'time_limit',
        target: 120,
        current: 0,
        completed: false
      },
      {
        id: 'collect_treasure',
        description: 'Find the hidden treasure',
        type: 'collect_items',
        target: 1,
        current: 0,
        completed: false
      }
    ],
    obstacles: [
      { id: 'moving_spike_2', type: ObstacleType.MOVING_SPIKE, x: 600, y: 750, width: 50, height: 50, damage: 20, velocity: { x: 0, y: 3 }, pattern: 'vertical' },
      { id: 'spike_3', type: ObstacleType.SPIKE, x: 900, y: 700, width: 50, height: 50, damage: 15 }
    ],
    powerUps: [
      { id: 'damage_1', type: PowerUpType.DAMAGE_BOOST, x: 750, y: 650, collected: false, duration: 30, effectValue: 2 }
    ],
    backgroundLayers: [
      'https://picsum.photos/seed/desert1/1920/1080',
      'https://picsum.photos/seed/desert2/1920/1080',
      'https://picsum.photos/seed/desert3/1920/1080'
    ],
    music: 'desert_theme'
  },
  {
    id: 'level_4',
    name: 'Arctic Server Farm',
    description: 'Stay warm in the frozen data centers.',
    theme: LevelTheme.ARCTIC,
    difficulty: 4,
    unlocked: false,
    completed: false,
    story: 'Black Cat: "Brrr... My whiskers are freezing. Let\'s move fast!"',
    objectives: [
      {
        id: 'reach_exit_2',
        description: 'Reach the warming station',
        type: 'reach_point',
        target: 1,
        current: 0,
        completed: false
      }
    ],
    obstacles: [
      { id: 'ice_wall_1', type: ObstacleType.WALL, x: 500, y: 650, width: 150, height: 100 },
      { id: 'ice_spike_1', type: ObstacleType.SPIKE, x: 800, y: 700, width: 50, height: 50, damage: 12 }
    ],
    powerUps: [
      { id: 'speed_2', type: PowerUpType.SPEED_BOOST, x: 650, y: 700, collected: false, duration: 30, effectValue: 2 }
    ],
    backgroundLayers: [
      'https://picsum.photos/seed/arctic1/1920/1080',
      'https://picsum.photos/seed/arctic2/1920/1080',
      'https://picsum.photos/seed/arctic3/1920/1080'
    ],
    music: 'arctic_theme'
  },
  {
    id: 'level_5',
    name: 'Volcano Database',
    description: 'Navigate through molten data streams.',
    theme: LevelTheme.VOLCANO,
    difficulty: 5,
    unlocked: false,
    completed: false,
    story: 'Bot: "High temperature warnings detected. This volcano is running HOT queries!"',
    objectives: [
      {
        id: 'avoid_lava',
        description: 'Avoid all lava pits',
        type: 'avoid_obstacles',
        target: 10,
        current: 0,
        completed: false
      },
      {
        id: 'collect_gems',
        description: 'Collect 8 fire gems',
        type: 'collect_items',
        target: 8,
        current: 0,
        completed: false
      }
    ],
    obstacles: [
      { id: 'lava_1', type: ObstacleType.PITFALL, x: 450, y: 800, width: 150, height: 50, damage: 30 },
      { id: 'spike_4', type: ObstacleType.SPIKE, x: 750, y: 700, width: 50, height: 50, damage: 18 }
    ],
    powerUps: [
      { id: 'inv_2', type: PowerUpType.INVINCIBILITY, x: 600, y: 680, collected: false, duration: 20, effectValue: 1 }
    ],
    backgroundLayers: [
      'https://picsum.photos/seed/volcano1/1920/1080',
      'https://picsum.photos/seed/volcano2/1920/1080',
      'https://picsum.photos/seed/volcano3/1920/1080'
    ],
    music: 'volcano_theme'
  },
  {
    id: 'level_6',
    name: 'Space Station Zero',
    description: 'The final frontier - defeat the Algorithm King in space!',
    theme: LevelTheme.SPACE,
    difficulty: 6,
    unlocked: false,
    completed: false,
    story: 'Black Cat: "This is it. The Algorithm King\'s throne. Let\'s show him what chaos looks like!"',
    objectives: [
      {
        id: 'boss_fight',
        description: 'Defeat the Algorithm King',
        type: 'defeat_enemies',
        target: 1,
        current: 0,
        completed: false
      }
    ],
    obstacles: [
      { id: 'barrier_2', type: ObstacleType.BARRIER, x: 800, y: 600, width: 50, height: 200 },
      { id: 'moving_spike_3', type: ObstacleType.MOVING_SPIKE, x: 1000, y: 750, width: 50, height: 50, damage: 25, velocity: { x: 3, y: 0 }, pattern: 'horizontal' }
    ],
    powerUps: [
      { id: 'damage_2', type: PowerUpType.DAMAGE_BOOST, x: 900, y: 650, collected: false, duration: 45, effectValue: 3 }
    ],
    backgroundLayers: [
      'https://picsum.photos/seed/space1/1920/1080',
      'https://picsum.photos/seed/space2/1920/1080',
      'https://picsum.photos/seed/space3/1920/1080'
    ],
    music: 'space_theme'
  }
];

// --- Initial State ---
export const INITIAL_STATE: GameState = {
  screen: GameScreen.INTRO,
  player: INITIAL_PLAYER,
  playerPosition: { x: 300, y: 800 }, // Start at start_node
  companion: null,
  party: [INITIAL_PLAYER],
  subscribers: 0,
  inventory: [],
  currentLocationId: 'start_node',
  quests: [INITIAL_QUEST],
  log: ['System initialized...', 'Crash detected...', 'Rebooting into Safe Mode...'],
  activeEnemy: null,
  activeNpcId: null,
  mapEnemies: [
    // Initial roaming glitches
    { id: 'glitch_1', type: 'bug_mite', x: 600, y: 850 },
    { id: 'glitch_2', type: 'youtube_minion', x: 1200, y: 700 },
    { id: 'glitch_3', type: 'troll_bot', x: 1100, y: 900 },
    { id: 'glitch_4', type: 'influencer_wraith', x: 1500, y: 650 },
    { id: 'glitch_5', type: 'syntax_error', x: 500, y: 500 },
  ],
  levels: LEVELS,
  currentLevel: undefined,
  achievements: ACHIEVEMENTS,
  activeEffects: [],
  customizations: [],
  audioEnabled: true,
  musicVolume: 0.5,
  sfxVolume: 0.7,
  levelStartTime: undefined
};
