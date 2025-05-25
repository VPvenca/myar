// gamification.js
// Tento skript se stará o logiku gamifikace na úrovni JEDNOTLIVÉ AR SCÉNY (HTML stránky).
// Zobrazuje hvězdy u odkazů a zaznamenává aktivaci markerů pro danou scénu a muzeum.

// Předpokládáme, že konstanty a funkce z gamification-config.js jsou dostupné:
// APP_STORAGE_KEY, MUSEUM_CONFIGS, getCurrentScenePath(),
// getCurrentMuseumConfig(), getCurrentSceneConfigForMuseum().
// Také předpokládáme, že v HTML je definována globální proměnná CURRENT_MUSEUM_ID.

/**
 * Načte všechna data aplikace z localStorage.
 * @returns {object} Objekt s daty aplikace.
 */
function getAppData() {
    const data = localStorage.getItem(APP_STORAGE_KEY);
    return data ? JSON.parse(data) : {}; // Pokud nic není, vrátí prázdný objekt
}

/**
 * Uloží všechna data aplikace do localStorage.
 * @param {object} appData - Objekt s daty aplikace k uložení.
 */
function saveAppData(appData) {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appData));
}

/**
 * Načte data specifická pro dané muzeum. Pokud neexistují, inicializuje je.
 * @param {string} museumId - ID muzea.
 * @returns {object} Objekt s daty pro dané muzeum (scenes, overall).
 */
function getMuseumData(museumId) {
    const appData = getAppData();
    if (!appData[museumId]) {
        // Inicializace dat pro muzeum, pokud ještě neexistují v localStorage
        appData[museumId] = {
            scenes: {}, // Zde se budou ukládat aktivované markery pro jednotlivé scény muzea
            overall: { badge: 'none', percentage: 0 } // Celkový postup pro muzeum (aktualizuje inventory.js)
        };
        // Neukládáme hned, počkáme na první relevantní akci nebo to necháme na inventory.js
    }
    // Zajistíme, že struktura je kompletní i pro již existující muzea
    if (!appData[museumId].scenes) appData[museumId].scenes = {};
    if (!appData[museumId].overall) appData[museumId].overall = { badge: 'none', percentage: 0 };

    return appData[museumId];
}

/**
 * Uloží data specifická pro dané muzeum zpět do celkových dat aplikace.
 * @param {string} museumId - ID muzea.
 * @param {object} museumSpecificData - Aktualizovaná data pro dané muzeum.
 */
function saveMuseumProgress(museumId, museumSpecificData) {
    const appData = getAppData();
    appData[museumId] = museumSpecificData;
    saveAppData(appData);
}

/**
 * Zaznamená aktivaci markeru pro aktuální scénu a muzeum.
 * Tato funkce by měla být volána, když uživatel úspěšně interaguje s markerem.
 * @param {string} markerId - ID aktivovaného markeru.
 */
function recordMarkerActivation(markerId) {
    if (typeof CURRENT_MUSEUM_ID === 'undefined') {
        console.error("Chyba: CURRENT_MUSEUM_ID není definováno. Aktivace markeru nemůže být zaznamenána.");
        return;
    }
    const scenePath = getCurrentScenePath();
    const sceneConfig = getCurrentSceneConfigForMuseum(); // Získá konfiguraci aktuální scény

    if (!sceneConfig) {
        console.warn(`Nelze zaznamenat marker "${markerId}", protože konfigurace pro scénu "${scenePath}" v muzeu "${CURRENT_MUSEUM_ID}" nebyla nalezena.`);
        return;
    }

    // Zkontrolujeme, zda markerId existuje v konfiguraci pro danou scénu
    if (!sceneConfig.markers || !sceneConfig.markers.includes(markerId)) {
        console.warn(`Marker ID "${markerId}" (scéna "${scenePath}", muzeum "${CURRENT_MUSEUM_ID}") není definován v konfiguraci scény. Aktivace se nezaznamená.`);
        return;
    }

    const museumData = getMuseumData(CURRENT_MUSEUM_ID); // Načte/inicializuje data pro aktuální muzeum

    // Inicializace dat pro scénu, pokud ještě neexistují
    if (!museumData.scenes[scenePath]) {
        museumData.scenes[scenePath] = {};
    }

    // Zaznamená aktivaci markeru pro danou scénu
    museumData.scenes[scenePath][markerId] = true;
    saveMuseumProgress(CURRENT_MUSEUM_ID, museumData); // Uloží aktualizovaná data pro muzeum

    console.log(`Marker "${markerId}" aktivován ve scéně "${scenePath}" muzea "${CURRENT_MUSEUM_ID}".`);

    // Po záznamu markeru aktualizujeme zobrazení hvězd pro tuto scénu
    updateStarsForCurrentScene();
}

/**
 * Vypočítá úroveň hvězdy (bronze, silver, gold) pro aktuální scénu na základě aktivovaných markerů.
 * @returns {string} Úroveň hvězdy ('none', 'bronze', 'silver', 'gold').
 */
