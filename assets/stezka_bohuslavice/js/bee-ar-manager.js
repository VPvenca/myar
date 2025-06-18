// === BEE-AR-MANAGER.JS - FYZICKÁ SPRÁVA AR OBJEKTŮ ===

class BeeARManager {
    constructor() {
        this.arObjectDefinitions = new Map();
        this.activeArObjects = new Set();
        this.scene = null;
    }
    
    initialize() {
        console.log("🐝 Initializing Bee AR Manager...");
        this.scene = document.querySelector('a-scene');
        this.clearExistingObjects();
        this.storeObjectDefinitions();
        console.log("✅ Bee AR Manager initialized");
    }
    
    clearExistingObjects() {
        // Najdi všechny existující AR objekty a odstraň je
        const existingObjects = document.querySelectorAll('[data-marker-id]');
        existingObjects.forEach(obj => {
            console.log(`🗑️ Removing existing AR object: ${obj.getAttribute('data-marker-id')}`);
            if (obj.parentNode) {
                obj.parentNode.removeChild(obj);
            }
        });
        console.log(`🧹 Removed ${existingObjects.length} existing AR objects`);
    }
    
    storeObjectDefinitions() {
        // Uložení definic objektů pro pozdější použití
        BEE_CONFIG.MARKERS.forEach(marker => {
            this.arObjectDefinitions.set(marker.id, {
                lat: marker.lat,
                lng: marker.lng,
                audioId: marker.audioId,
                glbModel: marker.glbModel,
                scale: marker.scale,
                rotation: "0 30 0"
            });
        });
        console.log(`📦 Stored ${this.arObjectDefinitions.size} AR object definitions`);
    }
    
    addObjectToScene(markerId) {
        if (this.activeArObjects.has(markerId)) {
            console.log(`⚠️ AR object ${markerId} already in scene`);
            return false;
        }
        
        const definition = this.arObjectDefinitions.get(markerId);
        if (!definition) {
            console.error(`❌ No definition found for marker ${markerId}`);
            return false;
        }
        
        if (!this.scene) {
            console.error("❌ A-Frame scene not found");
            return false;
        }
        
        try {
            // Vytvoř nový AR entity
            const arEntity = document.createElement('a-entity');
            arEntity.setAttribute('gps-entity-place', `latitude: ${definition.lat}; longitude: ${definition.lng}`);
            arEntity.setAttribute('data-marker-id', markerId);
            arEntity.setAttribute('data-audio-id', definition.audioId);
            arEntity.setAttribute('visible', 'true');
            
            // Vytvoř GLB model
            const glbModel = document.createElement('a-gltf-model');
            glbModel.id = `bee-model-${markerId}-gltf`;
            glbModel.setAttribute('src', definition.glbModel);
            glbModel.setAttribute('position', '0 0 0');
            glbModel.setAttribute('scale', definition.scale);
            glbModel.setAttribute('rotation', definition.rotation);
            glbModel.setAttribute('animation-mixer', '');
            
            // Event listenery pro model
            glbModel.addEventListener('model-loaded', () => {
                console.log(`✅ GLB model for ${markerId} loaded successfully!`);
            });
            
            glbModel.addEventListener('model-error', (error) => {
                console.error(`❌ GLB model for ${markerId} loading error:`, error);
            });
            
            // Přidej model do entity
            arEntity.appendChild(glbModel);
            
            // Přidej entity do scény
            this.scene.appendChild(arEntity);
            
            // Zaznamenej jako aktivní
            this.activeArObjects.add(markerId);
            
            console.log(`➕ Bee AR object ${markerId} added to scene at ${definition.lat}, ${definition.lng}`);
            return true;
            
        } catch (error) {
            console.error(`❌ Error adding AR object ${markerId}:`, error);
            return false;
        }
    }
    
