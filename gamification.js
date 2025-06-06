// gamification.js - Vylepšený gamifikační systém s frontou achievementů

// Základní klíče pro ukládání všech gamifikačních dat
const BASE_STORAGE_KEY = 'arGamificationData'; 
const ACHIEVEMENTS_STORAGE_KEY = 'arAchievements';
const TIME_TRACKING_STORAGE_KEY = 'arTimeTracking';

// === SYSTÉM FRONTY ACHIEVEMENTŮ ===
let achievementQueue = [];
let isShowingAchievement = false;

// === TIME TRACKING SYSTÉM ===
let timeTrackingData = {
    expositionId: null,
    sceneId: null,
    startTime: null,
    totalTime: 0,
    isActive: false
};

// Funkce pro získání time tracking dat
function getTimeTrackingData() {
    const data = localStorage.getItem(TIME_TRACKING_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
}

// Funkce pro uložení time tracking dat
function saveTimeTrackingData(data) {
    localStorage.setItem(TIME_TRACKING_STORAGE_KEY, JSON.stringify(data));
}

// Funkce pro inicializaci time tracking
function initializeTimeTracking(expositionId, sceneId) {
    console.log(`🕐 Initializing time tracking for ${expositionId}/${sceneId}`);
    
    timeTrackingData = {
        expositionId: expositionId,
        sceneId: sceneId,
        startTime: Date.now(),
        totalTime: 0,
        isActive: true
    };
    
    // Načti předchozí čas strávený v této scéně
    const savedData = getTimeTrackingData();
    const sceneKey = `${expositionId}_${sceneId}`;
    if (savedData[sceneKey]) {
        timeTrackingData.totalTime = savedData[sceneKey].totalTime || 0;
    }
    
    console.log(`Time tracking initialized. Previous time: ${timeTrackingData.totalTime}ms`);
}

// Funkce pro získání aktuálního času stráveného v scéně
function getCurrentTimeSpent() {
    if (!timeTrackingData.isActive || !timeTrackingData.startTime) {
        return timeTrackingData.totalTime;
    }
    
    const currentSession = Date.now() - timeTrackingData.startTime;
    return timeTrackingData.totalTime + currentSession;
}

// Funkce pro uložení aktuálního času
function saveCurrentTimeSpent() {
    if (!timeTrackingData.isActive || !timeTrackingData.expositionId || !timeTrackingData.sceneId) {
        return;
    }
    
    const currentTime = getCurrentTimeSpent();
    const savedData = getTimeTrackingData();
    const sceneKey = `${timeTrackingData.expositionId}_${timeTrackingData.sceneId}`;
    
    if (!savedData[sceneKey]) {
        savedData[sceneKey] = {};
    }
    
    savedData[sceneKey].totalTime = currentTime;
    savedData[sceneKey].lastUpdated = Date.now();
    savedData[sceneKey].expositionId = timeTrackingData.expositionId;
    savedData[sceneKey].sceneId = timeTrackingData.sceneId;
    
    saveTimeTrackingData(savedData);
    
    console.log(`💾 Time saved for ${sceneKey}: ${Math.round(currentTime/1000)}s`);
}

// Funkce pro finalizaci time tracking
function finalizeTimeTracking(expositionId, sceneId) {
    console.log(`🏁 Finalizing time tracking for ${expositionId}/${sceneId}`);
    
    if (timeTrackingData.isActive) {
        saveCurrentTimeSpent();
        timeTrackingData.isActive = false;
        
        // Zkontroluj časové achievementy
        checkTimeBasedAchievements(expositionId, sceneId);
    }
}

// Funkce pro pozastavení time tracking
function pauseTimeTracking() {
    if (timeTrackingData.isActive) {
        console.log("⏸️ Pausing time tracking");
        saveCurrentTimeSpent();
        timeTrackingData.startTime = null;
    }
}

// Funkce pro obnovení time tracking
function resumeTimeTracking() {
    if (timeTrackingData.isActive && !timeTrackingData.startTime) {
        console.log("▶️ Resuming time tracking");
        timeTrackingData.startTime = Date.now();
    }
}

// Funkce pro získání času stráveného v konkrétní scéně
function getTimeSpentInScene(expositionId, sceneId) {
    const savedData = getTimeTrackingData();
    const sceneKey = `${expositionId}_${sceneId}`;
    
    if (savedData[sceneKey]) {
        return savedData[sceneKey].totalTime || 0;
    }
    
    // Pokud je to aktuální aktivní scéna, vrať aktuální čas
    if (timeTrackingData.expositionId === expositionId && 
        timeTrackingData.sceneId === sceneId && 
        timeTrackingData.isActive) {
        return getCurrentTimeSpent();
    }
    
    return 0;
}

// Funkce pro kontrolu časových achievementů
function checkTimeBasedAchievements(expositionId, sceneId) {
    const timeSpent = getTimeSpentInScene(expositionId, sceneId);
    const timeSpentSeconds = Math.floor(timeSpent / 1000);
    
    console.log(`⏱️ Checking time achievements for ${sceneId}: ${timeSpentSeconds}s`);
    
    // Projdi všechny achievementy a zkontroluj časové podmínky
    Object.keys(ACHIEVEMENTS_CONFIG).forEach(achievementId => {
        const achievement = ACHIEVEMENTS_CONFIG[achievementId];
        
        // Pokud je achievement pro tuto scénu a má časovou podmínku
        if (achievement.sceneId === sceneId && achievement.condition) {
            let shouldUnlock = false;
            
            switch (achievement.condition) {
                case 'time_spent_30s':
                    shouldUnlock = timeSpentSeconds >= 30;
                    break;
                case 'time_spent_60s':
                    shouldUnlock = timeSpentSeconds >= 60;
                    break;
                case 'time_spent_2min':
                    shouldUnlock = timeSpentSeconds >= 120;
                    break;
                case 'time_spent_5min':
                    shouldUnlock = timeSpentSeconds >= 300;
                    break;
            }
            
            if (shouldUnlock) {
                console.log(`🏆 Time achievement unlocked: ${achievementId} (${timeSpentSeconds}s)`);
                unlockAchievement(achievementId);
            }
        }
    });
    
    // Zkontroluj také globální časové achievementy
    checkGlobalTimeAchievements();
}

// Funkce pro kontrolu globálních časových achievementů
function checkGlobalTimeAchievements() {
    const savedData = getTimeTrackingData();
    let totalTime = 0;
    
    // Sečti všechny časy
    Object.values(savedData).forEach(sceneData => {
        if (sceneData.totalTime) {
            totalTime += sceneData.totalTime;
        }
    });
    
    // Přidej aktuální session čas, pokud je aktivní
    if (timeTrackingData.isActive) {
        totalTime += getCurrentTimeSpent();
    }
    
    const totalMinutes = Math.floor(totalTime / (1000 * 60));
    
    // Kontrola globálních časových achievementů
    if (totalMinutes >= 30) {
        unlockAchievement('marathon_visitor');
    }
    
    console.log(`📊 Total time spent across all scenes: ${totalMinutes} minutes`);
}

// Automatické ukládání času každých 10 sekund
setInterval(() => {
    if (timeTrackingData.isActive) {
        saveCurrentTimeSpent();
        
        // Zkontroluj časové achievementy každých 10 sekund pro aktivní scénu
        if (timeTrackingData.expositionId && timeTrackingData.sceneId) {
            checkTimeBasedAchievements(timeTrackingData.expositionId, timeTrackingData.sceneId);
        }
    }
}, 10000);

// === GAMIFIKAČNÍ SYSTÉM ===

// Funkce pro získání dat PRO KONKRÉTNÍ EXPOZICI
function getGamificationData(expositionId) {
    const totalData = localStorage.getItem(BASE_STORAGE_KEY);
    const parsedTotalData = totalData ? JSON.parse(totalData) : {};
    return parsedTotalData[expositionId] || {};
}

// Funkce pro uložení dat PRO KONKRÉTNÍ EXPOZICI
function saveGamificationData(expositionId, expositionData) {
    const totalData = localStorage.getItem(BASE_STORAGE_KEY);
    const parsedTotalData = totalData ? JSON.parse(totalData) : {};
    parsedTotalData[expositionId] = expositionData;
    localStorage.setItem(BASE_STORAGE_KEY, JSON.stringify(parsedTotalData));
}

// === ACHIEVEMENT SYSTÉM S FRONTOU ===

// Funkce pro získání všech achievement dat
function getAchievementData() {
    const data = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
}

// Funkce pro uložení achievement dat
function saveAchievementData(achievementData) {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievementData));
}

