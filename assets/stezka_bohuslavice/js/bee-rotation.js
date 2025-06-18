// === BEE-ROTATION.JS - TOUCH ROTACE MODELŮ ===

class BeeRotationManager {
    constructor(arManager) {
        this.arManager = arManager;
        this.modelRotationY = 30;
        this.isRotating = false;
        this.startX = 0;
        this.rotationHintShown = false;
        this.touchStarted = false;
        this.rotationActive = false;
        this.rotationHintElement = null;
    }
    
    initialize() {
        console.log("🔄 Initializing Bee Rotation Manager...");
        this.rotationHintElement = document.getElementById('rotationHint');
        this.setupEventListeners();
        console.log("✅ Bee Rotation Manager initialized");
    }
    
    setupEventListeners() {
        // Touch events
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        document.addEventListener('touchend', () => this.handleTouchEnd(), { passive: false });
        
        // Mouse events
        document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', () => this.handleMouseUp());
        
        console.log("🔄 Rotation event listeners setup complete");
    }
    
    handleTouchStart(event) {
        if (this.isTouchingUI(event.target)) {
            return;
        }
        
        if (!this.isAnyModelVisible()) {
            return;
        }
        
        this.touchStarted = true;
        this.rotationActive = true;
        this.isRotating = true;
        this.startX = event.touches[0].clientX;
        
        this.showRotationHintOnce();
        event.preventDefault();
        
        console.log("🔄 Touch rotation started");
    }
    
    handleTouchMove(event) {
        if (!this.isRotating || !this.touchStarted || !this.rotationActive) {
            return;
        }
        
        const currentX = event.touches[0].clientX;
        const deltaX = currentX - this.startX;
        
        this.modelRotationY += deltaX * 0.3;
        this.updateModelRotation();
        
        this.startX = currentX;
        event.preventDefault();
    }
    
    handleTouchEnd() {
        this.isRotating = false;
        this.touchStarted = false;
        this.rotationActive = false;
        
        if (this.isRotating) {
            console.log("🔄 Touch rotation ended");
        }
    }
    
    handleMouseDown(event) {
        if (this.isTouchingUI(event.target)) {
            return;
        }
        
        if (!this.isAnyModelVisible()) {
            return;
        }
        
        this.rotationActive = true;
        this.isRotating = true;
        this.startX = event.clientX;
        
        this.showRotationHintOnce();
        event.preventDefault();
        
        console.log("🔄 Mouse rotation started");
    }
    
    handleMouseMove(event) {
        if (!this.isRotating || !this.rotationActive) {
            return;
        }
        
        const deltaX = event.clientX - this.startX;
        
        this.modelRotationY += deltaX * 0.3;
        this.updateModelRotation();
        
        this.startX = event.clientX;
        event.preventDefault();
    }
    
    handleMouseUp() {
        this.isRotating = false;
        this.rotationActive = false;
        
        if (this.isRotating) {
            console.log("🔄 Mouse rotation ended");
        }
    }
    
    updateModelRotation() {
        if (!this.arManager) {
            console.warn("🔄 AR Manager not available for rotation update");
            return;
        }
        
        // Deleguj rotaci na AR Manager
        this.arManager.updateModelRotation(this.modelRotationY);
        
        // Normalizuj rotaci (0-360 stupňů)
        if (this.modelRotationY > 360) {
            this.modelRotationY -= 360;
        } else if (this.modelRotationY < 0) {
            this.modelRotationY += 360;
        }
    }
    
    isAnyModelVisible() {
        if (!this.arManager) {
            return false;
        }
        
        return this.arManager.isAnyModelVisible();
    }
    
    isTouchingUI(target) {
        const uiSelectors = [
            '.back-button',
            '.navigation', 
            '.nav-toggle',
            '.nav-content',
            '.target-item',
            '.distance-info',
            '.audio-info',
            '.rotation-hint',
            '.bee-quiz'
        ];
        
        for (let selector of uiSelectors) {
            const element = document.querySelector(selector);
            if (element && (element === target || element.contains(target))) {
                return true;
            }
        }
        
        return false;
    }
    
    showRotationHintOnce() {
        if (this.rotationHintShown || !this.rotationHintElement) {
            return;
        }
        
        this.rotationHintShown = true;
        this.rotationHintElement.style.display = 'block';
        
        setTimeout(() => {
            if (this.rotationHintElement) {
                this.rotationHintElement.style.display = 'none';
            }
        }, 3000);
        
        console.log("🔄 Rotation hint shown");
    }
    
    // Metody pro manuální kontrolu rotace
    setRotation(degrees) {
        this.modelRotationY = degrees;
        this.updateModelRotation();
        console.log(`🔄 Rotation set to: ${degrees}°`);
    }
    
    getRotation() {
        return this.modelRotationY;
    }
    
    rotateBy(degrees) {
        this.modelRotationY += degrees;
        this.updateModelRotation();
        console.log(`🔄 Rotated by: ${degrees}°, new rotation: ${this.modelRotationY}°`);
    }
    
    resetRotation() {
        this.modelRotationY = 30; // Výchozí rotace
        this.updateModelRotation();
        console.log("🔄 Rotation reset to default (30°)");
    }
    
    // Metody pro ovládání sensitivity
    setSensitivity(factor) {
        this.rotationSensitivity = Math.max(0.1, Math.min(2.0, factor));
        console.log(`🔄 Rotation sensitivity set to: ${this.rotationSensitivity}`);
    }
    
    getSensitivity() {
        return this.rotationSensitivity || 0.3;
    }
    
    getStatus() {
        return {
            isRotating: this.isRotating,
            currentRotation: this.modelRotationY,
            hintShown: this.rotationHintShown,
            modelsVisible: this.isAnyModelVisible(),
            sensitivity: this.getSensitivity()
        };
    }
    
    // Debug metody
    debugRotation() {
        console.log("=== ROTATION DEBUG ===");
        console.log("Current rotation:", this.modelRotationY);
        console.log("Is rotating:", this.isRotating);
        console.log("Touch started:", this.touchStarted);
        console.log("Rotation active:", this.rotationActive);
        console.log("Models visible:", this.isAnyModelVisible());
        console.log("Hint shown:", this.rotationHintShown);
        console.log("======================");
    }
    
    // Test rotace
    testRotation(duration = 3000) {
        console.log("🔄 Starting rotation test...");
        const startRotation = this.modelRotationY;
        const rotationSpeed = 360 / (duration / 100); // stupňů za 100ms
        
        const interval = setInterval(() => {
            this.rotateBy(rotationSpeed);
        }, 100);
        
        setTimeout(() => {
            clearInterval(interval);
            this.setRotation(startRotation);
            console.log("🔄 Rotation test completed");
        }, duration);
    }
    
    // Cleanup
    cleanup() {
        console.log("🧹 Cleaning up rotation manager...");
        
        // Odstraň event listenery (pokud by bylo potřeba)
        // V tomto případě jsou event listenery na document, takže je necháme
        
        this.isRotating = false;
        this.touchStarted = false;
        this.rotationActive = false;
    }
}