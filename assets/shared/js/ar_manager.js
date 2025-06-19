/* ======================================
   AR MANAGER - AR objekty a 3D rotace
   Sdílený modul pro všechny AR stezky
   ====================================== */

// === GLOBÁLNÍ PROMĚNNÉ ===
const arObjectDefinitions = new Map();
const activeArObjects = new Set();

// Rotace proměnné
let modelRotationY = 30;
let isRotating = false;
let startX = 0;
let rotationHintShown = false;

// === AR OBJEKTY MANAGEMENT ===

/**
 * Inicializuje prázdnou AR scénu a připraví definice objektů
 * @param {Array} markers - Array markerů s definicemi objektů
 * @param {Function} getGLBModelCallback - Funkce pro získání GLB modelu podle ID
 * @param {Function} getScaleCallback - Funkce pro získání scale podle ID
 */
function initializeARScene(markers, getGLBModelCallback, getScaleCallback) {
    console.log("🏗️ Initializing AR scene...");
    
    // Najdi všechny existující AR objekty a odstraň je
    const existingObjects = document.querySelectorAll('[data-marker-id]');
    existingObjects.forEach(obj => {
        console.log(`🗑️ Removing existing AR object: ${obj.getAttribute('data-marker-id')}`);
        obj.parentNode.removeChild(obj);
    });
    
    // Vyčisti aktivní objekty
    activeArObjects.clear();
    arObjectDefinitions.clear();
    
    // Uložení definic objektů pro pozdější použití
    markers.forEach(marker => {
        arObjectDefinitions.set(marker.id, {
            lat: marker.lat,
            lng: marker.lng,
            audioId: marker.audioId,
            glbModel: getGLBModelCallback(marker.id),
            scale: getScaleCallback(marker.id),
            rotation: "0 30 0"
        });
    });
    
    console.log(`✅ AR scene cleared, ${markers.length} object definitions stored`);
}

/**
 * Přidá AR objekt do scény
 * @param {string} markerId - ID markeru
 * @returns {boolean} True pokud byl objekt úspěšně přidán
 */
function addARObjectToScene(markerId) {
    if (activeArObjects.has(markerId)) {
        console.log(`⚠️ AR object ${markerId} already in scene`);
        return false;
    }
    
    const definition = arObjectDefinitions.get(markerId);
    if (!definition) {
        console.error(`❌ No definition found for marker ${markerId}`);
        return false;
    }
    
    const scene = document.querySelector('a-scene');
    if (!scene) {
        console.error("❌ A-Frame scene not found");
        return false;
    }
    
    // Vytvoř nový AR entity
    const arEntity = document.createElement('a-entity');
    arEntity.setAttribute('gps-entity-place', `latitude: ${definition.lat}; longitude: ${definition.lng}`);
    arEntity.setAttribute('data-marker-id', markerId);
    arEntity.setAttribute('data-audio-id', definition.audioId);
    arEntity.setAttribute('visible', 'true');
    
    // Vytvoř GLB model
    const glbModel = document.createElement('a-gltf-model');
    glbModel.id = `ar-model-${markerId}-gltf`;
    glbModel.setAttribute('src', definition.glbModel);
    glbModel.setAttribute('position', '0 0 0');
    glbModel.setAttribute('scale', definition.scale);
    glbModel.setAttribute('rotation', `0 ${modelRotationY} 0`);
    glbModel.setAttribute('animation-mixer', '');
    
    // Přidej model do entity
    arEntity.appendChild(glbModel);
    
    // Přidej entity do scény
    scene.appendChild(arEntity);
    
    // Zaznamenej jako aktivní
    activeArObjects.add(markerId);
    
    console.log(`➕ AR object ${markerId} added to scene at ${definition.lat}, ${definition.lng}`);
    return true;
}

/**
 * Odstraní AR objekt ze scény
 * @param {string} markerId - ID markeru
 * @returns {boolean} True pokud byl objekt úspěšně odstraněn
 */
function removeARObjectFromScene(markerId) {
    if (!activeArObjects.has(markerId)) {
        return false; // Už není ve scéně
    }
    
    const arEntity = document.querySelector(`[data-marker-id="${markerId}"]`);
    if (arEntity && arEntity.parentNode) {
        arEntity.parentNode.removeChild(arEntity);
        activeArObjects.delete(markerId);
        console.log(`➖ AR object ${markerId} removed from scene`);
        return true;
    }
    
    return false;
}

/**
 * Zkontroluje, zda je nějaký AR model viditelný
 * @returns {boolean} True pokud je alespoň jeden model ve scéně
 */
function isAnyARModelVisible() {
    return activeArObjects.size > 0;
}