// Funkce pro kontrolu, zda je achievement odemčený
function isAchievementUnlocked(achievementId) {
    const achievementData = getAchievementData();
    return achievementData[achievementId] && achievementData[achievementId].unlocked;
}

// Funkce pro přidání achievementu do fronty
function queueAchievementNotification(achievementId) {
    achievementQueue.push(achievementId);
    processAchievementQueue();
}

// Zpracování fronty achievementů
function processAchievementQueue() {
    if (isShowingAchievement || achievementQueue.length === 0) {
        return;
    }
    
    isShowingAchievement = true;
    const achievementId = achievementQueue.shift();
    showAchievementNotification(achievementId);
}

// HLAVNÍ funkce pro odemknutí achievementu s frontou
function unlockAchievement(achievementId) {
    if (isAchievementUnlocked(achievementId)) {
        return false; // Už je odemčený
    }
    
    const achievementData = getAchievementData();
    achievementData[achievementId] = {
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        exposition: getCurrentExpositionId()
    };
    
    saveAchievementData(achievementData);
    
    // Přidáme achievement do fronty místo okamžitého zobrazení
    queueAchievementNotification(achievementId);
    
    console.log(`🏆 Achievement unlocked: ${achievementId}`);
    return true;
}

// Funkce pro zobrazení notifikace achievementu
function showAchievementNotification(achievementId) {
    const achievement = ACHIEVEMENTS_CONFIG[achievementId];
    if (!achievement) {
        console.warn(`⚠️ Achievement ${achievementId} not found in config`);
        isShowingAchievement = false;
        processAchievementQueue(); // Pokračuj s dalším
        return;
    }
    
    // Vytvoření notifikace
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-notification-content">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <h4>🏆 Nový Achievement!</h4>
                <p><strong>${achievement.name}</strong></p>
                <p>${achievement.description}</p>
            </div>
        </div>
    `;
    
    // Přidání stylů pro notifikaci (pokud ještě neexistují)
    if (!document.getElementById('achievement-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'achievement-notification-styles';
        styles.textContent = `
            .achievement-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 300px;
                animation: slideInRight 0.5s ease-out;
                border: 3px solid #ff6b35;
                cursor: pointer;
                transition: transform 0.2s ease;
            }
            
            .achievement-notification:hover {
                transform: scale(1.05);
            }
            
            .achievement-notification.fade-out {
                animation: fadeOut 0.5s ease-in forwards;
            }
            
            .achievement-notification-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .achievement-icon {
                font-size: 2.5em;
                flex-shrink: 0;
            }
            .achievement-text h4 {
                margin: 0 0 5px 0;
                color: #333;
                font-size: 1.1em;
            }
            .achievement-text p {
                margin: 0;
                color: #555;
                font-size: 0.9em;
            }
            
            /* Animace */
            @keyframes slideInRight {
                from { 
                    transform: translateX(100%); 
                    opacity: 0; 
                }
                to { 
                    transform: translateX(0); 
                    opacity: 1; 
                }
            }
            @keyframes fadeOut {
                to { 
                    transform: translateX(100%); 
                    opacity: 0; 
                }
            }
            
            /* Speciální efekt pro vzácné achievementy */
            .achievement-notification.legendary {
                border-color: #ffc107;
                background: linear-gradient(135deg, #ffd700, #ffed4e, #ffc107);
                animation: slideInRight 0.5s ease-out, pulse 0.3s ease-in-out 0.5s;
            }
            
            .achievement-notification.rare {
                border-color: #007bff;
                background: linear-gradient(135deg, #4fc3f7, #29b6f6, #03a9f4);
                color: white;
            }
            
            .achievement-notification.rare .achievement-text h4,
            .achievement-notification.rare .achievement-text p {
                color: white;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Přidej speciální třídy podle rarity
    if (achievement.rarity === 'legendary') {
        notification.classList.add('legendary');
    } else if (achievement.rarity === 'rare') {
        notification.classList.add('rare');
    }
    
    document.body.appendChild(notification);
    
    // Možnost zavřít kliknutím
    notification.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // Automatické zavření po 4 sekundách
    setTimeout(() => {
        hideNotification(notification);
    }, 4000);
    
    console.log(`🔔 Achievement notification shown: ${achievement.name}`);
}

// Funkce pro skrytí notifikace s callback
function hideNotification(notification) {
    if (!notification.parentNode) return;
    
    notification.classList.add('fade-out');
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
        
        // Označ, že notifikace skončila a zpracuj další
        isShowingAchievement = false;
        processAchievementQueue();
    }, 500); // Čas pro fade-out animaci
}

