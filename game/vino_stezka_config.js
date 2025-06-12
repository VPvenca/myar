// game/vino_stezka_config.js
// Konfigurace pro Vinařskou stezku

const VINO_STEZKA_EXPOSITION_CONFIG = {
    // === SCÉNY ===
    scenes: {
        "/assets/stezka_vino/stezka.html": {
            name: "Vinařská stezka",
            totalMarkers: 4, 
            markers: ["sud", "lis", "urban", "vinar"]
        }
    },

    // === ACHIEVEMENTY PRO VINAŘSKOU STEZKU ===
    achievements: {
        // === MARKER-SPECIFICKÉ ACHIEVEMENTY ===
        "sud": {
            name: "Znalec sudů",
            description: "Objevil jsi tajemství vinných sudů a jejich význam",
            icon: "🛢️",
            category: "stezka_vino",
            rarity: "uncommon",
            sceneId: "/assets/stezka_vino/stezka.html",
            markerId: "sud",
            image: "/img/achievements/sud.png"
        },

        "lis": {
            name: "Mistr lisování",
            description: "Pochopil jsi umění lisování hroznů",
            icon: "🍇",
            category: "stezka_vino",
            rarity: "uncommon",
            sceneId: "/assets/stezka_vino/stezka.html",
            markerId: "lis",
            image: "/img/achievements/lis.png"
        },

        "urban": {
            name: "Sv.Urban",
            description: "Setkal jsi se se svatým Urbanem",
            icon: "✝️",
            category: "stezka_vino",
            rarity: "uncommon", 
            sceneId: "/assets/stezka_vino/stezka.html",
            markerId: "urban",
            image: "/img/achievements/odrudy.png"
        },
        
        "vinar": {
            name: "Přítel vinaře",
            description: "Poznal jsi práci a umění moravských vinařů",
            icon: "👨‍🌾",
            category: "stezka_vino",
            rarity: "uncommon", 
            sceneId: "/assets/stezka_vino/stezka.html",
            markerId: "vinar",
            image: "/img/achievements/vinar.png"
        },

        // === POKROČILÉ ACHIEVEMENTY ===
        "znalec_vinarstvi": {
            name: "Znalec vinařství",
            description: "Ovládáš všechny aspekty vinařského řemesla",
            icon: "🍷",
            category: "stezka_vino",
            rarity: "rare",
            condition: "gold_star_in_scene",
            sceneId: "/assets/stezka_vino/stezka.html",
            image: "/img/achievements/znalec_vinarstvi.png"
        },

        // === KVÍZOVÝ ACHIEVEMENT ===
        "wine_quiz_master": {
            name: "Mistr vinařských kvízů",
            description: "Dokončil jsi všechny vinařské kvízy!",
            icon: "🏆",
            category: "stezka_vino",
            rarity: "legendary",
            sceneId: "/assets/stezka_vino/stezka.html",
            markerId: "wine_quiz_master",
            image: "/img/achievements/wine_quiz_master.png"
        },
/*
        // === PROGRESNÍ ACHIEVEMENTY ===
        "stezka_vino_first_scene": {
            name: "První krůčky ve vinařství",
            description: "Dokončil jsi první scénu na Vinařské stezce",
            icon: "🍇",
            category: "stezka_vino",
            rarity: "common",
            image: "/img/achievements/vinarstvi_first_scene.png"
        },

        "stezka_vino_half_complete": {
            name: "Pokročilý vinař",
            description: "Dokončil jsi polovinu scén na Vinařské stezce", 
            icon: "📚",
            category: "stezka_vino",
            rarity: "uncommon",
            image: "/img/achievements/vinarstvi_half_complete.png"
        },

        "stezka_vino_all_scenes": {
            name: "Mistr vinařství",
            description: "Dokončil jsi všechny scény na Vinařské stezce",
            icon: "🎓", 
            category: "stezka_vino",
            rarity: "rare",
            image: "/img/achievements/vinarstvi_all_scenes.png"
        },

        "stezka_vino_perfectionist": {
            name: "Perfektní vinař",
            description: "Získal jsi zlaté hvězdy ve všech scénách Vinařské stezky",
            icon: "👑",
            category: "stezka_vino", 
            rarity: "legendary",
            image: "/img/achievements/vinarstvi_perfectionist.png"
        },

        "stezka_vino_gold_collector": {
            name: "Sběratel zlatých hvězd",
            description: "Získal jsi 3 zlaté hvězdy na Vinařské stezce",
            icon: "⭐",
            category: "stezka_vino",
            rarity: "rare", 
            image: "/img/achievements/vinarstvi_gold_collector.png"
        },

        // === SPECIÁLNÍ ACHIEVEMENTY ===
        "wine_taster": {
            name: "Degustátor",
            description: "Naučil ses rozpoznávat chuťové profily různých vín",
            icon: "🥂",
            category: "stezka_vino",
            rarity: "rare",
            image: "/img/achievements/degustator.png"
        },

        "vineyard_explorer": {
            name: "Průzkumník vinic",
            description: "Prozkoumál jsi všechny části vinice",
            icon: "🗺️",
            category: "stezka_vino",
            rarity: "uncommon",
            image: "/img/achievements/pruzkumnik_vinic.png"
        }
    },
*/
    // === KATEGORIE ===
    category: {
        name: "Vinařská stezka",
        description: "Úspěchy na Vinařské stezce - poznávání vinařského řemesla",
        icon: "🍇",
        color: "#8e44ad" // Purpurová barva připomínající víno
    },

    // === METADATA ===
    metadata: {
        displayName: "Vinařská stezka",
        description: "Naučná stezka o vinařství a tradici pěstování vína na Moravě",
        coordinates: {
            lat: 49.0492,
            lng: 17.1276
        },
        difficulty: "střední",
        estimatedTime: "45 minut",
        topics: ["vinařství", "odrůdy vína", "historie", "tradice"]
    }
};

// Automatická registrace při načtení skriptu
document.addEventListener('DOMContentLoaded', () => {
    console.log("🍇 Vinařská stezka config: DOM loaded, registering exposition...");
    if (typeof registerExposition === 'function') {
        registerExposition('stezka_vino', VINO_STEZKA_EXPOSITION_CONFIG);
        console.log("✅ Vinařská stezka exposition successfully registered");
    } else {
        console.error("❌ registerExposition function not available");
    }
});

console.log("🍇 Vinařská stezka exposition config loaded");
