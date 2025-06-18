// === BEE-TUTORIAL.JS - TUTORIAL SYSTÉM ===

class BeeTutorialManager {
    constructor() {
        this.initialized = false;
        this.tutorialInstance = null;
        this.configLoaded = false;
    }
    
    initialize() {
        console.log("🎓 Initializing Bee Tutorial Manager...");
        
        // Spusť tutorial s časovým zpožděním
        setTimeout(async () => {
            await this.loadAndStartTutorial();
        }, 3000); // 3 sekundy po načtení A-Frame
    }
    
    async loadAndStartTutorial() {
        try {
            console.log("🎓 Loading tutorial config for bees...");
            
            // Dynamicky načti config
            const success = await this.loadTutorialConfig();
            
            if (success) {
                await this.createTutorialInstance();
                this.startTutorial();
            } else {
                console.warn("⚠️ Tutorial config failed to load");
            }
            
        } catch (error) {
            console.error("❌ Tutorial initialization failed:", error);
        }
    }
    
    loadTutorialConfig() {
        return new Promise((resolve, reject) => {
            if (this.configLoaded) {
                resolve(true);
                return;
            }
            
            const script = document.createElement('script');
            script.src = BEE_CONFIG.TUTORIAL_CONFIG_PATH;
            
            script.onload = () => {
                console.log("✅ Tutorial config script loaded");
                this.configLoaded = true;
                
                // Počkej chvilku na vykonání scriptu
                setTimeout(() => {
                    resolve(true);
                }, 200);
            };
            
            script.onerror = () => {
                console.error("❌ Failed to load tutorial config script");
                reject(new Error("Tutorial config script load failed"));
            };
            
            document.head.appendChild(script);
        });
    }
    
    async createTutorialInstance() {
        // Počkej na dostupnost tutorial systému
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
            if (this.isTutorialSystemAvailable()) {
                console.log("✅ Tutorial system available, creating instance...");
                
                try {
                    this.tutorialInstance = ARTutorial.create(tutorialConfig);
                    this.initialized = true;
                    console.log("✅ Tutorial instance created successfully");
                    return true;
                } catch (error) {
                    console.error("❌ Failed to create tutorial instance:", error);
                    return false;
                }
            }
            
            console.log(`⏳ Waiting for tutorial system... (${attempts + 1}/${maxAttempts})`);
            await this.delay(200);
            attempts++;
        }
        
