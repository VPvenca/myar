/* ======================================
   WINE APP - Vinný kvízový systém a gamifikace
   Specifický modul pro vinařskou stezku
   ====================================== */

// === GLOBÁLNÍ PROMĚNNÉ ===
let gamificationInitialized = false;
let currentExpositionId = 'stezka_vino';
let currentSceneId = '/assets/stezka_vino/stezka.html';

// Kvízový systém
const QUIZ_DISTANCE_STEP = 50; // každých 50m
let lastQuizMilestone = -1;
let currentQuiz = null;

// === VINNÉ KVÍZY DATA ===

// 20 vinařských kvízů s fakty
const WINE_QUIZZES = [
    {
        question: "🍇 Kolik hroznů je potřeba na jednu láhev vína?",
        answers: ["A) 300 hroznů", "B) 600 hroznů", "C) 1200 hroznů"],
        correct: 1,
        explanation: "Na jednu láhev vína (0,75l) je potřeba přibližně 600 hroznů! To odpovídá zhruba 1,2-1,5 kg hroznů."
    },
    {
        question: "🍷 Kolik druhů vína existuje na světě?",
        answers: ["A) 1000 druhů", "B) 5000 druhů", "C) 10000 druhů"],
        correct: 2,
        explanation: "Na světě existuje přes 10 000 různých odrůd vinné révy! Komerčně se však pěstuje jen asi 1000 z nich."
    },
    {
        question: "🌍 Která země je největším producentem vína?",
        answers: ["A) Francie", "B) Itálie", "C) Španělsko"],
        correct: 1,
        explanation: "Itálie je největším producentem vína na světě! Následuje ji Francie a Španělsko."
    },
    {
        question: "🍾 Kolik bublin obsahuje průměrná láhev šampaňského?",
        answers: ["A) 10 milionů", "B) 49 milionů", "C) 100 milionů"],
        correct: 1,
        explanation: "Průměrná láhev šampaňského obsahuje přibližně 49 milionů bublin! Vznikají při druhé fermentaci."
    },
    {
        question: "🌡️ Při jaké teplotě se podává červené víno?",
        answers: ["A) 12-14°C", "B) 16-18°C", "C) 20-22°C"],
        correct: 1,
        explanation: "Červené víno se ideálně podává při teplotě 16-18°C. Příliš teplé víno ztrácí svou eleganci."
    },
    {
        question: "🏺 Kolik let může víno zrát v sudu?",
        answers: ["A) 1-2 roky", "B) 3-5 let", "C) 10-20 let"],
        correct: 1,
        explanation: "Kvalitní víno může zrát v dubových sudech 3-5 let, výjimečná vína i déle. Krátké zrání je 6-12 měsíců."
    },
    {
        question: "🍇 Kolik kilogramů hroznů vyroste na jedné révě?",
        answers: ["A) 2-3 kg", "B) 5-8 kg", "C) 10-15 kg"],
        correct: 1,
        explanation: "Jedna vinná réva vyprodukuje průměrně 5-8 kg hroznů ročně! To stačí na 3-6 lahví vína."
    },
    {
        question: "🌿 Kolik let může žít vinná réva?",
        answers: ["A) 30 let", "B) 60 let", "C) 100+ let"],
        correct: 2,
        explanation: "Vinná réva může žít přes 100 let! Nejstarší révy na světě mají dokonce přes 400 let."
    },
    {
        question: "💎 Kolik obsahuje víno antioxidantů?",
        answers: ["A) 200 sloučenin", "B) 500 sloučenin", "C) 1000 sloučenin"],
        correct: 2,
        explanation: "Víno obsahuje přes 1000 různých chemických sloučenin! Červené víno má více antioxidantů než bílé."
    },
    {
        question: "🔍 Jak poznáme kvalitu vína podle barvy?",
        answers: ["A) Podle intenzity", "B) Podle čirosti", "C) Podle obojího"],
        correct: 2,
        explanation: "Kvalita vína se pozná podle čirosti a intenzity barvy. Kalné víno nebo víno s hnědým nádechem může být vadné."
    },
    {
        question: "🌡️ Při jaké teplotě fermentuje bílé víno?",
        answers: ["A) 10-15°C", "B) 15-20°C", "C) 20-25°C"],
        correct: 1,
        explanation: "Bílé víno fermentuje při nižší teplotě 15-20°C pro zachování svěžích aromát. Červené při 25-30°C."
    },
    {
        question: "👃 Kolik různých vůní lze rozpoznat ve víně?",
        answers: ["A) 50 vůní", "B) 200 vůní", "C) 500 vůní"],
        correct: 2,
        explanation: "Ve víně lze rozpoznat přes 500 různých aromat! Profesionální someliéři jich dokáží identifikovat stovky."
    },
    {
        question: "🍷 Kolik procent alkoholu má průměrné víno?",
        answers: ["A) 8-10%", "B) 11-14%", "C) 15-18%"],
        correct: 1,
        explanation: "Průměrné víno má 11-14% alkoholu. Lehká vína mají 8-11%, silná vína až 15-16%."
    },
    {
        question: "🌞 Kolik slunečných hodin potřebuje réva za rok?",
        answers: ["A) 800 hodin", "B) 1300 hodin", "C) 2000 hodin"],
        correct: 1,
        explanation: "Vinná réva potřebuje minimálně 1300 slunečních hodin ročně pro kvalitní dozrání hroznů!"
    },
    {
        question: "🍾 Jak dlouho se uchovává otevřené víno?",
        answers: ["A) 1 den", "B) 3-5 dní", "C) 2 týdny"],
        correct: 1,
        explanation: "Otevřené víno se uchovává 3-5 dní v lednici. Červené vydrží o něco déle než bílé."
    },
    {
        question: "🏺 Z jakého materiálu jsou nejlepší vinné sudy?",
        answers: ["A) Akácie", "B) Dubu", "C) Kaštanu"],
        correct: 1,
        explanation: "Nejlepší vinné sudy jsou z dubu! Dubové dřevo dodává vínu komplexní chutě a umožňuje řízenou oxidaci."
    },
    {
        question: "💪 Kolik kilogramů hroznů unese sběrač za den?",
        answers: ["A) 50 kg", "B) 200 kg", "C) 500 kg"],
        correct: 1,
        explanation: "Zkušený sběrač hroznů dokáže za den nasbírat 200-300 kg hroznů! Ruční sběr je stále nejšetrnější metoda."
    },
    {
        question: "🛡️ Co je sulfitan ve víně?",
        answers: ["A) Konzervant", "B) Barvivo", "C) Chuťová přísada"],
        correct: 0,
        explanation: "Sulfitany jsou přírodní konzervant, který brání oxidaci a růstu bakterií. Jsou ve víně přirozeně i uměle."
    },
    {
        question: "⏰ Kdy se hrozny sklízí nejlépe?",
        answers: ["A) Ráno", "B) Poledne", "C) Večer"],
        correct: 0,
        explanation: "Hrozny se nejlépe sklízí časně ráno, kdy jsou chladné a obsahují nejvíce kyselin a aromát."
    },
    {
        question: "🌙 Jak dlouho trvá vinifikace?",
        answers: ["A) 1 týden", "B) 1 měsíc", "C) 3-6 měsíců"],
        correct: 2,
        explanation: "Celá vinifikace trvá 3-6 měsíců! Samotná fermentace 1-3 týdny, pak následuje dozrávání a ležení."
    }
];

