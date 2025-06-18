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
console.log("- testBeeFeatures() - test funkcí");