function getStarLevelForCurrentScene() {
    if (typeof CURRENT_MUSEUM_ID === 'undefined') {
        // console.warn("CURRENT_MUSEUM_ID není definováno, nelze určit úroveň hvězdy.");
        return 'none';
    }
    const scenePath = getCurrentScenePath();
    const sceneConfig = getCurrentSceneConfigForMuseum(); // Konfigurace pro aktuální scénu

    if (!sceneConfig || typeof sceneConfig.totalMarkers !== 'number' || !Array.isArray(sceneConfig.markers)) {
        // console.warn(`Konfigurace pro scénu "${scenePath}" v muzeu "${CURRENT_MUSEUM_ID}" je neúplná nebo chybí.`);
        return 'none';
    }

    const museumData = getMuseumData(CURRENT_MUSEUM_ID);
    const sceneProgress = museumData.scenes[scenePath] || {}; // Postup v aktuální scéně

    // Počet unikátních aktivovaných markerů v této scéně podle konfigurace
    const activatedMarkersCount = sceneConfig.markers.filter(markerId => sceneProgress[markerId] === true).length;
    const totalMarkersInScene = sceneConfig.totalMarkers;

    if (totalMarkersInScene === 0) return 'none'; // Pokud scéna nemá definované markery
    if (activatedMarkersCount === 0) return 'none'; // Pokud žádný marker není aktivován

    // Logika pro určení hvězdy na základě počtu markerů ve scéně (stejná jako jsi měl)
    if (totalMarkersInScene === 1) {
        if (activatedMarkersCount === 1) return 'gold';
    } else if (totalMarkersInScene === 2) {
        if (activatedMarkersCount === 2) return 'gold';
        if (activatedMarkersCount === 1) return 'silver';
    } else if (totalMarkersInScene === 3) {
        if (activatedMarkersCount === 3) return 'gold';
        if (activatedMarkersCount === 2) return 'silver'; // 2 je >= 3/2
        if (activatedMarkersCount === 1) return 'bronze';
    } else { // Scény se 4 a více markery
        if (activatedMarkersCount >= totalMarkersInScene) return 'gold'; // Všechny
        if (activatedMarkersCount >= Math.ceil(totalMarkersInScene / 2)) return 'silver'; // Polovina nebo více
        if (activatedMarkersCount > 0) return 'bronze'; // Alespoň jeden
    }

    return 'none'; // Výchozí, pokud žádná podmínka nesedí
}

/**
 * Zobrazí hvězdy v určeném HTML elementu na základě úrovně.
 * @param {HTMLElement} starElement - HTML element, kam se mají hvězdy vykreslit.
 * @param {string} level - Úroveň hvězdy ('none', 'bronze', 'silver', 'gold').
 */
function displayStarsInElement(starElement, level) {
    if (!starElement) return;

    let starsHtml = '';
    // Cesty k obrázkům hvězd by měly být absolutní od kořene webu nebo relativní k HTML.
    // Předpokládáme, že obrázky jsou ve složce /img/
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
            starsHtml = ''; // Žádná hvězda nebo prázdné místo
    }
    starElement.innerHTML = starsHtml;
    // Můžeš přidat i třídy pro další stylování:
    // starElement.className = 'star-display ' + 'star-' + level; // Např. 'star-display star-bronze'
}

/**
 * Najde všechny elementy pro zobrazení hvězd na stránce a aktualizuje je.
 * Předpokládá, že odkazy/tlačítka mají atribut `data-scene-path` odpovídající cestě scény,
 * a uvnitř nich je element s třídou `.star-indicator-for-scene`.
 * Nebo jednodušeji, aktualizuje hvězdy pro AKTUÁLNÍ SCÉNU, pokud máš jen jeden ukazatel na stránce.
 */
function updateStarsForCurrentScene() {
    const starLevel = getStarLevelForCurrentScene();
    // Předpokládejme, že na stránce je jeden hlavní ukazatel hvězd pro danou scénu.
    // Např. někde v hlavičce nebo vedle názvu scény.
    const mainSceneStarElement = document.querySelector('.main-scene-star-display'); // Uprav selektor
    if (mainSceneStarElement) {
        displayStarsInElement(mainSceneStarElement, starLevel);
    }

    // Pokud máš hvězdy u více odkazů na jedné stránce (méně typické pro AR scénu, spíše pro přehledovou stránku):
    // document.querySelectorAll('[data-star-display-for-path]').forEach(element => {
    //     const path = element.dataset.starDisplayForPath;
    //     if (path === getCurrentScenePath()) { // Nebo pokud je to přehled, počítat hvězdy pro každou cestu
    //         const level = getStarLevelForCurrentScene(); // Zde bys potřeboval funkci, co bere path jako argument
    //         displayStarsInElement(element, level);
    //     }
    // });
}


// Inicializace gamifikace na stránce AR scény.
// Spustí se po načtení DOMu.
document.addEventListener('DOMContentLoaded', () => {
    // Ověření, zda jsou dostupné potřebné konfigurace a proměnné
    if (typeof CURRENT_MUSEUM_ID === 'undefined' ||
        typeof APP_STORAGE_KEY === 'undefined' ||
        typeof MUSEUM_CONFIGS === 'undefined' ||
        typeof getCurrentScenePath !== 'function' ||
        typeof getCurrentMuseumConfig !== 'function' ||
        typeof getCurrentSceneConfigForMuseum !== 'function') {
        console.error("Chyba: Základní gamifikační konfigurace nebo CURRENT_MUSEUM_ID chybí. Gamifikace na této stránce nemusí fungovat správně.");
        return;
    }

    // Při startu scény zobrazíme aktuální stav hvězd pro tuto scénu.
    updateStarsForCurrentScene();

    // Zde bys měl integrovat volání `recordMarkerActivation(markerId)`
    // s tvým systémem detekce markerů (např. event listenery na tlačítka,
    // nebo callbacky z A-Frame/MindAR, když je marker nalezen/aktivován).

    // Příklad: Pokud máš tlačítka pro simulaci aktivace markerů:
    // document.querySelectorAll('button[data-marker-id]').forEach(button => {
    //     button.addEventListener('click', function() {
    //         const markerId = this.dataset.markerId;
    //         if (markerId) {
    //             recordMarkerActivation(markerId);
    //         }
    //     });
    // });
});
