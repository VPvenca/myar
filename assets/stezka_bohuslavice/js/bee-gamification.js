// === BEE-GAMIFICATION.JS - GAMIFIKAČNÍ SYSTÉM ===

class BeeGamificationManager {
    constructor() {
        this.initialized = false;
        this.trackingActive = false;
        this.maxWaitTime = 15000; // 15 sekund maximální čekání
    }
    
    initialize() {
        console.log("🎮 Initializing Bee Gamification Manager...");
        
        // Čekej na načtení gamifikačních konfigurací s delším timeoutem
        this.waitForConfigurations().then(() => {
            this.initializeTracking();
        }).catch((error) => {
            console.warn("⚠️ Gamification initialization failed:", error.message);
            console.log("🎮 Continuing without gamification features");
            // Nepřerušuj aplikaci, jen pokračuj bez gamifikace
        });
    }
    
    async waitForConfigurations() {
        console.log("⏳ Waiting for gamification configurations...");
        
        const startTime = Date.now();
        
        while (Date.now() - startTime < this.maxWaitTime) {
            if (this.areConfigurationsLoaded()) {
                console.log("✅ Gamification configurations loaded");
                await this.delay(500); // Dodatečné čekání pro jistotu
                return true;
            }
            
            const elapsed = Date.now() - startTime;
            if (elapsed % 2000 === 0) { // Log každé 2 sekundy
                console.log(`⏳ Still waiting for gamification config... (${Math.round(elapsed/1000)}s)`);
                this.debugConfigurationState();
            }
            
            await this.delay(500);
        }
        
        throw new Error("Gamification configurations not loaded in time");
    }
    
    areConfigurationsLoaded() {
        const hasSceneConfig = typeof SCENE_CONFIG !== 'undefined';
        const hasAchievements = typeof ACHIEVEMENTS_CONFIG !== 'undefined';
        const hasRegistry = typeof EXPOSITION_REGISTRY !== 'undefined';
        const hasExposition = hasRegistry && EXPOSITION_REGISTRY && EXPOSITION_REGISTRY[BEE_CONFIG.EXPOSITION_ID];
        
        return hasSceneConfig && hasAchievements && hasRegistry && hasExposition;
    }
    
    debugConfigurationState() {
        console.log("🔍 Configuration state check:");
        console.log("- SCENE_CONFIG:", typeof SCENE_CONFIG !== 'undefined');
        console.log("- ACHIEVEMENTS_CONFIG:", typeof ACHIEVEMENTS_CONFIG !== 'undefined');
        console.log("- EXPOSITION_REGISTRY:", typeof EXPOSITION_REGISTRY !== 'undefined');
        
        if (typeof EXPOSITION_REGISTRY !== 'undefined' && EXPOSITION_REGISTRY) {
            console.log("- Available expositions:", Object.keys(EXPOSITION_REGISTRY));
            console.log("- Looking for:", BEE_CONFIG.EXPOSITION_ID);
            console.log("- Found:", !!EXPOSITION_REGISTRY[BEE_CONFIG.EXPOSITION_ID]);
        }
    }
    
    initializeTracking() {
        console.log("📊 Scene config:", SCENE_CONFIG);
        console.log("🏆 Achievements config:", ACHIEVEMENTS_CONFIG);
        console.log("🏛️ Exposition registry:", EXPOSITION_REGISTRY);
        
        // Zkontroluj, že je expozice registrovaná
        if (EXPOSITION_REGISTRY && EXPOSITION_REGISTRY[BEE_CONFIG.EXPOSITION_ID]) {
            console.log("✅ Včelařská stezka exposition is registered");
        } else {
            console.error("❌ Včelařská stezka exposition not found in registry");
            this.debugConfigurationState();
            throw new Error("Exposition not registered");
        }
        
        // Inicializuj time tracking
        if (typeof initializeTimeTracking === 'function') {
            initializeTimeTracking(BEE_CONFIG.EXPOSITION_ID, BEE_CONFIG.SCENE_ID);
            console.log("⏱️ Time tracking initialized");
            this.trackingActive = true;
        } else {
            console.error("❌ initializeTimeTracking function not found");
        }
        
        this.initialized = true;
        console.log("✅ Gamification initialized successfully for včelařská stezka");
    }
    
    recordMarkerActivation(markerId) {
        if (!this.initialized) {
            console.warn("⚠️ Gamification not initialized yet, skipping marker activation");
            return false;
        }
        
        console.log(`🐝 Recording bee marker activation: ${markerId} in exposition ${BEE_CONFIG.EXPOSITION_ID}, scene ${BEE_CONFIG.SCENE_ID}`);
        
        if (typeof recordMarkerActivation === 'function') {
            recordMarkerActivation(BEE_CONFIG.EXPOSITION_ID, BEE_CONFIG.SCENE_ID, markerId);
            console.log(`✅ Marker activation recorded: ${markerId}`);
            return true;
        } else {
            console.error("❌ recordMarkerActivation function not found");
            return false;
        }
    }
    
    pauseTracking() {
        if (!this.trackingActive) return;
        
        if (typeof pauseTimeTracking === 'function') {
            pauseTimeTracking();
            console.log("⏸️ Gamification tracking paused");
        }
    }
    
