
   document.addEventListener('DOMContentLoaded', function() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isFacebookApp = ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
    const isMessengerApp = ua.indexOf('Messenger') > -1;
    const isAndroid = ua.indexOf('Android') > -1;
    const isWebView = ua.indexOf('; wv)') > -1 || ua.indexOf('WebView') > -1;

    // Přesnější kontrola pro WebView na Androidu v kombinaci s FB/Messenger
    const isFbOrMessengerWebView = isAndroid && isWebView && (ua.includes('FB') || ua.includes('Messenger'));

    if (isAndroid && (isFacebookApp || isMessengerApp || isFbOrMessengerWebView)) {
        displayInAppBrowserWarning();
    } else {
        // Původní kód pro inicializaci, pokud nějaký máte,
        // jinak nechte prázdné, A-Frame se inicializuje sám.
        initializeApp();
    }
});

function displayInAppBrowserWarning() {
    // Zkontrolujeme, jestli už varování neexistuje
    if (document.getElementById('inAppBrowserWarningDiv')) {
        return;
    }

    const warningDiv = document.createElement('div');
    warningDiv.id = 'inAppBrowserWarningDiv'; // Přidáme ID pro případnou kontrolu
    warningDiv.style.position = 'fixed';
    warningDiv.style.top = '0';
    warningDiv.style.left = '0';
    warningDiv.style.width = '100%';
    warningDiv.style.height = '100%';
    warningDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    warningDiv.style.color = 'white';
    warningDiv.style.zIndex = '10000';
    warningDiv.style.display = 'flex';
    warningDiv.style.flexDirection = 'column';
    warningDiv.style.justifyContent = 'center';
    warningDiv.style.alignItems = 'center';
    warningDiv.style.padding = '20px';
    warningDiv.style.textAlign = 'center';
    warningDiv.style.fontFamily = 'sans-serif';

    warningDiv.innerHTML = `
        <div style="background: white; color: black; padding: 30px; border-radius: 10px; max-width: 90%;">
            <h2>Problém s prohlížečem</h2>
            <p>Zdá se, že otevíráte aplikaci ve vestavěném prohlížeči Messengeru (nebo jiné aplikace), který nemusí správně podporovat rozšířenou realitu.</p>
            <p><strong>Prosím, otevřete tento odkaz ve Vašem hlavním internetovém prohlížeči (např. Google Chrome).</strong></p>
            <button id="copyLinkBtn" style="background-color: #4CAF50; color: white; padding: 12px 25px; border: none; border-radius: 5px; margin-top: 20px; font-size: 16px; cursor: pointer;">Kopírovat odkaz</button>
            <p style="margin-top: 15px; font-size: 14px;">Poté odkaz vložte do adresního řádku prohlížeče Chrome.</p>
            <p style="margin-top: 25px; font-size: 12px; color: grey;">Pro zkušenější uživatele: Můžete také zkusit v menu (obvykle tři tečky ⋮ vpravo nahoře) zvolit "Otevřít v prohlížeči".</p>
        </div>
    `;
    document.body.appendChild(warningDiv);

    document.getElementById('copyLinkBtn').addEventListener('click', function() {
         navigator.clipboard.writeText(window.location.href).then(function() {
             alert('Odkaz byl zkopírován do schránky!');
         }, function(err) {
             // Fallback pro starší prohlížeče nebo pokud selže API
             try {
                 const input = document.createElement('textarea');
                 input.value = window.location.href;
                 document.body.appendChild(input);
                 input.select();
                 document.execCommand('copy');
                 document.body.removeChild(input);
                 alert('Odkaz byl zkopírován do schránky!');
             } catch (e) {
                 alert('Nepodařilo se automaticky zkopírovat odkaz. Zkuste to prosím ručně (podržte prst na odkazu nebo ho vyberte a zvolte kopírovat).');
                 console.error('Chyba kopírování: ', err, e);
             }
         });
    });
}

function initializeApp() {
    // Tuto funkci zavoláte, pokud jste v podporovaném prohlížeči.
    // Můžete ji nechat prázdnou, pokud se A-Frame a MindAR inicializují samy.
    console.log("Aplikace inicializována v podporovaném prohlížeči.");
    // Případně zde můžete skrýt nějaký načítací indikátor nebo provést jinou inicializaci.
}
Use code with caution.
JavaScript
(Přidal jsem drobná vylepšení do displayInAppBrowserWarning - lepší vzhled, fallback pro kopírování, kontrolu, aby se varování nezobrazilo vícekrát, a přesnější detekci WebView).
Problém č. 2: Chyba Service Workeru (sw.js)
Chyba Failed to execute 'addAll' on 'Cache': Request failed ve vašem sw.js znamená, že Service Worker se pokusil stáhnout a uložit všechny soubory uvedené v poli urlsToCache, ale minimálně jeden z nich se nepodařilo stáhnout (pravděpodobně chyba 404 Not Found nebo jiná síťová chyba).
Řešení pro sw.js:
Zkontrolujte všechny cesty v urlsToCache: Projděte si seznam a ověřte, že všechny cesty jsou správně a soubory na nich skutečně existují na vašem serveru https://www.augview.cz/:
'/' - OK
'/index.html' - Existuje https://www.augview.cz/index.html?
'/style.css' - Existuje https://www.augview.cz/style.css? (Není to např. /styles/style.css?)
'/script.js' - Existuje https://www.augview.cz/script.js? (Jaký skript to je? Je to ten hlavní pro PWA?)
'/images/logo.png' - Existuje https://www.augview.cz/images/logo.png? (Není to /img/logo.png nebo jiná cesta?)
'/podmenu_vyukove.html' - Existuje https://www.augview.cz/podmenu_vyukove.html?
'/podmenu_zabavne.html' - Existuje https://www.augview.cz/podmenu_zabavne.html?
Opravte nebo odeberte chybné cesty: Pokud některý soubor neexistuje nebo má špatnou cestu, opravte ji v poli urlsToCache nebo řádek dočasně odeberte (zakomentujte pomocí //).
Přidejte browser-check.js (volitelně): Až opravíte obsah browser-check.js a ověříte, že se správně načítá, můžete jeho cestu přidat do urlsToCache, pokud chcete, aby fungoval i offline (pokud to dává smysl pro vaši aplikaci):
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js', // Ujistěte se, že tento soubor existuje
  '/browser-check.js', // PŘIDÁNO - ujistěte se, že cesta je správná
  '/images/logo.png', // Ujistěte se, že tento soubor existuje
  '/podmenu_vyukove.html', // Ujistěte se, že tento soubor existuje
  '/podmenu_zabavne.html', // Ujistěte se, že tento soubor existuje
];
