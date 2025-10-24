// tutorial.js - Premium Tutorial System with Animated Mascot
class TutorialSystem {
    constructor(steps) {
        this.steps = steps;
        this.currentStep = 0;
        this.overlay = null;
        this.spotlight = null;
        this.bubble = null;
        this.mascot = null;
        this.isActive = false;
        this.completed = this.checkCompletion();
    }

    checkCompletion() {
        const page = window.location.pathname.split('/').filter(Boolean).pop() || 'mainpage';
        return localStorage.getItem(`tutorial_${page}`) === 'completed';
    }

    shouldShow() {
        return !this.completed && this.steps.length > 0;
    }

    start() {
        if (this.isActive || !this.shouldShow()) return;
        this.isActive = true;
        this.currentStep = 0;
        this.createElements();
        this.showStep();
    }

    createElements() {
        // Overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'tutorial-overlay';
        
        // Spotlight
        this.spotlight = document.createElement('div');
        this.spotlight.className = 'tutorial-spotlight';
        
        // Mascot
        this.mascot = document.createElement('div');
        this.mascot.className = 'tutorial-mascot';
        this.mascot.innerHTML = `
            <div class="mascot-character">
                <div class="mascot-body">🍚</div>
                <div class="mascot-pointer">👉</div>
            </div>
        `;
        
        // Speech Bubble
        this.bubble = document.createElement('div');
        this.bubble.className = 'tutorial-bubble';
        this.bubble.innerHTML = `
            <div class="bubble-content">
                <p class="bubble-text"></p>
                <div class="bubble-controls">
                    <button class="tutorial-btn skip-btn">건너뛰기</button>
                    <div class="nav-btns">
                        <button class="tutorial-btn prev-btn" style="display:none">이전</button>
                        <button class="tutorial-btn next-btn">다음</button>
                    </div>
                </div>
                <div class="bubble-progress">
                    <span class="step-counter"></span>
                </div>
            </div>
            <div class="bubble-arrow"></div>
        `;

        document.body.appendChild(this.overlay);
        document.body.appendChild(this.spotlight);
        document.body.appendChild(this.mascot);
        document.body.appendChild(this.bubble);

        this.attachEventListeners();
        
        requestAnimationFrame(() => {
            this.overlay.classList.add('active');
        });
    }

    attachEventListeners() {
        this.bubble.querySelector('.next-btn').addEventListener('click', () => this.next());
        this.bubble.querySelector('.prev-btn').addEventListener('click', () => this.prev());
        this.bubble.querySelector('.skip-btn').addEventListener('click', () => this.skip());
    }

