// game/bohuslavice_stezka_config.js
// KOMPLETNĚ OPRAVENÁ Konfigurace pro Včelařskou stezku

const BOHUSLAVICE_STEZKA_EXPOSITION_CONFIG = {
    // === SCÉNY ===
    scenes: {
        "/assets/stezka_bohuslavice/vcela.html": {
            name: "Včelařská stezka",
            totalMarkers: 4, // 3 včely + 1 kvízový achievement
            markers: ["vcela_1", "vcela_2", "vcela_3", "bee_quiz_master"]
        }
    },

    // === ACHIEVEMENTY PRO VČELAŘSKOU STEZKU ===
    achievements: {
        // === MARKER-SPECIFICKÉ ACHIEVEMENTY ===
        "vcela_1_delnice": {
            name: "Pozorovatel dělnic",
            description: "Pochopil jsi život pracovitých dělnic",
            icon: "🐝",
            category: "stezka_bohuslavice",
            rarity: "uncommon",
            sceneId: "/assets/stezka_bohuslavice/vcela.html",
            markerId: "vcela_1",
            image: "/img/achievements/delnice.png"
        },

        "vcela_2_trubec": {
            name: "Badatel trubců",
            description: "Se zájmem jsi prostudoval život trubců",
            icon: "🐛",
            category: "stezka_bohuslavice",
            rarity: "uncommon",
            sceneId: "/assets/stezka_bohuslavice/vcela.html",
            markerId: "vcela_2",
            image: "/img/achievements/trubec.png"
        },

        "vcela_3_kralovna": {
            name: "Ctitel královny",
            description: "Nahlédl jsi do života včelí královny",
            icon: "👑",
            category: "stezka_bohuslavice",
            rarity: "uncommon", 
            sceneId: "/assets/stezka_bohuslavice/vcela.html",
            markerId: "vcela_3",
            image: "/img/achievements/kralovna.png"
        },

        "znalec_vcelstva": {
            name: "Znalec včelstva",
            description: "Poznáš všechny typy včel - dělnice, trubce i královnu",
            icon: "🍯",
            category: "stezka_bohuslavice",
            rarity: "rare",
            condition: "gold_star_in_scene",
            sceneId: "/assets/stezka_bohuslavice/vcela.html",
            image: "/img/achievements/znalec_vcelstva.png"
        },

        // === KVÍZOVÝ ACHIEVEMENT ===
        "bee_quiz_master": {
            name: "Mistr včelařství",
            description: "Dokončil jsi všech 20 včelích kvízů!",
            icon: "🏆",
            category: "stezka_bohuslavice",
            rarity: "legendary",
            sceneId: "/assets/stezka_bohuslavice/vcela.html",
            markerId: "bee_quiz_master",
            image: "/img/achievements/bee_quiz_master.png"
        },

        // === ZÁKLADNÍ ACHIEVEMENTY PRO EXPOZICI ===
        "stezka_bohuslavice_first_scene": {
            name: "První krůčky ve včelařství",
            description: "Dokončil jsi první scénu na Včelařské stezce",
            icon: "🐝",
            category: "stezka_bohuslavice",
            rarity: "common",
            image: "/img/achievements/vcelarstvi_first_scene.png"
        }
    },

    // === KATEGORIE ===
    category: {
        name: "Včelařská stezka",
        description: "Úspěchy na Včelařské stezce",
        icon: "🐝",
        color: "#f39c12"
    },

    // === METADATA ===
    metadata: {
        displayName: "Včelařská stezka Bohuslavice",
        description: "Naučná stezka o životě včel",
        coordinates: {
            lat: 49.0492,
            lng: 17.1276
        }
    }
};

// Automatická registrace při načtení skriptu
document.addEventListener('DOMContentLoaded', () => {
    console.log("🐝 Bohuslavice včelařská stezka config: DOM loaded, registering exposition...");
    if (typeof registerExposition === 'function') {
        registerExposition('stezka_bohuslavice', BOHUSLAVICE_STEZKA_EXPOSITION_CONFIG);
    } else {
        console.error("❌ registerExposition function not available");
    }
});

console.log("🐝 Bohuslavice včelařská stezka exposition config loaded");
