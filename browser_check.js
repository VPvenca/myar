// Toto je správný obsah souboru browser-check.js

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
            <p>Zdá se, že otevíráte aplikaci ve vestavěném prohlížeči Messengeru, který nemusí správně podporovat rozšířenou realitu.</p>
            <p><strong>Prosím, otevřete tento odkaz ve Vašem hlavním internetovém prohlížeči (např. Google Chrome). Obvykle tři tečky ⋮ vpravo nahoře, zvolit "Otevřít v prohlížeči".</strong></p>
            <p style="margin-top: 25px; font-size: 12px; color: grey;">Pro zkušenější uživatele: Stiskněte tlačítko "Kopírovat odkaz". Poté odkaz vložte do adresního řádku prohlížeče.</p>
            <button id="copyLinkBtn" style="background-color: #4CAF50; color: white; padding: 12px 25px; border: none; border-radius: 5px; margin-top: 20px; font-size: 16px; cursor: pointer;">Kopírovat odkaz</button>
            
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
