// inventory.js (upraveno pro specifické medaile muzeí)

document.addEventListener('DOMContentLoaded', () => {
    if (typeof MUSEUM_CONFIGS === 'undefined' || typeof APP_STORAGE_KEY === 'undefined') {
        console.error("Chyba: MUSEUM_CONFIGS nebo APP_STORAGE_KEY nejsou definovány.");
        return;
    }

    const inventoryContainer = document.getElementById('inventory-display');
    if (!inventoryContainer) {
        console.error("Element s ID 'inventory-display' nebyl nalezen.");
        return;
    }

    function getAppDataForInventory() {
        const data = localStorage.getItem(APP_STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    }
    
    // Tato funkce zůstává stejná jako v předchozí verzi inventory.js pro výpočet hvězdy
    function calculateStarLevel(activatedCount, totalMarkers) {
        if (!totalMarkers || totalMarkers === 0) return 'none'; if (activatedCount === 0) return 'none';
        if (totalMarkers === 1) { return (activatedCount === 1) ? 'gold' : 'none'; }
        else if (totalMarkers === 2) { if (activatedCount === 2) return 'gold'; if (activatedCount === 1) return 'silver'; }
        else if (totalMarkers === 3) { if (activatedCount === 3) return 'gold'; if (activatedCount === 2) return 'silver'; if (activatedCount === 1) return 'bronze'; }
        else { if (activatedCount >= totalMarkers) return 'gold'; if (activatedCount >= Math.ceil(totalMarkers / 2)) return 'silver'; if (activatedCount > 0) return 'bronze';}
        return 'none';
    }

    function renderInventoryWithSpecificMedals() {
        const appData = getAppDataForInventory(); // Data z localStorage
        let html = '<h1>Moje sbírka medailí</h1><div class="medals-grid">'; // Použijeme grid pro zobrazení medailí

        for (const museumId in MUSEUM_CONFIGS) {
            if (MUSEUM_CONFIGS.hasOwnProperty(museumId)) {
                const museumConfig = MUSEUM_CONFIGS[museumId]; // Konfigurace konkrétního muzea
                // Zajistíme, že museumData existuje, i když uživatel muzeum ještě nenavštívil
                const museumDataFromStorage = appData[museumId] || { scenes: {}, overall: { badge: 'none', percentage: 0 } };
                
                let totalActivatedInMuseum = 0;
                let totalPossibleInMuseum = 0;

                // Výpočet postupu pro toto muzeum
                for (const scenePath in museumConfig.sceneConfig) {
                    if (museumConfig.sceneConfig.hasOwnProperty(scenePath)) {
                        const sceneCfg = museumConfig.sceneConfig[scenePath];
                        const sceneProgressData = museumDataFromStorage.scenes[scenePath] || {};
                        
                        let activatedInScene = 0;
                        if(Array.isArray(sceneCfg.markers)){
                           activatedInScene = sceneCfg.markers.filter(markerId => sceneProgressData[markerId] === true).length;
                        }
                        totalActivatedInMuseum += activatedInScene;
                        totalPossibleInMuseum += sceneCfg.totalMarkers;
                    }
                }

                const completionPercentageMuseum = (totalPossibleInMuseum > 0)
                    ? (totalActivatedInMuseum / totalPossibleInMuseum) * 100
                    : 0;

                let achievedMedalLevel = 'base'; // Výchozí je 'base' nebo 'ghost' medaile
                const thresholds = museumConfig.overallBadgeThresholds || { bronze: 10, silver: 50, gold: 100};
                
                // Určení úrovně medaile POUZE pokud byl alespoň jeden marker v muzeu aktivován
                // nebo pokud je 0% ale muzeum už bylo "načato" (má záznam v appData[museumId])
                // To zabrání zobrazení bronzové medaile jen proto, že existuje konfigurace muzea.
                if (appData[museumId] || totalActivatedInMuseum > 0) { // Pokud uživatel do muzea "vstoupil" nebo něco aktivoval
                    if (completionPercentageMuseum >= thresholds.gold) achievedMedalLevel = 'gold';
                    else if (completionPercentageMuseum >= thresholds.silver) achievedMedalLevel = 'silver';
                    else if (completionPercentageMuseum >= thresholds.bronze && totalActivatedInMuseum > 0) achievedMedalLevel = 'bronze';
                    // Pokud má 0% ale už byl v muzeu, zobrazíme base medaili.
                    // Pokud má 0% a ještě v muzeu nebyl (appData[museumId] je undefined), achievedMedalLevel zůstane 'base'
                }


                // Aktualizace 'overall' dat v appData pro toto muzeum
                // Je dobré to dělat zde, aby se to uložilo zpět do localStorage s aktuálním stavem
                if (!appData[museumId]) { // Pokud muzeum ještě není v datech, inicializujeme ho
                    appData[museumId] = { scenes: {}, overall: {} };
                }
                appData[museumId].overall = {
                    badge: achievedMedalLevel === 'base' ? 'none' : achievedMedalLevel, // Pro konzistenci s předchozí logikou
                    percentage: completionPercentageMuseum
                };


                // Získání cesty k obrázku medaile
                let medalImagePath = museumConfig.medals ? museumConfig.medals[achievedMedalLevel] : null;
                if (!medalImagePath && museumConfig.medals) { // Fallback na 'base', pokud specifická úroveň chybí
                    medalImagePath = museumConfig.medals.base;
                }


                html += `<div class="museum-medal-card">
                            <div class="medal-image-container">
                                ${medalImagePath ? `<img src="${medalImagePath}" alt="${museumConfig.name} - ${achievedMedalLevel} medaile">` : `<div class="medal-placeholder">?</div>`}
                            </div>
                            <div class="museum-medal-info">
                                <h3>${museumConfig.name}</h3>
                                <p>Postup: ${completionPercentageMuseum.toFixed(0)}%</p>
                                <p>(${totalActivatedInMuseum}/${totalPossibleInMuseum} markerů)</p>
                                <!-- Odkaz na detail muzea, pokud chceš -->
                                <!-- <a href="inventory.html?museum=${museumId}">Detail expozice</a> -->
                            </div>
                         </div>`;
            }
        }
        html += `</div>`; // Konec .medals-grid

        // Uložíme aktualizovaná data (zejména 'overall' pro každé muzeum) zpět do localStorage
        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appData));

        inventoryContainer.innerHTML = html;

        // Možnost přidat podrobnější rozpis scén pro každé muzeum (volitelné)
        addSceneDetailsSection(appData);
    }
    
    // Volitelná funkce pro zobrazení detailů scén (podobně jako dříve, ale může být skrytá a rozbalitelná)
    function addSceneDetailsSection(appData) {
        let detailsHtml = `<div class="all-scenes-details">
                                <h2>Detailní přehled scén</h2>`;
        for (const museumId in MUSEUM_CONFIGS) {
            if (MUSEUM_CONFIGS.hasOwnProperty(museumId)) {
                const museumConfig = MUSEUM_CONFIGS[museumId];
                const museumDataFromStorage = appData[museumId] || { scenes: {} };
                detailsHtml += `<h3>${museumConfig.name}</h3><ul>`;

                for (const scenePath in museumConfig.sceneConfig) {
                    if (museumConfig.sceneConfig.hasOwnProperty(scenePath)) {
                        const sceneCfg = museumConfig.sceneConfig[scenePath];
                        const sceneProgressData = museumDataFromStorage.scenes[scenePath] || {};
                        let activatedInScene = 0;
                        if(Array.isArray(sceneCfg.markers)){
                           activatedInScene = sceneCfg.markers.filter(markerId => sceneProgressData[markerId] === true).length;
                        }
                        const star = calculateStarLevel(activatedInScene, sceneCfg.totalMarkers);
                        detailsHtml += `<li>
                                            <strong>${sceneCfg.name}</strong> (Markery: ${activatedInScene}/${sceneCfg.totalMarkers})
                                            <span class="star-icon star-${star}">
                                                ${star !== 'none' ? `<img src="/img/${star}_star.png" alt="${star} hvězda">` : ''}
                                            </span>
                                         </li>`;
                    }
                }
                detailsHtml += `</ul>`;
            }
        }
        detailsHtml += `</div>`;
        inventoryContainer.insertAdjacentHTML('beforeend', detailsHtml);
    }


    renderInventoryWithSpecificMedals();
});