    removeObjectFromScene(markerId) {
        if (!this.activeArObjects.has(markerId)) {
            return false; // Už není ve scéně
        }
        
        try {
            const arEntity = document.querySelector(`[data-marker-id="${markerId}"]`);
            if (arEntity && arEntity.parentNode) {
                arEntity.parentNode.removeChild(arEntity);
                this.activeArObjects.delete(markerId);
                console.log(`➖ Bee AR object ${markerId} removed from scene`);
                return true;
            }
        } catch (error) {
            console.error(`❌ Error removing AR object ${markerId}:`, error);
        }
        
        return false;
    }
    
    checkProximity(userPosition, audioManager, gamificationManager) {
        if (!userPosition) return;
        
        console.log("🔍 Checking proximity with PHYSICAL object management...");
        let hasCloseMarker = false;
        
        BEE_CONFIG.MARKERS.forEach(marker => {
            const distance = this.calculateDistance(
                userPosition.lat, userPosition.lng,
                marker.lat, marker.lng
            );
            
            const isCurrentlyInScene = this.activeArObjects.has(marker.id);
            const shouldBeInScene = distance <= BEE_CONFIG.AR_VISIBILITY_THRESHOLD;
            
            console.log(`${marker.id}: distance=${distance.toFixed(1)}m, inScene=${isCurrentlyInScene}, shouldBe=${shouldBeInScene}`);
            
            // FYZICKÉ PŘIDÁNÍ/ODSTRANĚNÍ OBJEKTŮ
            if (shouldBeInScene && !isCurrentlyInScene) {
                this.addObjectToScene(marker.id);
            } else if (!shouldBeInScene && isCurrentlyInScene) {
                this.removeObjectFromScene(marker.id);
            }
            
            // Audio logika (pouze pro objekty ve scéně)
            if (distance <= BEE_CONFIG.AUDIO_THRESHOLD && isCurrentlyInScene) {
                hasCloseMarker = true;
                if (audioManager && audioManager.playAudio) {
                    audioManager.playAudio(marker.id);
                }
                console.log(`🎵 Audio available for ${marker.id}`);
            }
            
            // Gamifikace (pouze pro objekty ve scéně)
            if (distance <= BEE_CONFIG.PROXIMITY_THRESHOLD && isCurrentlyInScene) {
                console.log(`🎯 Bee activated: ${marker.id}`);
                if (gamificationManager && gamificationManager.recordMarkerActivation) {
                    gamificationManager.recordMarkerActivation(marker.id);
                }
            }
        });
        
        // Zastav audio pokud není žádný marker blízko
        if (!hasCloseMarker && audioManager && audioManager.stopCurrentAudio) {
            audioManager.stopCurrentAudio();
        }
        
        const activeCount = this.activeArObjects.size;
        const availableCount = BEE_CONFIG.MARKERS.length;
        console.log(`📊 Bee AR Status: ${activeCount}/${availableCount} objects in scene`);
    }
    
    updateModelRotation(rotationY) {
        // Aktualizuj rotaci pouze pro objekty, které jsou skutečně ve scéně
        this.activeArObjects.forEach(markerId => {
            const beeModel = document.querySelector(`#bee-model-${markerId}-gltf`);
            if (beeModel) {
                beeModel.setAttribute('rotation', `0 ${rotationY} 0`);
            }
        });
    }
    
    isAnyModelVisible() {
        return this.activeArObjects.size > 0;
    }
    
    getActiveObjects() {
        return Array.from(this.activeArObjects);
    }
    
    getSceneStatus() {
        const entitiesInDOM = document.querySelectorAll('[data-marker-id]');
        return {
            activeObjects: Array.from(this.activeArObjects),
            entitiesInDOM: Array.from(entitiesInDOM).map(e => e.getAttribute('data-marker-id')),
            totalMarkers: BEE_CONFIG.MARKERS.length
        };
    }
    
    forceClean() {
        const allEntities = document.querySelectorAll('[data-marker-id]');
        allEntities.forEach(entity => {
            if (entity.parentNode) {
                entity.parentNode.removeChild(entity);
            }
        });
        
        this.activeArObjects.clear();
        console.log("🧹 Force cleanup completed - all bee AR objects removed");
    }
    
    // Utility funkce pro výpočet vzdálenosti
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000; // Poloměr Země v metrech
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                 Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                 Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
}