/**
 * Získá seznam aktivních AR objektů ve scéně
 * @returns {Array} Array ID aktivních objektů
 */
function getActiveARObjects() {
    return Array.from(activeArObjects);
}

/**
 * Získá počet aktivních AR objektů
 * @returns {number} Počet objektů ve scéně
 */
function getActiveARObjectsCount() {
    return activeArObjects.size;
}

/**
 * Zkontroluje, zda je specifický objekt ve scéně
 * @param {string} markerId - ID markeru
 * @returns {boolean} True pokud je objekt ve scéně
 */
function isARObjectInScene(markerId) {
    return activeArObjects.has(markerId);
}

// === 3D MODEL ROTACE ===

/**
 * Nastaví systém pro rotaci 3D modelů pomocí myši/dotyku
 */
function setupModelRotation() {
    let touchStarted = false;
    let rotationActive = false;
    
    // Touch události
    document.addEventListener('touchstart', (e) => {
        if (window.CoreUtils && window.CoreUtils.isTouchingUI(e.target)) return;
        if (!isAnyARModelVisible()) return;
        
        touchStarted = true;
        rotationActive = true;
        isRotating = true;
        startX = e.touches[0].clientX;
        showRotationHintOnce();
        e.preventDefault();
    }, { passive: false });
    
    // Mouse události
    document.addEventListener('mousedown', (e) => {
        if (window.CoreUtils && window.CoreUtils.isTouchingUI(e.target)) return;
        if (!isAnyARModelVisible()) return;
        
        rotationActive = true;
        isRotating = true;
        startX = e.clientX;
        showRotationHintOnce();
        e.preventDefault();
    });
    
    // Touch move
    document.addEventListener('touchmove', (e) => {
        if (!isRotating || !touchStarted || !rotationActive) return;
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        modelRotationY += deltaX * 0.3;
        updateModelRotation();
        startX = currentX;
        e.preventDefault();
    }, { passive: false });
    
    // Mouse move
    document.addEventListener('mousemove', (e) => {
        if (!isRotating || !rotationActive) return;
        const deltaX = e.clientX - startX;
        modelRotationY += deltaX * 0.3;
        updateModelRotation();
        startX = e.clientX;
        e.preventDefault();
    });
    
    // Touch end
    document.addEventListener('touchend', () => {
        isRotating = false;
        touchStarted = false;
        rotationActive = false;
    });
    
    // Mouse up
    document.addEventListener('mouseup', () => {
        isRotating = false;
        rotationActive = false;
    });
    
    console.log("🔄 Model rotation system initialized");
}

/**
 * Aktualizuje rotaci všech aktivních AR modelů
 */
function updateModelRotation() {
    // Aktualizuj rotaci pouze pro objekty, které jsou skutečně ve scéně
    activeArObjects.forEach(markerId => {
        const arModel = document.querySelector(`#ar-model-${markerId}-gltf`);
        if (arModel) {
            arModel.setAttribute('rotation', `0 ${modelRotationY} 0`);
        }
    });
}

/**
 * Nastaví konkrétní rotaci pro všechny modely
 * @param {number} rotationY - Rotace kolem Y osy ve stupních
 */
function setModelRotation(rotationY) {
    modelRotationY = rotationY;
    updateModelRotation();
    console.log(`🔄 Model rotation set to ${rotationY}°`);
}

/**
 * Získá aktuální rotaci modelů
 * @returns {number} Rotace kolem Y osy ve stupních
 */
function getModelRotation() {
    return modelRotationY;
}

/**
 * Resetuje rotaci modelů na výchozí hodnotu
 */
function resetModelRotation() {
    setModelRotation(30);
}

/**
 * Zobraz nápovědu pro rotaci (pouze jednou)
 */
function showRotationHintOnce() {
    if (rotationHintShown) return;
    
    rotationHintShown = true;
    const rotationHint = document.getElementById('rotationHint');
    
    if (rotationHint) {
        rotationHint.style.display = 'block';
        setTimeout(() => {
            rotationHint.style.display = 'none';
        }, 3000);
        console.log("💡 Rotation hint shown");
    }
}

/**
 * Resetuje stav nápovědy rotace (pro debug/testing)
 */
function resetRotationHint() {
    rotationHintShown = false;
    console.log("🔄 Rotation hint reset");
}

// === UTILITY FUNKCE ===

/**
 * Vyčistí všechny AR objekty ze scény (force cleanup)
 */
function forceCleanARScene() {
    const allEntities = document.querySelectorAll('[data-marker-id]');
    allEntities.forEach(entity => {
        if (entity.parentNode) {
            entity.parentNode.removeChild(entity);
        }
    });
    
    activeArObjects.clear();
    console.log("🧹 Force AR cleanup completed - all objects removed");
}

