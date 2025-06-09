/**
 * TUTORIAL CONFIG FOR GEO_ANDELE.HTML
 * Konfigurační soubor pro tutoriál andělské stezky
 */

// Konfigurace tutoriálu pro andělskou stezku
const tutorialConfig = {
    id: 'andele-stezka',
    storageKey: 'ar-tutorial-completed',
    autoStart: true,
    autoStartDelay: 1500,
    
    steps: [
        {
            title: '🔙 Zpět do Menu',
            content: '<p>Tímto tlačítkem se vrátíte do hlavního menu aplikace</p>',
            arrow: {
                direction: 'right',
                style: 'top: 25px; left: 120px;'
            },
            bubble: {
                style: 'top: 10px; left: 140px;'
            }
        },
        {
            title: '🔊 Audio ovládání',
            content: '<p>Ovládá přehrávání zvuku, který se spustí při přiblížení k bodu zájmu</p>',
            arrow: {
                direction: 'right',
                style: 'top: 75px; left: 70px;'
            },
            bubble: {
                style: 'top: 60px; left: 90px;'
            }
        },
        {
            title: '🧭 Navigace',
            content: '<p>Zobrazí seznam všech bodů zájmu a jejich vzdálenosti od vaší pozice</p>',
            arrow: {
                direction: 'left',
                style: 'top: 25px; right: 160px;'
            },
            bubble: {
                style: 'top: 10px; right: 180px;'
            }
        },
        {
            title: '📍 Informace o vzdálenosti',
            content: '<p>Ukazuje vzdálenost k nejbližšímu nebo vybranému bodu zájmu</p>',
            arrow: {
                direction: 'up',
                style: 'bottom: 100px; left: 50%; transform: translateX(-50%);'
            },
            bubble: {
                style: 'bottom: 120px; left: 50%; transform: translateX(-50%);'
            }
        },
        {
            title: '👁️ Rozšířená realita',
            content: `
                <ul>
                    <li>🎯 Na <strong>20m</strong> se objekt zobrazí v AR</li>
                    <li>🎵 Na <strong>10m</strong> se spustí zvukový doprovod</li>
                    <li>🔄 Dotykem můžete objekt otáčet</li>
                    <li>📱 Pohybujte telefonem pro lepší zobrazení</li>
                </ul>
            `,
            center: true
        },
        {
            title: '⚠️ Bezpečnost na prvním místě',
            content: `
                <div style="background: rgba(255, 69, 58, 0.1); padding: 12px; border-radius: 8px; border-left: 3px solid #ff453a; margin-bottom: 10px;">
                    <p style="margin: 5px 0; font-weight: bold; color: #ff453a;">Důležité upozornění:</p>
                    <ul style="margin: 8px 0;">
                        <li>👀 <strong>Vždy sledujte okolí</strong> a cestu před sebou</li>
                        <li>🚶 Při pohledu do telefonu se <strong>zastavte</strong></li>
                        <li>🛣️ Dávejte pozor na <strong>vozovky a překážky</strong></li>
                        <li>👥 Buďte ohleduplní k <strong>ostatním návštěvníkům</strong></li>
                    </ul>
                    <p style="margin: 5px 0; font-size: 13px; color: #ff8a80;">Bezpečná cesta je nejlepší cesta! 🙏</p>
                </div>
            `,
            center: true,
            finalButton: 'Rozumím, začít bezpečně! ✨'
        }
    ],
    
    onComplete: function() {
        console.log('Tutorial completed for andělská stezka');
        // Zde můžete spustit další logiku po dokončení tutoriálu
    }
};

// Inicializace tutoriálu
function initTutorial() {
    // Kontrola, jestli je ARTutorial class dostupná
    if (typeof ARTutorial !== 'undefined') {
        arTutorial = ARTutorial.create(tutorialConfig);
    } else {
        console.error('ARTutorial class not found. Make sure tutorial.js is loaded first.');
    }
}

// Spustit po načtení stránky
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initTutorial, 500);
    });
} else {
    setTimeout(initTutorial, 500);
}

// Pro debug - resetování tutoriálu (volitelné)
function resetTutorial() {
    if (arTutorial) {
        arTutorial.reset();
        arTutorial.start();
    }
}