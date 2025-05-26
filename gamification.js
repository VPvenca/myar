
// gamification.js

// Základní klíč pro ukládání všech gamifikačních dat
// Data budou vnořená pod klíči jednotlivých expozic (např. 'kyjov', 'brno')
const BASE_STORAGE_KEY = 'arGamificationData'; 

// Funkce pro získání dat PRO KONKRÉTNÍ EXPOZICI
function getGamificationData(expositionId) {
    // Načte všechna data
    const totalData = localStorage.getItem(BASE_STORAGE_KEY);
    const parsedTotalData = totalData ? JSON.parse(totalData) : {};

    // Vrátí data pro danou expozici, nebo prázdný objekt, pokud neexistují
    return parsedTotalData[expositionId] || {};
}

// Funkce pro uložení dat PRO KONKRÉTNÍ EXPOZICI
function saveGamificationData(expositionId, expositionData) {
    // Načte všechna data (abychom nepřepsali data z jiných expozic)
    const totalData = localStorage.getItem(BASE_STORAGE_KEY);
    const parsedTotalData = totalData ? JSON.parse(totalData) : {};

    // Aktualizuje data pro danou expozici
    parsedTotalData[expositionId] = expositionData;

    // Uloží všechna data zpět
    localStorage.setItem(BASE_STORAGE_KEY, JSON.stringify(parsedTotalData));
}

// Upravená funkce pro záznam aktivace markeru - teď potřebuje ID expozice
function recordMarkerActivation(expositionId, sceneId, markerId) {
    // Získáme data pouze pro aktuální expozici
    const expoData = getGamificationData(expositionId);

    if (!expoData[sceneId]) {
        expoData[sceneId] = {};
    }

    // Zkontrolujeme, zda markerId existuje v konfiguraci pro danou scénu
    // Konfigurace SCENE_CONFIG je globální, předpokládáme unikátní cesty k scénám
    // nebo že SCENE_CONFIG obsahuje konfigurace pro VŠECHNY scény napříč expozicemi
    if (SCENE_CONFIG[sceneId] && SCENE_CONFIG[sceneId].markers && SCENE_CONFIG[sceneId].markers.includes(markerId)) {
        // Zaznamenáme aktivaci v datech pro aktuální expozici
        expoData[sceneId][markerId] = true;
        // Uložíme aktualizovaná data pro aktuální expozici
        saveGamificationData(expositionId, expoData);
        console.log(`Marker ${markerId} activated in scene ${sceneId} for exposition ${expositionId}`);
    } else {
        console.warn(`Marker ID "${markerId}" (in scene "${sceneId}", exposition "${expositionId}") not found in SCENE_CONFIG or SCENE_CONFIG.markers is undefined. Activation not recorded.`);
    }
}

// Upravená funkce pro získání úrovně hvězd - teď potřebuje ID expozice
function getSceneStarLevel(expositionId, sceneId) {
    // Získáme data pouze pro aktuální expozici
    const expoData = getGamificationData(expositionId);
    const sceneData = expoData[sceneId] || {}; // Data pro aktuální scénu v rámci expozice
    const config = SCENE_CONFIG[sceneId]; // Konfigurace pro aktuální scénu (předpokládáme globální SCENE_CONFIG)

    if (!config) {
        console.warn(`Configuration for scene ${sceneId} not found in SCENE_CONFIG.`);
        return 'none'; // Nebo nějaká výchozí hodnota
    }
    // Zajištění, že totalMarkers je číslo a markers je pole
    if (typeof config.totalMarkers !== 'number' || !Array.isArray(config.markers)) {
        console.warn(`Configuration for scene ${sceneId} is incomplete or malformed (totalMarkers should be a number, markers should be an array).`);
        return 'none';
    }

    // Počet aktivovaných markerů počítáme pouze z dat pro aktuální expozici a scénu
    const activatedMarkersCount = Object.keys(sceneData).filter(markerId => sceneData[markerId] === true).length;
    const totalMarkersInScene = config.totalMarkers;

    if (totalMarkersInScene === 0 || activatedMarkersCount === 0) {
        return 'none'; // Žádné markery ve scéně nebo žádný aktivovaný v této expozici
    }

    // Specifická logika podle počtu markerů ve scéně - ZŮSTÁVÁ STEJNÁ
    if (totalMarkersInScene === 1) {
        if (activatedMarkersCount === 1) return 'gold';
    } else if (totalMarkersInScene === 2) {
        if (activatedMarkersCount === 2) return 'gold';
        if (activatedMarkersCount === 1) return 'silver';
    } else if (totalMarkersInScene === 3) {
        if (activatedMarkersCount === 3) return 'gold';
        if (activatedMarkersCount >= 2) return 'silver'; // 2 je >= 3/2
        if (activatedMarkersCount >= 1) return 'bronze';
    } else { // Scény se 4 a více markery
        if (activatedMarkersCount >= totalMarkersInScene) return 'gold'; // Všechny
        // Math.ceil zajistí, že pro 5 markerů bude polovina 3 (ceil(2.5)=3)
        // Pro 4 markery bude polovina 2 (ceil(2)=2)
        if (activatedMarkersCount >= Math.ceil(totalMarkersInScene / 2)) return 'silver'; // Polovina nebo více
        if (activatedMarkersCount > 0) return 'bronze'; // Alespoň jeden (a méně než polovina)
    }

    return 'none'; // Výchozí
}

// Funkce pro zobrazení hvězd - ZŮSTÁVÁ STEJNÁ
function displayStars(starElement, level) {
    let starsHtml = '';
    switch (level) {
        case 'bronze':
            starsHtml = '<img src="/img/bronze_star.png" alt="Bronzová hvězda" class="star-image">';
            break;
        case 'silver':
            starsHtml = '<img src="/img/silver_star.png" alt="Stříbrná hvězda" class="star-image">';
            break;
        case 'gold':
            starsHtml = '<img src="/img/gold_star.png" alt="Zlatá hvězda" class="star-image">';
            break;
        default:
            starsHtml = '';
    }
    if (starElement) {
        starElement.innerHTML = starsHtml;
        // Pro případné další stylování samotného <span> elementu, který hvězdu obsahuje:
        // starElement.className = 'star-display'; // Základní třída
        // if (level !== 'none') {
        //     starElement.classList.add('star-' + level); // Např. star-bronze, star-silver
        // } else {
        //     starElement.classList.remove('star-bronze', 'star-silver', 'star-gold');
        // }
    }
}