// === KONTROLA ACHIEVEMENTŮ ===

// Kontrola achievementů pro konkrétní expozici
function checkExpositionAchievements(expositionId) {
    console.log(`🔍 Checking exposition achievements for: ${expositionId}`);
    
    const expoData = getGamificationData(expositionId);
    const expositionConfig = Object.keys(SCENE_CONFIG).filter(sceneId => 
        sceneId.includes(`/${expositionId}/`) || sceneId.includes(`_${expositionId}/`)
    );
    
    if (expositionConfig.length === 0) {
        console.warn(`⚠️ No scenes found for exposition: ${expositionId}`);
        return;
    }
    
    console.log(`📋 Found ${expositionConfig.length} scenes for ${expositionId}:`, expositionConfig);
    
    // Počítání dokončených scén
    let completedScenes = 0;
    let totalScenes = expositionConfig.length;
    let totalGoldStars = 0;
    let totalSilverStars = 0;
    let totalBronzeStars = 0;
    
    expositionConfig.forEach(sceneId => {
        const starLevel = getSceneStarLevel(expositionId, sceneId);
        if (starLevel !== 'none') {
            completedScenes++;
            if (starLevel === 'gold') totalGoldStars++;
            else if (starLevel === 'silver') totalSilverStars++;
            else if (starLevel === 'bronze') totalBronzeStars++;
        }
    });
    
    console.log(`📊 Progress for ${expositionId}: ${completedScenes}/${totalScenes} scenes, ${totalGoldStars} gold stars`);
    
    // Kontrola různých typů achievementů
    
    // 1. První dokončení scény v expozici
    if (completedScenes === 1) {
        unlockAchievement(`${expositionId}_first_scene`);
    }
    
    // 2. Dokončení poloviny scén
    if (completedScenes >= Math.ceil(totalScenes / 2)) {
        unlockAchievement(`${expositionId}_half_complete`);
    }
    
    // 3. Dokončení všech scén
    if (completedScenes === totalScenes) {
        unlockAchievement(`${expositionId}_all_scenes`);
    }
    
    // 4. Získání všech zlatých hvězd
    if (totalGoldStars === totalScenes) {
        unlockAchievement(`${expositionId}_perfectionist`);
    }
    
    // 5. Sběratelské achievementy
    if (totalGoldStars >= 3) {
        unlockAchievement(`${expositionId}_gold_collector`);
    }
    
    // 6. Kontrola globálních achievementů
    checkGlobalAchievements();
}

