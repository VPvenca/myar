
// gamification-config.js

// Konfigurace scén - ZŮSTÁVÁ STEJNÁ.
// Předpokládá se, že cesty ke scénám (např. "/assets/kyjov/terce.html") jsou unikátní napříč všemi expozicemi.
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
    // Přidejte další scény z jiných expozic zde, pokud mají unikátní cesty.
    // Příklad pro Brno:
    // "/assets/brno/scena_a.html": {
    //     name: "Brno Scéna A",
    //     totalMarkers: 2,
    //     markers: ["brno_marker1", "brno_marker2"]
    // }
};

// Funkce pro získání ID aktuální scény z URL - ZŮSTÁVÁ STEJNÁ
function getCurrentSceneId() {
    return window.location.pathname;
}

// NOVÁ funkce pro získání ID aktuální expozice z URL
function getCurrentExpositionId() {
    const pathParts = window.location.pathname.split('/');
    // Předpokládáme URL strukturu jako /assets/EXPOSITION_ID/stranka.html
    // ID expozice by tedy mělo být na indexu 2 po rozdělení cesty lomítky.
    if (pathParts.length >= 3 && pathParts[1] === 'assets') {
        return pathParts[2]; // Např. "kyjov", "brno"
    }
    
    // Pokud se nepodaří určit expozici, vrátíme výchozí ID nebo zalogujeme chybu
    console.warn("Could not determine exposition ID from path:", window.location.pathname, ". Using default ID 'unknown'.");
    return 'unknown'; // Vratí výchozí ID, pokud URL neodpovídá očekávané struktuře
}
