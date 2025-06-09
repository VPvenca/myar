/**
 * UNIVERSAL AR TUTORIAL SYSTEM
 * Konfigurovatelný tutoriálový systém pro jakoukoliv AR stezku
 */

class ARTutorial {
    constructor(config) {
        this.config = {
            storageKey: 'ar-tutorial-completed',
            autoStart: true,
            autoStartDelay: 1000,
            ...config
        };
        
        this.currentStep = 1;
        this.totalSteps = this.config.steps.length;
        this.isActive = false;
        
        this.init();
    }
    
    init() {
        this.createTutorialHTML();
        this.attachEventListeners();
        
        if (this.config.autoStart) {
            window.addEventListener('load', () => {
                setTimeout(() => this.start(), this.config.autoStartDelay);
            });
        }
    }
    
    createTutorialHTML() {
        // Create main overlay
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        overlay.id = 'tutorialOverlay';
        
        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'tutorial-backdrop';
        overlay.appendChild(backdrop);
        
        // Create steps
        this.config.steps.forEach((step, index) => {
            const stepElement = this.createStepElement(step, index + 1);
            overlay.appendChild(stepElement);
        });
        
        // Skip button
        const skipButton = document.createElement('button');
        skipButton.className = 'tutorial-skip';
        skipButton.textContent = 'Přeskočit ✕';
        skipButton.onclick = () => this.close();
        overlay.appendChild(skipButton);
        
        // Progress dots
        const progress = this.createProgressDots();
        overlay.appendChild(progress);
        
        document.body.appendChild(overlay);
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
            arrow.style.cssText = step.arrow.style;
            stepDiv.appendChild(arrow);
        }
        
        // Bubble
        const bubble = document.createElement('div');
        bubble.className = step.center ? 'tutorial-bubble-center' : 'tutorial-bubble';
        if (!step.center && step.bubble && step.bubble.style) {
            bubble.style.cssText = step.bubble.style;
        }
        
        // Content
        bubble.innerHTML = `
            <h3>${step.title}</h3>
            ${step.content}
            <button class="tutorial-next" onclick="arTutorial.next()">
                ${stepNumber === this.config.steps.length ? (step.finalButton || 'Začít!') : 'Pokračovat'}
            </button>
        `;
        
        stepDiv.appendChild(bubble);
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
        // Close on backdrop click (optional)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tutorial-backdrop')) {
                // this.close(); // Uncomment to enable backdrop close
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            
            if (e.key === 'Escape') {
                this.close();
            } else if (e.key === 'ArrowRight' || e.key === ' ') {
                this.next();
            } else if (e.key === 'ArrowLeft') {
                this.previous();
            }
        });
    }
    
    shouldShow() {
        const storageKey = `${this.config.storageKey}-${this.config.id || 'default'}`;
        return !localStorage.getItem(storageKey);
    }
    
    start() {
        if (!this.shouldShow()) {
            console.log('Tutorial already completed for this scene');
            return;
        }
        
        this.isActive = true;
        document.getElementById('tutorialOverlay').style.display = 'block';
        this.showStep(1);
        console.log('AR Tutorial started');
    }
    
    showStep(stepNumber) {
        // Hide all steps
        for (let i = 1; i <= this.totalSteps; i++) {
            const step = document.getElementById(`tutorialStep${i}`);
            if (step) step.style.display = 'none';
            
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
        }
        
        this.currentStep = stepNumber;
        
        // Call step callback if provided
        const stepConfig = this.config.steps[stepNumber - 1];
        if (stepConfig && stepConfig.onShow) {
            stepConfig.onShow();
        }
    }
    
    next() {
        if (this.currentStep < this.totalSteps) {
            this.showStep(this.currentStep + 1);
        } else {
            this.close();
        }
    }
    
    previous() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }
    
    close() {
        this.isActive = false;
        document.getElementById('tutorialOverlay').style.display = 'none';
        
        // Mark as completed
        const storageKey = `${this.config.storageKey}-${this.config.id || 'default'}`;
        localStorage.setItem(storageKey, 'true');
        
        console.log('Tutorial completed');
        
        // Call completion callback
        if (this.config.onComplete) {
            this.config.onComplete();
        }
    }
    
    reset() {
        const storageKey = `${this.config.storageKey}-${this.config.id || 'default'}`;
        localStorage.removeItem(storageKey);
        this.currentStep = 1;
        console.log('Tutorial reset');
    }
    
    // Static method to create tutorial with config
    static create(config) {
        return new ARTutorial(config);
    }
}

// Global instance holder
let arTutorial = null;