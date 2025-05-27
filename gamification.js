// gamification.js - Rozšířený o Achievement systém a Time Tracking

// Základní klíč pro ukládání všech gamifikačních dat
const BASE_STORAGE_KEY = 'arGamificationData'; 

// Klíč pro ukládání dat o achievementech
const ACHIEVEMENTS_STORAGE_KEY = 'arAchievements';

// Klíč pro ukládání time tracking dat
const TIME_TRACKING_STORAGE_KEY = 'arTimeTracking';

// === TIME TRACKING SYSTÉM ===

// Globální proměnné pro time tracking
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
                // Přidej další časové podmínky podle potřeby
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

// === PŮVODNÍ GAMIFIKAČNÍ SYSTÉM ===

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

// === ACHIEVEMENT SYSTÉM ===

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

// Funkce pro odemknutí achievementu
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
    
    // Zobrazit notifikaci o novém achievementu
    showAchievementNotification(achievementId);
    
    console.log(`🏆 Achievement unlocked: ${achievementId}`);
    return true;
}

// Funkce pro zobrazení notifikace o novém achievementu
function showAchievementNotification(achievementId) {
    const achievement = ACHIEVEMENTS_CONFIG[achievementId];
    if (!achievement) return;
    
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
                animation: slideInRight 0.5s ease-out, fadeOut 0.5s ease-in 4s forwards;
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
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Odstranění notifikace po 5 sekundách
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Funkce pro kontrolu achievementů pro konkrétní expozici
function checkExpositionAchievements(expositionId) {
    const expoData = getGamificationData(expositionId);
    const expositionConfig = Object.keys(SCENE_CONFIG).filter(sceneId => 
        sceneId.includes(`/${expositionId}/`)
    );
    
    if (expositionConfig.length === 0) return;
    
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
            sceneId.includes(`/${expositionId}/`)
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

// Upravená funkce pro záznam aktivace markeru - nyní s achievement kontrolou
function recordMarkerActivation(expositionId, sceneId, markerId) {
    const expoData = getGamificationData(expositionId);

    if (!expoData[sceneId]) {
        expoData[sceneId] = {};
    }

    if (SCENE_CONFIG[sceneId] && SCENE_CONFIG[sceneId].markers && SCENE_CONFIG[sceneId].markers.includes(markerId)) {
        // Zkontroluj, zda je to první aktivace tohoto markeru
        const isFirstActivation = !expoData[sceneId][markerId];
        
        expoData[sceneId][markerId] = true;
        saveGamificationData(expositionId, expoData);
        
        console.log(`Marker ${markerId} activated in scene ${sceneId} for exposition ${expositionId}`);
        
        // Pokud je to první aktivace, spusť kontrolu achievementů
        if (isFirstActivation) {
            checkExpositionAchievements(expositionId);
            checkSceneSpecificAchievements(expositionId, sceneId);
            
            // Speciální achievement pro první marker celkově
            checkFirstMarkerAchievement();
        }
    } else {
        console.warn(`Marker ID "${markerId}" (in scene "${sceneId}", exposition "${expositionId}") not found in SCENE_CONFIG or SCENE_CONFIG.markers is undefined. Activation not recorded.`);
    }
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

// Funkce pro kontrolu specifických achievementů pro scény (přesunutá z config)
function checkSceneSpecificAchievements(expositionId, sceneId) {
    const starLevel = getSceneStarLevel(expositionId, sceneId);
    
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
                // Časové podmínky jsou řešeny v checkTimeBasedAchievements
            }
            
            if (shouldUnlock) {
                unlockAchievement(achievementId);
            }
        }
    });
}

// Funkce pro získání úrovně hvězd - ZŮSTÁVÁ STEJNÁ
function getSceneStarLevel(expositionId, sceneId) {
    const expoData = getGamificationData(expositionId);
    const sceneData = expoData[sceneId] || {};
    const config = SCENE_CONFIG[sceneId];

    if (!config) {
        console.warn(`Configuration for scene ${sceneId} not found in SCENE_CONFIG.`);
        return 'none';
    }
    
    if (typeof config.totalMarkers !== 'number' || !Array.isArray(config.markers)) {
        console.warn(`Configuration for scene ${sceneId} is incomplete or malformed (totalMarkers should be a number, markers should be an array).`);
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

// Funkce pro zobrazení hvězd - ZŮSTÁVÁ STEJNÁ
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