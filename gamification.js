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
    const sceneData = data[sceneId] || {};
    const config = SCENE_CONFIG[sceneId];

    if (!config) {
        console.warn(`Configuration for scene ${sceneId} not found.`);
        return 'none';
    }
    if (config.totalMarkers === undefined || !Array.isArray(config.markers)) {
        console.warn(`Configuration for scene ${sceneId} is incomplete (missing totalMarkers or markers array).`);
        return 'none';
    }


    const activatedMarkersCount = Object.keys(sceneData).filter(markerId => sceneData[markerId] === true).length;
    const totalMarkersInScene = config.totalMarkers;

    if (totalMarkersInScene === 0) return 'none';

    if (activatedMarkersCount === 0) return 'none';
    if (activatedMarkersCount >= totalMarkersInScene) return 'gold'; // Používám >= pro případ, že by se omylem zaznamenalo více
    if (activatedMarkersCount >= totalMarkersInScene / 2) return 'silver';
    if (activatedMarkersCount > 0) return 'bronze';

    return 'none';
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
        // Můžete přidat třídu pro lepší styling, např.
        // starElement.className = 'star-display star-' + level;
    }
}
