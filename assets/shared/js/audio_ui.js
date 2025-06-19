/* ======================================
   AUDIO-UI MANAGER - Audio a UI navigace
   Sdílený modul pro všechny AR stezky
   ====================================== */

// === GLOBÁLNÍ PROMĚNNÉ ===
let currentlyPlayingAudio = null;
let audioPlayingForMarker = null;
let audioIsPaused = false;
let selectedTargetId = null;

// === AUDIO MANAGEMENT ===

/**
 * Přehraje audio pro specifický marker
 * @param {string} markerId - ID markeru
 * @param {Array} markers - Array všech markerů
 * @returns {boolean} True pokud se audio spustilo úspěšně
 */
function playAudio(markerId, markers) {
    const marker = markers.find(m => m.id === markerId);
    if (!marker || audioPlayingForMarker === markerId) {
        return false;
    }
    
    stopCurrentAudio();
    
    const audioElement = document.getElementById(marker.audioId);
    if (audioElement) {
        audioElement.currentTime = 0;
        audioIsPaused = false;
        
        audioElement.play().then(() => {
            currentlyPlayingAudio = audioElement;
            audioPlayingForMarker = markerId;
            
            updateAudioDisplay();
            
            // Nastavení callback pro konec přehrávání
            audioElement.onended = stopCurrentAudio;
            
            console.log(`🎵 Audio playing for marker: ${markerId}`);
        }).catch(error => {
            console.error(`❌ Audio play error for ${markerId}:`, error);
        });
        
        return true;
    }
    
    return false;
}

/**
 * Přepne mezi play/pause aktuálního audia
 * @returns {boolean} True pokud se stav změnil
 */
function toggleAudioPlayPause() {
    if (!currentlyPlayingAudio) {
        console.warn("⚠️ No audio currently playing to toggle");
        return false;
    }
    
    if (audioIsPaused) {
        currentlyPlayingAudio.play().then(() => {
            audioIsPaused = false;
            updateAudioDisplay();
            console.log("▶️ Audio resumed");
        }).catch(error => {
            console.error("❌ Audio resume error:", error);
        });
    } else {
        currentlyPlayingAudio.pause();
        audioIsPaused = true;
        updateAudioDisplay();
        console.log("⏸️ Audio paused");
    }
    
    return true;
}

/**
 * Zastaví aktuální audio
 */
function stopCurrentAudio() {
    if (currentlyPlayingAudio) {
        currentlyPlayingAudio.pause();
        currentlyPlayingAudio.currentTime = 0;
        currentlyPlayingAudio.onended = null;
        
        const stoppedMarker = audioPlayingForMarker;
        currentlyPlayingAudio = null;
        audioPlayingForMarker = null;
        audioIsPaused = false;
        
        hideAudioDisplay();
        
        console.log(`🔇 Audio stopped for marker: ${stoppedMarker}`);
    }
}

/**
 * Aktualizuje zobrazení audio tlačítka
 */
function updateAudioDisplay() {
    const audioInfo = document.getElementById('audioInfo');
    if (!audioInfo) return;
    
    if (audioIsPaused) {
        audioInfo.innerHTML = '▶️';
        audioInfo.style.background = 'rgba(255, 193, 7, 0.9)';
        audioInfo.style.borderColor = 'rgba(255, 193, 7, 1)';
    } else {
        audioInfo.innerHTML = '⏸️';
        audioInfo.style.background = 'rgba(40, 167, 69, 0.9)';
        audioInfo.style.borderColor = 'rgba(40, 167, 69, 1)';
    }
    audioInfo.style.display = 'flex';
}

/**
 * Skryje audio tlačítko
 */
function hideAudioDisplay() {
    const audioInfo = document.getElementById('audioInfo');
    if (audioInfo) {
        audioInfo.style.display = 'none';
    }
}

/**
 * Získá status aktuálního audia
 * @returns {Object} Status objektu s informacemi o audio
 */