// === KVÍZOVÝ SYSTÉM ===

/**
 * Získá seznam dokončených kvízů z localStorage
 * @returns {Array} Array indexů dokončených kvízů
 */
function getCompletedQuizzes() {
    const completed = localStorage.getItem('wineQuizzesCompleted');
    return completed ? JSON.parse(completed) : [];
}

/**
 * Označí kvíz jako dokončený a zkontroluje achievement
 * @param {number} quizIndex - Index dokončeného kvízu
 */
function markQuizCompleted(quizIndex) {
    const completed = getCompletedQuizzes();
    console.log(`🍇 markQuizCompleted called for quiz ${quizIndex}`);
    console.log(`📊 Current completed: ${completed.length}/${WINE_QUIZZES.length}`);
    
    // Přidej kvíz, pokud není dokončený
    if (!completed.includes(quizIndex)) {
        completed.push(quizIndex);
        localStorage.setItem('wineQuizzesCompleted', JSON.stringify(completed));
        console.log(`✅ Quiz ${quizIndex} added. New total: ${completed.length}/${WINE_QUIZZES.length}`);
    } else {
        console.log(`ℹ️ Quiz ${quizIndex} already completed`);
    }
    
    // Kontrola achievementu - vždy se zkontroluje
    const finalCompleted = getCompletedQuizzes();
    
    if (finalCompleted.length === WINE_QUIZZES.length) {
        console.log('🏆 All 20 quizzes completed! Activating quiz achievement...');
        
        // Zkontroluj, zda už není achievement odemčený
        if (typeof isAchievementUnlocked === 'function' && isAchievementUnlocked('wine_quiz_master')) {
            console.log('ℹ️ wine_quiz_master already unlocked');
            return;
        }
        
        // Aktivuj achievement přímo
        if (typeof unlockAchievement === 'function') {
            const success = unlockAchievement('wine_quiz_master');
            console.log('✅ unlockAchievement result:', success);
            
            if (success) {
                console.log('🎉 Kvízový achievement úspěšně aktivován!');
            }
        } else {
            console.error("❌ unlockAchievement function not found");
        }
    } else {
        console.log(`📈 Progress: ${finalCompleted.length}/${WINE_QUIZZES.length} quizzes completed`);
    }
}

