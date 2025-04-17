// Počkáme, až se načte celý HTML dokument
document.addEventListener('DOMContentLoaded', function() {

    // Najdeme potřebné elementy podle jejich ID
    const helpButton = document.getElementById('help-button');
    const helpModal = document.getElementById('help-modal');
    const closeHelpButton = document.getElementById('close-help-button');

    // Zkontrolujeme, zda všechny elementy existují, abychom předešli chybám
    if (helpButton && helpModal && closeHelpButton) {

        // Funkce pro otevření modálního okna
        function openModal() {
            helpModal.classList.add('visible'); // Přidá třídu .visible
        }

        // Funkce pro zavření modálního okna
        function closeModal() {
            helpModal.classList.remove('visible'); // Odebere třídu .visible
        }

        // Přidáme "posluchač" události kliknutí na tlačítko nápovědy
        helpButton.addEventListener('click', openModal);

        // Přidáme posluchač události kliknutí na tlačítko "Zpět do menu" uvnitř modálu
        closeHelpButton.addEventListener('click', closeModal);

        // VOLITELNÉ: Zavření modálního okna kliknutím na pozadí (overlay)
        helpModal.addEventListener('click', function(event) {
            // Zavřeme pouze pokud bylo kliknuto přímo na overlay (event.target),
            // ne na jeho obsah (.modal-content nebo prvky uvnitř něj)
            if (event.target === helpModal) {
                closeModal();
            }
        });

        // VOLITELNÉ: Zavření modálního okna stiskem klávesy Escape
        document.addEventListener('keydown', function(event) {
            // Zkontrolujeme, zda je modální okno viditelné a byla stisknuta klávesa Escape
            if (helpModal.classList.contains('visible') && event.key === 'Escape') {
                closeModal();
            }
        });

    } else {
        console.error("Některý z elementů pro nápovědu nebyl nalezen!");
    }
    // --- Logika pro zobrazení iOS instalačního návodu ---

function isIOS() {
  // Jednoduchá detekce (může být v budoucnu méně spolehlivá)
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  // Nebo robustnější:
  // return [
  //   'iPad Simulator',
  //   'iPhone Simulator',
  //   'iPod Simulator',
  //   'iPad',
  //   'iPhone',
  //   'iPod'
  // ].includes(navigator.platform)
  // // iPad na iOS 13+ může hlásit MacIntel, přidáme další check
  // || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

// Zjistíme, zda aplikace běží v režimu standalone (nainstalovaná PWA)
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

const iosInstallPrompt = document.getElementById('ios-install-prompt');
const closeIosPromptButton = document.getElementById('close-ios-prompt');

if (iosInstallPrompt && closeIosPromptButton) {
    // Zobrazíme návod pouze pokud je to iOS A aplikace NEběží jako nainstalovaná
    if (isIOS() && !isStandalone()) {
        console.log("Detekován iOS, zobrazuji instalační návod.");
        // Po malé prodlevě zobrazíme banner (dáme uživateli čas se zorientovat)
        setTimeout(() => {
             iosInstallPrompt.classList.remove('hidden'); // Odstraní display:none
             // Pokud používáte animaci vysunutí:
             requestAnimationFrame(() => { // Zajistí, že prohlížeč stihne aplikovat display:block
                iosInstallPrompt.classList.add('visible');
             });
        }, 1500); // Zobrazí po 1.5 sekundách
    } else {
        iosInstallPrompt.classList.add('hidden'); // Ujistíme se, že je skrytý
    }

    // Funkce pro zavření návodu
    closeIosPromptButton.addEventListener('click', () => {
        iosInstallPrompt.classList.remove('visible'); // Zasune banner
        // Můžete přidat i 'hidden' po dokončení animace, pokud nepoužíváte display:none
        setTimeout(() => {
             iosInstallPrompt.classList.add('hidden'); // Skryje úplně
        }, 400); // Musí odpovídat délce transition v CSS

        // Můžete si uložit do localStorage, že uživatel banner zavřel,
        // aby se nezobrazoval při každé návštěvě session
        // localStorage.setItem('iosInstallPromptDismissed', 'true');
        // Pak byste na začátku kontrolovali:
        // if (isIOS() && !isStandalone() && !localStorage.getItem('iosInstallPromptDismissed')) { ... }
    });

} else {
     console.warn("Element pro iOS instalační návod (#ios-install-prompt) nebo jeho zavírací tlačítko nebylo nalezeno.");
}

// --- Konec logiky pro iOS návod ---


    // --- Registrace Service Workeru ---

// Zkontrolujeme, zda prohlížeč podporuje Service Worker
if ('serviceWorker' in navigator) {
  // Počkáme, až se stránka úplně načte, než zaregistrujeme SW
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js') // Cesta k vašemu sw.js
      .then(registration => {
        console.log('Service Worker úspěšně zaregistrován. Scope:', registration.scope);
      })
      .catch(error => {
        console.error('Registrace Service Workeru selhala:', error);
      });
  });
} else {
  console.log('Service Worker není podporován tímto prohlížečem.');
}

// --- Konec Registrace Service Workeru ---

// Zde pokračuje váš ostatní kód (listenery tlačítek, MindAR logika atd.)
// ...

});