function getAudioStatus() {
    return {
        isPlaying: !!currentlyPlayingAudio,
        isPaused: audioIsPaused,
        currentMarker: audioPlayingForMarker,
        currentTime: currentlyPlayingAudio ? currentlyPlayingAudio.currentTime : 0,
        duration: currentlyPlayingAudio ? currentlyPlayingAudio.duration : 0
    };
}

// === UI NAVIGACE ===

/**
 * Aktualizuje navigační seznam markerů
 * @param {Array} markers - Array markerů
 * @param {Function} formatDistanceCallback - Funkce pro formátování vzdálenosti
 * @param {Function} calculateDistanceCallback - Funkce pro výpočet vzdálenosti
 */
function updateNavigation(markers, formatDistanceCallback, calculateDistanceCallback) {
    // Závislost na CoreUtils pro getUserPosition
    const userPos = window.CoreUtils ? window.CoreUtils.getUserPosition() : null;
    if (!userPos) return;
    
    const targetsList = document.getElementById('targetsList');
    if (!targetsList) return;
    
    let html = '';
    
    // Vypočítej vzdálenosti a seřaď podle vzdálenosti
    const markersWithDistance = markers.map(marker => {
        const distance = calculateDistanceCallback(
            userPos.lat, userPos.lng,
            marker.lat, marker.lng
        );
        return { ...marker, distance };
    }).sort((a, b) => a.distance - b.distance);
    
    // Vygeneruj HTML pro každý marker
    markersWithDistance.forEach((marker, index) => {
        const isClosest = index === 0;
        const isSelected = marker.id === selectedTargetId;
        
        let cssClass = 'target-item';
        if (isSelected) cssClass += ' selected';
        else if (isClosest) cssClass += ' closest';
        
        html += `
            <div class="${cssClass}" data-target-id="${marker.id}">
                <div style="font-weight: bold;">${marker.name} ${isSelected ? '🎯' : ''}</div>
                <div style="font-size: 12px; color: #666;">${formatDistanceCallback(marker.distance)} - ${marker.description}</div>
            </div>
        `;
    });
    
    targetsList.innerHTML = html;
    
    // Přidej event listenery
    document.querySelectorAll('.target-item').forEach(item => {
        item.addEventListener('click', () => {
            selectTarget(item.getAttribute('data-target-id'));
        });
    });
    
    console.log(`🗺️ Navigation updated with ${markersWithDistance.length} markers`);
}

/**
 * Aktualizuje hlavní distance display panel
 * @param {Array} markers - Array markerů
 * @param {Function} formatDistanceCallback - Funkce pro formátování vzdálenosti
 * @param {Function} calculateDistanceCallback - Funkce pro výpočet vzdálenosti
 * @param {Object} thresholds - Objekty s prahy (AUDIO_THRESHOLD, AR_VISIBILITY_THRESHOLD)
 * @param {Function} getQuizProgressCallback - Funkce pro získání kvízového progressu
 */
function updateDistanceDisplay(markers, formatDistanceCallback, calculateDistanceCallback, thresholds, getQuizProgressCallback) {
    const distanceInfo = document.getElementById('distanceInfo');
    if (!distanceInfo) return;
    
    // Závislost na CoreUtils
    const userPos = window.CoreUtils ? window.CoreUtils.getUserPosition() : null;
    const startPos = window.CoreUtils ? window.CoreUtils.getStartPosition() : null;
    
    if (!userPos) {
        distanceInfo.innerHTML = '📍 Čekám na GPS...';
        return;
    }
    
    const targetMarker = selectedTargetId ? 
        findSelectedMarker(markers, calculateDistanceCallback) : 
        findClosestMarker(markers, calculateDistanceCallback);
    
    const quizProgress = getQuizProgressCallback ? getQuizProgressCallback() : { completed: 0, total: 0 };
    
    // Vypočítej vzdálenost od startu
    const distanceFromStart = startPos ? calculateDistanceCallback(
        startPos.lat, startPos.lng,
        userPos.lat, userPos.lng
    ) : 0;
    
    if (targetMarker) {
        const distance = Math.round(targetMarker.distance);
        const prefix = selectedTargetId ? '🎯' : '🍇';
        
        // Indikátory blízkosti
        let indicators = '';
        if (distance <= thresholds.AUDIO_THRESHOLD) indicators += ' 🎵';
        if (distance <= thresholds.AR_VISIBILITY_THRESHOLD) indicators += ' 👁️';
        
        distanceInfo.innerHTML = `${prefix} ${targetMarker.name}${indicators}<br><strong>${distance}m</strong><br><small>📚 Kvízy: ${quizProgress.completed}/${quizProgress.total} • Nachozeno: ${distanceFromStart.toFixed(0)}m</small>`;
    } else {
        distanceInfo.innerHTML = `🍇 GPS aktivní<br><small>📚 Kvízy: ${quizProgress.completed}/${quizProgress.total} • Nachozeno: ${distanceFromStart.toFixed(0)}m</small>`;
    }
}