    showStep() {
        const step = this.steps[this.currentStep];
        const element = document.querySelector(step.selector);
        
        if (!element) {
            console.warn(`Element not found: ${step.selector}`);
            this.next();
            return;
        }

        const rect = element.getBoundingClientRect();
        
        // Position spotlight
        this.spotlight.style.width = `${rect.width + 40}px`;
        this.spotlight.style.height = `${rect.height + 40}px`;
        this.spotlight.style.left = `${rect.left - 20}px`;
        this.spotlight.style.top = `${rect.top - 20}px`;
        this.spotlight.classList.add('active');

        // Allow clicks on highlighted element
        element.style.position = 'relative';
        element.style.zIndex = '100001';
        element.style.pointerEvents = 'auto';

        // Position mascot and bubble
        this.positionMascotAndBubble(rect, step);

        // Update bubble content
        this.bubble.querySelector('.bubble-text').textContent = step.text;
        this.bubble.querySelector('.step-counter').textContent = `${this.currentStep + 1} / ${this.steps.length}`;
        
        const prevBtn = this.bubble.querySelector('.prev-btn');
        prevBtn.style.display = this.currentStep > 0 ? 'block' : 'none';
        
        const nextBtn = this.bubble.querySelector('.next-btn');
        nextBtn.textContent = this.currentStep === this.steps.length - 1 ? '완료' : '다음';

        // Animate mascot
        this.mascot.classList.remove('celebrating');
        this.mascot.classList.add('pointing');
        
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    positionMascotAndBubble(rect, step) {
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const mascotSize = 100;
        const bubbleWidth = 350;
        const bubbleHeight = 200;
        const margin = 20;

        let mascotX, mascotY, bubbleX, bubbleY, bubblePosition;

        // Determine best position
        if (rect.bottom + mascotSize + margin < windowHeight) {
            // Below element
            mascotY = rect.bottom + margin;
            bubbleY = mascotY + mascotSize + margin;
            mascotX = rect.left + rect.width / 2 - mascotSize / 2;
            bubbleX = Math.max(margin, Math.min(windowWidth - bubbleWidth - margin, mascotX - bubbleWidth / 2 + mascotSize / 2));
            bubblePosition = 'bottom';
        } else if (rect.top - mascotSize - margin > 0) {
            // Above element
            mascotY = rect.top - mascotSize - margin;
            bubbleY = mascotY - bubbleHeight - margin;
            mascotX = rect.left + rect.width / 2 - mascotSize / 2;
            bubbleX = Math.max(margin, Math.min(windowWidth - bubbleWidth - margin, mascotX - bubbleWidth / 2 + mascotSize / 2));
            bubblePosition = 'top';
        } else {
            // Side
            if (rect.right + mascotSize + margin < windowWidth) {
                mascotX = rect.right + margin;
                bubblePosition = 'right';
            } else {
                mascotX = rect.left - mascotSize - margin;
                bubblePosition = 'left';
            }
            mascotY = rect.top + rect.height / 2 - mascotSize / 2;
            bubbleX = bubblePosition === 'right' ? mascotX + mascotSize + margin : mascotX - bubbleWidth - margin;
            bubbleY = Math.max(margin, Math.min(windowHeight - bubbleHeight - margin, mascotY - bubbleHeight / 2));
        }

        this.mascot.style.left = `${mascotX}px`;
        this.mascot.style.top = `${mascotY}px`;
        
        this.bubble.style.left = `${bubbleX}px`;
        this.bubble.style.top = `${bubbleY}px`;
        this.bubble.setAttribute('data-position', bubblePosition);
    }

    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.clearHighlight();
            this.currentStep++;
            this.showStep();
        } else {
            this.complete();
        }
    }

    prev() {
        if (this.currentStep > 0) {
            this.clearHighlight();
            this.currentStep--;
            this.showStep();
        }
    }

    skip() {
        this.complete(true);
    }

    clearHighlight() {
        const step = this.steps[this.currentStep];
        const element = document.querySelector(step.selector);
        if (element) {
            element.style.zIndex = '';
            element.style.pointerEvents = '';
        }
    }

    complete(skipped = false) {
        this.clearHighlight();
        
        if (!skipped) {
            this.mascot.classList.add('celebrating');
            setTimeout(() => this.cleanup(), 1000);
        } else {
            this.cleanup();
        }

        const page = window.location.pathname.split('/').filter(Boolean).pop() || 'mainpage';
        localStorage.setItem(`tutorial_${page}`, 'completed');
        this.completed = true;
    }

    cleanup() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            setTimeout(() => this.overlay?.remove(), 300);
        }
        this.spotlight?.remove();
        this.mascot?.remove();
        this.bubble?.remove();
        this.isActive = false;
    }

    reset() {
        const page = window.location.pathname.split('/').filter(Boolean).pop() || 'mainpage';
        localStorage.removeItem(`tutorial_${page}`);
        this.completed = false;
        this.start();
    }
}

// Auto-initialize when DOM is ready
if (typeof tutorialSteps !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const tutorial = new TutorialSystem(tutorialSteps);
        setTimeout(() => tutorial.start(), 500);
        window.tutorialSystem = tutorial;
    });
}
