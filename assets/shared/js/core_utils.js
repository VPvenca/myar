/* ======================================
   CORE UTILITIES - Základní utility funkce
   Sdílený modul pro všechny AR stezky
   ====================================== */

// === GLOBÁLNÍ PROMĚNNÉ ===
let userPosition = null;
let startPosition = null;

// === VÝPOČTY VZDÁLENOSTÍ ===

/**
 * Vypočítá vzdálenost mezi dvěma GPS body v metrech
 * @param {number} lat1 - Zeměpisná šířka prvního bodu
 * @param {number} lon1 - Zeměpisná délka prvního bodu  
 * @param {number} lat2 - Zeměpisná šířka druhého bodu
 * @param {number} lon2 - Zeměpisná délka druhého bodu
 * @returns {number} Vzdálenost v metrech
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Poloměr Země v metrech
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
             Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

/**
 * Formátuje vzdálenost do čitelné podoby
 * @param {number} distance - Vzdálenost v metrech
 * @returns {string} Formátovaná vzdálenost (např. "150m" nebo "1.2km")
 */
function formatDistance(distance) {
    if (distance < 1000) {
        return `${Math.round(distance)}m`;
    } else {
        return `${(distance / 1000).toFixed(1)}km`;
    }
}

// === GPS FUNKCE ===

/**
 * Získá aktuální GPS pozici uživatele
 * @param {Function} onSuccess - Callback při úspěchu (position)
 * @param {Function} onError - Callback při chybě (error)
 * @param {Object} fallbackPosition - Záložní pozice při chybě GPS
 */