/**
 * Vybere cílový marker pro navigaci
 * @param {string} targetId - ID cílového markeru
 */
function selectTarget(targetId) {
    selectedTargetId = targetId;
    
    const clearSelection = document.getElementById('clearSelection');
    if (clearSelection) {
        clearSelection.style.display = 'block';
    }
    
    const navContent = document.getElementById('navContent');
    if (navContent) {
        navContent.classList.remove('open');
    }
    
    console.log(`🎯 Target selected: ${targetId}`);
}

/**
 * Zruší výběr cílového markeru
 */
function clearSelection() {
    selectedTargetId = null;
    
    const clearSelectionBtn = document.getElementById('clearSelection');
    if (clearSelectionBtn) {
        clearSelectionBtn.style.display = 'none';
    }
    
    console.log("🚫 Target selection cleared");
}

/**
 * Najde nejbližší marker k uživateli
 * @param {Array} markers - Array markerů
 * @param {Function} calculateDistanceCallback - Funkce pro výpočet vzdálenosti
 * @returns {Object|null} Nejbližší marker nebo null
 */
function findClosestMarker(markers, calculateDistanceCallback) {
    const userPos = window.CoreUtils ? window.CoreUtils.getUserPosition() : null;
    if (!userPos) return null;
    
    let closest = null;
    let minDistance = Infinity;
    
    markers.forEach(marker => {
        const distance = calculateDistanceCallback(
            userPos.lat, userPos.lng,
            marker.lat, marker.lng
        );
        
        if (distance < minDistance) {
            minDistance = distance;
            closest = { ...marker, distance };
        }
    });
    
    return closest;
}

/**
 * Najde vybraný marker a vypočítá jeho vzdálenost
 * @param {Array} markers - Array markerů
 * @param {Function} calculateDistanceCallback - Funkce pro výpočet vzdálenosti
 * @returns {Object|null} Vybraný marker s vzdáleností nebo null
 */
function findSelectedMarker(markers, calculateDistanceCallback) {
    const userPos = window.CoreUtils ? window.CoreUtils.getUserPosition() : null;
    if (!userPos || !selectedTargetId) return null;
    
    const marker = markers.find(m => m.id === selectedTargetId);
    if (!marker) return null;
    
    const distance = calculateDistanceCallback(
        userPos.lat, userPos.lng,
        marker.lat, marker.lng
    );
    
    return { ...marker, distance };
}

/**
 * Získá ID aktuálně vybraného cíle
 * @returns {string|null} ID vybraného cíle nebo null
 */
function getSelectedTargetId() {
    return selectedTargetId;
}

// === UI EVENT HANDLERS ===

/**
 * Nastaví základní UI event listenery
 */
