// expositions/kyjov-config.js
// Konfigurace pro Muzeum Kyjovska

const KYJOV_EXPOSITION_CONFIG = {
    // === SCÉNY ===
    scenes: {
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
    },

    // === ACHIEVEMENTY ===
    achievements: {
        // === ZÁKLADNÍ ACHIEVEMENTY PRO EXPOZICI ===
        
        "kyjov_first_scene": {
            name: "První krůčky v Kyjově",
            description: "Dokončil jsi první scénu v Muzeu Kyjovska",
            icon: "🏛️",
            category: "kyjov",
            rarity: "common",
            image: "/img/achievements/kyjov_first_scene.png"
        },

        "kyjov_half_complete": {
            name: "Průzkumník Kyjova",
            description: "Navštívil jsi polovinu expozic v Muzeu Kyjovska",
            icon: "🗺️",
            category: "kyjov",
            rarity: "uncommon",
            image: "/img/achievements/kyjov_half_complete.png"
        },

        "kyjov_all_scenes": {
            name: "Znalec Kyjovska",
            description: "Dokončil jsi všechny scény v Muzeu Kyjovska",
            icon: "🎓",
            category: "kyjov",
            rarity: "rare",
            image: "/img/achievements/kyjov_all_scenes.png"
        },

        "kyjov_perfectionist": {
            name: "Mistr Kyjovska",
            description: "Získal jsi zlaté hvězdy ve všech scénách Muzea Kyjovska",
            icon: "👑",
            category: "kyjov",
            rarity: "legendary",
            image: "/img/achievements/kyjov_perfectionist.png"
        },

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
        }
    },

    // === KATEGORIE ===
    category: {
        name: "Muzeum Kyjovska",
        description: "Úspěchy v Muzeu Kyjovska",
        icon: "🏛️",
        color: "#28a745"
    },

    // === METADATA (volitelné) ===
    metadata: {
        displayName: "Muzeum Kyjovska",
        description: "Regionální muzeum s bohatou historií",
        website: "https://www.muzeum-kyjov.cz",
        address: "tř. Palackého 1373/13a, 697 01 Kyjov 1",
        coordinates: {
            lat: 49.0109,
            lng: 17.1237
        }
    }
};

// Automatická registrace při načtení skriptu
document.addEventListener('DOMContentLoaded', () => {
    registerExposition('kyjov', KYJOV_EXPOSITION_CONFIG);
});

console.log("🏛️ Kyjov exposition config loaded");