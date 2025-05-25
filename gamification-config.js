// gamification-config.js

// Hlavní klíč pro ukládání všech dat aplikace do localStorage.
// Doporučuje se unikátní název, případně s verzí pro snadnější migraci v budoucnu.
const APP_STORAGE_KEY = 'myMultiMuseumArApp_v1';

// Konfigurace pro jednotlivá muzea/expozice.
// Každé muzeum má svůj unikátní identifikátor (např. "muzeumKyjov").
const MUSEUM_CONFIGS = {
    "muzeumKyjov": { // Unikátní ID muzea
        name: "Vlastivědné muzeum Kyjov", // Čitelný název muzea
        medals: { // Cesty k obrázkům specifických medailí pro toto muzeum
            base: "/img/medals/kyjov_base.png",   // Základní/neaktivní/ghost medaile
            bronze: "/img/medals/kyjov_bronze.png", // Bronzová medaile
            silver: "/img/medals/kyjov_silver.png", // Stříbrná medaile
            gold: "/img/medals/kyjov_gold.png"     // Zlatá medaile
        },
        // Konfigurace jednotlivých AR scén (HTML stránek) patřících do tohoto muzea.
        // Klíč je cesta k HTML souboru scény (jak ji vrací window.location.pathname).
        sceneConfig: {
            "/assets/kyjov/terce.html": { // Cesta k HTML souboru scény
                name: "Střelecké terče",        // Čitelný název scény
                totalMarkers: 4,                // Celkový počet unikátních markerů v této scéně
                markers: ["terc_selim", "terc_kyjov_1", "terc_kyjov_2", "terc_kyjov_3"] // Pole ID markerů
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
            // Přidejte další scény pro "muzeumKyjov" zde
        },
        // Prahové hodnoty (v procentech) pro získání celkové medaile za toto muzeum.
        overallBadgeThresholds: {
            bronze: 10, // % celkového obsahu muzea pro bronzovou medaili
            silver: 50, // % pro stříbrnou
            gold: 100   // % pro zlatou
        }
    },
    "muzeumBrno": { // Další muzeum
        name: "Technické muzeum Brno",
        medals: {
            base: "/img/medals/brno_base.png",
            bronze: "/img/medals/brno_bronze.png",
            silver: "/img/medals/brno_silver.png",
            gold: "/img/medals/brno_gold.png"
        },
        sceneConfig: {
            "/assets/brno/motory.html": {
                name: "Historické motory",
                totalMarkers: 5,
                markers: ["motor1", "motor2", "motor3", "motor4", "motor5"]
            },
            "/assets/brno/pocitace.html": {
                name: "Vývoj počítačů",
                totalMarkers: 3,
                markers: ["pc_saly", "pc_8bit", "pc_moderni"]
            }
            // Přidejte další scény pro "muzeumBrno" zde
        },
        overallBadgeThresholds: { // Může mít jiné prahy než Kyjov
            bronze: 15,
            silver: 60,
            gold: 100
        }
    }
    // Zde můžete přidat konfigurace pro další muzea podle stejného vzoru.
};

/**
 * Získá cestu k aktuálnímu HTML souboru (scéně).
 * @returns {string} Cesta k souboru, např. "/assets/kyjov/terce.html".
 */
function getCurrentScenePath() {
    // window.location.pathname by měl vrátit cestu od kořene webu.
    // Ujistěte se, že to odpovídá klíčům v sceneConfig.
    return window.location.pathname;
}

/**
 * Získá konfiguraci pro aktuálně zobrazené muzeum.
 * Předpokládá, že v HTML souboru AR scény je definována globální proměnná `CURRENT_MUSEUM_ID`.
 * @returns {object|null} Objekt s konfigurací muzea, nebo null, pokud není nalezena.
 */
function getCurrentMuseumConfig() {
    // CURRENT_MUSEUM_ID musí být definováno v každém HTML souboru AR scény.
    // Např. <script> const CURRENT_MUSEUM_ID = "muzeumKyjov"; </script>
    if (typeof CURRENT_MUSEUM_ID !== 'undefined' && MUSEUM_CONFIGS[CURRENT_MUSEUM_ID]) {
        return MUSEUM_CONFIGS[CURRENT_MUSEUM_ID];
    }
    // Toto varování se může objevit, pokud je config načten na stránce, která není AR scénou (např. hlavní stránka).
    // console.warn(`CURRENT_MUSEUM_ID ("${CURRENT_MUSEUM_ID || 'undefined'}") není definováno nebo pro něj neexistuje konfigurace v MUSEUM_CONFIGS.`);
    return null;
}

/**
 * Získá konfiguraci pro aktuálně zobrazenou AR scénu v rámci aktuálního muzea.
 * @returns {object|null} Objekt s konfigurací scény, nebo null, pokud není nalezena.
 */
function getCurrentSceneConfigForMuseum() {
    const museumConfig = getCurrentMuseumConfig(); // Získá konfiguraci aktuálního muzea
    const scenePath = getCurrentScenePath();       // Získá cestu aktuální stránky

    if (museumConfig && museumConfig.sceneConfig && museumConfig.sceneConfig[scenePath]) {
        return museumConfig.sceneConfig[scenePath];
    }
    // Varování, pokud se skript spustí na stránce, která není definována jako scéna v configu.
    // console.warn(`Konfigurace pro scénu "${scenePath}" v muzeu "${CURRENT_MUSEUM_ID || 'undefined'}" nenalezena.`);
    return null;
}