        console.error("❌ Tutorial system not available after waiting");
        return false;
    }
    
    isTutorialSystemAvailable() {
        return (
            typeof ARTutorial !== 'undefined' && 
            typeof tutorialConfig !== 'undefined' &&
            ARTutorial.create
        );
    }
    
    startTutorial() {
        if (!this.initialized || !this.tutorialInstance) {
            console.warn("⚠️ Cannot start tutorial - not initialized");
            return false;
        }
        
        try {
            console.log("🎓 Starting bee tutorial...");
            this.tutorialInstance.start();
            return true;
        } catch (error) {
            console.error("❌ Failed to start tutorial:", error);
            return false;
        }
    }
    
    stopTutorial() {
        if (!this.tutorialInstance) {
            console.warn("⚠️ No tutorial instance to stop");
            return false;
        }
        
        try {
            if (typeof this.tutorialInstance.stop === 'function') {
                this.tutorialInstance.stop();
                console.log("🎓 Tutorial stopped");
                return true;
            } else {
                console.warn("⚠️ Tutorial instance doesn't have stop method");
                return false;
            }
        } catch (error) {
            console.error("❌ Failed to stop tutorial:", error);
            return false;
        }
    }
    
    pauseTutorial() {
        if (!this.tutorialInstance) {
            console.warn("⚠️ No tutorial instance to pause");
            return false;
        }
        
        try {
            if (typeof this.tutorialInstance.pause === 'function') {
                this.tutorialInstance.pause();
                console.log("⏸️ Tutorial paused");
                return true;
            } else {
                console.warn("⚠️ Tutorial instance doesn't have pause method");
                return false;
            }
        } catch (error) {
            console.error("❌ Failed to pause tutorial:", error);
            return false;
        }
    }
    
    resumeTutorial() {
        if (!this.tutorialInstance) {
            console.warn("⚠️ No tutorial instance to resume");
            return false;
        }
        
        try {
            if (typeof this.tutorialInstance.resume === 'function') {
                this.tutorialInstance.resume();
                console.log("▶️ Tutorial resumed");
                return true;
            } else {
                console.warn("⚠️ Tutorial instance doesn't have resume method");
                return false;
            }
        } catch (error) {
            console.error("❌ Failed to resume tutorial:", error);
            return false;
        }
    }
    
    restartTutorial() {
        console.log("🔄 Restarting tutorial...");
        
        this.stopTutorial();
        
        setTimeout(() => {
            this.startTutorial();
        }, 1000);
    }
    
    // Metody pro získání stavu tutorialu
    isTutorialActive() {
        if (!this.tutorialInstance) return false;
        
        if (typeof this.tutorialInstance.isActive === 'function') {
            return this.tutorialInstance.isActive();
        }
        
        return false;
    }
    
    getTutorialProgress() {
        if (!this.tutorialInstance) return null;
        
        if (typeof this.tutorialInstance.getProgress === 'function') {
            return this.tutorialInstance.getProgress();
        }
        
        return null;
    }
    
    getCurrentStep() {
        if (!this.tutorialInstance) return null;
        
        if (typeof this.tutorialInstance.getCurrentStep === 'function') {
            return this.tutorialInstance.getCurrentStep();
        }
        
        return null;
    }
    
    getStatus() {
        return {
            initialized: this.initialized,
            configLoaded: this.configLoaded,
            hasInstance: !!this.tutorialInstance,
            isActive: this.isTutorialActive(),
            currentStep: this.getCurrentStep(),
            progress: this.getTutorialProgress()
        };
    }
    
    // Debug metody
    debugTutorial() {
        console.log("=== TUTORIAL DEBUG ===");
        console.log("Initialized:", this.initialized);
        console.log("Config loaded:", this.configLoaded);
        console.log("Has instance:", !!this.tutorialInstance);
        console.log("Config path:", BEE_CONFIG.TUTORIAL_CONFIG_PATH);
        
        console.log("Available objects:");
        console.log("- ARTutorial:", typeof ARTutorial);
        console.log("- tutorialConfig:", typeof tutorialConfig);
        
        if (this.tutorialInstance) {
            console.log("Tutorial instance methods:");
            console.log("- start:", typeof this.tutorialInstance.start);
            console.log("- stop:", typeof this.tutorialInstance.stop);
            console.log("- pause:", typeof this.tutorialInstance.pause);
            console.log("- resume:", typeof this.tutorialInstance.resume);
            console.log("- isActive:", typeof this.tutorialInstance.isActive);
            console.log("- getProgress:", typeof this.tutorialInstance.getProgress);
        }
        
        console.log("=======================");
    }
    
    // Test metody
    testTutorialSystem() {
        console.log("🧪 Testing tutorial system...");
        
        console.log("System availability:", this.isTutorialSystemAvailable());
        console.log("Config loaded:", this.configLoaded);
        console.log("Instance available:", !!this.tutorialInstance);
        
        if (this.tutorialInstance) {
            console.log("Current status:", this.getStatus());
        }
    }
    
    // Utility metody
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Event handlers pro tutorial události
    onTutorialStart() {
        console.log("🎓 Tutorial started event");
    }
    
    onTutorialComplete() {
        console.log("🎓 Tutorial completed event");
    }
    
    onTutorialSkip() {
        console.log("🎓 Tutorial skipped event");
    }
    
    onStepChange(stepNumber) {
        console.log(`🎓 Tutorial step changed to: ${stepNumber}`);
    }
    
    // Cleanup
    cleanup() {
        console.log("🧹 Cleaning up tutorial manager...");
        
        if (this.tutorialInstance) {
            this.stopTutorial();
            this.tutorialInstance = null;
        }
        
        this.initialized = false;
        this.configLoaded = false;
    }
}