function setupUIEventListeners() {
    // Navigační toggle
    const navToggle = document.getElementById('navToggle');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const navContent = document.getElementById('navContent');
            if (navContent) {
                navContent.classList.toggle('open');
            }
        });
    }
    
    // Clear selection tlačítko
    const clearSelectionBtn = document.getElementById('clearSelection');
    if (clearSelectionBtn) {
        clearSelectionBtn.addEventListener('click', clearSelection);
    }
    
    // Audio tlačítko
    const audioInfo = document.getElementById('audioInfo');
    if (audioInfo) {
        audioInfo.addEventListener('click', toggleAudioPlayPause);
    }
    
    // Kliknutí mimo navigaci ji zavře
    document.addEventListener('click', (e) => {
        const navPanel = document.querySelector('.navigation');
        if (navPanel && !navPanel.contains(e.target)) {
            const navContent = document.getElementById('navContent');
            if (navContent) {
                navContent.classList.remove('open');
            }
        }
    });
    
    console.log("🎛️ UI event listeners setup completed");
}

// === DEBUG FUNKCE ===

/**
 * Zobrazí debug informace o audio a UI
 */
function debugAudioUIStatus() {
    console.log("=== AUDIO-UI STATUS ===");
    console.log("Audio status:", getAudioStatus());
    console.log("Selected target:", selectedTargetId);
    console.log("UI elements present:", {
        audioInfo: !!document.getElementById('audioInfo'),
        distanceInfo: !!document.getElementById('distanceInfo'),
        targetsList: !!document.getElementById('targetsList'),
        navToggle: !!document.getElementById('navToggle'),
        navContent: !!document.getElementById('navContent'),
        clearSelection: !!document.getElementById('clearSelection')
    });
    console.log("=======================");
    
    return {
        audio: getAudioStatus(),
        selectedTarget: selectedTargetId,
        uiElements: {
            audioInfo: !!document.getElementById('audioInfo'),
            distanceInfo: !!document.getElementById('distanceInfo'),
            targetsList: !!document.getElementById('targetsList'),
            navToggle: !!document.getElementById('navToggle'),
            navContent: !!document.getElementById('navContent'),
            clearSelection: !!document.getElementById('clearSelection')
        }
    };
}

/**
 * Testuje audio funkce s konkrétním markerem
 * @param {string} markerId - ID markeru pro test
 * @param {Array} markers - Array markerů
 */
function testAudioPlayback(markerId, markers) {
    console.log(`🧪 Testing audio playback for: ${markerId}`);
    
    const marker = markers.find(m => m.id === markerId);
    if (!marker) {
        console.log(`❌ Marker ${markerId} not found`);
        return;
    }
    
    const audioElement = document.getElementById(marker.audioId);
    if (!audioElement) {
        console.log(`❌ Audio element ${marker.audioId} not found`);
        return;
    }
    
    if (currentlyPlayingAudio) {
        console.log("🔄 Stopping current audio first");
        stopCurrentAudio();
        setTimeout(() => playAudio(markerId, markers), 500);
    } else {
        playAudio(markerId, markers);
    }
}

// === EXPORT FUNKCÍ ===

// Pro ES6 moduly
if (typeof module !== 'undefined' && module.exports) {
    // Node.js export
    module.exports = {
        playAudio,
        toggleAudioPlayPause,
        stopCurrentAudio,
        updateAudioDisplay,
        hideAudioDisplay,
        getAudioStatus,
        updateNavigation,
        updateDistanceDisplay,
        selectTarget,
        clearSelection,
        findClosestMarker,
        findSelectedMarker,
        getSelectedTargetId,
        setupUIEventListeners,
        debugAudioUIStatus,
        testAudioPlayback
    };
} else if (typeof window !== 'undefined') {
    // Browser global export
    window.AudioUI = {
        playAudio,
        toggleAudioPlayPause,
        stopCurrentAudio,
        updateAudioDisplay,
        hideAudioDisplay,
        getAudioStatus,
        updateNavigation,
        updateDistanceDisplay,
        selectTarget,
        clearSelection,
        findClosestMarker,
        findSelectedMarker,
        getSelectedTargetId,
        setupUIEventListeners,
        debugAudioUIStatus,
        testAudioPlayback
    };
}

console.log("✅ Audio-UI Manager module loaded successfully!");