// Funkce pro kontrolu globálních achievementů (napříč expozicemi)
function checkGlobalAchievements() {
    const allData = localStorage.getItem(BASE_STORAGE_KEY);
    if (!allData) return;
    
    const parsedData = JSON.parse(allData);
    const expositions = Object.keys(parsedData);
    
    let totalCompletedExpositions = 0;
    let totalGoldStars = 0;
    
    expositions.forEach(expositionId => {
        const expoData = parsedData[expositionId];
        const expositionScenes = Object.keys(SCENE_CONFIG).filter(sceneId => 
            sceneId.includes(`/${expositionId}/`) || sceneId.includes(`_${expositionId}/`)
        );
        
        let completedScenes = 0;
        let goldStars = 0;
        
        expositionScenes.forEach(sceneId => {
            const starLevel = getSceneStarLevel(expositionId, sceneId);
            if (starLevel !== 'none') completedScenes++;
            if (starLevel === 'gold') {
                goldStars++;
                totalGoldStars++;
            }
        });
        
        if (completedScenes === expositionScenes.length) {
            totalCompletedExpositions++;
        }
    });
    
    // Globální achievementy
    if (totalCompletedExpositions >= 1) {
        unlockAchievement('global_first_exposition');
    }
    
    if (totalCompletedExpositions >= 3) {
        unlockAchievement('global_explorer');
    }
    
    if (totalGoldStars >= 10) {
        unlockAchievement('global_star_collector');
    }
    
    if (totalGoldStars >= 25) {
        unlockAchievement('global_master_collector');
    }
}