function getCurrentPosition(onSuccess, onError, fallbackPosition = null) {
    console.log("🗺️ Requesting GPS position...");
    
    // Fallback pozice pro vinnou stezku (pokud není specifikována jiná)
    const defaultFallback = {
        lat: 49.090675,
        lng: 17.132976,
        accuracy: 50
    };
    
    const fallback = fallbackPosition || defaultFallback;
    
    // Kontrola podpory geolokace
    if (!navigator.geolocation) {
        console.error("❌ Geolocation is not supported");
        userPosition = fallback;
        if (!startPosition) {
            startPosition = { ...userPosition };
        }
        if (onError) onError(new Error("Geolocation not supported"));
        return;
    }

    // Pokus o získání GPS pozice
    navigator.geolocation.getCurrentPosition(
        (position) => {
            userPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            
            // Nastav startovní pozici při prvním GPS fix
            if (!startPosition) {
                startPosition = { ...userPosition };
                console.log("🎯 Start position set:", startPosition);
            }
            
            console.log("✅ GPS position found:", userPosition);
            if (onSuccess) onSuccess(userPosition);
        },
        (error) => {
            console.error("❌ Geolocation error:", error);
            
            // Použij fallback pozici
            userPosition = fallback;
            if (!startPosition) {
                startPosition = { ...userPosition };
            }
            
            console.log("🔄 Using fallback position:", userPosition);
            if (onError) onError(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000
        }
    );
    
    // Timeout fallback
    setTimeout(() => {
        if (!userPosition) {
            console.log("⏰ GPS timeout - activating fallback position");
            userPosition = fallback;
            if (!startPosition) {
                startPosition = { ...userPosition };
            }
            if (onError) onError(new Error("GPS timeout"));
        }
    }, 5000);
}

/**
 * Spustí sledování GPS pozice
 * @param {Function} onPositionUpdate - Callback při aktualizaci pozice (position)
 * @param {Function} onError - Callback při chybě (error)
 * @returns {number|null} Watch ID pro geolocation.clearWatch()
 */
function watchPosition(onPositionUpdate, onError = null) {
    if (!navigator.geolocation) {
        console.warn("⚠️ Geolocation not supported for position watching");
        return null;
    }
    
    console.log("👁️ Starting GPS position watching...");
    
    const watchId = navigator.geolocation.watchPosition(
        (position) => {
            userPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            
            console.log(`🗺️ GPS position updated: ${userPosition.lat.toFixed(6)}, ${userPosition.lng.toFixed(6)} (±${userPosition.accuracy}m)`);
            
            if (onPositionUpdate) {
                onPositionUpdate(userPosition);
            }
        },
        (error) => {
            console.error("❌ Watch position error:", error);
            if (onError) onError(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 20000
        }
    );
    
    return watchId;
}

/**
 * Zastaví sledování GPS pozice
 * @param {number} watchId - ID ze watchPosition()
 */
function clearPositionWatch(watchId) {
    if (watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
        console.log("🛑 GPS position watching stopped");
    }
}

// === UTILITY FUNKCE ===

/**
 * Zkontroluje, zda uživatel kliká na UI element
 * @param {Element} target - Cílový element kliknutí
 * @returns {boolean} True pokud se jedná o UI element
 */
function isTouchingUI(target) {
    const uiSelectors = [
        '.back-button',
        '.navigation', 
        '.nav-toggle',
        '.nav-content',
        '.target-item',
        '.distance-info',
        '.audio-info',
        '.rotation-hint',
        '.wine-quiz',
        '.quiz-answer',
        '.quiz-close',
        '#clearSelection'
    ];
    
    for (let selector of uiSelectors) {
        const element = document.querySelector(selector);
        if (element && (element === target || element.contains(target))) {
            return true;
        }
    }
    return false;
}

/**
 * Debounce funkce - omezuje frekvenci volání funkce
 * @param {Function} func - Funkce k debouncing
 * @param {number} wait - Čekací doba v ms
 * @returns {Function} Debounced funkce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Získá aktuální pozici uživatele
 * @returns {Object|null} Objekt s lat, lng, accuracy nebo null
 */
function getUserPosition() {
    return userPosition;
}

/**
 * Získá startovní pozici uživatele
 * @returns {Object|null} Objekt s lat, lng, accuracy nebo null
 */
function getStartPosition() {
    return startPosition;
}

/**
 * Manuálně nastaví uživatelskou pozici (pro testování)
 * @param {Object} position - Objekt s lat, lng, accuracy
 */
function setUserPosition(position) {
    userPosition = { ...position };
    if (!startPosition) {
        startPosition = { ...position };
    }
    console.log("🔧 User position manually set:", userPosition);
}

/**
 * Resetuje startovní pozici (pro restart stezky)
 */
function resetStartPosition() {
    startPosition = userPosition ? { ...userPosition } : null;
    console.log("🔄 Start position reset:", startPosition);
}

// === DEBUG FUNKCE ===

/**
 * Zobrazí aktuální GPS status v konzoli
 */
function debugGPSStatus() {
    console.log("=== GPS STATUS DEBUG ===");
    console.log("User position:", userPosition);
    console.log("Start position:", startPosition);
    console.log("Geolocation supported:", !!navigator.geolocation);
    console.log("========================");
}

// === EXPORT FUNKCÍ ===

// Pro ES6 moduly
if (typeof module !== 'undefined' && module.exports) {
    // Node.js export
    module.exports = {
        calculateDistance,
        formatDistance,
        getCurrentPosition,
        watchPosition,
        clearPositionWatch,
        isTouchingUI,
        debounce,
        getUserPosition,
        getStartPosition,
        setUserPosition,
        resetStartPosition,
        debugGPSStatus
    };
} else if (typeof window !== 'undefined') {
    // Browser global export
    window.CoreUtils = {
        calculateDistance,
        formatDistance,
        getCurrentPosition,
        watchPosition,
        clearPositionWatch,
        isTouchingUI,
        debounce,
        getUserPosition,
        getStartPosition,
        setUserPosition,
        resetStartPosition,
        debugGPSStatus
    };
}

console.log("✅ Core utilities module loaded successfully!");