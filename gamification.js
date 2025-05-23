// gamification.js

const STORAGE_KEY = 'arGamificationDataKyjov'; // Doporučuji unikátní klíč pro vaši aplikaci

function getGamificationData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
}

function saveGamificationData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function recordMarkerActivation(sceneId, markerId) {
    const data = getGamificationData();
    if (!data[sceneId]) {
        data[sceneId] = {};
    }
    // Zkontrolujeme, zda markerId existuje v konfiguraci pro danou scénu
    if (SCENE_CONFIG[sceneId] && SCENE_CONFIG[sceneId].markers && SCENE_CONFIG[sceneId].markers.includes(markerId)) {
        data[sceneId][markerId] = true;
        saveGamificationData(data);
        console.log(`Marker ${markerId} activated in scene ${sceneId}`);
    } else {
        console.warn(`Marker ID "${markerId}" (in scene "${sceneId}") not found in SCENE_CONFIG or SCENE_CONFIG.markers is undefined. Activation not recorded.`);
    }
}

function getSceneStarLevel(sceneId) {
    const data = getGamificationData();
    const sceneData = data[sceneId] || {}; // Data pro aktuální scénu
    const config = SCENE_CONFIG[sceneId]; // Konfigurace pro aktuální scénu

    if (!config) {
        console.warn(`Configuration for scene ${sceneId} not found.`);
        return 'none'; // Nebo nějaká výchozí hodnota
    }
    // Zajištění, že totalMarkers je číslo a markers je pole
    if (typeof config.totalMarkers !== 'number' || !Array.isArray(config.markers)) {
        console.warn(`Configuration for scene ${sceneId} is incomplete or malformed (totalMarkers should be a number, markers should be an array).`);
        return 'none';
    }

    const activatedMarkersCount = Object.keys(sceneData).filter(markerId => sceneData[markerId] === true).length;
    const totalMarkersInScene = config.totalMarkers;

    if (totalMarkersInScene === 0 || activatedMarkersCount === 0) {
        return 'none'; // Žádné markery ve scéně nebo žádný aktivovaný
    }

    // Specifická logika podle počtu markerů ve scéně
    if (totalMarkersInScene === 1) {
        // Scéna s 1 markerem
        if (activatedMarkersCount === 1) return 'gold';
    } else if (totalMarkersInScene === 2) {
        // Scéna se 2 markery
        if (activatedMarkersCount === 2) return 'gold';
        if (activatedMarkersCount === 1) return 'silver';
    } else if (totalMarkersInScene === 3) {
        // Scéna se 3 markery
        if (activatedMarkersCount === 3) return 'gold';
        if (activatedMarkersCount === 2) return 'silver'; // 2 je >= 3/2
        if (activatedMarkersCount === 1) return 'bronze';
    } else { // Scény se 4 a více markery
        if (activatedMarkersCount >= totalMarkersInScene) return 'gold'; // Všechny
        // Math.ceil zajistí, že pro 5 markerů bude polovina 3 (ceil(2.5)=3)
        // Pro 4 markery bude polovina 2 (ceil(2)=2)
        if (activatedMarkersCount >= Math.ceil(totalMarkersInScene / 2)) return 'silver'; // Polovina nebo více
        if (activatedMarkersCount > 0) return 'bronze'; // Alespoň jeden (a méně než polovina)
    }

    return 'none'; // Výchozí, pokud žádná podmínka nesedí (nemělo by nastat s kontrolou na začátku)
}

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