// Záznam aktivace markeru s vylepšenou logikou
function recordMarkerActivation(expositionId, sceneId, markerId) {
    console.log(`🎯 Recording marker activation: ${markerId} in scene ${sceneId} for exposition ${expositionId}`);
    
    const expoData = getGamificationData(expositionId);

    if (!expoData[sceneId]) {
        expoData[sceneId] = {};
    }

    // Zkontroluj, zda marker existuje v konfiguraci
    if (SCENE_CONFIG[sceneId] && SCENE_CONFIG[sceneId].markers && SCENE_CONFIG[sceneId].markers.includes(markerId)) {
        // Zkontroluj, zda je to první aktivace tohoto markeru
        const isFirstActivation = !expoData[sceneId][markerId];
        
        if (isFirstActivation) {
            expoData[sceneId][markerId] = true;
            saveGamificationData(expositionId, expoData);
            
            console.log(`✅ Marker ${markerId} activated for the first time in scene ${sceneId}`);
            
            // Kontrola marker-specifických achievementů
            checkMarkerSpecificAchievements(expositionId, sceneId, markerId);
            
            // Kontrola scény-specifických achievementů
            checkSceneSpecificAchievements(expositionId, sceneId);
            
            // Kontrola expozice-specifických achievementů
            checkExpositionAchievements(expositionId);
            
            // Speciální achievement pro první marker celkově
            checkFirstMarkerAchievement();
        } else {
            console.log(`ℹ️ Marker ${markerId} already activated previously`);
        }
    } else {
        console.warn(`⚠️ Marker ID "${markerId}" not found in scene "${sceneId}" config for exposition "${expositionId}"`);
    }
}

// Kontrola marker-specifických achievementů
function checkMarkerSpecificAchievements(expositionId, sceneId, markerId) {
    console.log(`🔍 Checking marker-specific achievements for ${markerId}`);
    
    // Najdi všechny achievementy pro tento konkrétní marker
    Object.keys(ACHIEVEMENTS_CONFIG).forEach(achievementId => {
        const achievement = ACHIEVEMENTS_CONFIG[achievementId];
        
        // Pokud je achievement vázaný na konkrétní marker
        if (achievement.markerId === markerId && achievement.sceneId === sceneId) {
            console.log(`🎯 Found marker achievement: ${achievementId} for marker ${markerId}`);
            unlockAchievement(achievementId);
        }
    });
}

// Funkce pro kontrolu prvního markeru celkově
function checkFirstMarkerAchievement() {
    const allData = localStorage.getItem(BASE_STORAGE_KEY);
    if (!allData) return;
    
    const parsedData = JSON.parse(allData);
    let totalMarkers = 0;
    
    Object.values(parsedData).forEach(expositionData => {
        Object.values(expositionData).forEach(sceneData => {
            totalMarkers += Object.values(sceneData).filter(marker => marker === true).length;
        });
    });
    
    if (totalMarkers === 1) {
        unlockAchievement('global_first_marker');
    }
}

