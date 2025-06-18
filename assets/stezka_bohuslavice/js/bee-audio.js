// === BEE-AUDIO.JS - AUDIO MANAGEMENT ===

class BeeAudioManager {
    constructor() {
        this.currentlyPlayingAudio = null;
        this.audioPlayingForMarker = null;
        this.audioIsPaused = false;
        this.audioInfoElement = null;
    }
    
    initialize() {
        console.log("🔊 Initializing Bee Audio Manager...");
        this.audioInfoElement = document.getElementById('audioInfo');
        this.setupEventListeners();
        this.updateDisplay();
        console.log("✅ Bee Audio Manager initialized");
    }
    
    setupEventListeners() {
        if (this.audioInfoElement) {
            this.audioInfoElement.addEventListener('click', () => this.togglePlayPause());
        }
    }
    
    playAudio(markerId) {
        const marker = BEE_CONFIG.MARKERS.find(m => m.id === markerId);
        if (!marker) {
            console.warn(`❌ Marker ${markerId} not found`);
            return false;
        }
        
        // Pokud už hraje audio pro tento marker, nerestartuj
        if (this.audioPlayingForMarker === markerId && this.currentlyPlayingAudio && !this.currentlyPlayingAudio.paused) {
            return true;
        }
        
        // Pokud hraje jiné audio, zastav ho
        if (this.currentlyPlayingAudio && this.audioPlayingForMarker !== markerId) {
            this.stopCurrentAudio();
        }
        
        const audioElement = document.getElementById(marker.audioId);
        if (!audioElement) {
            console.error(`❌ Audio element ${marker.audioId} not found`);
            return false;
        }
        
        try {
            console.log(`🎵 Playing audio for marker: ${markerId}`);
            
            audioElement.currentTime = 0;
            this.audioIsPaused = false;
            
            const playPromise = audioElement.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.currentlyPlayingAudio = audioElement;
                    this.audioPlayingForMarker = markerId;
                    
                    this.updateDisplay();
                    
                    // Event listener pro konec audio
                    audioElement.onended = () => {
                        console.log(`🎵 Audio ended for marker: ${markerId} - checking for restart`);
                        // Restart audio pokud je uživatel stále blízko
                        if (this.audioPlayingForMarker === markerId) {
                            setTimeout(() => {
                                if (this.audioPlayingForMarker === markerId) {
                                    // Zde by se měla kontrolovat vzdálenost, ale to dělá AR manager
                                    console.log(`🎵 Restarting audio for ${markerId}`);
                                    this.playAudio(markerId);
                                }
                            }, 500);
                        }
                    };
                    
                }).catch(error => {
                    console.error(`❌ Error playing audio for ${markerId}:`, error);
                    this.handleAudioError(error);
                });
            }
            
            return true;
            
        } catch (error) {
            console.error(`❌ Exception playing audio for ${markerId}:`, error);
            this.handleAudioError(error);
            return false;
        }
    }
    
    togglePlayPause() {
        if (!this.currentlyPlayingAudio) {
            console.log("🎵 No audio to toggle");
            return false;
        }
        
        try {
            if (this.audioIsPaused) {
                const playPromise = this.currentlyPlayingAudio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.audioIsPaused = false;
                        this.updateDisplay();
                        console.log("🎵 Audio resumed");
                    }).catch(error => {
                        console.error("❌ Error resuming audio:", error);
                        this.handleAudioError(error);
                    });
                }
            } else {
                this.currentlyPlayingAudio.pause();
                this.audioIsPaused = true;
                this.updateDisplay();
                console.log("🎵 Audio paused");
            }
            return true;
        } catch (error) {
            console.error("❌ Error toggling audio:", error);
            this.handleAudioError(error);
            return false;
        }
    }
    
    stopCurrentAudio() {
        if (this.currentlyPlayingAudio) {
            try {
                this.currentlyPlayingAudio.pause();
                this.currentlyPlayingAudio.currentTime = 0;
                this.currentlyPlayingAudio.onended = null;
                
                const stoppedMarker = this.audioPlayingForMarker;
                
                this.currentlyPlayingAudio = null;
                this.audioPlayingForMarker = null;
                this.audioIsPaused = false;
                
                this.updateDisplay();
                console.log(`🎵 Audio stopped for marker: ${stoppedMarker}`);
                
            } catch (error) {
                console.error("❌ Error stopping audio:", error);
            }
        }
    }
    
    updateDisplay() {
        if (!this.audioInfoElement) return;
        
        if (this.currentlyPlayingAudio && this.audioPlayingForMarker) {
            if (this.audioIsPaused) {
                this.audioInfoElement.innerHTML = '▶️';
                this.audioInfoElement.style.background = 'rgba(255, 193, 7, 0.9)';
                this.audioInfoElement.style.borderColor = 'rgba(255, 193, 7, 1)';
                this.audioInfoElement.className = 'audio-info ui-element paused';
                console.log("🎵 Audio button: paused state");
            } else {
                this.audioInfoElement.innerHTML = '⏸️';
                this.audioInfoElement.style.background = 'rgba(40, 167, 69, 0.9)';
                this.audioInfoElement.style.borderColor = 'rgba(40, 167, 69, 1)';
                this.audioInfoElement.className = 'audio-info ui-element playing';
                console.log("🎵 Audio button: playing state");
            }
            this.audioInfoElement.style.display = 'flex';
        } else {
            this.audioInfoElement.innerHTML = '🔊';
            this.audioInfoElement.style.background = 'rgba(100, 100, 100, 0.9)';
            this.audioInfoElement.style.borderColor = 'rgba(100, 100, 100, 1)';
            this.audioInfoElement.className = 'audio-info ui-element inactive';
            this.audioInfoElement.style.display = 'none'; // Skryj když nehraje
            console.log("🎵 Audio button: inactive state");
        }
    }
    
    handleAudioError(error) {
        console.error("🎵 Audio error:", error);
        
        // Reset stavu při chybě
        this.currentlyPlayingAudio = null;
        this.audioPlayingForMarker = null;
        this.audioIsPaused = false;
        this.updateDisplay();
        
        // Můžeme přidat notifikaci pro uživatele
        if (error.name === 'NotAllowedError') {
            console.warn("🎵 Audio playback not allowed - user interaction required");
        } else if (error.name === 'NotSupportedError') {
            console.warn("🎵 Audio format not supported");
        }
    }
    
    // Metody pro kontrolu stavu
    isPlaying() {
        return !!(this.currentlyPlayingAudio && !this.audioIsPaused);
    }
    
    isPaused() {
        return this.audioIsPaused;
    }
    
    getCurrentMarker() {
        return this.audioPlayingForMarker;
    }
    
    getVolume() {
        return this.currentlyPlayingAudio ? this.currentlyPlayingAudio.volume : 0;
    }
    
    setVolume(volume) {
        if (this.currentlyPlayingAudio) {
            this.currentlyPlayingAudio.volume = Math.max(0, Math.min(1, volume));
            console.log(`🔊 Volume set to: ${this.currentlyPlayingAudio.volume}`);
        }
    }
    
    getStatus() {
        return {
            playing: this.isPlaying(),
            paused: this.isPaused(),
            currentMarker: this.getCurrentMarker(),
            volume: this.getVolume(),
            hasAudio: !!this.currentlyPlayingAudio
        };
    }
    
    // Debug metody
    debugAudioElements() {
        console.log("=== AUDIO DEBUG ===");
        BEE_CONFIG.MARKERS.forEach(marker => {
            const audioElement = document.getElementById(marker.audioId);
            console.log(`${marker.id} (${marker.audioId}):`, {
                exists: !!audioElement,
                readyState: audioElement ? audioElement.readyState : 'N/A',
                duration: audioElement ? audioElement.duration : 'N/A',
                src: audioElement ? audioElement.src : 'N/A'
            });
        });
        console.log("Current status:", this.getStatus());
        console.log("===================");
    }
    
    // Metoda pro preload všech audio souborů
    preloadAllAudio() {
        console.log("🔊 Preloading all audio files...");
        
        BEE_CONFIG.MARKERS.forEach(marker => {
            const audioElement = document.getElementById(marker.audioId);
            if (audioElement) {
                audioElement.load();
                console.log(`🔊 Preloading ${marker.audioId}`);
            }
        });
    }
    
    // Cleanup metoda
    cleanup() {
        console.log("🧹 Cleaning up audio manager...");
        this.stopCurrentAudio();
        
        if (this.audioInfoElement) {
            this.audioInfoElement.removeEventListener('click', this.togglePlayPause);
        }
    }
}