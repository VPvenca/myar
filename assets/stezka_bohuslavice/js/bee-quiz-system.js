// === BEE-QUIZ-SYSTEM.JS - KOMPLETNÍ KVÍZOVÝ SYSTÉM ===

class BeeQuizSystem {
    constructor() {
        this.currentQuiz = null;
        this.startPosition = null;
        this.lastQuizMilestone = -1;
        this.quizzes = BEE_QUIZZES;
        this.elements = {};
    }
    
    initialize() {
        console.log("🧩 Initializing Bee Quiz System...");
        this.cacheElements();
        this.setupEventListeners();
        console.log("✅ Bee Quiz System initialized");
    }
    
    cacheElements() {
        this.elements = {
            quiz: document.getElementById('beeQuiz'),
            question: document.getElementById('quizQuestion'),
            answers: document.getElementById('quizAnswers'),
            explanation: document.getElementById('quizExplanation'),
            close: document.getElementById('quizClose'),
            progress: document.getElementById('quizProgress')
        };
        
        // Zkontroluj, že všechny elementy existují
        Object.entries(this.elements).forEach(([key, element]) => {
            if (!element) {
                console.error(`❌ Quiz element not found: ${key}`);
            }
        });
    }
    
    setupEventListeners() {
        if (this.elements.close) {
            this.elements.close.addEventListener('click', () => this.closeQuiz());
        }
    }
    
    checkDistanceForQuiz(userPosition, startPosition) {
        if (!userPosition || !startPosition) {
            return;
        }
        
        // Nastav start pozici pokud ještě není
        if (!this.startPosition) {
            this.startPosition = { ...startPosition };
            console.log("🎯 Quiz start position set:", this.startPosition);
        }
        
        // Vypočítej vzdálenost od startu
        const distanceFromStart = this.calculateDistance(
            this.startPosition.lat, this.startPosition.lng,
            userPosition.lat, userPosition.lng
        );
        
        // Zjisti, na kterém milníku jsme
        const currentMilestone = Math.floor(distanceFromStart / BEE_CONFIG.QUIZ_DISTANCE_STEP);
        
        console.log(`🎯 Quiz distance check: ${distanceFromStart.toFixed(1)}m, milestone: ${currentMilestone}, last: ${this.lastQuizMilestone}`);
        
        // Pokud jsme na novém milníku a ještě jsme tu kvíz nezobrazili
        if (currentMilestone > this.lastQuizMilestone && currentMilestone > 0) {
            console.log(`🎯 New quiz milestone reached: ${currentMilestone * BEE_CONFIG.QUIZ_DISTANCE_STEP}m - showing quiz!`);
            this.lastQuizMilestone = currentMilestone;
            this.showRandomQuiz();
        }
    }
    
    getCompletedQuizzes() {
        const completed = localStorage.getItem(BEE_CONFIG.QUIZ_STORAGE_KEY);
        return completed ? JSON.parse(completed) : [];
    }
    
    markQuizCompleted(quizIndex) {
        const completed = this.getCompletedQuizzes();
        console.log(`🐝 markQuizCompleted called for quiz ${quizIndex}`);
        console.log(`📊 Current completed: ${completed.length}/${this.quizzes.length}`);
        
        // Přidej kvíz, pokud není dokončený
        if (!completed.includes(quizIndex)) {
            completed.push(quizIndex);
            localStorage.setItem(BEE_CONFIG.QUIZ_STORAGE_KEY, JSON.stringify(completed));
            console.log(`✅ Quiz ${quizIndex} added. New total: ${completed.length}/${this.quizzes.length}`);
        } else {
            console.log(`ℹ️ Quiz ${quizIndex} already completed`);
        }
        
        // Kontrola achievementu
        const finalCompleted = this.getCompletedQuizzes();
        
        if (finalCompleted.length === this.quizzes.length) {
            console.log('🏆 All quizzes completed! Activating quiz achievement...');
            
            // Zkontroluj, zda už není achievement odemčený
            if (typeof isAchievementUnlocked === 'function' && isAchievementUnlocked(BEE_CONFIG.QUIZ_ACHIEVEMENT_ID)) {
                console.log(`ℹ️ ${BEE_CONFIG.QUIZ_ACHIEVEMENT_ID} already unlocked`);
                return;
            }
            
            // Aktivuj achievement přímo
            if (typeof unlockAchievement === 'function') {
                const success = unlockAchievement(BEE_CONFIG.QUIZ_ACHIEVEMENT_ID);
                console.log('✅ unlockAchievement result:', success);
                
                if (success) {
                    console.log('🎉 Kvízový achievement úspěšně aktivován!');
                }
            } else {
                console.error("❌ unlockAchievement function not found");
            }
        } else {
            console.log(`📈 Progress: ${finalCompleted.length}/${this.quizzes.length} quizzes completed`);
        }
    }
    
