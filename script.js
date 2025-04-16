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

});