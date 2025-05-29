// gamification-config.js - Rozšířený o Achievement systém

// Konfigurace scén - ZŮSTÁVÁ STEJNÁ.
const SCENE_CONFIG = {
    "/assets/kyjov/terce.html": {
        name: "Střelecké terče",
        totalMarkers: 4, 
        markers: ["terc_selim", "terc_kyjov_1", "terc_kyjov_2", "terc_kyjov_3"]
    },
    "/assets/kyjov/florian.html": {
        name: "Obraz sv. Floriána",
        totalMarkers: 1,
        markers: ["florian"]
    },
    "/assets/kyjov/scena_1.html": {
        name: "Obrazy v mezipatře",
        totalMarkers: 2,
        markers: ["joklik_video", "dinosauri_video"]
    },
    "/assets/kyjov/scena_3.html": {
        name: "3D Vědro",
        totalMarkers: 1,
        markers: ["vedro_model_kyjov"]
    },
    "/assets/kyjov/scena_2.html": {
        name: "Hádanky",
        totalMarkers: 3,
        markers: ["hadanka_masaryk", "hadanka_benes", "hadanka_adrianka"]
    }
    // Přidej další expozice zde...
    // "/assets/brno/scena_a.html": {
    //     name: "Brno Scéna A",
    //     totalMarkers: 2,
    //     markers: ["brno_marker1", "brno_marker2"]
    // }
};

// === ACHIEVEMENT KONFIGURACE ===

