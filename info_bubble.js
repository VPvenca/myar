class InfoBubbleModule {
    constructor(options = {}) {
        this.options = {
            delay: options.delay || 3000,
            storageKey: options.storageKey || 'infoBubbleShown',
            autoShow: options.autoShow !== false,
            title: options.title || 'Vítejte!',
            content: options.content || 'Toto je vaše první návštěva naší stránky. Děkujeme, že jste si nás vybrali!',
            primaryButtonText: options.primaryButtonText || 'Rozumím',
            secondaryButtonText: options.secondaryButtonText || 'Nezobrazovat znovu',
            position: options.position || 'top-right',
            onPrimaryClick: options.onPrimaryClick || null,
            onSecondaryClick: options.onSecondaryClick || null,
            onClose: options.onClose || null
        };
        
        this.bubble = null;
        this.isVisible = false;
        
        // Počkáme na načtení DOM před inicializací
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            // DOM je už načten
            this.init();
        }
    }
    
    init() {
        this.createBubble();
        
        if (this.options.autoShow && this.isFirstVisit()) {
            setTimeout(() => {
                this.show();
            }, this.options.delay);
        }
    }
    
    isFirstVisit() {
        return !localStorage.getItem(this.options.storageKey);
    }
    
    markAsShown() {
        localStorage.setItem(this.options.storageKey, 'true');
    }
    
    createBubble() {
        if (this.bubble) return;
        
        // Dodatečná kontrola, že document.body existuje
        if (!document.body) {
            console.error('Document body is not available yet');
            return;
        }
        
        this.bubble = document.createElement('div');
        this.bubble.className = 'info-bubble';
        this.bubble.innerHTML = `
            <div class="info-bubble-header">
                <span>${this.options.title}</span>
                <button class="info-bubble-close" onclick="infoBubble.hide()">&times;</button>
            </div>
            <div class="info-bubble-content">
                ${this.options.content}
            </div>
            <div class="info-bubble-actions">
                <button class="info-bubble-btn info-bubble-btn-secondary" onclick="infoBubble.handleSecondaryClick()">
                    ${this.options.secondaryButtonText}
                </button>
                <button class="info-bubble-btn info-bubble-btn-primary" onclick="infoBubble.handlePrimaryClick()">
                    ${this.options.primaryButtonText}
                </button>
            </div>
        `;
        
        document.body.appendChild(this.bubble);
    }
    
    show() {
        if (!this.bubble || this.isVisible) return;
        
        this.bubble.classList.add('show');
        this.isVisible = true;
    }
    
    hide() {
        if (!this.bubble || !this.isVisible) return;
        
        this.bubble.classList.remove('show');
        this.isVisible = false;
        
        if (this.options.onClose) {
            this.options.onClose();
        }
    }
    
    handlePrimaryClick() {
        this.markAsShown();
        this.hide();
        
        if (this.options.onPrimaryClick) {
            this.options.onPrimaryClick();
        }
    }
    
    handleSecondaryClick() {
        this.markAsShown();
        this.hide();
        
        if (this.options.onSecondaryClick) {
            this.options.onSecondaryClick();
        }
    }
    
    reset() {
        localStorage.removeItem(this.options.storageKey);
        this.hide();
    }
    
    destroy() {
        if (this.bubble) {
            this.bubble.remove();
            this.bubble = null;
        }
        this.isVisible = false;
    }
}

// Inicializace modulu - spustí se až po načtení DOM
function initializeInfoBubble() {
    const infoBubble = new InfoBubbleModule({
       title: '<img src="/img/map_ico.png" style="width: 40px; height: 40px; margin-right: 8px; vertical-align: middle;">Navigace',
        content: 'Tlačítko mapy vás nasměruje k místu na Google mapách, kde se expozice nachází',
        delay: 3000,
        primaryButtonText: 'Rozumím!',
        secondaryButtonText: 'Nezobrazovat znovu',
        onPrimaryClick: () => {
            console.log('Uživatel přečetl uvítací zprávu');
        },
        onSecondaryClick: () => {
            console.log('Uživatel nechce znovu zobrazovat uvítací zprávu');
        },
        onClose: () => {
            console.log('Uvítací bublina byla zavřena');
        }
    });
    
    // Globální přístup k modulu
    window.infoBubble = infoBubble;
}

// Spustíme inicializaci když je DOM připraven
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInfoBubble);
} else {
    // DOM je už načten
    initializeInfoBubble();
}