    resumeTracking() {
        if (!this.trackingActive) return;
        
        if (typeof resumeTimeTracking === 'function') {
            resumeTimeTracking();
            console.log("▶️ Gamification tracking resumed");
        }
    }
    
    finalize() {
        if (!this.trackingActive) return;
        
        if (typeof finalizeTimeTracking === 'function') {
            finalizeTimeTracking(BEE_CONFIG.EXPOSITION_ID, BEE_CONFIG.SCENE_ID);
            console.log("🏁 Gamification finalized");
        }
        
        this.trackingActive = false;
    }
    
    // Metody pro správu achievementů
    unlockAchievement(achievementId) {
        if (!this.initialized) {
            console.warn("⚠️ Cannot unlock achievement - gamification not initialized");
            return false;
        }
        
        if (typeof unlockAchievement === 'function') {
            const result = unlockAchievement(achievementId);
            console.log(`🏆 Achievement unlock attempt: ${achievementId}, result: ${result}`);
            return result;
        } else {
            console.error("❌ unlockAchievement function not found");
            return false;
        }
    }
    
    isAchievementUnlocked(achievementId) {
        if (typeof isAchievementUnlocked === 'function') {
            return isAchievementUnlocked(achievementId);
        }
        return false;
    }
    
    getAchievementProgress(achievementId) {
        if (typeof getAchievementProgress === 'function') {
            return getAchievementProgress(achievementId);
        }
        return null;
    }
    
    // Statistiky a progress
    getTimeSpent() {
        if (typeof getTimeSpent === 'function') {
            return getTimeSpent(BEE_CONFIG.EXPOSITION_ID, BEE_CONFIG.SCENE_ID);
        }
        return 0;
    }
    
    getMarkersActivated() {
        if (typeof getMarkersActivated === 'function') {
            return getMarkersActivated(BEE_CONFIG.EXPOSITION_ID, BEE_CONFIG.SCENE_ID);
        }
        return [];
    }
    
    getVisitCount() {
        if (typeof getVisitCount === 'function') {
            return getVisitCount(BEE_CONFIG.EXPOSITION_ID, BEE_CONFIG.SCENE_ID);
        }
        return 0;
    }
    
    // Komplexní status
    getDetailedStatus() {
        return {
            initialized: this.initialized,
            trackingActive: this.trackingActive,
            expositionId: BEE_CONFIG.EXPOSITION_ID,
            sceneId: BEE_CONFIG.SCENE_ID,
            timeSpent: this.getTimeSpent(),
            markersActivated: this.getMarkersActivated(),
            visitCount: this.getVisitCount(),
            achievements: {
                quizMaster: this.isAchievementUnlocked(BEE_CONFIG.QUIZ_ACHIEVEMENT_ID),
                // Další achievementy podle potřeby
            }
        };
    }
    
    getStatus() {
        return {
            initialized: this.initialized,
            trackingActive: this.trackingActive,
            expositionId: BEE_CONFIG.EXPOSITION_ID,
            sceneId: BEE_CONFIG.SCENE_ID
        };
    }
    
    // Debug metody
    debugGamification() {
        console.log("=== GAMIFICATION DEBUG ===");
        console.log("Initialized:", this.initialized);
        console.log("Tracking active:", this.trackingActive);
        console.log("Exposition ID:", BEE_CONFIG.EXPOSITION_ID);
        console.log("Scene ID:", BEE_CONFIG.SCENE_ID);
        
        if (this.initialized) {
            console.log("Time spent:", this.getTimeSpent());
            console.log("Markers activated:", this.getMarkersActivated());
            console.log("Visit count:", this.getVisitCount());
        }
        
        this.debugConfigurationState();
        
        console.log("Available functions:");
        console.log("- initializeTimeTracking:", typeof initializeTimeTracking);
        console.log("- recordMarkerActivation:", typeof recordMarkerActivation);
        console.log("- unlockAchievement:", typeof unlockAchievement);
        console.log("- isAchievementUnlocked:", typeof isAchievementUnlocked);
        
        console.log("===========================");
    }
    
    // Testovací metody
    testAchievement(achievementId) {
        console.log(`🧪 Testing achievement: ${achievementId}`);
        
        const isUnlocked = this.isAchievementUnlocked(achievementId);
        console.log(`Current state: ${isUnlocked ? 'unlocked' : 'locked'}`);
        
        if (!isUnlocked) {
            const result = this.unlockAchievement(achievementId);
            console.log(`Unlock attempt result: ${result}`);
        }
        
        return this.isAchievementUnlocked(achievementId);
    }
    
    simulateMarkerActivations() {
        console.log("🧪 Simulating all marker activations...");
        
        BEE_CONFIG.MARKERS.forEach((marker, index) => {
            setTimeout(() => {
                this.recordMarkerActivation(marker.id);
            }, index * 1000); // 1 sekunda mezi aktivacemi
        });
    }
    
    // Utility metody
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Cleanup
    cleanup() {
        console.log("🧹 Cleaning up gamification manager...");
        this.finalize();
        this.initialized = false;
        this.trackingActive = false;
    }
}