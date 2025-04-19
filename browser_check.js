<!-- ======================================================= -->
    <!-- ZDE VLOŽTE VÁŠ DETEKČNÍ JAVASCRIPT                -->
    <!-- ======================================================= -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const ua = navigator.userAgent || navigator.vendor || window.opera;
            const isFacebookApp = ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
            const isMessengerApp = ua.indexOf('Messenger') > -1;
            const isAndroid = ua.indexOf('Android') > -1;
            const isWebView = ua.indexOf('; wv)') > -1 || ua.indexOf('WebView') > -1;

            if (isAndroid && (isFacebookApp || isMessengerApp || (isWebView && (ua.includes("FB") || ua.includes("Messenger")))) ) {
                displayInAppBrowserWarning();
            } else {
                // Původní kód pro inicializaci, pokud nějaký máte,
                // jinak nechte prázdné, A-Frame se inicializuje sám.
                initializeApp();
            }
        });

        function displayInAppBrowserWarning() {
            const warningDiv = document.createElement('div');
            // ... (zbytek kódu pro warningDiv z předchozí odpovědi) ...
            warningDiv.innerHTML = `
                <h2>Problém s prohlížečem</h2>
                <p>Zdá se, že otevíráte aplikaci ve vestavěném prohlížeči Messengeru, který nemusí správně podporovat rozšířenou realitu.</p>
                <p><strong>Prosím, otevřete tento odkaz ve Vašem hlavním prohlížeči (např. Google Chrome).</strong></p>
                <button id="copyLinkBtn" style="padding: 10px 20px; margin-top: 20px; font-size: 16px; cursor: pointer;">Kopírovat odkaz</button>
                <p style="margin-top: 15px; font-size: 14px;">Poté odkaz vložte do adresního řádku prohlížeče Chrome.</p>
                <br><br>
                <small>Pokud jste již v Chrome, můžete tuto zprávu ignorovat.</small>
            `;
            document.body.appendChild(warningDiv);

            document.getElementById('copyLinkBtn').addEventListener('click', function() {
                 navigator.clipboard.writeText(window.location.href).then(function() {
                     alert('Odkaz byl zkopírován do schránky!');
                 }, function(err) {
                     alert('Nepodařilo se zkopírovat odkaz. Zkuste to prosím ručně.');
                     console.error('Chyba kopírování: ', err);
                 });
            });
        }

        function initializeApp() {
            // Tuto funkci zavoláte, pokud jste v podporovaném prohlížeči.
            // Pokud vaše AR aplikace nevyžaduje žádnou speciální JS inicializaci
            // (A-Frame a MindAR se často inicializují samy na základě atributů v HTML),
            // můžete tuto funkci nechat prázdnou nebo jen vypsat něco do konzole.
            console.log("Aplikace inicializována v podporovaném prohlížeči.");
            // Případně zde můžete skrýt nějaký načítací indikátor, pokud jej používáte.
        }
    </script>
    <!-- ======================================================= -->
    <!-- KONEC DETEKČNÍHO JAVASCRIPTU                        -->
    <!-- ======================================================= -->
