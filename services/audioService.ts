// Simple Audio Service for managing game sounds
// In a real implementation, you would load actual audio files

interface AudioConfig {
  enabled: boolean;
  musicVolume: number;
  sfxVolume: number;
}

class AudioService {
  private config: AudioConfig = {
    enabled: true,
    musicVolume: 0.5,
    sfxVolume: 0.7
  };

  private currentMusic: string | null = null;
  private musicAudio: HTMLAudioElement | null = null;

  updateConfig(config: Partial<AudioConfig>) {
    this.config = { ...this.config, ...config };
    if (this.musicAudio) {
      this.musicAudio.volume = this.config.musicVolume;
    }
  }

  playMusic(track: string) {
    if (!this.config.enabled) return;
    
    // Stop any currently playing music
    this.stopMusic();
    
    // In a real implementation, you would load and play the actual music file
    // For now, we'll just track what should be playing
    this.currentMusic = track;
    console.log(`🎵 Playing music: ${track}`);
    
    // Placeholder for actual music playback
    // this.musicAudio = new Audio(`/music/${track}.mp3`);
    // this.musicAudio.loop = true;
    // this.musicAudio.volume = this.config.musicVolume;
    // this.musicAudio.play().catch(err => console.log('Music autoplay blocked:', err));
  }

  stopMusic() {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio = null;
    }
    this.currentMusic = null;
  }

  playSFX(effect: string) {
    if (!this.config.enabled) return;
    
    console.log(`🔊 Playing SFX: ${effect}`);
    
    // Placeholder for actual sound effects
    // const sfx = new Audio(`/sfx/${effect}.mp3`);
    // sfx.volume = this.config.sfxVolume;
    // sfx.play().catch(err => console.log('SFX error:', err));
  }

  getCurrentMusic(): string | null {
    return this.currentMusic;
  }
}

export const audioService = new AudioService();

// Common sound effects
export const SFX = {
  COLLECT: 'collect',
  POWERUP: 'powerup',
  DAMAGE: 'damage',
  JUMP: 'jump',
  LEVEL_COMPLETE: 'level_complete',
  ACHIEVEMENT: 'achievement',
  MENU_SELECT: 'menu_select',
  BUTTON_CLICK: 'button_click'
};

// Music tracks
export const MUSIC = {
  MAIN_MENU: 'main_menu',
  CYBER_THEME: 'cyber_theme',
  FOREST_THEME: 'forest_theme',
  DESERT_THEME: 'desert_theme',
  ARCTIC_THEME: 'arctic_theme',
  VOLCANO_THEME: 'volcano_theme',
  SPACE_THEME: 'space_theme',
  BOSS_BATTLE: 'boss_battle',
  VICTORY: 'victory'
};