/**
 * Získá náhodný nedokončený kvíz
 * @returns {Object|null} Objekt s kvízem a jeho indexem nebo null
 */
function getRandomUncompletedQuiz() {
    const completed = getCompletedQuizzes();
    const available = WINE_QUIZZES.map((_, index) => index).filter(index => !completed.includes(index));
    
    if (available.length === 0) {
        console.log('🍇 All quizzes completed!');
        return null;
    }
    
    const randomIndex = available[Math.floor(Math.random() * available.length)];
    return { quiz: WINE_QUIZZES[randomIndex], index: randomIndex };
}

/**
 * Zkontroluje vzdálenost od startu a zobrazí kvíz pokud je potřeba
 */
function checkDistanceForQuiz() {
    // Závislost na CoreUtils
    const userPos = window.CoreUtils ? window.CoreUtils.getUserPosition() : null;
    const startPos = window.CoreUtils ? window.CoreUtils.getStartPosition() : null;
    
    if (!userPos || !startPos) {
        return;
    }
    
    // Vypočítej vzdálenost od startu
    const distanceFromStart = window.CoreUtils.calculateDistance(
        startPos.lat, startPos.lng,
        userPos.lat, userPos.lng
    );
    
    // Zjisti, na kterém milníku jsme
    const currentMilestone = Math.floor(distanceFromStart / QUIZ_DISTANCE_STEP);
    
    console.log(`🎯 Distance from start: ${distanceFromStart.toFixed(1)}m, milestone: ${currentMilestone}, last quiz milestone: ${lastQuizMilestone}`);
    
    // Pokud jsme na novém milníku a ještě jsme tu kvíz nezobrazili
    if (currentMilestone > lastQuizMilestone && currentMilestone > 0) {
        console.log(`🎯 New milestone reached: ${currentMilestone * QUIZ_DISTANCE_STEP}m - showing quiz!`);
        lastQuizMilestone = currentMilestone;
        showRandomQuiz();
    }
}

/**
 * Zobrazí náhodný kvíz uživateli
 */