    getRandomUncompletedQuiz() {
        const completed = this.getCompletedQuizzes();
        const available = this.quizzes.map((_, index) => index).filter(index => !completed.includes(index));
        
        if (available.length === 0) {
            console.log('🐝 All quizzes completed!');
            return null;
        }
        
        const randomIndex = available[Math.floor(Math.random() * available.length)];
        return { quiz: this.quizzes[randomIndex], index: randomIndex };
    }
    
    showRandomQuiz() {
        const quizData = this.getRandomUncompletedQuiz();
        if (!quizData) {
            console.log('🎯 No more quizzes available - all completed!');
            return;
        }
        
        const { quiz, index } = quizData;
        this.currentQuiz = { ...quiz, index };
        
        // Zobraz kvíz
        this.elements.question.textContent = quiz.question;
        
        // Vyčisti odpovědi
        this.elements.answers.innerHTML = '';
        
        // Vytvoř odpovědi
        quiz.answers.forEach((answer, answerIndex) => {
            const button = document.createElement('div');
            button.className = 'quiz-answer';
            button.textContent = answer;
            button.onclick = () => this.selectAnswer(answerIndex);
            this.elements.answers.appendChild(button);
        });
        
        // Aktualizuj progress
        const completed = this.getCompletedQuizzes();
        const distanceFromStart = this.startPosition ? this.calculateDistance(
            this.startPosition.lat, this.startPosition.lng,
            this.startPosition.lat, this.startPosition.lng
        ) : 0;
        
        this.elements.progress.textContent = 
            `Kvíz ${completed.length + 1}/${this.quizzes.length} • Vzdálenost: ${this.lastQuizMilestone * BEE_CONFIG.QUIZ_DISTANCE_STEP}m`;
        
        // Skryj vysvětlení
        this.elements.explanation.style.display = 'none';
        
        // Zobraz kvíz
        this.elements.quiz.style.display = 'block';
        
        console.log(`🐝 Showing quiz ${index}: ${quiz.question.substring(0, 50)}...`);
    }
    
    selectAnswer(selectedIndex) {
        if (!this.currentQuiz) return;
        
        const answers = document.querySelectorAll('.quiz-answer');
        
        // Označ odpovědi
        answers.forEach((answer, index) => {
            if (index === this.currentQuiz.correct) {
                answer.classList.add('correct');
            } else if (index === selectedIndex && index !== this.currentQuiz.correct) {
                answer.classList.add('incorrect');
            }
            answer.onclick = null; // Deaktivuj klikání
        });
        
        // Zobraz vysvětlení
        this.elements.explanation.textContent = this.currentQuiz.explanation;
        this.elements.explanation.style.display = 'block';
        
        // Označ kvíz jako dokončený
        this.markQuizCompleted(this.currentQuiz.index);
        
        console.log(`🐝 Answer selected: ${selectedIndex}, correct: ${this.currentQuiz.correct}`);
    }
    
    closeQuiz() {
        this.elements.quiz.style.display = 'none';
        this.elements.explanation.style.display = 'none';
        this.currentQuiz = null;
        console.log("🐝 Quiz closed");
    }
    
    getStatus() {
        const completed = this.getCompletedQuizzes();
        return {
            currentQuiz: this.currentQuiz,
            lastMilestone: this.lastQuizMilestone,
            completedCount: completed.length,
            totalQuizzes: this.quizzes.length,
            startPosition: this.startPosition
        };
    }
    
    // Debug funkce
    debugGetCompletedQuizzes() {
        console.log("=== DEBUG getCompletedQuizzes ===");
        
        const rawData = localStorage.getItem(BEE_CONFIG.QUIZ_STORAGE_KEY);
        console.log("Raw localStorage data:", rawData);
        
        const completed = this.getCompletedQuizzes();
        console.log("getCompletedQuizzes() returns:", completed);
        console.log("Type:", typeof completed);
        console.log("Is array:", Array.isArray(completed));
        
        if (rawData) {
            try {
                const parsed = JSON.parse(rawData);
                console.log("Manual parse:", parsed);
            } catch (e) {
                console.log("Parse error:", e);
            }
        }
        console.log("===============================");
    }
    
    directActivateQuizAchievement() {
        console.log("🎯 DIRECT ACHIEVEMENT ACTIVATION");
        console.log("=================================");
        
        const allQuizzes = Array.from({length: this.quizzes.length}, (_, i) => i);
        localStorage.setItem(BEE_CONFIG.QUIZ_STORAGE_KEY, JSON.stringify(allQuizzes));
        
        if (typeof unlockAchievement === 'function') {
            console.log("🏆 Calling unlockAchievement directly...");
            const result = unlockAchievement(BEE_CONFIG.QUIZ_ACHIEVEMENT_ID);
            console.log("Result:", result);
        } else {
            console.log("❌ unlockAchievement not available");
        }
        
        console.log("=================================");
    }
    
    // Utility funkce pro výpočet vzdálenosti
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                 Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                 Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
}