/**
 * Aktualizuje všechny AR objekty podle vzdálenosti od uživatele
 * @param {Array} markers - Array markerů
 * @param {number} visibilityThreshold - Vzdálenost pro zobrazení objektů (metry)
 * @returns {Object} Status update s informacemi o změnách
 */
function updateARObjectsByDistance(markers, visibilityThreshold = 30) {
    const userPos = window.CoreUtils ? window.CoreUtils.getUserPosition() : null;
    if (!userPos) {
        return { added: [], removed: [], total: activeArObjects.size };
    }
    
    const addedObjects = [];
    const removedObjects = [];
    
    markers.forEach(marker => {
        const distance = window.CoreUtils.calculateDistance(
            userPos.lat, userPos.lng,
            marker.lat, marker.lng
        );
        
        const isCurrentlyInScene = activeArObjects.has(marker.id);
        const shouldBeInScene = distance <= visibilityThreshold;
        
        // Přidání objektu
        if (shouldBeInScene && !isCurrentlyInScene) {
            if (addARObjectToScene(marker.id)) {
                addedObjects.push(marker.id);
            }
        }
        // Odstranění objektu
        else if (!shouldBeInScene && isCurrentlyInScene) {
            if (removeARObjectFromScene(marker.id)) {
                removedObjects.push(marker.id);
            }
        }
    });
    
    return {
        added: addedObjects,
        removed: removedObjects,
        total: activeArObjects.size
    };
}

// === DEBUG FUNKCE ===

/**
 * Zobrazí status AR scény v konzoli
 */
function debugARSceneStatus() {
    console.log("=== AR SCENE STATUS ===");
    console.log(`Active objects in scene: ${Array.from(activeArObjects).join(', ')}`);
    console.log(`Object definitions: ${Array.from(arObjectDefinitions.keys()).join(', ')}`);
    console.log(`Model rotation: ${modelRotationY}°`);
    console.log(`Rotation hint shown: ${rotationHintShown}`);
    
    const entitiesInDOM = document.querySelectorAll('[data-marker-id]');
    console.log(`Entities in DOM: ${Array.from(entitiesInDOM).map(e => e.getAttribute('data-marker-id')).join(', ')}`);
    
    console.log("=======================");
    
    return {
        activeObjects: Array.from(activeArObjects),
        definedObjects: Array.from(arObjectDefinitions.keys()),
        entitiesInDOM: Array.from(entitiesInDOM).map(e => e.getAttribute('data-marker-id')),
        modelRotation: modelRotationY,
        rotationHintShown: rotationHintShown
    };
}

/**
 * Testuje přidání a odstranění AR objektu
 * @param {string} markerId - ID markeru pro test
 */
function testARObjectToggle(markerId) {
    console.log(`🧪 Testing AR object toggle for: ${markerId}`);
    
    if (activeArObjects.has(markerId)) {
        removeARObjectFromScene(markerId);
        console.log(`🔄 Removed ${markerId} from scene`);
    } else if (arObjectDefinitions.has(markerId)) {
        addARObjectToScene(markerId);
        console.log(`🔄 Added ${markerId} to scene`);
    } else {
        console.log(`❌ No definition found for ${markerId}`);
    }
}

// === EXPORT FUNKCÍ ===

// Pro ES6 moduly
if (typeof module !== 'undefined' && module.exports) {
    // Node.js export
    module.exports = {
        initializeARScene,
        addARObjectToScene,
        removeARObjectFromScene,
        isAnyARModelVisible,
        getActiveARObjects,
        getActiveARObjectsCount,
        isARObjectInScene,
        setupModelRotation,
        updateModelRotation,
        setModelRotation,
        getModelRotation,
        resetModelRotation,
        showRotationHintOnce,
        resetRotationHint,
        forceCleanARScene,
        updateARObjectsByDistance,
        debugARSceneStatus,
        testARObjectToggle
    };
} else if (typeof window !== 'undefined') {
    // Browser global export
    window.ARManager = {
        initializeARScene,
        addARObjectToScene,
        removeARObjectFromScene,
        isAnyARModelVisible,
        getActiveARObjects,
        getActiveARObjectsCount,
        isARObjectInScene,
        setupModelRotation,
        updateModelRotation,
        setModelRotation,
        getModelRotation,
        resetModelRotation,
        showRotationHintOnce,
        resetRotationHint,
        forceCleanARScene,
        updateARObjectsByDistance,
        debugARSceneStatus,
        testARObjectToggle
    };
}

console.log("✅ AR Manager module loaded successfully!");