function showRandomQuiz() {
    const quizData = getRandomUncompletedQuiz();
    if (!quizData) {
        console.log('🎯 No more quizzes available - all completed!');
        return;
    }
    
    const { quiz, index } = quizData;
    currentQuiz = { ...quiz, index };
    
    // Zobraz kvíz
    document.getElementById('quizQuestion').textContent = quiz.question;
    
    const answersContainer = document.getElementById('quizAnswers');
    answersContainer.innerHTML = '';
    
    quiz.answers.forEach((answer, answerIndex) => {
        const button = document.createElement('div');
        button.className = 'quiz-answer';
        button.textContent = answer;
        button.onclick = () => selectAnswer(answerIndex);
        answersContainer.appendChild(button);
    });
    
    // Aktualizuj progress
    const completed = getCompletedQuizzes();
    const userPos = window.CoreUtils ? window.CoreUtils.getUserPosition() : null;
    const startPos = window.CoreUtils ? window.CoreUtils.getStartPosition() : null;
    
    const distanceFromStart = startPos && userPos ? window.CoreUtils.calculateDistance(
        startPos.lat, startPos.lng,
        userPos.lat, userPos.lng
    ) : 0;
    
    document.getElementById('quizProgress').textContent = 
        `Kvíz ${completed.length + 1}/${WINE_QUIZZES.length} • Vzdálenost: ${distanceFromStart.toFixed(0)}m`;
    
    document.getElementById('wineQuiz').style.display = 'block';
    console.log(`🍇 Showing quiz ${index}: ${quiz.question.substring(0, 50)}...`);
}

/**
 * Zpracuje výběr odpovědi uživatelem
 * @param {number} selectedIndex - Index vybrané odpovědi
 */
function selectAnswer(selectedIndex) {
    if (!currentQuiz) return;
    
    const answers = document.querySelectorAll('.quiz-answer');
    const explanationDiv = document.getElementById('quizExplanation');
    
    // Označ odpovědi
    answers.forEach((answer, index) => {
        if (index === currentQuiz.correct) {
            answer.classList.add('correct');
        } else if (index === selectedIndex && index !== currentQuiz.correct) {
            answer.classList.add('incorrect');
        }
        answer.onclick = null; // Deaktivuj klikání
    });
    
    // Zobraz vysvětlení
    explanationDiv.textContent = currentQuiz.explanation;
    explanationDiv.style.display = 'block';
    
    // Označ kvíz jako dokončený
    markQuizCompleted(currentQuiz.index);
    
    console.log(`🍇 Answer selected: ${selectedIndex}, correct: ${currentQuiz.correct}`);
}

/**
 * Zavře aktuální kvíz
 */
function closeQuiz() {
    document.getElementById('wineQuiz').style.display = 'none';
    document.getElementById('quizExplanation').style.display = 'none';
    currentQuiz = null;
}

/**
 * Získá progress kvízů pro UI
 * @returns {Object} Objekt s completed a total
 */
function getQuizProgress() {
    return {
        completed: getCompletedQuizzes().length,
        total: WINE_QUIZZES.length
    };
}

/**
 * Resetuje všechny kvízy (pro debug)
 */
function resetAllQuizzes() {
    localStorage.removeItem('wineQuizzesCompleted');
    lastQuizMilestone = -1;
    console.log("🔄 All wine quizzes reset");
}

// === GAMIFIKAČNÍ SYSTÉM ===

/**
 * Inicializuje gamifikační systém pro vinařskou stezku
 */
function initializeGameification() {
    console.log("🎮 Initializing gamification for vinařská stezka...");
    
    // Ujisti se, že jsou načtené všechny konfigurace
    if (typeof SCENE_CONFIG === 'undefined' || typeof ACHIEVEMENTS_CONFIG === 'undefined') {
        console.log("⏳ Waiting for gamification config...");
        setTimeout(initializeGameification, 500);
        return;
    }
    
    // Debug výpis konfigurací (pouze do konzole)
    console.log("📊 Scene config:", SCENE_CONFIG);
    console.log("🏆 Achievements config:", ACHIEVEMENTS_CONFIG);
    console.log("🏛️ Exposition registry:", EXPOSITION_REGISTRY);
    
    // Zkontroluj, že je expozice registrovaná
    if (typeof EXPOSITION_REGISTRY !== 'undefined' && EXPOSITION_REGISTRY['stezka_vino']) {
        console.log("✅ Vinařská stezka exposition is registered");
    } else {
        console.warn("⚠️ Vinařská stezka exposition not found in registry");
        // Zkus inicializovat znovu za chvíli
        setTimeout(initializeGameification, 1000);
        return;
    }
    
    // Inicializuj time tracking
    if (typeof initializeTimeTracking === 'function') {
        initializeTimeTracking(currentExpositionId, currentSceneId);
        console.log("⏱️ Time tracking initialized");
    } else {
        console.error("❌ initializeTimeTracking function not found");
    }
    
    gamificationInitialized = true;
    console.log("✅ Gamification initialized successfully for vinařská stezka");
}

