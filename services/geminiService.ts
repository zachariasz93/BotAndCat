import { GoogleGenAI } from "@google/genai";
import { LORE_POEM } from "../constants";

let ai: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

interface ChatContext {
  npcName: string;
  playerInput: string;
  history: string[];
}

export const generateDialogue = async (context: ChatContext): Promise<string> => {
  if (!ai) {
    return `[System]: API Key missing. The ${context.npcName} stares at you silently (simulated mode).`;
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    const systemInstruction = `
      You are an NPC in a digital RPG called "Glitch Protocol".
      The Lore is based on this poem: "${LORE_POEM}".
      
      You are roleplaying as: ${context.npcName}.
      
      Tone instructions based on character:
      - Black Cat: Sarcastic, posts trash, says "meow" sometimes, rude but loyal eventually. Loves "slop" art.
      - Algorithm King: Arrogant, cold, obsessed with "metrics", "engagement", and "perfection". Wants to ban the player.
      - Barkeep VPN: Secretive, helpful, speaks in whispers.
      
      Keep responses short (under 30 words) and RPG-style.
      Do not break character.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: `Player says: "${context.playerInput}". Respond as ${context.npcName}.`,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "[System]: Connection to AI Core unstable. (Error generating dialogue)";
  }
};