// Kontrola specifických achievementů pro scény
function checkSceneSpecificAchievements(expositionId, sceneId) {
    console.log(`🔍 Checking scene-specific achievements for ${sceneId}`);
    
    const starLevel = getSceneStarLevel(expositionId, sceneId);
    const expoData = getGamificationData(expositionId);
    const sceneData = expoData[sceneId] || {};
    const config = SCENE_CONFIG[sceneId];
    
    if (!config) return;
    
    const activatedMarkersCount = Object.keys(sceneData).filter(markerId => sceneData[markerId] === true).length;
    const totalMarkersInScene = config.totalMarkers;
    
    // Najdi všechny achievementy pro tuto konkrétní scénu
    Object.keys(ACHIEVEMENTS_CONFIG).forEach(achievementId => {
        const achievement = ACHIEVEMENTS_CONFIG[achievementId];
        
        // Pokud je achievement vázaný na konkrétní scénu
        if (achievement.sceneId === sceneId) {
            let shouldUnlock = false;
            
            switch (achievement.condition) {
                case 'complete_scene':
                    shouldUnlock = starLevel !== 'none';
                    break;
                case 'gold_star_in_scene':
                    shouldUnlock = starLevel === 'gold';
                    break;
                case 'silver_star_in_scene':
                    shouldUnlock = starLevel === 'silver' || starLevel === 'gold';
                    break;
                case 'bronze_star_in_scene':
                    shouldUnlock = starLevel === 'bronze' || starLevel === 'silver' || starLevel === 'gold';
                    break;
                case 'complete_all_markers':
                    shouldUnlock = activatedMarkersCount === totalMarkersInScene;
                    break;
                // Časové podmínky jsou řešeny v checkTimeBasedAchievements
            }
            
            if (shouldUnlock) {
                console.log(`🏆 Scene achievement unlocked: ${achievementId}`);
                unlockAchievement(achievementId);
            }
        }
    });
}

// === HVĚZDNÝ SYSTÉM ===

// Funkce pro získání úrovně hvězd
function getSceneStarLevel(expositionId, sceneId) {
    const expoData = getGamificationData(expositionId);
    const sceneData = expoData[sceneId] || {};
    const config = SCENE_CONFIG[sceneId];

    if (!config) {
        console.warn(`Configuration for scene ${sceneId} not found in SCENE_CONFIG.`);
        return 'none';
    }
    
    if (typeof config.totalMarkers !== 'number' || !Array.isArray(config.markers)) {
        console.warn(`Configuration for scene ${sceneId} is incomplete or malformed.`);
        return 'none';
    }

    const activatedMarkersCount = Object.keys(sceneData).filter(markerId => sceneData[markerId] === true).length;
    const totalMarkersInScene = config.totalMarkers;

    if (totalMarkersInScene === 0 || activatedMarkersCount === 0) {
        return 'none';
    }

    if (totalMarkersInScene === 1) {
        if (activatedMarkersCount === 1) return 'gold';
    } else if (totalMarkersInScene === 2) {
        if (activatedMarkersCount === 2) return 'gold';
        if (activatedMarkersCount === 1) return 'silver';
    } else if (totalMarkersInScene === 3) {
        if (activatedMarkersCount === 3) return 'gold';
        if (activatedMarkersCount >= 2) return 'silver';
        if (activatedMarkersCount >= 1) return 'bronze';
    } else {
        if (activatedMarkersCount >= totalMarkersInScene) return 'gold';
        if (activatedMarkersCount >= Math.ceil(totalMarkersInScene / 2)) return 'silver';
        if (activatedMarkersCount > 0) return 'bronze';
    }

    return 'none';
}

// Funkce pro zobrazení hvězd
function displayStars(starElement, level) {
    let starsHtml = '';
    switch (level) {
        case 'bronze':
            starsHtml = '<img src="/img/bronze_star.png" alt="Bronzová hvězda" class="star-image">';
            break;
        case 'silver':
            starsHtml = '<img src="/img/silver_star.png" alt="Stříbrná hvězda" class="star-image">';
            break;
        case 'gold':
            starsHtml = '<img src="/img/gold_star.png" alt="Zlatá hvězda" class="star-image">';
            break;
        default:
            starsHtml = '';
    }
    if (starElement) {
        starElement.innerHTML = starsHtml;
    }
}

// === UTILITY FUNKCE ===