/**
 * Zaznamenává aktivaci vinného markeru pro gamifikaci
 * @param {string} markerId - ID aktivovaného markeru
 */
function recordWineMarkerActivation(markerId) {
    if (!gamificationInitialized) {
        console.warn("⚠️ Gamification not initialized yet, skipping marker activation");
        return;
    }
    
    console.log(`🍇 Recording wine marker activation: ${markerId} in exposition ${currentExpositionId}, scene ${currentSceneId}`);
    
    if (typeof recordMarkerActivation === 'function') {
        recordMarkerActivation(currentExpositionId, currentSceneId, markerId);
    } else {
        console.error("❌ recordMarkerActivation function not found");
    }
}

/**
 * Získá status gamifikace
 * @returns {Object} Status objekt
 */
function getGameificationStatus() {
    return {
        initialized: gamificationInitialized,
        expositionId: currentExpositionId,
        sceneId: currentSceneId,
        quizProgress: getQuizProgress()
    };
}

// === TUTORIAL SYSTÉM ===

let tutorialInitialized = false;

/**
 * Inicializuje tutorial pro vinařskou stezku
 * @returns {Promise<boolean>} True pokud se tutorial úspěšně inicializoval
 */
async function initializeTutorial() {
    if (tutorialInitialized) return true;
    
    try {
        console.log("🎓 Loading tutorial config...");
        
        // Dynamicky načti config
        const script = document.createElement('script');
        script.src = '/assets/stezka_vino/tutorial/config_vino.js';
        
        await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
        
        // Počkej chvilku na vykonání
        await new Promise(resolve => setTimeout(resolve, 200));
        
        console.log("✅ Tutorial config loaded, creating instance...");
        
        // Vytvoř tutorial instanci
        if (typeof ARTutorial !== 'undefined' && typeof tutorialConfig !== 'undefined') {
            window.arTutorial = ARTutorial.create(tutorialConfig);
            tutorialInitialized = true;
            console.log("✅ Tutorial initialized successfully");
            return true;
        } else {
            console.error("❌ Tutorial dependencies not loaded");
            return false;
        }
        
    } catch (error) {
        console.error("❌ Tutorial initialization failed:", error);
        return false;
    }
}

/**
 * Spustí tutorial když je vše připravené
 */
function startTutorialWhenReady() {
    setTimeout(async () => {
        console.log("🎓 Starting tutorial initialization...");
        
        const success = await initializeTutorial();
        if (success && window.arTutorial) {
            // Malé zpoždění pro plynulý přechod
            setTimeout(() => {
                console.log("🎓 Starting tutorial...");
                window.arTutorial.start();
            }, 1000);
        }
    }, 3000); // 3 sekundy po načtení A-Frame
}

// === DEBUG FUNKCE ===

/**
 * Debug funkce pro kvízový systém
 */
function debugQuizSystem() {
    console.log("=== WINE QUIZ SYSTEM DEBUG ===");
    console.log("Total quizzes:", WINE_QUIZZES.length);
    console.log("Completed quizzes:", getCompletedQuizzes());
    console.log("Quiz progress:", getQuizProgress());
    console.log("Current quiz milestone:", lastQuizMilestone);
    console.log("Current quiz:", currentQuiz);
    
    const rawData = localStorage.getItem('wineQuizzesCompleted');
    console.log("Raw localStorage data:", rawData);
    
    console.log("===============================");
    
    return {
        totalQuizzes: WINE_QUIZZES.length,
        completedQuizzes: getCompletedQuizzes(),
        progress: getQuizProgress(),
        currentMilestone: lastQuizMilestone,
        currentQuiz: currentQuiz,
        rawData: rawData
    };
}

/**
 * Debug funkce pro gamifikaci
 */
function debugGameification() {
    console.log("=== WINE GAMIFICATION DEBUG ===");
    console.log("Gamification status:", getGameificationStatus());
    console.log("Tutorial initialized:", tutorialInitialized);
    console.log("Available functions:", {
        recordMarkerActivation: typeof recordMarkerActivation,
        unlockAchievement: typeof unlockAchievement,
        isAchievementUnlocked: typeof isAchievementUnlocked,
        initializeTimeTracking: typeof initializeTimeTracking
    });
    console.log("================================");
    
    return getGameificationStatus();
}

