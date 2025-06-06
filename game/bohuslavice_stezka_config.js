// game/bohuslavice_stezka_config.js
// Konfigurace pro Včelařskou stezku

const BOHUSLAVICE_STEZKA_EXPOSITION_CONFIG = {
    // === SCÉNY ===
    scenes: {
        "/assets/stezka_bohuslavice/vcela.html": {
            name: "Včelařská stezka",
            totalMarkers: 3, 
            markers: ["vcela_1", "vcela_2", "vcela_3"]
        }
    },

    // === ACHIEVEMENTY PRO VČELAŘSKOU STEZKU ===
    achievements: {
        "vcela_1_delnice": {
            name: "Pozorovatel dělnic",
            description: "Strávil jsi 30 sekund pozorováním pracovitých dělnic",
            icon: "🐝",
            category: "vcelarstvi",
            rarity: "uncommon",
            condition: "time_spent_30s",
            sceneId: "vcela_1",
            image: "/img/achievements/delnice.png"
        },

        "vcela_2_trubec": {
            name: "Badatel trubců",
            description: "Strávil jsi 30 sekund studiem života trubců",
            icon: "🐛",
            category: "vcelarstvi", 
            rarity: "uncommon",
            condition: "time_spent_30s",
            sceneId: "vcela_2",
            image: "/img/achievements/trubec.png"
        },

        "vcela_3_kralovna": {
            name: "Ctitel královny",
            description: "Strávil jsi 30 sekund obdivováním včelí královny",
            icon: "👑",
            category: "vcelarstvi",
            rarity: "uncommon", 
            condition: "time_spent_30s",
            sceneId: "vcela_3",
            image: "/img/achievements/kralovna.png"
        },

        "znalec_vcelstva": {
            name: "Znalec včelstva",
            description: "Poznáš všechny typy včel - dělnice, trubce i královnu",
            icon: "🍯",
            category: "vcelarstvi",
            rarity: "rare",
            condition: "requires_achievements",
            requiredAchievements: ["vcela_1_delnice", "vcela_2_trubec", "vcela_3_kralovna"],
            image: "/img/achievements/znalec_vcelstva.png"
        },

        // === ZÁKLADNÍ ACHIEVEMENTY PRO EXPOZICI ===
        "vcelarstvi_first_scene": {
            name: "První krůčky ve včelařství",
            description: "Dokončil jsi první scénu na Včelařské stezce",
            icon: "🐝",
            category: "vcelarstvi",
            rarity: "common",
            image: "/img/achievements/vcelarstvi_first_scene.png"
        },

        "vcelarstvi_all_scenes": {
            name: "Znalec včelařství",
            description: "Dokončil jsi všechny scény na Včelařské stezce",
            icon: "🎓",
            category: "vcelarstvi",
            rarity: "rare",
            image: "/img/achievements/vcelarstvi_all_scenes.png"
        },

        "vcelarstvi_perfectionist": {
            name: "Mistr včelařství",
            description: "Získal jsi zlaté hvězdy ve všech scénách Včelařské stezky",
            icon: "👑",
            category: "vcelarstvi",
            rarity: "legendary",
            image: "/img/achievements/vcelarstvi_perfectionist.png"
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
    registerExposition('vcelarstvi', BOHUSLAVICE_STEZKA_EXPOSITION_CONFIG);
});

console.log("🐝 Bohuslavice včelařská stezka exposition config loaded");