const ACHIEVEMENTS_CONFIG = {
    // === KYJOV SPECIFICKÉ ACHIEVEMENTY ===
    
    // První scéna
    "kyjov_first_scene": {
        name: "První krůčky v Kyjově",
        description: "Dokončil jsi první scénu v Muzeu Kyjovska",
        icon: "🏛️",
        category: "kyjov",
        rarity: "common",
        image: "/img/achievements/kyjov_first_scene.png"
    },

    // Polovina scén
    "kyjov_half_complete": {
        name: "Průzkumník Kyjova",
        description: "Navštívil jsi polovinu expozic v Muzeu Kyjovska",
        icon: "🗺️",
        category: "kyjov",
        rarity: "uncommon",
        image: "/img/achievements/kyjov_half_complete.png"
    },

    // Všechny scény
    "kyjov_all_scenes": {
        name: "Znalec Kyjovska",
        description: "Dokončil jsi všechny scény v Muzeu Kyjovska",
        icon: "🎓",
        category: "kyjov",
        rarity: "rare",
        image: "/img/achievements/kyjov_all_scenes.png"
    },

    // Perfekcionista - všechny zlaté hvězdy
    "kyjov_perfectionist": {
        name: "Mistr Kyjovska",
        description: "Získal jsi zlaté hvězdy ve všech scénách Muzea Kyjovska",
        icon: "👑",
        category: "kyjov",
        rarity: "legendary",
        image: "/img/achievements/kyjov_perfectionist.png"
    },

    // Sběratel zlatých hvězd
    "kyjov_gold_collector": {
        name: "Sběratel zlatých hvězd",
        description: "Získal jsi alespoň 3 zlaté hvězdy v Kyjově",
        icon: "⭐",
        category: "kyjov",
        rarity: "uncommon",
        image: "/img/achievements/kyjov_gold_collector.png"
    },

    // === SPECIFICKÉ ACHIEVEMENTY PRO JEDNOTLIVÉ SCÉNY ===
    
    "kyjov_archer_master": {
        name: "Mistr střelby",
        description: "Prozkoumal jsi všechny střelecké terče do detailu",
        icon: "🏹",
        category: "kyjov",
        rarity: "rare",
        condition: "gold_star_in_scene",
        sceneId: "/assets/kyjov/terce.html",
        image: "/img/achievements/archer_master.png"
    },

    "kyjov_saint_devotee": {
        name: "Ctitel sv. Floriána", 
        description: "Strávil jsi alespoň 30 sekund pozorováním obrazu sv. Floriána",
        icon: "🔥",
        category: "kyjov",
        rarity: "uncommon",
        condition: "time_spent_30s",
        sceneId: "/assets/kyjov/florian.html",
        image: "/img/achievements/saint_devotee.png"
    },

    "kyjov_contemplative": {
        name: "Kontemplativní návštěvník",
        description: "Strávil jsi 2 minuty v hluboké kontemplaci u sv. Floriána",
        icon: "🧘",
        category: "kyjov", 
        rarity: "rare",
        condition: "time_spent_2min",
        sceneId: "/assets/kyjov/florian.html",
        image: "/img/achievements/contemplative.png"
    },

    "kyjov_art_lover": {
        name: "Milovník umění",
        description: "Strávil jsi 2 minuty obdivováním obrazů v mezipatře",
        icon: "🖼️",
        category: "kyjov",
        rarity: "uncommon",
        condition: "time_spent_2min",
        sceneId: "/assets/kyjov/scena_1.html",
        image: "/img/achievements/art_lover.png"
    },

    "kyjov_puzzle_solver": {
        name: "Řešitel hádanek",
        description: "Vyřešil jsi všechny hádanky v muzeu",
        icon: "🧩",
        category: "kyjov",
        rarity: "rare",
        condition: "gold_star_in_scene",
        sceneId: "/assets/kyjov/scena_2.html",
        image: "/img/achievements/puzzle_solver.png"
    },

    "kyjov_3d_explorer": {
        name: "3D Objevitel",
        description: "Prozkoumal jsi 3D model vědra ze všech stran",
        icon: "🪣",
        category: "kyjov",
        rarity: "uncommon",
        condition: "time_spent_30s",
        sceneId: "/assets/kyjov/scena_3.html",
        image: "/img/achievements/3d_explorer.png"
    },

    // === GLOBÁLNÍ ACHIEVEMENTY ===
    
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
        description: "Dokončil jsi svou první kompletní expozici",
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

    // === ČASOVÉ ACHIEVEMENTY (pro budoucí rozšíření) ===
    
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

    // === SKRYTÉ ACHIEVEMENTY ===
    
    "secret_discoverer": {
        name: "Objevitel tajemství",
        description: "Našel jsi skrytý easter egg",
        icon: "🔍",
        category: "secret",
        rarity: "legendary",
        hidden: true,
        image: "/img/achievements/secret_discoverer.png"
    }

    // === TEMPLATE PRO DALŠÍ EXPOZICE ===
    // Když přidáš novou expozici, zkopíruj a uprav tento template:
    
    /*
    // === [NÁZEV_EXPOZICE] SPECIFICKÉ ACHIEVEMENTY ===
    
    "[expo_id]_first_scene": {
        name: "První krůčky v [Název]",
        description: "Dokončil jsi první scénu v [Název expozice]",
        icon: "🏛️", // změň podle typu expozice
        category: "[expo_id]",
        rarity: "common",
        image: "/img/achievements/[expo_id]_first_scene.png"
    },

    "[expo_id]_all_scenes": {
        name: "Znalec [Názvu]",
        description: "Dokončil jsi všechny scény v [Název expozice]",
        icon: "🎓",
        category: "[expo_id]",
        rarity: "rare",
        image: "/img/achievements/[expo_id]_all_scenes.png"
    },

    "[expo_id]_perfectionist": {
        name: "Mistr [Názvu]",
        description: "Získal jsi zlaté hvězdy ve všech scénách [Název expozice]",
        icon: "👑",
        category: "[expo_id]",
        rarity: "legendary",
        image: "/img/achievements/[expo_id]_perfectionist.png"
    }
    */
};

// Konfigurace kategorií achievementů pro inventář
const ACHIEVEMENT_CATEGORIES = {
    "global": {
        name: "Globální úspěchy",
        description: "Achievementy za celkový progress",
        icon: "🌍",
        color: "#667eea"
    },
    "kyjov": {
        name: "Muzeum Kyjovska",
        description: "Úspěchy v Muzeu Kyjovska",
        icon: "🏛️",
        color: "#28a745"
    },
    "secret": {
        name: "Skryté úspěchy",
        description: "Tajné a vzácné achievementy",
        icon: "🔍",
        color: "#6f42c1"
    }
    // Přidej další kategorie pro nové expozice...
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

// Funkce pro získání ID aktuální scény z URL - ZŮSTÁVÁ STEJNÁ
function getCurrentSceneId() {
    return window.location.pathname;
}

// Funkce pro získání ID aktuální expozice z URL - ZŮSTÁVÁ STEJNÁ
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
