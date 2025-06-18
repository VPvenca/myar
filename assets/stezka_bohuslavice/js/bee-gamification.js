// === BEE-GAMIFICATION.JS - GAMIFIKAČNÍ SYSTÉM ===

class BeeGamificationManager {
    constructor() {
        this.initialized = false;
        this.trackingActive = false;
    }
    
    initialize() {
        console.log("🎮 Initializing Bee Gamification Manager...");
        
        // Čekej na načtení gamifikačních konfigurací
        this.waitForConfigurations().then(() => {
            this.initializeTracking();
        }).catch((error) => {
            console.error("❌ Gamification initialization failed:", error);
        });
    }
    
    async waitForConfigurations() {
        // Čekej na načtení všech gamifikačních skriptů
        let attempts = 0;
        const maxAttempts = 20; // 10 sekund čekání
        
        while (attempts < maxAttempts) {
            if (this.areConfigurationsLoaded()) {
                console.log("✅ Gamification configurations loaded");
                return true;
            }
            
            console.log(`⏳ Waiting for gamification config... (${attempts + 1}/${maxAttempts})`);
            await this.delay(500);
            attempts++;
        }
        
        throw new Error("Gamification configurations not loaded in time");
    }
    
    areConfigurationsLoaded() {
        return (
            typeof SCENE_CONFIG !== 'undefined' && 
            typeof ACHIEVEMENTS_CONFIG !== 'undefined' &&
            typeof EXPOSITION_REGISTRY !== 'undefined'
        );
    }
    
    initializeTracking() {
        console.log("📊 Scene config:", SCENE_CONFIG);
        console.log("🏆 Achievements config:", ACHIEVEMENTS_CONFIG);
        console.log("🏛️ Exposition registry:", EXPOSITION_REGISTRY);
        
        // Zkontroluj, že je expozice registrovaná
        if (EXPOSITION_REGISTRY && EXPOSITION_REGISTRY[BEE_CONFIG.EXPOSITION_ID]) {
            console.log("✅ Včelařská stezka exposition is registered");
        } else {
            console.warn("⚠️ Včelařská stezka exposition not found in registry");
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
        
        console.log("Available functions:");
        console.log("- initializeTimeTracking:", typeof initializeTimeTracking);
        console.log("- recordMarkerActivation:", typeof recordMarkerActivation);
        console.log("- unlockAchievement:", typeof unlockAchievement);
        console.log("- isAchievementUnlocked:", typeof isAchievementUnlocked);
        
        console.log("Configurations:");
        console.log("- SCENE_CONFIG:", typeof SCENE_CONFIG !== 'undefined');
        console.log("- ACHIEVEMENTS_CONFIG:", typeof ACHIEVEMENTS_CONFIG !== 'undefined');
        console.log("- EXPOSITION_REGISTRY:", typeof EXPOSITION_REGISTRY !== 'undefined');
        
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