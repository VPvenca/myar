// === BEE-NAVIGATION.JS - GPS A NAVIGACE ===

class BeeNavigationManager {
    constructor() {
        this.userPosition = null;
        this.startPosition = null;
        this.selectedTargetId = null;
        this.watchId = null;
        this.elements = {};
    }
    
    initialize() {
        console.log("📍 Initializing Bee Navigation Manager...");
        this.cacheElements();
        this.setupEventListeners();
        this.getCurrentPosition();
        this.watchPosition();
        console.log("✅ Bee Navigation Manager initialized");
    }
    
    cacheElements() {
        this.elements = {
            distanceInfo: document.getElementById('distanceInfo'),
            navToggle: document.getElementById('navToggle'),
            navContent: document.getElementById('navContent'),
            targetsList: document.getElementById('targetsList'),
            clearSelection: document.getElementById('clearSelection')
        };
        
        // Zkontroluj, že všechny elementy existují
        Object.entries(this.elements).forEach(([key, element]) => {
            if (!element) {
                console.error(`❌ Navigation element not found: ${key}`);
            }
        });
    }
    
    setupEventListeners() {
        // Navigation toggle
        if (this.elements.navToggle) {
            this.elements.navToggle.addEventListener('click', () => this.toggleNavigation());
        }
        
        // Clear selection
        if (this.elements.clearSelection) {
            this.elements.clearSelection.addEventListener('click', () => this.clearSelection());
        }
    }
    
    getCurrentPosition() {
        console.log("📍 Requesting GPS position...");
        this.updateDistanceDisplay('📍 Hledám GPS signál...');
        
        if (!navigator.geolocation) {
            console.error("📍 Geolocation is not supported");
            this.handleGPSError("GPS není podporován");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.userPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                
                // Nastav start pozici pouze při prvním GPS fix
                if (!this.startPosition) {
                    this.startPosition = { ...this.userPosition };
                    console.log("🎯 Start position set:", this.startPosition);
                }
                
                console.log("📍 GPS position found:", this.userPosition);
                this.updateAll();
            },
            (error) => {
                console.error("📍 Geolocation error:", error);
                this.handleGPSError("GPS chyba");
            },
            BEE_CONFIG.GPS_OPTIONS
        );
        
