// Text-To-Speech SpeechSynthesis Engine
// Configured for documentary-style calm, authoritative narration.

class SpeechEngine {
  private isVoiceEnabled: boolean = true;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private currentSceneNumber: number = -1;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    this.voices = window.speechSynthesis.getVoices();
    // Prioritize high-quality natural English voices
    const preferredNames = ['Google US English', 'Microsoft Christopher Online', 'Microsoft Guy Online', 'Daniel', 'Samantha', 'Alex', 'en-US', 'en-GB'];
    
    for (const name of preferredNames) {
      const match = this.voices.find(v => v.name.includes(name) || v.lang.startsWith(name));
      if (match) {
        this.selectedVoice = match;
        break;
      }
    }

    if (!this.selectedVoice && this.voices.length > 0) {
      this.selectedVoice = this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
    }
  }

  public setVoiceEnabled(enabled: boolean) {
    this.isVoiceEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  public getVoiceEnabled(): boolean {
    return this.isVoiceEnabled;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }

  public speakSceneNarration(sceneNumber: number, text: string, rate: number = 1.0) {
    if (!this.isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (this.currentSceneNumber === sceneNumber && window.speechSynthesis.speaking) {
      return;
    }

    this.stop();
    this.currentSceneNumber = sceneNumber;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = Math.min(1.15, Math.max(0.85, rate * 0.98)); // Documentarian measured pace
      utterance.pitch = 0.96; // Slightly deeper, authoritative pitch
      utterance.volume = 0.9;

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Fallback gracefully if speech synthesis is blocked
    }
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }
}

export const speechEngine = new SpeechEngine();
