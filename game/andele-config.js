// game/andele-config.js
// OPRAVENÁ Konfigurace pro Andělé v Kyjově

const ANDELE_EXPOSITION_CONFIG = {
    // === SCÉNY ===
    scenes: {
        "/assets/andele/geo_andele.html": {
            name: "Andělé na trase",
            totalMarkers: 3, 
            markers: ["andel_1", "andel_2", "andel_3"]
        },
        "/assets/andele/muzeum_vstup.html": {
            name: "Vstup do muzea",
            totalMarkers: 1,
            markers: ["muzeum_entrance"]
        },
        "/assets/andele/vystava_andelu.html": {
            name: "Výstava andělů",
            totalMarkers: 5,
            markers: ["vystava_1", "vystava_2", "vystava_3", "vystava_4", "vystava_5"]
        }
    },

    // === ACHIEVEMENTY ===
    achievements: {
        // === MARKER-SPECIFICKÉ ACHIEVEMENTY (OPRAVENO) ===
        
        "andele_first_angel": {
            name: "První setkání",
            description: "Našel jsi svého prvního anděla na stezce",
            icon: "😇",
            category: "andele",
            rarity: "common",
            sceneId: "/assets/andele/geo_andele.html",
            markerId: "andel_1",
            image: "/img/achievements/first_angel.png"
        },

        "andele_guardian_gabriel": {
            name: "Setkání s Gabrielem",
            description: "Setkal ses s andělem Gabriel",
            icon: "👼",
            category: "andele",
            rarity: "uncommon",
            sceneId: "/assets/andele/geo_andele.html",
            markerId: "andel_1",
            image: "/img/achievements/gabriel.png"
        },

        "andele_guardian_rafael": {
            name: "Setkání s Rafaelem",
            description: "Setkal ses s andělem Rafael",
            icon: "💚",
            category: "andele",
            rarity: "uncommon",
            sceneId: "/assets/andele/geo_andele.html",
            markerId: "andel_2",
            image: "/img/achievements/rafael.png"
        },

        "andele_guardian_michael": {
            name: "Setkání s Michaelem",
            description: "Setkal ses s archandělem Michael",
            icon: "⚔️",
            category: "andele",
            rarity: "uncommon",
            sceneId: "/assets/andele/geo_andele.html",
            markerId: "andel_3",
            image: "/img/achievements/michael.png"
        },

        "andele_angel_collector": {
            name: "Sběratel andělů",
            description: "Našel jsi všechny anděly na venkovní stezce",
            icon: "👼",
            category: "andele", 
            rarity: "rare",
            condition: "gold_star_in_scene",
            sceneId: "/assets/andele/geo_andele.html",
            image: "/img/achievements/angel_collector.png"
        },
/*
        "andele_pathfinder": {
            name: "Průvodce stezkou",
            description: "Úspěšně jsi doshel až k muzeu",
            icon: "🗺️",
            category: "andele",
            rarity: "common",
            condition: "complete_scene",
            sceneId: "/assets/andele/muzeum_vstup.html",
            image: "/img/achievements/pathfinder.png"
        },

        "andele_museum_visitor": {
            name: "Návštěvník muzea",
            description: "Vstoupil jsi do muzea a začal prohlídku výstavy",
            icon: "🏛️",
            category: "andele",
            rarity: "common",
            condition: "enter_scene",
            sceneId: "/assets/andele/vystava_andelu.html",
            image: "/img/achievements/museum_visitor.png"
        },

        "andele_exhibition_master": {
            name: "Znalec výstavy",
            description: "Prozkoumal jsi celou výstavu andělů v muzeu",
            icon: "🎨",
            category: "andele",
            rarity: "rare",
            condition: "complete_scene",
            sceneId: "/assets/andele/vystava_andelu.html",
            image: "/img/achievements/exhibition_master.png"
        },

        "andele_completionist": {
            name: "Andělský poutník",
            description: "Dokončil jsi celou stezku andělů od začátku do konce",
            icon: "🌟",
            category: "andele",
            rarity: "legendary",
            condition: "complete_all_scenes",
            image: "/img/achievements/angel_pilgrim.png"
        },
*/
        // === ZÁKLADNÍ ACHIEVEMENTY PRO EXPOZICI ===
        "andele_first_scene": {
            name: "První krůčky mezi anděly",
            description: "Dokončil jsi první scénu na Stezce andělů",
            icon: "😇",
            category: "andele",
            rarity: "common",
            image: "/img/achievements/andele_first_scene.png"
        },

        "andele_all_scenes": {
            name: "Znalec andělů",
            description: "Dokončil jsi všechny scény na Stezce andělů",
            icon: "🎓",
            category: "andele",
            rarity: "rare",
            image: "/img/achievements/andele_all_scenes.png"
        },

        "andele_perfectionist": {
            name: "Mistr andělské stezky",
            description: "Získal jsi zlaté hvězdy ve všech scénách Stezky andělů",
            icon: "👑",
            category: "andele",
            rarity: "legendary",
            image: "/img/achievements/andele_perfectionist.png"
        } 
    },

    // === KATEGORIE ===
    category: {
        name: "Andělé v Kyjově",
        description: "Duchovní stezka s anděly vedoucí do muzea",
        icon: "😇",
        color: "#FFD700" // zlatá barva pro anděly
    },

    // === METADATA ===
    metadata: {
        displayName: "Stezka andělů",
        description: "Následuj anděly na jejich cestě do muzea",
        website: "https://www.masaryk.info/vlastivedne-muzeum-kyjov/",
        address: "Stezka začíná u kostela sv. Martina, Kyjov",
        coordinates: {
            start: { lat: 49.0109, lng: 17.1237 },
            end: { lat: 49.0115, lng: 17.1245 }
        },
        estimatedTime: "30-45 minut",
        difficulty: "snadná",
        accessibility: "částečně bezbariérová"
    }
};

// Automatická registrace při načtení skriptu
document.addEventListener('DOMContentLoaded', () => {
    console.log("😇 Andělé config: DOM loaded, registering exposition...");
    if (typeof registerExposition === 'function') {
        registerExposition('andele', ANDELE_EXPOSITION_CONFIG);
    } else {
        console.error("❌ registerExposition function not available");
    }
});

console.log("😇 Angels exposition config loaded");
