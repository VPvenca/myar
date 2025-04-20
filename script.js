// Počkáme, až se načte celý HTML dokument
document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // === Kód pro modální okno nápovědy ===
    // ========================================
    const helpButton = document.getElementById('help-button');
    const helpModal = document.getElementById('help-modal');
    const closeHelpButton = document.getElementById('close-help-button');

    if (helpButton && helpModal && closeHelpButton) {
        function openModal() {
            helpModal.classList.add('visible');
        }
        function closeModal() {
            helpModal.classList.remove('visible');
        }
        helpButton.addEventListener('click', openModal);
        closeHelpButton.addEventListener('click', closeModal);
        helpModal.addEventListener('click', function(event) {
            if (event.target === helpModal) {
                closeModal();
            }
        });
        document.addEventListener('keydown', function(event) {
            if (helpModal.classList.contains('visible') && event.key === 'Escape') {
                closeModal();
            }
        });
    } else {
        console.warn("Některý z elementů pro nápovědu nebyl nalezen!"); // Změna na warn, není to kritická chyba
    }
    // ========================================
    // === Konec kódu pro nápovědu ===
    // ========================================


    // =================================================
    // === Registrace a aktualizace Service Workeru ===
    // =================================================

    let newWorker; // Proměnná pro uložení čekajícího/instalujícího se SW

    // Funkce pro zobrazení informační lišty o aktualizaci
    function showUpdateBar() {
        let updateBar = document.getElementById('update-bar');
        if (!updateBar) {
            updateBar = document.createElement('div');
            updateBar.id = 'update-bar';
            // Základní stylování lišty (můžete vylepšit v CSS)
            updateBar.style.position = 'fixed';
            updateBar.style.bottom = '0';
            updateBar.style.left = '0';
            updateBar.style.width = '100%';
            updateBar.style.backgroundColor = '#333';
            updateBar.style.color = 'white';
            updateBar.style.padding = '1em';
            updateBar.style.textAlign = 'center';
            updateBar.style.zIndex = '1001'; // Nad většinou obsahu
            updateBar.style.borderTop = '1px solid #555';
            updateBar.innerHTML = `
                Nová verze aplikace je k dispozici.
                <button id="reload-button" style="margin-left: 15px; padding: 8px 15px; background-color: #5bc0de; color: white; border: none; border-radius: 4px; cursor: pointer;">Aktualizovat</button>
            `;
            document.body.appendChild(updateBar);

            // Přidání listeneru na tlačítko aktualizace
            document.getElementById('reload-button').addEventListener('click', () => {
                // Předpokládáme, že `skipWaiting()` bylo voláno v 'install' eventu SW.
                // Jednoduše znovu načteme stránku. Nový SW by měl převzít kontrolu.
                console.log("Uživatel kliknul na Aktualizovat. Provádím reload.");
                window.location.reload();
            });
        }
        updateBar.style.display = 'block'; // Zajistíme, že je viditelná
    }

    // Zkontrolujeme, zda prohlížeč podporuje Service Worker
    if ('serviceWorker' in navigator) {
        // Registrujeme SW
        navigator.serviceWorker.register('/sw.js') // Ujistěte se, že cesta k sw.js je správná
            .then(reg => {
                console.log('Service Worker zaregistrován.', reg);

                // --- Sledování aktualizací ---
                reg.addEventListener('updatefound', () => {
                    console.log('Nalezena nová verze Service Workeru, instaluje se...');
                    newWorker = reg.installing; // Získáme odkaz na nový SW

                    newWorker.addEventListener('statechange', () => {
                        // Sledujeme změnu stavu nového SW
                        if (newWorker.state === 'installed') {
                            // Nový SW je nainstalován
                            // Zkontrolujeme, zda už stránku nekontroluje jiný (starý) SW
                            if (navigator.serviceWorker.controller) {
                                // Pokud ano, znamená to, že je to AKTUALIZACE
                                console.log('Nová verze Service Workeru nainstalována. Zobrazuji upozornění.');
                                showUpdateBar(); // Zobrazíme uživateli lištu
                            } else {
                                // Pokud ne, toto je první instalace SW
                                console.log('Service Worker nainstalován poprvé. Není třeba aktualizovat.');
                            }
                        }
                    });
                });
                // --- Konec sledování aktualizací ---

            })
            .catch(error => {
                console.error('Registrace Service Workeru selhala:', error);
            });

        // --- Sledování převzetí kontroly ---
        // Tento listener se spustí, když nový SW úspěšně nahradí starý
        let refreshing; // Pojistka proti vícenásobnému reloadu
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log("Controllerchange: Nový Service Worker převzal kontrolu.");
            // Zde bychom mohli vynutit reload, ale necháme to na uživateli přes tlačítko
            // if (refreshing) return;
            // refreshing = true;
            // window.location.reload();
        });
        // --- Konec sledování převzetí kontroly ---

    } else {
        console.warn('Service Worker není podporován tímto prohlížečem.');
    }

    // =====================================================
    // === Konec Registrace a aktualizace Service Workeru ===
    // =====================================================


    // Zde pokračuje váš ostatní kód (listenery tlačítek, MindAR logika atd.)
    // ...
    console.log("Ostatní logika aplikace inicializována.");

}); // Konec DOMContentLoaded listeneru
