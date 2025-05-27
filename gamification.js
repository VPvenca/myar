// gamification.js - Rozšířený o Achievement systém

// Základní klíč pro ukládání všech gamifikačních dat
const BASE_STORAGE_KEY = 'arGamificationData'; 

// Klíč pro ukládání dat o achievementech
const ACHIEVEMENTS_STORAGE_KEY = 'arAchievements';

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
    return achievementData[achievementId] || false;
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

// Upravená funkce pro získání úrovně hvězd - ZŮSTÁVÁ STEJNÁ
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