// === BEE-CONFIG.JS - KONFIGURACE VČELAŘSKÉ STEZKY ===

const BEE_CONFIG = {
    // GPS nastavení
    PROXIMITY_THRESHOLD: 15,
    AR_VISIBILITY_THRESHOLD: 30,
    AUDIO_THRESHOLD: 15,
    
    // Gamifikace
    EXPOSITION_ID: 'stezka_bohuslavice',
    SCENE_ID: '/assets/stezka_bohuslavice/vcela.html',
    
    // Kvízy
    QUIZ_DISTANCE_STEP: 50,
    QUIZ_STORAGE_KEY: 'beeQuizzesCompleted',
    QUIZ_ACHIEVEMENT_ID: 'bee_quiz_master',
    
    // Tutorial
    TUTORIAL_CONFIG_PATH: '/assets/stezka_bohuslavice/tutorial/config_vcela.js',
    
    // Modely a pozice
    MARKERS: [
        { 
            id: "vcela_1", 
            lat: 49.009093, 
            lng: 17.128643, 
            name: "🐝 Dělnice",
            description: "Pracovitá včela dělnice - základ úlu",
            audioId: "audio1",
            glbModel: "#bee-model-1",
            scale: "7 7 7"
        },
        { 
            id: "vcela_2", 
            lat: 49.009373, 
            lng: 7.127490,
            name: "🐝 Trubec", 
            description: "Samec včely - zodpovědný za rozmnožování",
            audioId: "audio2",
            glbModel: "#bee-model-2",
            scale: "7 7 7"
        },
        { 
            id: "vcela_3", 
            lat: 49.008410,  
            lng: 17.129966,
            name: "👑 Královna",
            description: "Matka úlu - vládkyně včelího státu",
            audioId: "audio3",
            glbModel: "#bee-model-3",
            scale: "8 8 8"
        }
    ],
    
    // Fallback GPS pozice (pro testování)
    FALLBACK_POSITION: {
        lat: 49.090675,
        lng: 17.132976,
        accuracy: 50
    },
    
    // GPS nastavení
    GPS_OPTIONS: {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
    },
    
    GPS_WATCH_OPTIONS: {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 20000
    }
};

