// gamification-config.js - Hlavní konfigurace (bez expozice-specifických dat)

// === GLOBÁLNÍ KONFIGURACE ===

// Registry všech dostupných expozic - dynamicky se naplní
let SCENE_CONFIG = {};
let ACHIEVEMENTS_CONFIG = {};

// Konfigurace kategorií achievementů pro inventář
const ACHIEVEMENT_CATEGORIES = {
    "global": {
        name: "Globální úspěchy",
        description: "Achievementy za celkový progress",
        icon: "🌍",
        color: "#667eea"
    },
    "secret": {
        name: "Skryté úspěchy",
        description: "Tajné a vzácné achievementy",
        icon: "🔍",
        color: "#6f42c1"
    }
    // Expozice-specifické kategorie se přidají dynamicky
};

// Konfigurace rarity achievementů
const RARITY_CONFIG = {
    "common": {
        name: "Běžný",
        color: "#6c757d",
        glow: "none"
    },
    "uncommon": {
        name: "Neobvyklý", 
        color: "#28a745",
        glow: "0 0 10px rgba(40, 167, 69, 0.5)"
    },
    "rare": {
        name: "Vzácný",
        color: "#007bff",
        glow: "0 0 15px rgba(0, 123, 255, 0.5)"
    },
    "legendary": {
        name: "Legendární",
        color: "#ffc107",
        glow: "0 0 20px rgba(255, 193, 7, 0.7)"
    }
};

// === GLOBÁLNÍ ACHIEVEMENTY (nezávislé na expozici) ===
const GLOBAL_ACHIEVEMENTS = {
    "global_first_marker": {
        name: "První kontakt",
        description: "Aktivoval jsi svůj první AR marker",
        icon: "🎯",
        category: "global",
        rarity: "common",
        image: "/img/achievements/first_marker.png"
    },

    "global_first_exposition": {
        name: "Průkopník",
        description: "Proletěl jsi první expozici a nakoukl do všech scén",
        icon: "🚀",
        category: "global",
        rarity: "uncommon",
        image: "/img/achievements/first_exposition.png"
    },

    "global_explorer": {
        name: "Velký průzkumník",
        description: "Dokončil jsi 3 různé expozice",
        icon: "🌍",
        category: "global",
        rarity: "rare",
        image: "/img/achievements/explorer.png"
    },

    "global_star_collector": {
        name: "Hvězdný sběratel",
        description: "Nasbíral jsi celkem 10 zlatých hvězd",
        icon: "🌟",
        category: "global",
        rarity: "rare",
        image: "/img/achievements/star_collector.png"
    },

    "global_master_collector": {
        name: "Mistr sběratel",
        description: "Nasbíral jsi neuvěřitelných 25 zlatých hvězd!",
        icon: "💎",
        category: "global",
        rarity: "legendary",
        image: "/img/achievements/master_collector.png"
    },

    "speed_runner": {
        name: "Rychlík",
        description: "Dokončil jsi scénu pod 2 minuty",
        icon: "⚡",
        category: "global",
        rarity: "rare",
        image: "/img/achievements/speed_runner.png"
    },

    "marathon_visitor": {
        name: "Maratonský návštěvník",
        description: "Strávil jsi v aplikaci více než 30 minut",
        icon: "⏰",
        category: "global",
        rarity: "uncommon",
        image: "/img/achievements/marathon_visitor.png"
    },

    "secret_discoverer": {
        name: "Objevitel tajemství",
        description: "Našel jsi skrytý easter egg",
        icon: "🔍",
        category: "secret",
        rarity: "legendary",
        hidden: true,
        image: "/img/achievements/secret_discoverer.png"
    }
};

// === REGISTRACE EXPOZIC ===

// Objekt pro registraci konfigurací expozic
const EXPOSITION_REGISTRY = {};

// Funkce pro registraci nové expozice
function registerExposition(expositionId, config) {
    console.log(`📝 Registering exposition: ${expositionId}`);
    
    if (!config.scenes || !config.achievements || !config.category) {
        console.error(`❌ Invalid exposition config for ${expositionId}. Missing required properties.`);
        return false;
    }
    
    // Přidej scény do globálního registru
    Object.assign(SCENE_CONFIG, config.scenes);
    
    // Přidej achievementy do globálního registru
    Object.assign(ACHIEVEMENTS_CONFIG, config.achievements);
    
    // Přidej kategorii do ACHIEVEMENT_CATEGORIES
    if (config.category) {
        ACHIEVEMENT_CATEGORIES[expositionId] = config.category;
    }
    
    // Ulož do registru pro případné budoucí použití
    EXPOSITION_REGISTRY[expositionId] = config;
    
    console.log(`✅ Exposition ${expositionId} registered successfully`);
    return true;
}

// Funkce pro načtení všech registrovaných expozic
function initializeExpositions() {
    console.log("🚀 Initializing exposition system...");
    
    // Přidej globální achievementy
    Object.assign(ACHIEVEMENTS_CONFIG, GLOBAL_ACHIEVEMENTS);
    
    console.log(`📊 Loaded ${Object.keys(SCENE_CONFIG).length} scenes across ${Object.keys(EXPOSITION_REGISTRY).length} expositions`);
    console.log(`🏆 Loaded ${Object.keys(ACHIEVEMENTS_CONFIG).length} achievements`);
}