/**
 * Aktivuje přímo kvízový achievement (pro testing)
 */
function directActivateWineQuizAchievement() {
    console.log("🎯 DIRECT ACHIEVEMENT ACTIVATION");
    console.log("=================================");
    
    const allQuizzes = Array.from({length: WINE_QUIZZES.length}, (_, i) => i);
    localStorage.setItem('wineQuizzesCompleted', JSON.stringify(allQuizzes));
    
    if (typeof unlockAchievement === 'function') {
        console.log("🏆 Calling unlockAchievement directly...");
        const result = unlockAchievement('wine_quiz_master');
        console.log("Result:", result);
    } else {
        console.log("❌ unlockAchievement not available");
    }
    
    console.log("=================================");
}

/**
 * Kompletní debug status pro wine app
 */
function debugWineAppStatus() {
    console.log("=== WINE APP COMPLETE STATUS ===");
    const quizDebug = debugQuizSystem();
    const gamificationDebug = debugGameification();
    
    return {
        quiz: quizDebug,
        gamification: gamificationDebug,
        tutorial: tutorialInitialized
    };
}

// === EVENT LISTENERY ===

/**
 * Nastaví event listenery specifické pro wine app
 */
function setupWineAppEventListeners() {
    // Quiz close button
    const quizClose = document.getElementById('quizClose');
    if (quizClose) {
        quizClose.addEventListener('click', closeQuiz);
        console.log("🎛️ Quiz close event listener setup");
    }
    
    // Page visibility API pro pozastavení gamifikace
    document.addEventListener('visibilitychange', () => {
        if (typeof pauseTimeTracking === 'function' && typeof resumeTimeTracking === 'function') {
            if (document.hidden) {
                pauseTimeTracking();
            } else {
                resumeTimeTracking();
            }
        }
    });
    
    // Finalizace při odchodu ze stránky
    window.addEventListener('beforeunload', () => {
        if (typeof finalizeTimeTracking === 'function') {
            finalizeTimeTracking(currentExpositionId, currentSceneId);
        }
    });
    
    console.log("✅ Wine app event listeners setup completed");
}

// === EXPORT FUNKCÍ ===

// Pro ES6 moduly
if (typeof module !== 'undefined' && module.exports) {
    // Node.js export
    module.exports = {
        // Kvízový systém
        getCompletedQuizzes,
        markQuizCompleted,
        getRandomUncompletedQuiz,
        checkDistanceForQuiz,
        showRandomQuiz,
        selectAnswer,
        closeQuiz,
        getQuizProgress,
        resetAllQuizzes,
        
        // Gamifikace
        initializeGameification,
        recordWineMarkerActivation,
        getGameificationStatus,
        
        // Tutorial
        initializeTutorial,
        startTutorialWhenReady,
        
        // Event listeners
        setupWineAppEventListeners,
        
        // Debug
        debugQuizSystem,
        debugGameification,
        debugWineAppStatus,
        directActivateWineQuizAchievement,
        
        // Data export
        WINE_QUIZZES,
        QUIZ_DISTANCE_STEP
    };
} else if (typeof window !== 'undefined') {
    // Browser global export
    window.WineApp = {
        // Kvízový systém
        getCompletedQuizzes,
        markQuizCompleted,
        getRandomUncompletedQuiz,
        checkDistanceForQuiz,
        showRandomQuiz,
        selectAnswer,
        closeQuiz,
        getQuizProgress,
        resetAllQuizzes,
        
        // Gamifikace
        initializeGameification,
        recordWineMarkerActivation,
        getGameificationStatus,
        
        // Tutorial
        initializeTutorial,
        startTutorialWhenReady,
        
        // Event listeners
        setupWineAppEventListeners,
        
        // Debug
        debugQuizSystem,
        debugGameification,
        debugWineAppStatus,
        directActivateWineQuizAchievement,
        
        // Data export
        WINE_QUIZZES,
        QUIZ_DISTANCE_STEP
    };
}

console.log("✅ Wine App module loaded successfully!");