        // Timeout pro aktivaci fallback pozice
        setTimeout(() => {
            if (!this.userPosition) {
                console.log("📍 GPS timeout - activating fallback position");
                this.userPosition = { ...BEE_CONFIG.FALLBACK_POSITION };
                this.startPosition = { ...this.userPosition };
                this.updateDistanceDisplay('🔄 Testovací pozice aktivní');
                this.updateAll();
            }
        }, 5000);
    }
    
    handleGPSError(message) {
        this.userPosition = { ...BEE_CONFIG.FALLBACK_POSITION };
        this.startPosition = { ...this.userPosition };
        this.updateDistanceDisplay(`🔄 ${message} - používám testovací pozici`);
        console.log("📍 Using fallback position:", this.userPosition);
        this.updateAll();
    }
    
    watchPosition() {
        if (navigator.geolocation) {
            this.watchId = navigator.geolocation.watchPosition(
                (position) => {
                    this.userPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    this.updateAll();
                },
                (error) => {
                    console.error("📍 GPS watch error:", error);
                },
                BEE_CONFIG.GPS_WATCH_OPTIONS
            );
            console.log("📍 GPS watching started");
        }
    }
    
    updateAll() {
        this.updateNavigation();
        this.updateDistanceDisplay();
    }
    
    updateNavigation() {
        if (!this.userPosition || !this.elements.targetsList) return;
        
        let html = '';
        
        // Spočítej vzdálenosti pro všechny markery
        const markersWithDistance = BEE_CONFIG.MARKERS.map(marker => {
            const distance = this.calculateDistance(
                this.userPosition.lat, this.userPosition.lng,
                marker.lat, marker.lng
            );
            return { ...marker, distance };
        }).sort((a, b) => a.distance - b.distance);
        
        // Vytvoř HTML pro každý marker
        markersWithDistance.forEach((marker, index) => {
            const isClosest = index === 0;
            const isSelected = marker.id === this.selectedTargetId;
            
            let cssClass = 'target-item';
            if (isSelected) cssClass += ' selected';
            else if (isClosest) cssClass += ' closest';
            
            let indicators = '';
            if (marker.distance <= BEE_CONFIG.AUDIO_THRESHOLD) indicators += ' 🎵';
            if (marker.distance <= BEE_CONFIG.AR_VISIBILITY_THRESHOLD) indicators += ' 👁️';
            
            html += `
                <div class="${cssClass}" data-target-id="${marker.id}">
                    <div style="font-weight: bold;">${marker.name}${indicators} ${isSelected ? '🎯' : ''}</div>
                    <div style="font-size: 12px; color: #666;">${this.formatDistance(marker.distance)} - ${marker.description}</div>
                </div>
            `;
        });
        
        this.elements.targetsList.innerHTML = html;
        
        // Přidej event listenery pro klikání na targets
        document.querySelectorAll('.target-item[data-target-id]').forEach(item => {
            item.addEventListener('click', () => {
                const targetId = item.getAttribute('data-target-id');
                this.selectTarget(targetId);
            });
        });
    }
    
    updateDistanceDisplay(customMessage = null) {
        if (!this.elements.distanceInfo) return;
        
        if (customMessage) {
            this.elements.distanceInfo.innerHTML = customMessage;
            return;
        }
        
        if (!this.userPosition) {
            this.elements.distanceInfo.innerHTML = '📍 Čekám na GPS...';
            return;
        }
        
        // Nastav start pozici pokud ještě není
        if (!this.startPosition) {
            this.startPosition = { ...this.userPosition };
            console.log("🎯 Start position initialized in updateDistanceDisplay");
        }
        
        const targetMarker = this.selectedTargetId ? this.findSelectedMarker() : this.findClosestMarker();
        
        // Vypočítej vzdálenost od startu
        const distanceFromStart = this.startPosition ? this.calculateDistance(
            this.startPosition.lat, this.startPosition.lng,
            this.userPosition.lat, this.userPosition.lng
        ) : 0;
        
        if (targetMarker) {
            const distance = Math.round(targetMarker.distance);
            const prefix = this.selectedTargetId ? '🎯' : '🐝';
            
            let indicators = '';
            if (distance <= BEE_CONFIG.AUDIO_THRESHOLD) indicators += ' 🎵';
            if (distance <= BEE_CONFIG.AR_VISIBILITY_THRESHOLD) indicators += ' 👁️';
            
            // Barva podle vzdálenosti
            if (distance <= BEE_CONFIG.AR_VISIBILITY_THRESHOLD) {
                this.elements.distanceInfo.style.borderColor = '#00ff00';
                this.elements.distanceInfo.style.backgroundColor = 'rgba(255, 215, 0, 0.9)';
            } else if (distance <= 100) {
                this.elements.distanceInfo.style.borderColor = '#ffaa00';
                this.elements.distanceInfo.style.backgroundColor = 'rgba(255, 170, 0, 0.9)';
            } else {
                this.elements.distanceInfo.style.borderColor = '#ff0000';
                this.elements.distanceInfo.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
            }
            
            this.elements.distanceInfo.innerHTML = 
                `${prefix} ${targetMarker.name}${indicators}<br><strong>${distance}m</strong><br><small>Nachozeno: ${distanceFromStart.toFixed(0)}m</small>`;
        } else {
            this.elements.distanceInfo.innerHTML = 
                `🐝 GPS aktivní<br><small>Nachozeno: ${distanceFromStart.toFixed(0)}m</small>`;
            this.elements.distanceInfo.style.borderColor = '#FFD700';
            this.elements.distanceInfo.style.backgroundColor = 'rgba(255, 215, 0, 0.9)';
        }
    }
    
    findClosestMarker() {
        if (!this.userPosition) return null;
        
        let closest = null;
        let minDistance = Infinity;
        
        BEE_CONFIG.MARKERS.forEach(marker => {
            const distance = this.calculateDistance(
                this.userPosition.lat, this.userPosition.lng,
                marker.lat, marker.lng
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closest = { ...marker, distance };
            }
        });
        
        return closest;
    }
    
    findSelectedMarker() {
        if (!this.userPosition || !this.selectedTargetId) return null;
        
        const marker = BEE_CONFIG.MARKERS.find(m => m.id === this.selectedTargetId);
        if (!marker) return null;
        
        const distance = this.calculateDistance(
            this.userPosition.lat, this.userPosition.lng,
            marker.lat, marker.lng
        );
        
        return { ...marker, distance };
    }
    
    selectTarget(targetId) {
        this.selectedTargetId = targetId;
        if (this.elements.clearSelection) {
            this.elements.clearSelection.style.display = 'block';
        }
        this.updateAll();
        this.closeNavigation();
        console.log(`🎯 Target selected: ${targetId}`);
    }
    
    clearSelection() {
        this.selectedTargetId = null;
        if (this.elements.clearSelection) {
            this.elements.clearSelection.style.display = 'none';
        }
        this.updateAll();
        console.log("🎯 Target selection cleared");
    }
    
    toggleNavigation() {
        if (this.elements.navContent) {
            this.elements.navContent.classList.toggle('open');
        }
    }
    
    closeNavigation() {
        if (this.elements.navContent) {
            this.elements.navContent.classList.remove('open');
        }
    }
    
    handleGlobalClick(event) {
        const navPanel = document.querySelector('.navigation');
        if (navPanel && !navPanel.contains(event.target)) {
            this.closeNavigation();
        }
    }
    
    formatDistance(distance) {
        if (distance < 1000) {
            return `${Math.round(distance)}m`;
        } else {
            return `${(distance / 1000).toFixed(1)}km`;
        }
    }
    
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
    
    // Gettery pro ostatní moduly
    getUserPosition() {
        return this.userPosition;
    }
    
    getStartPosition() {
        return this.startPosition;
    }
    
    getSelectedTarget() {
        return this.selectedTargetId;
    }
    
    getStatus() {
        return {
            userPosition: this.userPosition,
            startPosition: this.startPosition,
            selectedTarget: this.selectedTargetId,
            watchId: this.watchId,
            hasGPS: !!navigator.geolocation
        };
    }
    
    // Cleanup
    cleanup() {
        console.log("🧹 Cleaning up navigation manager...");
        if (this.watchId && navigator.geolocation) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }
}