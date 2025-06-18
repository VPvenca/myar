// === BEE-MAIN.JS - HLAVNÍ KOORDINAČNÍ SOUBOR ===

class BeeApp {
    constructor() {
        this.arManager = new BeeARManager();
        this.quizSystem = new BeeQuizSystem();
        this.audioManager = new BeeAudioManager();
        this.navigationManager = new BeeNavigationManager();
        this.rotationManager = new BeeRotationManager(this.arManager);
        this.gamificationManager = new BeeGamificationManager();
        this.tutorialManager = new BeeTutorialManager();
        
        this.initialized = false;
        this.mainLoopInterval = null;
    }
    
    async initialize() {
        console.log("🚀 Starting Bee Trail App initialization...");
        
        try {
            // Čekání na A-Frame
            await this.waitForAFrame();
            
            // Inicializace modulů v správném pořadí
            this.arManager.initialize();
            this.audioManager.initialize();
            this.navigationManager.initialize();
            this.rotationManager.initialize();
            this.quizSystem.initialize();
            
            // Gamifikace s časovým zpožděním
            setTimeout(() => {
                this.gamificationManager.initialize();
            }, 2000);
            
            // Tutorial s časovým zpožděním
            setTimeout(() => {
                this.tutorialManager.initialize();
            }, 3000);
            
            // Spuštění hlavní smyčky
            this.setupMainLoop();
            
            // Propojení event handlerů
            this.setupCrossModuleCommunication();
            
            this.initialized = true;
            console.log("✅ Bee Trail App initialized successfully");
            
        } catch (error) {
            console.error("❌ Bee Trail App initialization failed:", error);
        }
    }
    
    waitForAFrame() {
        return new Promise((resolve) => {
            const scene = document.querySelector('a-scene');
            if (scene && scene.hasLoaded) {
                console.log("🎬 A-Frame scene already loaded");
                resolve();
            } else if (scene) {
                scene.addEventListener('loaded', () => {
                    console.log("🎬 A-Frame scene loaded");
                    resolve();
                });
            } else {
                console.error("❌ A-Frame scene not found");
                resolve(); // Pokračuj i bez A-Frame
            }
        });
    }
    
    setupMainLoop() {
        // Hlavní smyčka aplikace - kontrola každé 3 sekundy
        this.mainLoopInterval = setInterval(() => {
            if (!this.initialized) return;
            
            const userPosition = this.navigationManager.getUserPosition();
            if (userPosition) {
                // Proximity check s propojením všech managerů
                this.arManager.checkProximity(
                    userPosition, 
                    this.audioManager, 
                    this.gamificationManager
                );
                
                // Kontrola kvízů
                this.quizSystem.checkDistanceForQuiz(
                    userPosition,
                    this.navigationManager.getStartPosition()
                );
                
                // Aktualizace navigace
                this.navigationManager.updateAll();
            }
        }, 3000);
        
        console.log("🔄 Main loop started (3s interval)");
    }
    
    setupCrossModuleCommunication() {
        console.log("🔗 Setting up cross-module communication...");
        
        // Globální klik pro zavření navigace
        document.addEventListener('click', (e) => {
            this.navigationManager.handleGlobalClick(e);
        });
        
        // Page visibility pro gamifikaci
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.gamificationManager.pauseTracking();
            } else {
                this.gamificationManager.resumeTracking();
            }
        });
        
        // Cleanup při odchodu
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
        
        console.log("✅ Cross-module communication setup complete");
    }
    
    cleanup() {
        console.log("🧹 Cleaning up Bee Trail App...");
        
        if (this.mainLoopInterval) {
            clearInterval(this.mainLoopInterval);
            this.mainLoopInterval = null;
        }
        
        // Cleanup všech managerů
        this.gamificationManager.cleanup();
        this.tutorialManager.cleanup();
        this.audioManager.cleanup();
        this.navigationManager.cleanup();
        this.rotationManager.cleanup();
        this.arManager.forceClean();
        
        this.initialized = false;
        console.log("✅ Cleanup complete");
    }
    
    // Debug metody
    getStatus() {
        return {
            initialized: this.initialized,
            hasMainLoop: !!this.mainLoopInterval,
            modules: {
                ar: this.arManager.getSceneStatus(),
                audio: this.audioManager.getStatus(),
                navigation: this.navigationManager.getStatus(),
                quiz: this.quizSystem.getStatus(),
                rotation: this.rotationManager.getStatus(),
                gamification: this.gamificationManager.getStatus(),
                tutorial: this.tutorialManager.getStatus()
            }
        };
    }
    
    forceReset() {
        console.log("🔄 Force resetting Bee Trail App...");
        this.cleanup();
        setTimeout(() => {
            this.initialize();
        }, 1000);
    }
    
    // Metody pro přímé ovládání modulů
    getARManager() { return this.arManager; }
    getAudioManager() { return this.audioManager; }
    getNavigationManager() { return this.navigationManager; }
    getQuizSystem() { return this.quizSystem; }
    getRotationManager() { return this.rotationManager; }
    getGamificationManager() { return this.gamificationManager; }
    getTutorialManager() { return this.tutorialManager; }
    
    // Rychlé akce
    playTestAudio() {
        const firstMarker = BEE_CONFIG.MARKERS[0];
        if (firstMarker) {
            this.audioManager.playAudio(firstMarker.id);
        }
    }
    
    showTestQuiz() {
        this.quizSystem.showRandomQuiz();
    }
    
    testRotation() {
        this.rotationManager.testRotation(3000);
    }
    
    activateTestMarker() {
        const firstMarker = BEE_CONFIG.MARKERS[0];
        if (firstMarker) {
            this.gamificationManager.recordMarkerActivation(firstMarker.id);
        }
    }
}

