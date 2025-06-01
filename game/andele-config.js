// game/andele-config.js
// Konfigurace pro Andělé v Kyjově

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
        // === ZÁKLADNÍ ACHIEVEMENTY PRO STEZKU ===
        
        "andele_first_angel": {
            name: "První setkání",
            description: "Našel jsi svého prvního anděla na stezce",
            icon: "😇",
            category: "andele",
            rarity: "common",
            condition: "complete_marker",
            markerId: "andel_1",
            image: "/img/achievements/first_angel.png"
        },

        "andele_angel_collector": {
            name: "Sběratel andělů",
            description: "Našel jsi všechny anděly na venkovní stezce",
            icon: "👼",
            category: "andele", 
            rarity: "uncommon",
            condition: "complete_scene",
            sceneId: "/assets/andele/geo_andele.html",
            image: "/img/achievements/angel_collector.png"
        },

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

        // === SPECIÁLNÍ ACHIEVEMENTY ===

        "andele_speed_walker": {
            name: "Rychlý poutník",
            description: "Dokončil jsi venkovní stezku za méně než 15 minut",
            icon: "⚡",
            category: "andele",
            rarity: "uncommon",
            condition: "time_limit",
            timeLimit: 900, // 15 minut v sekundách
            sceneId: "/assets/andele/geo_andele.html",
            image: "/img/achievements/speed_walker.png"
        },

        "andele_contemplator": {
            name: "Andělský rozjímač",
            description: "Strávil jsi alespoň 5 minut u jedného anděla na stezce",
            icon: "🧘‍♂️",
            category: "andele",
            rarity: "rare",
            condition: "time_spent_5min",
            markerId: "andel_2", // prostřední anděl
            image: "/img/achievements/contemplator.png"
        },

        "andele_art_critic": {
            name: "Andělský kritik",
            description: "Strávil jsi více než 20 minut studiem výstavy v muzeu",
            icon: "🔍",
            category: "andele",
            rarity: "uncommon",
            condition: "time_spent_20min",
            sceneId: "/assets/andele/vystava_andelu.html",
            image: "/img/achievements/art_critic.png"
        },

        "andele_guardian": {
            name: "Andělský strážce",
            description: "Navštívil jsi všechny anděly ve správném pořadí",
            icon: "🛡️",
            category: "andele",
            rarity: "rare",
            condition: "sequential_completion",
            sequence: ["andel_1", "andel_2", "andel_3"],
            image: "/img/achievements/guardian.png"
        },

        "andele_photographer": {
            name: "Andělský fotograf",
            description: "Pořídil jsi fotku u každého anděla na stezce",
            icon: "📸",
            category: "andele",
            rarity: "uncommon",
            condition: "photo_at_markers",
            markers: ["andel_1", "andel_2", "andel_3"],
            image: "/img/achievements/photographer.png"
        },

        "andele_devotee": {
            name: "Oddaný ctitel",
            description: "Vrátil jsi se na stezku andělů vícekrát",
            icon: "🙏",
            category: "andele",
            rarity: "rare",
            condition: "repeat_visit",
            minVisits: 3,
            image: "/img/achievements/devotee.png"
        },

        "andele_night_visitor": {
            name: "Noční návštěvník",
            description: "Navštívil jsi stezku andělů po setmění",
            icon: "🌙",
            category: "andele",
            rarity: "uncommon",
            condition: "time_of_day",
            startHour: 19,
            endHour: 6,
            image: "/img/achievements/night_visitor.png"
        },

        "andele_dawn_pilgrim": {
            name: "Úsvitový poutník",
            description: "Začal jsi stezku před východem slunce",
            icon: "🌅",
            category: "andele",
            rarity: "rare",
            condition: "time_of_day",
            startHour: 5,
            endHour: 7,
            image: "/img/achievements/dawn_pilgrim.png"
        },

        "andele_weather_warrior": {
            name: "Neporazitelný poutník",
            description: "Dokončil jsi stezku za nepříznivého počasí",
            icon: "🌧️",
            category: "andele",
            rarity: "uncommon",
            condition: "weather_condition",
            weatherTypes: ["rain", "snow", "storm"],
            image: "/img/achievements/weather_warrior.png"
        },

        "andele_seasonal_visitor": {
            name: "Sezónní návštěvník",
            description: "Navštívil jsi stezku ve všech čtyřech ročních obdobích",
            icon: "🍂",
            category: "andele",
            rarity: "legendary",
            condition: "seasonal_visits",
            seasons: ["spring", "summer", "autumn", "winter"],
            hidden: true,
            image: "/img/achievements/seasonal_visitor.png"
        },

        // === SKRYTÉ/EASTER EGG ACHIEVEMENTY ===

        "andele_secret_prayer": {
            name: "Tajná modlitba",
            description: "Objevil jsi skrytou zprávu u jedného z andělů",
            icon: "🤫",
            category: "andele",
            rarity: "rare",
            hidden: true,
            condition: "discover_secret",
            secretId: "hidden_prayer",
            image: "/img/achievements/secret_prayer.png"
        },

        "andele_easter_egg": {
            name: "Andělské překvapení",
            description: "Našel jsi velikonoční vajíčko vývojářů",
            icon: "🥚",
            category: "andele",
            rarity: "legendary",
            hidden: true,
            condition: "easter_egg",
            easterEggId: "dev_surprise",
            image: "/img/achievements/easter_egg.png"
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
    registerExposition('andele', ANDELE_EXPOSITION_CONFIG);
});

console.log("😇 Angels exposition config loaded");