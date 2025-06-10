/**
 * UNIVERSAL AR TUTORIAL SYSTEM - FIXED VERSION
 * Konfigurovatelný tutoriálový systém pro jakoukoliv AR stezku
 * 
 * Opravené verze:
 * - Event listenery místo onclick
 * - Lepší error handling
 * - Robustnější DOM manipulace
 */

class ARTutorial {
    constructor(config) {
        console.log("🎓 ARTutorial constructor called with config:", config);
        
        this.config = {
            storageKey: 'ar-tutorial-completed',
            autoStart: false, // Změněno na false pro manuální spuštění
            autoStartDelay: 1000,
            ...config
        };
        
        this.currentStep = 1;
        this.totalSteps = this.config.steps ? this.config.steps.length : 0;
        this.isActive = false;
        this.tutorialElement = null;
        
        console.log(`🎓 Tutorial initialized with ${this.totalSteps} steps`);
        
        // Inicializuj hned
        this.init();
    }
    
    init() {
        console.log("🎓 Initializing tutorial...");
        
        try {
            this.createTutorialHTML();
            this.attachEventListeners();
            console.log("✅ Tutorial HTML and events created successfully");
            
            // Autostart pokud je povolený
            if (this.config.autoStart) {
                if (document.readyState === 'loading') {
                    window.addEventListener('load', () => {
                        setTimeout(() => this.start(), this.config.autoStartDelay);
                    });
                } else {
                    setTimeout(() => this.start(), this.config.autoStartDelay);
                }
            }
        } catch (error) {
            console.error("❌ Tutorial initialization failed:", error);
        }
    }
    
    createTutorialHTML() {
        console.log("🎓 Creating tutorial HTML...");
        
        // Odstraň existující tutorial pokud existuje
        const existingTutorial = document.getElementById('tutorialOverlay');
        if (existingTutorial) {
            existingTutorial.remove();
        }
        
        // Create main overlay
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        overlay.id = 'tutorialOverlay';
        overlay.style.display = 'none';
        
        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'tutorial-backdrop';
        overlay.appendChild(backdrop);
        
        // Create steps
        if (this.config.steps && this.config.steps.length > 0) {
            this.config.steps.forEach((step, index) => {
                const stepElement = this.createStepElement(step, index + 1);
                overlay.appendChild(stepElement);
            });
        } else {
            console.error("❌ No steps defined in tutorial config!");
            return;
        }
        
        // Skip button
        const skipButton = document.createElement('button');
        skipButton.className = 'tutorial-skip';
        skipButton.textContent = 'Přeskočit ✕';
        skipButton.addEventListener('click', () => this.close());
        overlay.appendChild(skipButton);
        
        // Progress dots
        const progress = this.createProgressDots();
        overlay.appendChild(progress);
        
        // Append to body
        document.body.appendChild(overlay);
        this.tutorialElement = overlay;
        
        console.log(`✅ Tutorial HTML created with ${this.config.steps.length} steps`);
    }
    
    createStepElement(step, stepNumber) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'tutorial-step';
        stepDiv.id = `tutorialStep${stepNumber}`;
        stepDiv.setAttribute('data-step', stepNumber);
        stepDiv.style.display = 'none';
        
        // Arrow
        if (step.arrow) {
            const arrow = document.createElement('div');
            arrow.className = `tutorial-arrow tutorial-arrow-${step.arrow.direction}`;
            if (step.arrow.style) {
                arrow.style.cssText = step.arrow.style;
            }
            stepDiv.appendChild(arrow);
        }
        
        // Bubble
        const bubble = document.createElement('div');
        bubble.className = step.center ? 'tutorial-bubble-center' : 'tutorial-bubble';
        if (!step.center && step.bubble && step.bubble.style) {
            bubble.style.cssText = step.bubble.style;
        }
        
        // Title
        const title = document.createElement('h3');
        title.innerHTML = step.title;
        bubble.appendChild(title);
        