// Export pro globální použití
window.BeeApp = BeeApp;

// Debug funkce pro vývojáře
window.getBeeAppStatus = function() {
    if (window.beeApp) {
        return window.beeApp.getStatus();
    }
    return "Bee App not initialized";
};

window.resetBeeApp = function() {
    if (window.beeApp) {
        window.beeApp.forceReset();
    }
};

window.debugBeeApp = function() {
    if (window.beeApp) {
        console.log("=== BEE APP DEBUG ===");
        console.log("Status:", window.beeApp.getStatus());
        
        // Debug jednotlivých modulů
        window.beeApp.arManager.getSceneStatus();
        window.beeApp.audioManager.debugAudioElements();
        window.beeApp.rotationManager.debugRotation();
        window.beeApp.gamificationManager.debugGamification();
        window.beeApp.tutorialManager.debugTutorial();
        
        console.log("======================");
    }
};

// Test funkce
window.testBeeFeatures = function() {
    if (window.beeApp) {
        console.log("🧪 Testing bee features...");
        window.beeApp.playTestAudio();
        setTimeout(() => window.beeApp.showTestQuiz(), 2000);
        setTimeout(() => window.beeApp.testRotation(), 4000);
        setTimeout(() => window.beeApp.activateTestMarker(), 6000);
    }
};

console.log("🐝 BeeApp class and debug functions loaded successfully!");
console.log("🔧 Available debug commands:");
console.log("- getBeeAppStatus() - zobrazí stav aplikace");
console.log("- resetBeeApp() - restartuje aplikaci");
console.log("- debugBeeApp() - debug všech modulů");
console.log("- testBeeFeatures() - test funkcí");addEventListener('click', () => {
            this.audioManager.togglePlayPause();
        });
        
        // Navigační události
        document.getElementById('navToggle').addEventListener('click', () => {
            this.navigationManager.toggleNavigation();
        });
        
        document.getElementById('clearSelection').addEventListener('click', () => {
            this.navigationManager.clearSelection();
        });
        
        // Kvíz události
        document.getElementById('quizClose').addEventListener('click', () => {
            this.quizSystem.closeQuiz();
        });
        
        // Globální klik pro zavření navigace
        document.addEventListener('click', (e) => {
            this.navigationManager.handleGlobalClick(e);
        });
        
        // Page visibility pro gamifikaci
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.gamificationManager.pauseTracking();
            } else {
                this.gamificationManager.resumeTracking();
            }
        });
        
        // Cleanup při odchodu
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
        
        console.log("🔗 Cross-module communication setup complete");
    }
    
    cleanup() {
        console.log("🧹 Cleaning up Bee Trail App...");
        
        if (this.mainLoopInterval) {
            clearInterval(this.mainLoopInterval);
            this.mainLoopInterval = null;
        }
        
        this.gamificationManager.finalize();
        this.arManager.forceClean();
        
        console.log("✅ Cleanup complete");
    }
    
    // Debug metody
    getStatus() {
        return {
            initialized: this.initialized,
            arStatus: this.arManager.getSceneStatus(),
            audioStatus: this.audioManager.getStatus(),
            navigationStatus: this.navigationManager.getStatus(),
            quizStatus: this.quizSystem.getStatus(),
            gamificationStatus: this.gamificationManager.getStatus()
        };
    }
    
    forceReset() {
        console.log("🔄 Force resetting Bee Trail App...");
        this.cleanup();
        setTimeout(() => {
            this.initialize();
        }, 1000);
    }
}

// === ZJEDNODUŠENÉ MOCK TŘÍDY PRO MODULY ===
// (Tyto budou nahrazeny skutečnými implementacemi v separátních souborech)

class BeeQuizSystem {
    constructor() {
        this.currentQuiz = null;
        this.startPosition = null;
        this.lastQuizMilestone = -1;
    }
    
    initialize() {
        console.log("🧩 BeeQuizSystem initialized");
    }
    