// 20 včelích kvízů s fakty
const BEE_QUIZZES = [
    {
        question: "🐝 Kolik květů navštíví jedna včela za den?",
        answers: ["A) 500 květů", "B) 2000 květů", "C) 5000 květů"],
        correct: 2,
        explanation: "Včela navštíví až 5000 květů denně! To je neuvěřitelný výkon při hledání nektaru a pylu."
    },
    {
        question: "👑 Kolik vajíček snese včelí královna za den?",
        answers: ["A) 500 vajíček", "B) 1500 vajíček", "C) 3000 vajíček"],
        correct: 2,
        explanation: "Královna může snést až 3000 vajíček denně během sezóny! To je více než její vlastní váha."
    },
    {
        question: "🍯 Kolik medu vyprodukuje včela za svůj život?",
        answers: ["A) 1 lžičku", "B) 1/12 lžičky", "C) 3 lžičky"],
        correct: 1,
        explanation: "Včela za celý svůj život vyprodukuje pouze 1/12 lžičky medu. Proto je med tak cenný!"
    },
    {
        question: "⚡ Kolikrát za sekundu rozhýbe včela křídla?",
        answers: ["A) 50krát", "B) 230krát", "C) 400krát"],
        correct: 1,
        explanation: "Včela rozhýbe křídla až 230krát za sekundu! Proto vydává charakteristické bzučení."
    },
    {
        question: "🌈 Kterou barvu včely nevidí?",
        answers: ["A) Červenou", "B) Modrou", "C) Žlutou"],
        correct: 0,
        explanation: "Včely nevidí červenou barvu, místo ní vidí ultrafialové záření. Červené květy pro ně vypadají černě."
    },
    {
        question: "🏃‍♀️ Jak rychle dokáže létat včela?",
        answers: ["A) 15 km/h", "B) 25 km/h", "C) 35 km/h"],
        correct: 1,
        explanation: "Včela dokáže létat rychlostí až 25 km/h! To jí umožňuje efektivně prozkoumávat velká území."
    },
    {
        question: "🏠 Z kolika šestihranných buněk se skládá plást?",
        answers: ["A) 1000 buněk", "B) 3000 buněk", "C) 7000 buněk"],
        correct: 2,
        explanation: "Jeden plást obsahuje až 7000 šestihranných buněk! Šestihrany jsou nejefektivnější tvar pro skladování."
    },
    {
        question: "🌍 Jak daleko může včela létat od úlu?",
        answers: ["A) 2 km", "B) 5 km", "C) 8 km"],
        correct: 2,
        explanation: "Včela může létat až 8 km od úlu! Obvykle však zůstává v okruhu 2-3 km, kde najde dostatek potravy."
    },
    {
        question: "🕐 Jak dlouho žije včela dělnice v létě?",
        answers: ["A) 2 týdny", "B) 6 týdnů", "C) 3 měsíce"],
        correct: 1,
        explanation: "Včela dělnice žije v létě pouze 6 týdnů. V zimě žijí déle - až 6 měsíců kvůli menší aktivitě."
    },
    {
        question: "💃 Jak včely komunikují směr ke zdroji potravy?",
        answers: ["A) Bzučením", "B) Tancem", "C) Vůní"],
        correct: 1,
        explanation: "Včely komunikují tancem! Kruhový tanec znamená blízký zdroj, osmičkový tanec ukazuje směr a vzdálenost."
    },
    {
        question: "🌡️ Jakou teplotu udržují včely v úlu?",
        answers: ["A) 25°C", "B) 35°C", "C) 45°C"],
        correct: 1,
        explanation: "Včely udržují v úlu konstantní teplotu 35°C! To je ideální teplota pro vývoj larev a zpracování medu."
    },
    {
        question: "🧠 Kolik očí má včela?",
        answers: ["A) 2 oči", "B) 5 očí", "C) 8 očí"],
        correct: 1,
        explanation: "Včela má 5 očí - 2 složené oči a 3 jednoduché oči na vrcholu hlavy! Složené oči mají až 7000 facetek."
    },
    {
        question: "🔢 Kolik včel žije v silném úlu?",
        answers: ["A) 20 000", "B) 60 000", "C) 100 000"],
        correct: 1,
        explanation: "V silném úlu může žít až 60 000 včel! V zimě jich zůstává jen 10-20 000."
    },
    {
        question: "🌸 Kolik květů potřebuje včela pro 1 kg medu?",
        answers: ["A) 500 000", "B) 2 miliony", "C) 4 miliony"],
        correct: 2,
        explanation: "Pro 1 kg medu musí včely navštívit až 4 miliony květů! A nalétat vzdálenost 3x kolem Země."
    },
    {
        question: "👃 Jak daleko cítí včela aroma květů?",
        answers: ["A) 2 m", "B) 50 m", "C) 2 km"],
        correct: 2,
        explanation: "Včela dokáže cítit aroma květů až na vzdálenost 2 km! Má mimořádně vyvinutý čich."
    },
    {
        question: "🏗️ Z čeho včely stavějí plásty?",
        answers: ["A) Propolisu", "B) Vosku", "C) Medu"],
        correct: 1,
        explanation: "Plásty stavějí z vosku, který si samy vyrábějí ve speciálních žlázách na břiše!"
    },
    {
        question: "💪 Kolikrát své váhy unese včela?",
        answers: ["A) Polovinu", "B) Stejnou váhu", "C) Dvojnásobek"],
        correct: 2,
        explanation: "Včela dokáže unést až dvojnásobek své vlastní váhy! To odpovídá 70 mg nektaru nebo pylu."
    },
    {
        question: "🛡️ Co je propolis?",
        answers: ["A) Včelí lepidlo", "B) Druh medu", "C) Včelí jed"],
        correct: 0,
        explanation: "Propolis je přírodní 'lepidlo' které včely vyrábějí ze stromových pryskyřic. Má antibiotické účinky!"
    },
    {
        question: "⏰ V kolik hodin jsou včely nejaktivnější?",
        answers: ["A) 6-8 hodin", "B) 10-14 hodin", "C) 16-18 hodin"],
        correct: 1,
        explanation: "Včely jsou nejaktivnější mezi 10-14 hodinou, kdy je nejvíce květů otevřených a slunce nejsilnější."
    },
    {
        question: "🌙 Co dělají včely v noci?",
        answers: ["A) Spí", "B) Zpracovávají med", "C) Hlídají úl"],
        correct: 1,
        explanation: "Včely v noci nezahálí! Zpracovávají nektar na med, větrají úl a mladé včely pokračují ve stavbě plástů."
    }
];

// Export pro ostatní moduly
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BEE_CONFIG, BEE_QUIZZES };
}