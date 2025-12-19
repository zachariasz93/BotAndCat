# GitHub Copilot Instructions for BotAndCat

## Project Overview

This is "Glitch Protocol: The Black Cat & The Bot" - a digital RPG game built with React, TypeScript, and Vite. The game features:
- Turn-based combat system
- Companion/friendship mechanics
- AI-powered NPC dialogue using Google Gemini
- Exploration and world map navigation
- Skill tree and progression system
- Shop and inventory management

## Tech Stack

- **Framework**: React 19.2.3 with TypeScript
- **Build Tool**: Vite 6.2.0
- **AI Integration**: Google Gemini AI (@google/genai)
- **Icons**: lucide-react
- **Styling**: Inline styles and CSS

## Development Setup

### Prerequisites
- Node.js (latest stable version)
- npm package manager

### Installation & Running
```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env.local file with:
# GEMINI_API_KEY=your_api_key_here

# Start development server
npm run dev
# Server runs on http://0.0.0.0:3000

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
/
├── .github/              # GitHub configuration files
├── components/           # React components
│   ├── Combat.tsx       # Combat system
│   ├── Exploration.tsx  # Exploration mode
│   ├── GameLayout.tsx   # Layout wrapper
│   ├── Inventory.tsx    # Inventory UI
│   ├── Shop.tsx         # Shop system
│   ├── SkillTree.tsx    # Skill progression
│   └── WorldMap.tsx     # Map navigation
├── services/            # External services
│   └── geminiService.ts # AI dialogue generation
├── App.tsx              # Main app component
├── constants.ts         # Game constants and data
├── types.ts             # TypeScript type definitions
├── index.tsx            # App entry point
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## Code Style & Conventions

### TypeScript
- Use TypeScript for all files (`.tsx` for React, `.ts` for utilities)
- Define interfaces for all data structures
- Use enums for constant state values (see `types.ts`)
- Enable strict type checking
- Use path alias `@/` for imports from root

### React
- Use functional components with hooks
- Use TypeScript interfaces for component props
- Use `React.FC<Props>` pattern for components
- Keep components focused and single-responsibility

### State Management
- Use `useState` for local component state
- Use `useEffect` for side effects and lifecycle events
- Pass state down via props, callbacks up

### Naming Conventions
- Components: PascalCase (e.g., `Combat.tsx`, `GameLayout.tsx`)
- Files: PascalCase for components, camelCase for utilities
- Types/Interfaces: PascalCase (e.g., `GameState`, `Entity`)
- Enums: PascalCase with UPPERCASE values (e.g., `GameScreen.EXPLORATION`)
- Variables/functions: camelCase
- Constants: UPPER_SNAKE_CASE (e.g., `INITIAL_STATE`, `COMBAT_BANTER`)

### Code Organization
- Keep game constants in `constants.ts`
- Keep type definitions in `types.ts`
- Keep service integrations in `services/` directory
- Component-specific logic stays in component files

## Key Patterns & Practices

### Game State
- Central `GameState` interface defined in `types.ts`
- State managed in `App.tsx` and passed down to components
- Components receive state via props and update via callbacks

### Entity System
- All characters (player, companion, enemies) use `Entity` interface
- Entities have HP, level, XP, attack, defense, and skills
- Type differentiation via `EntityType` enum

### Combat System
- Turn-based: 'PLAYER' or 'ENEMY' turn state
- Skill-based actions with different `SkillType` values
- Combat log for action history
- Banter system with friendship level requirements

### Friendship System
- Companion has `friendshipXp` and `friendshipLevel`
- Higher levels unlock more banter and dialogue options
- Friendship increased through combat, dialogue, and gifts

### AI Dialogue
- Uses Google Gemini AI via `geminiService.ts`
- NPC-specific personalities defined in system instructions
- Short responses (under 30 words) for RPG immersion
- Graceful fallback when API unavailable

### Environment Variables
- API keys stored in `.env.local` (not committed)
- Accessed via `process.env` in Vite config
- `GEMINI_API_KEY` required for AI dialogue

## Testing

Currently, this project does not have automated tests. When adding tests:
- Use a React testing framework (e.g., Jest, Vitest, React Testing Library)
- Test components in isolation
- Mock external services (Gemini AI)
- Test game state transitions and combat logic

## Important Notes

### Security
- Never commit API keys to the repository
- Keep `.env.local` in `.gitignore`
- Validate and sanitize user input for dialogue

### Build Artifacts
- `node_modules/` is excluded via `.gitignore`
- `dist/` and `dist-ssr/` are build outputs (excluded)
- `*.local` files are excluded (for local env vars)

### Dependencies
- Keep React and related packages in sync
- Use specific versions to ensure compatibility
- Run `npm install` after pulling changes

### Game Balance
- Enemy stats, skill costs, and XP rewards defined in `constants.ts`
- Be mindful of game balance when modifying these values
- Test gameplay changes thoroughly

### Character Lore
- The game has an established narrative (`LORE_POEM` in constants)
- Maintain character personalities in dialogue
- Black Cat: Sarcastic, posts "slop", says "meow", eventually loyal
- Algorithm King: Arrogant, obsessed with metrics and engagement
- Keep NPCs consistent with their defined personalities

## Common Tasks

### Adding a New Component
1. Create `.tsx` file in `components/` directory
2. Define interface for component props
3. Export as named export: `export const ComponentName: React.FC<Props> = ...`
4. Import and use in parent component

### Adding a New Game Screen
1. Add enum value to `GameScreen` in `types.ts`
2. Create component for the screen
3. Add screen handling in `App.tsx`
4. Update screen transitions

### Modifying Game State
1. Update `GameState` interface in `types.ts` if needed
2. Modify `INITIAL_STATE` in `constants.ts` if changing defaults
3. Update state setters in `App.tsx`
4. Pass updated state to affected components

### Adding New Skills or Items
1. Define in `constants.ts` (e.g., in skills array or items array)
2. Follow existing structure (id, name, description, etc.)
3. Ensure skill types match `SkillType` enum
4. Test in combat or relevant game mode

### Updating AI Dialogue
1. Modify system instructions in `geminiService.ts`
2. Keep character personalities consistent
3. Maintain short response requirement
4. Test with actual API calls

## Best Practices for AI Agent

- Make minimal, focused changes
- Preserve existing game balance and mechanics
- Test changes with `npm run dev`
- Maintain type safety - fix TypeScript errors
- Keep UI/UX consistent with existing design
- Respect character personalities and lore
- Don't modify working features unless fixing bugs
- Document any new patterns or conventions