        // Content
        const content = document.createElement('div');
        content.innerHTML = step.content;
        bubble.appendChild(content);
        
        // Button
        const nextButton = document.createElement('button');
        nextButton.className = 'tutorial-next';
        nextButton.textContent = stepNumber === this.totalSteps ? (step.finalButton || 'Začít!') : 'Pokračovat';
        
        // OPRAVENO: Event listener místo onclick
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`🎓 Button clicked for step ${stepNumber}`);
            this.next();
        });
        
        bubble.appendChild(nextButton);
        stepDiv.appendChild(bubble);
        
        console.log(`✅ Step ${stepNumber} element created: ${step.title}`);
        return stepDiv;
    }
    
    createProgressDots() {
        const progress = document.createElement('div');
        progress.className = 'tutorial-progress';
        
        for (let i = 1; i <= this.totalSteps; i++) {
            const dot = document.createElement('div');
            dot.className = 'tutorial-dot';
            dot.id = `tutorialDot${i}`;
            progress.appendChild(dot);
        }
        
        return progress;
    }
    
    attachEventListeners() {
        console.log("🎓 Attaching event listeners...");
        
        // Keyboard navigation
        this.keyboardHandler = (e) => {
            if (!this.isActive) return;
            
            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    this.next();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previous();
                    break;
            }
        };
        
        document.addEventListener('keydown', this.keyboardHandler);
        
        // Backdrop click (optional)
        this.backdropHandler = (e) => {
            if (e.target.classList.contains('tutorial-backdrop')) {
                // this.close(); // Uncomment to enable backdrop close
            }
        };
        
        document.addEventListener('click', this.backdropHandler);
        
        console.log("✅ Event listeners attached");
    }
    
    removeEventListeners() {
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }
        if (this.backdropHandler) {
            document.removeEventListener('click', this.backdropHandler);
        }
    }
    
    shouldShow() {
        const storageKey = `${this.config.storageKey}-${this.config.id || 'default'}`;
        const completed = localStorage.getItem(storageKey);
        console.log(`🎓 Checking if tutorial should show - storage key: ${storageKey}, completed: ${completed}`);
        return !completed;
    }
    
    start() {
        console.log("🎓 Starting tutorial...");
        
        if (!this.shouldShow()) {
            console.log('📝 Tutorial already completed for this scene');
            return false;
        }
        
        if (!this.tutorialElement) {
            console.error("❌ Tutorial element not created!");
            return false;
        }
        
        this.isActive = true;
        this.tutorialElement.style.display = 'block';
        this.showStep(1);
        
        console.log('✅ AR Tutorial started successfully');
        return true;
    }
    
    showStep(stepNumber) {
        console.log(`🎓 Showing step ${stepNumber}/${this.totalSteps}`);
        
        if (stepNumber < 1 || stepNumber > this.totalSteps) {
            console.error(`❌ Invalid step number: ${stepNumber}`);
            return;
        }
        
        // Hide all steps
        for (let i = 1; i <= this.totalSteps; i++) {
            const step = document.getElementById(`tutorialStep${i}`);
            if (step) {
                step.style.display = 'none';
            }
            
            // Update progress dots
            const dot = document.getElementById(`tutorialDot${i}`);
            if (dot) {
                dot.classList.remove('active', 'completed');
                if (i < stepNumber) {
                    dot.classList.add('completed');
                } else if (i === stepNumber) {
                    dot.classList.add('active');
                }
            }
        }
        
        // Show current step
        const currentStepElement = document.getElementById(`tutorialStep${stepNumber}`);
        if (currentStepElement) {
            currentStepElement.style.display = 'block';
            console.log(`✅ Step ${stepNumber} displayed`);
        } else {
            console.error(`❌ Step element not found: tutorialStep${stepNumber}`);
        }
        
        this.currentStep = stepNumber;
        
        // Call step callback if provided
        const stepConfig = this.config.steps[stepNumber - 1];
        if (stepConfig && stepConfig.onShow) {
            try {
                stepConfig.onShow();
            } catch (error) {
                console.error("❌ Step onShow callback failed:", error);
            }
        }
    }
    
    next() {
        console.log(`🎓 Next button clicked - current step: ${this.currentStep}/${this.totalSteps}`);
        
        if (this.currentStep < this.totalSteps) {
            this.showStep(this.currentStep + 1);
        } else {
            console.log("🎓 Last step reached - closing tutorial");
            this.close();
        }
    }
    
    previous() {
        console.log(`🎓 Previous - current step: ${this.currentStep}`);
        
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }
    
    close() {
        console.log("🎓 Closing tutorial...");
        
        this.isActive = false;
        
        if (this.tutorialElement) {
            this.tutorialElement.style.display = 'none';
        }
        
        // Mark as completed
        const storageKey = `${this.config.storageKey}-${this.config.id || 'default'}`;
        localStorage.setItem(storageKey, 'true');
        console.log(`✅ Tutorial marked as completed: ${storageKey}`);
        
        // Call completion callback
        if (this.config.onComplete) {
            try {
                this.config.onComplete();
                console.log("✅ Tutorial completion callback executed");
            } catch (error) {
                console.error("❌ Tutorial completion callback failed:", error);
            }
        }
        
        // Remove event listeners
        this.removeEventListeners();
        
        console.log('✅ Tutorial closed successfully');
    }
    
    reset() {
        console.log("🔄 Resetting tutorial...");
        
        const storageKey = `${this.config.storageKey}-${this.config.id || 'default'}`;
        localStorage.removeItem(storageKey);
        this.currentStep = 1;
        this.isActive = false;
        
        if (this.tutorialElement) {
            this.tutorialElement.style.display = 'none';
        }
        
        console.log('✅ Tutorial reset successfully');
    }
    
    // Destroy tutorial completely
    destroy() {
        console.log("🗑️ Destroying tutorial...");
        
        this.removeEventListeners();
        
        if (this.tutorialElement && this.tutorialElement.parentNode) {
            this.tutorialElement.parentNode.removeChild(this.tutorialElement);
        }
        
        this.tutorialElement = null;
        this.isActive = false;
        
        console.log("✅ Tutorial destroyed");
    }
    
    // Static method to create tutorial with config
    static create(config) {
        console.log("🏭 ARTutorial.create() called with config:", config);
        
        try {
            const tutorial = new ARTutorial(config);
            console.log("✅ ARTutorial instance created successfully");
            return tutorial;
        } catch (error) {
            console.error("❌ ARTutorial.create() failed:", error);
            throw error;
        }
    }
}

// Debugging functions
window.debugTutorial = function() {
    console.log("🔧 TUTORIAL DEBUG INFO:");
    console.log("- window.arTutorial:", typeof window.arTutorial);
    console.log("- ARTutorial class:", typeof ARTutorial);
    
    if (window.arTutorial) {
        console.log("- isActive:", window.arTutorial.isActive);
        console.log("- currentStep:", window.arTutorial.currentStep);
        console.log("- totalSteps:", window.arTutorial.totalSteps);
        console.log("- tutorialElement:", window.arTutorial.tutorialElement);
    }
    
    const tutorialOverlay = document.getElementById('tutorialOverlay');
    console.log("- tutorialOverlay element:", tutorialOverlay);
    console.log("- tutorialOverlay display:", tutorialOverlay ? tutorialOverlay.style.display : 'not found');
};

window.forceTutorial = function() {
    console.log("🔧 FORCING TUTORIAL START...");
    if (window.arTutorial) {
        window.arTutorial.reset();
        window.arTutorial.start();
    } else {
        console.error("❌ No tutorial instance found!");
    }
};

// Global instance holder
let arTutorial = null;

console.log("✅ ARTutorial class loaded successfully");