    checkDistanceForQuiz(userPosition, startPosition) {
        // Implementace kontroly vzdálenosti pro kvízy
        if (!userPosition || !startPosition) return;
        
        const distance = this.calculateDistance(
            startPosition.lat, startPosition.lng,
            userPosition.lat, userPosition.lng
        );
        
        const currentMilestone = Math.floor(distance / BEE_CONFIG.QUIZ_DISTANCE_STEP);
        
        if (currentMilestone > this.lastQuizMilestone && currentMilestone > 0) {
            this.lastQuizMilestone = currentMilestone;
            this.showRandomQuiz();
        }
    }
    
    showRandomQuiz() {
        // Mock implementace
        console.log("🐝 Showing quiz...");
    }
    
    closeQuiz() {
        document.getElementById('beeQuiz').style.display = 'none';
        this.currentQuiz = null;
    }
    
    getStatus() {
        return {
            currentQuiz: this.currentQuiz,
            lastMilestone: this.lastQuizMilestone
        };
    }
    
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                 Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                 Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
}

class BeeAudioManager {
    constructor() {
        this.currentlyPlayingAudio = null;
        this.audioPlayingForMarker = null;
        this.audioIsPaused = false;
    }
    
    initialize() {
        console.log("🔊 BeeAudioManager initialized");
    }
    
    playAudio(markerId) {
        console.log(`🎵 Playing audio for ${markerId}`);
    }
    
    togglePlayPause() {
        console.log("🎵 Toggle audio play/pause");
    }
    
    stopCurrentAudio() {
        console.log("🎵 Stop current audio");
    }
    
    getStatus() {
        return {
            playing: !!this.currentlyPlayingAudio,
            paused: this.audioIsPaused,
            currentMarker: this.audioPlayingForMarker
        };
    }
}

class BeeNavigationManager {
    constructor() {
        this.userPosition = null;
        this.startPosition = null;
        this.selectedTargetId = null;
    }
    
    initialize() {
        console.log("📍 BeeNavigationManager initialized");
        this.getCurrentPosition();
        this.watchPosition();
    }
    
    getCurrentPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    if (!this.startPosition) {
                        this.startPosition = { ...this.userPosition };
                    }
                    console.log("📍 GPS position found:", this.userPosition);
                },
                (error) => {
                    console.error("📍 GPS error:", error);
                    this.userPosition = BEE_CONFIG.FALLBACK_POSITION;
                    this.startPosition = { ...this.userPosition };
                },
                BEE_CONFIG.GPS_OPTIONS
            );
        }
    }
    
    watchPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    this.userPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                },
                (error) => console.error("📍 GPS watch error:", error),
                BEE_CONFIG.GPS_WATCH_OPTIONS
            );
        }
    }
    
    getUserPosition() {
        return this.userPosition;
    }
    
    getStartPosition() {
        return this.startPosition;
    }
    
    updateAll() {
        // Mock implementace
    }
    
    toggleNavigation() {
        document.getElementById('navContent').classList.toggle('open');
    }
    
    clearSelection() {
        this.selectedTargetId = null;
        document.getElementById('clearSelection').style.display = 'none';
    }
    
    handleGlobalClick(e) {
        const navPanel = document.querySelector('.navigation');
        if (!navPanel.contains(e.target)) {
            document.getElementById('navContent').classList.remove('open');
        }
    }
    
    getStatus() {
        return {
            userPosition: this.userPosition,
            startPosition: this.startPosition,
            selectedTarget: this.selectedTargetId
        };
    }
}

class BeeRotationManager {
    constructor(arManager) {
        this.arManager = arManager;
        this.modelRotationY = 30;
        this.isRotating = false;
        this.rotationHintShown = false;
    }
    
    initialize() {
        console.log("🔄 BeeRotationManager initialized");
    }
}

class BeeGamificationManager {
    constructor() {
        this.initialized = false;
    }
    
    initialize() {
        console.log("🎮 BeeGamificationManager initialized");
        this.initialized = true;
    }
    
    recordMarkerActivation(markerId) {
        console.log(`🏆 Recording activation: ${markerId}`);
    }
    
    pauseTracking() {
        console.log("⏸️ Gamification tracking paused");
    }
    
    resumeTracking() {
        console.log("▶️ Gamification tracking resumed");
    }
    
    finalize() {
        console.log("🏁 Gamification finalized");
    }
    
    getStatus() {
        return {
            initialized: this.initialized
        };
    }
}

class BeeTutorialManager {
    constructor() {
        this.initialized = false;
    }
    
    initialize() {
        console.log("🎓 BeeTutorialManager initialized");
        this.initialized = true;
    }
}

// Export pro globální použití
window.BeeApp = BeeApp;

// Debug funkce
window.getBeeAppStatus = function() {
    if (window.beeApp) {
        return window.beeApp.getStatus();
    }
    return "Bee App not initialized";
};

window.resetBeeApp = function() {
    if (window.beeApp) {
        window.beeApp.forceReset();
    }
};

console.log("🐝 BeeApp class loaded successfully!");