// === HELPER FUNKCE ===

// Funkce pro získání ID aktuální scény z URL
function getCurrentSceneId() {
    return window.location.pathname;
}

// Funkce pro získání ID aktuální expozice z URL
function getCurrentExpositionId() {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length >= 3 && pathParts[1] === 'assets') {
        return pathParts[2];
    }
    
    console.warn("Could not determine exposition ID from path:", window.location.pathname, ". Using default ID 'unknown'.");
    return 'unknown';
}

// Pomocné funkce pro práci s achievementy

// Získání všech achievementů pro konkrétní kategorii
function getAchievementsByCategory(category) {
    return Object.keys(ACHIEVEMENTS_CONFIG)
        .filter(achievementId => ACHIEVEMENTS_CONFIG[achievementId].category === category)
        .map(achievementId => ({
            id: achievementId,
            ...ACHIEVEMENTS_CONFIG[achievementId]
        }));
}

// Získání achievementů podle rarity
function getAchievementsByRarity(rarity) {
    return Object.keys(ACHIEVEMENTS_CONFIG)
        .filter(achievementId => ACHIEVEMENTS_CONFIG[achievementId].rarity === rarity)
        .map(achievementId => ({
            id: achievementId,
            ...ACHIEVEMENTS_CONFIG[achievementId]
        }));
}

// Získání všech dostupných kategorií
function getAllCategories() {
    return Object.keys(ACHIEVEMENT_CATEGORIES);
}

// Kontrola, zda je achievement skrytý
function isAchievementHidden(achievementId) {
    const achievement = ACHIEVEMENTS_CONFIG[achievementId];
    return achievement && achievement.hidden === true;
}

// Funkce pro získání informací o expozici
function getExpositionInfo(expositionId) {
    return EXPOSITION_REGISTRY[expositionId] || null;
}

// Funkce pro získání všech registrovaných expozic
function getAllExpositions() {
    return Object.keys(EXPOSITION_REGISTRY);
}

// === TEMPLATE GENERATOR ===

// Funkce pro generování šablony pro novou expozici
function generateExpositionTemplate(expositionId, expositionName, expositionIcon = "🏛️", expositionColor = "#28a745") {
    return `// game/${expositionId}-config.js
// Konfigurace pro ${expositionName}

const ${expositionId.toUpperCase()}_EXPOSITION_CONFIG = {
    // === SCÉNY ===
    scenes: {
        "/assets/${expositionId}/terce.html": {
            name: "Střelecké terče",
            totalMarkers: 4,
            markers: ["terc_selim", "terc_kyjov_1", "terc_kyjov_2", "terc_kyjov_3"]
        },
        "/assets/${expositionId}/florian.html": {
            name: "Obraz sv. Floriána", 
            totalMarkers: 1,
            markers: ["florian"]
        }
        "/assets/${expositionId}/scena_1.html": {
            name: "Obrazy v mezipatře", 
            totalMarkers: 2,
            markers: ["joklik_video", "dinosauri_video"]
        }
         "/assets/${expositionId}/scena_3.html": {
            name: "3D Vědro", 
            totalMarkers: 1,
            markers: ["vedro_model_kyjov"]
        }
          "/assets/${expositionId}/scena_2.html": {
            name: "Hádanky", 
            totalMarkers: 3,
            markers: ["hadanka_masaryk", "hadanka_benes", "hadanka_adrianka"]
        }
        // Přidej další scény...
    },

    // === ACHIEVEMENTY ===
    achievements: {
        "${expositionId}_first_scene": {
            name: "První krůčky v ${expositionName}",
            description: "Dokončil jsi první scénu v ${expositionName}",
            icon: "${expositionIcon}",
            category: "${expositionId}",
            rarity: "common",
            image: "/img/achievements/${expositionId}_first_scene.png"
        },

        "${expositionId}_all_scenes": {
            name: "Znalec ${expositionName}",
            description: "Dokončil jsi všechny scény v ${expositionName}",
            icon: "🎓",
            category: "${expositionId}",
            rarity: "rare",
            image: "/img/achievements/${expositionId}_all_scenes.png"
        },

        "${expositionId}_perfectionist": {
            name: "Mistr ${expositionName}",
            description: "Získal jsi zlaté hvězdy ve všech scénách ${expositionName}",
            icon: "👑",
            category: "${expositionId}",
            rarity: "legendary",
            image: "/img/achievements/${expositionId}_perfectionist.png"
        }
        // Přidej další achievementy...
    },

    // === KATEGORIE ===
    category: {
        name: "${expositionName}",
        description: "Úspěchy v ${expositionName}",
        icon: "${expositionIcon}",
        color: "${expositionColor}"
    }
};

// Registrace expozice při načtení
document.addEventListener('DOMContentLoaded', () => {
    registerExposition('${expositionId}', ${expositionId.toUpperCase()}_EXPOSITION_CONFIG);
});`;
}

console.log("📚 Gamification config system loaded - ready for exposition registration");