// Funkce pro získání všech odemčených achievementů pro inventář
function getUnlockedAchievements() {
    const achievementData = getAchievementData();
    const unlocked = [];
    
    Object.keys(achievementData).forEach(achievementId => {
        if (achievementData[achievementId].unlocked) {
            const config = ACHIEVEMENTS_CONFIG[achievementId];
            if (config) {
                unlocked.push({
                    id: achievementId,
                    name: config.name,
                    description: config.description,
                    icon: config.icon,
                    category: config.category,
                    rarity: config.rarity,
                    unlockedAt: achievementData[achievementId].unlockedAt
                });
            }
        }
    });
    
    return unlocked.sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt));
}

// Funkce pro získání progress pro konkrétní kategorii achievementů
function getAchievementProgress(category) {
    const categoryAchievements = Object.keys(ACHIEVEMENTS_CONFIG).filter(
        achievementId => ACHIEVEMENTS_CONFIG[achievementId].category === category
    );
    
    const unlockedCount = categoryAchievements.filter(
        achievementId => isAchievementUnlocked(achievementId)
    ).length;
    
    return {
        unlocked: unlockedCount,
        total: categoryAchievements.length,
        percentage: Math.round((unlockedCount / categoryAchievements.length) * 100)
    };
}

// === DEBUGGING FUNKCE ===

// Funkce pro debug výpis stavu gamifikace
function debugGamificationState() {
    console.log("=== GAMIFICATION DEBUG STATE ===");
    console.log("Available expositions:", Object.keys(EXPOSITION_REGISTRY || {}));
    console.log("Scene config keys:", Object.keys(SCENE_CONFIG || {}));
    console.log("Achievement config keys:", Object.keys(ACHIEVEMENTS_CONFIG || {}));
    console.log("Current data:", localStorage.getItem(BASE_STORAGE_KEY));
    console.log("Current achievements:", localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY));
    console.log("Achievement queue:", achievementQueue);
    console.log("Is showing achievement:", isShowingAchievement);
    console.log("=== END DEBUG STATE ===");
}

// Funkce pro vymazání všech gamifikačních dat (pro testování)
function resetGamificationData() {
    localStorage.removeItem(BASE_STORAGE_KEY);
    localStorage.removeItem(ACHIEVEMENTS_STORAGE_KEY);
    localStorage.removeItem(TIME_TRACKING_STORAGE_KEY);
    console.log("🔄 All gamification data reset!");
}

// Funkce pro vymazání fronty achievementů (pro debugging)
function clearAchievementQueue() {
    achievementQueue = [];
    isShowingAchievement = false;
    console.log("🔄 Achievement queue cleared");
}

// Funkce pro zobrazení aktuální fronty (pro debugging)
function showAchievementQueue() {
    console.log("📋 Current achievement queue:", achievementQueue);
    console.log("🎭 Is showing achievement:", isShowingAchievement);
}

// Funkce pro testování achievementů (pro debugging)
function testAchievementQueue() {
    console.log("🧪 Testing achievement queue with dummy achievements...");
    
    // Vytvoř testovací achievementy
    const testAchievements = [
        { id: 'test_1', name: 'Test Achievement 1', description: 'První testovací achievement', icon: '🎯', rarity: 'common' },
        { id: 'test_2', name: 'Test Achievement 2', description: 'Druhý testovací achievement', icon: '🏆', rarity: 'rare' },
        { id: 'test_3', name: 'Test Achievement 3', description: 'Třetí testovací achievement', icon: '👑', rarity: 'legendary' }
    ];
    
    // Přidej je do konfigurace
    testAchievements.forEach(achievement => {
        ACHIEVEMENTS_CONFIG[achievement.id] = achievement;
    });
    
    // Odemkni je postupně
    testAchievements.forEach(achievement => {
        unlockAchievement(achievement.id);
    });
}

// Globální dostupnost pro debugging
if (typeof window !== 'undefined') {
    window.debugGamificationState = debugGamificationState;
    window.resetGamificationData = resetGamificationData;
    window.clearAchievementQueue = clearAchievementQueue;
    window.showAchievementQueue = showAchievementQueue;
    window.testAchievementQueue = testAchievementQueue;
}

console.log("🎮 Enhanced gamification system loaded with achievement queue system");