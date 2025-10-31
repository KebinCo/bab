// Universal Tutorial System
// Add to each HTML: <script src="../tutorial/tutorial.js"></script>

class TutorialSystem {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.currentPage = this.detectPage();
        this.tutorialCompleted = JSON.parse(localStorage.getItem('tutorialCompleted') || '{}');
        
        this.createTutorialElements();
        this.loadTutorialSteps();
        
        // Only start if there are steps for this page and it hasn't been completed
        if (this.currentSteps.length > 0 && !this.tutorialCompleted[this.currentPage]) {
            setTimeout(() => this.start(), 1000);
        } else {
            // Ensure overlay is hidden
            setTimeout(() => {
                if (this.overlay) this.overlay.style.display = 'none';
            }, 100);
        }
    }
    
    detectPage() {
        const path = window.location.pathname;
        if (path.includes('login')) return 'login';
        if (path.includes('signup')) return 'signup';
        if (path.includes('dashboard')) return 'dashboard';
        if (path.includes('restaurant-search')) return 'restaurant-search';
        if (path.includes('matching')) return 'matching';
        if (path.includes('review-write')) return 'review-write';
        if (path.includes('feedback')) return 'feedback';
        if (path.includes('chat')) return 'chat';
        return 'home';
    }
    
    createTutorialElements() {
        // Tutorial overlay
        const overlay = document.createElement('div');
        overlay.id = 'tutorial-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9998;
            display: none;
            pointer-events: none;
        `;








        
        // Spotlight (highlights target element)
    
        const spotlight = document.createElement('div');
        spotlight.id = 'tutorial-spotlight';
        spotlight.style.cssText = `
            position: fixed;
            border: 3px solid #8a2be2;
            border-radius: 12px;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 40px rgba(138, 43, 226, 0.8);
            z-index: 9999;
            display: none;
            pointer-events: none;
            transition: all 0.5s ease;
        `;





        
        
        // Character container
        const character = document.createElement('div');
        character.id = 'tutorial-character';
        character.style.cssText = `
            position: fixed;
            width: 120px;
            height: 120px;
            z-index: 10000;
            display: none;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        character.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #8a2be2 0%, #daa520 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 4rem;
                box-shadow: 0 8px 32px rgba(138, 43, 226, 0.6);
                animation: float 3s ease-in-out infinite;
            ">
                🤖
            </div>
        `;
        
        // Speech bubble
        const bubble = document.createElement('div');
        bubble.id = 'tutorial-bubble';
        bubble.style.cssText = `
            position: fixed;
            max-width: 350px;
            background: rgba(15, 15, 30, 0.98);
            backdrop-filter: blur(20px);
            border: 2px solid #8a2be2;
            border-radius: 20px;
            padding: 1.5rem;
            z-index: 10001;
            display: none;
            box-shadow: 0 12px 48px rgba(138, 43, 226, 0.5);
            animation: bubblePop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;
        
        // Bubble content
        bubble.innerHTML = `
            <div id="tutorial-text" style="
                color: #e8e8f0;
                font-size: 1rem;
                line-height: 1.6;
                margin-bottom: 1rem;
            "></div>
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
                <button id="tutorial-skip" style="
                    padding: 0.5rem 1rem;
                    background: rgba(239, 68, 68, 0.2);
                    border: 1px solid rgba(239, 68, 68, 0.4);
                    border-radius: 8px;
                    color: #ef4444;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                ">건너뛰기</button>
                <button id="tutorial-next" style="
                    padding: 0.5rem 1.5rem;
                    background: linear-gradient(135deg, #8a2be2 0%, #daa520 100%);
                    border: none;
                    border-radius: 8px;
                    color: #fff;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 16px rgba(138, 43, 226, 0.4);
                ">다음</button>
            </div>
        `;
        
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
            }
            
            @keyframes bubblePop {
                0% { transform: scale(0); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            
            #tutorial-skip:hover {
                background: rgba(239, 68, 68, 0.3);
                transform: translateY(-2px);
            }
            
            #tutorial-next:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 24px rgba(138, 43, 226, 0.6);
            }
            
            .tutorial-pulse {
                animation: pulse 1.5s ease-in-out infinite;
            }
            
            @keyframes pulse {
                0%, 100% { 
                    border-color: #8a2be2;
                    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 40px rgba(138, 43, 226, 0.8);
                }
                50% { 
                    border-color: #daa520;
                    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 60px rgba(218, 165, 32, 0.8);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        document.body.appendChild(spotlight);
        document.body.appendChild(character);
        document.body.appendChild(bubble);
        
        // Event listeners
        document.getElementById('tutorial-next').addEventListener('click', () => this.nextStep());
        document.getElementById('tutorial-skip').addEventListener('click', () => this.skip());
        
        // Store references



        this.spotlight = spotlight;
        this.character = character;
        this.bubble = bubble;
    }
    
    loadTutorialSteps() {
        this.steps = {
            home: [
                { text: '안녕하세요! 밥심앱 튜토리얼을 시작합니다 🎉', target: '.main-title', position: 'bottom' },
                { text: '여기서 다양한 맛집 정보를 확인할 수 있어요', target: '.info-block:first-child', position: 'right' },
                { text: '회원가입하여 모든 기능을 사용해보세요!', target: '.auth-btn[data-action="signup"]', position: 'bottom', clickable: true },
            ],
            login: [
                { text: '로그인 페이지입니다', target: '.page-title', position: 'bottom' },
                { text: '이메일을 입력해주세요', target: '#email', position: 'right', wait: 3000 },
                { text: '비밀번호를 입력하세요', target: '#password', position: 'right', wait: 3000 },
                { text: '로그인 버튼을 클릭하여 입장하세요', target: '.submit-btn', position: 'top', clickable: true },
            ],
            signup: [
                { text: '회원가입 페이지에 오신 것을 환영합니다!', target: '.page-title', position: 'bottom' },
                { text: '먼저 사용자 유형을 선택하세요', target: '.user-type-selection', position: 'bottom', wait: 4000 },
                { text: '이메일을 입력해주세요', target: '#email', position: 'right', wait: 3000 },
                { text: '비밀번호 강도를 확인하세요', target: '.password-strength', position: 'right', wait: 3000 },
                { text: '약관에 동의하고 가입하세요', target: '.submit-btn', position: 'top', clickable: true },
            ],
            dashboard: [
                { text: '대시보드에 오신 것을 환영합니다! 🎉', target: '.page-title', position: 'bottom' },
                { text: '여기서 당신의 활동을 확인할 수 있어요', target: '.user-stats-grid', position: 'bottom', wait: 4000 },
                { text: '최근 활동 내역입니다', target: '.activity-section', position: 'right', wait: 4000 },
                { text: '메뉴에서 다양한 기능을 이용하세요', target: '.nav-center', position: 'bottom', clickable: true },
            ],
            'restaurant-search': [
                { text: '맛집 찾기 페이지입니다', target: '.page-title', position: 'bottom' },
                { text: '검색창에서 음식점을 찾아보세요', target: '#search-input', position: 'bottom', wait: 3000 },
                { text: '카테고리로 필터링할 수 있어요', target: '.filter-buttons', position: 'bottom', wait: 4000 },
                { text: '지역을 선택해보세요', target: '.region-map', position: 'right', wait: 4000 },
                { text: '음식점 카드를 클릭하면 상세 정보를 볼 수 있어요', target: '.restaurant-card:first-child', position: 'right', clickable: true },
            ],
            matching: [
                { text: '다인매치 페이지입니다', target: '.page-title', position: 'bottom' },
                { text: '프로필을 확인하고 스와이프하세요', target: '.swipe-cards-wrapper', position: 'bottom', wait: 5000 },
                { text: '✕ 버튼으로 패스할 수 있어요', target: '#pass-btn', position: 'top', wait: 2000 },
                { text: '❤ 버튼으로 매치를 요청하세요', target: '#match-btn', position: 'top', wait: 2000 },
                { text: '실수했다면 되돌리기를 사용하세요', target: '#undo-btn', position: 'top', clickable: true },
            ],
            'review-write': [
                { text: '후기 작성 페이지입니다', target: '.page-title', position: 'bottom' },
                { text: '음식점 이름을 입력하세요', target: '#restaurant-name', position: 'right', wait: 3000 },
                { text: '별점을 매겨주세요', target: '.star-rating', position: 'bottom', wait: 4000 },
                { text: '상세 평가를 해주세요', target: '.detailed-ratings', position: 'right', wait: 4000 },
                { text: '후기를 작성하고 제출하세요', target: '#review-content', position: 'right', clickable: true },
            ],
            feedback: [
                { text: '개선 피드백 페이지입니다', target: '.page-title', position: 'bottom' },
                { text: '개선이 필요한 부분을 선택하세요', target: '.issue-categories', position: 'bottom', wait: 5000 },
                { text: '문제의 심각도를 선택해주세요', target: '.severity-scale', position: 'bottom', wait: 4000 },
                { text: '구체적인 피드백을 작성하세요', target: '#feedback-content', position: 'right', clickable: true },
            ],
            chat: [
                { text: '채팅 페이지입니다', target: '.page-title', position: 'bottom' },
                { text: '왼쪽에서 대화를 선택하세요', target: '.chat-list', position: 'right', wait: 4000 },
                { text: '메시지를 입력하고 전송하세요', target: '.message-input', position: 'top', wait: 3000 },
                { text: '일정 잡기로 만남을 계획하세요', target: '#schedule-btn', position: 'bottom', clickable: true },
            ],
        };
        
        this.currentSteps = this.steps[this.currentPage] || [];
    }
    
    start() {
        if (this.currentSteps.length === 0) {
            // No tutorial for this page, ensure overlay is hidden
            this.overlay.style.display = 'none';
            return;
        }
        
        this.isActive = true;
        this.currentStep = 0;
        this.showStep();
    }
    
    showStep() {
        const step = this.currentSteps[this.currentStep];
        if (!step) {
            this.complete();
            return;
        }
        
        const target = document.querySelector(step.target);
        if (!target) {
            console.warn(`Tutorial target not found: ${step.target}`);
            this.nextStep();
            return;
        }
        
        // Show overlay and elements
        this.overlay.style.display = 'block';
        this.spotlight.style.display = 'block';
        this.character.style.display = 'block';
        this.bubble.style.display = 'block';
        
        // Position spotlight on target
        const rect = target.getBoundingClientRect();
        this.spotlight.style.top = `${rect.top - 10}px`;
        this.spotlight.style.left = `${rect.left - 10}px`;
        this.spotlight.style.width = `${rect.width + 20}px`;
        this.spotlight.style.height = `${rect.height + 20}px`;
        this.spotlight.classList.add('tutorial-pulse');
        
        // Allow clicking on target if specified
        if (step.clickable) {
            this.spotlight.style.pointerEvents = 'none';
            target.style.position = 'relative';
            target.style.zIndex = '10002';
            target.style.pointerEvents = 'auto';
        } else {
            target.style.zIndex = '';
            target.style.pointerEvents = '';
        }
        
        // Position character and bubble
        this.positionCharacterAndBubble(rect, step.position);
        
        // Set bubble text
        document.getElementById('tutorial-text').textContent = step.text;
        
        // Auto-advance if wait time specified
        if (step.wait && !step.clickable) {
            setTimeout(() => this.nextStep(), step.wait);
        }
    }
    
    positionCharacterAndBubble(targetRect, position) {
        const charWidth = 120;
        const charHeight = 120;
        const bubbleWidth = 350;
        const offset = 30;
        
        let charX, charY, bubbleX, bubbleY;
        
        switch (position) {
            case 'right':
                charX = targetRect.right + offset;
                charY = targetRect.top + (targetRect.height / 2) - (charHeight / 2);
                bubbleX = charX + charWidth + 20;
                bubbleY = charY;
                break;
            case 'left':
                charX = targetRect.left - charWidth - offset;
                charY = targetRect.top + (targetRect.height / 2) - (charHeight / 2);
                bubbleX = charX - bubbleWidth - 20;
                bubbleY = charY;
                break;
            case 'top':
                charX = targetRect.left + (targetRect.width / 2) - (charWidth / 2);
                charY = targetRect.top - charHeight - offset;
                bubbleX = charX + charWidth + 20;
                bubbleY = charY;
                break;
            case 'bottom':
            default:
                charX = targetRect.left + (targetRect.width / 2) - (charWidth / 2);
                charY = targetRect.bottom + offset;
                bubbleX = charX + charWidth + 20;
                bubbleY = charY;
        }
        
        // Keep within viewport
        charX = Math.max(20, Math.min(charX, window.innerWidth - charWidth - 20));
        charY = Math.max(20, Math.min(charY, window.innerHeight - charHeight - 20));
        bubbleX = Math.max(20, Math.min(bubbleX, window.innerWidth - bubbleWidth - 20));
        bubbleY = Math.max(20, Math.min(bubbleY, window.innerHeight - 200));
        
        this.character.style.left = `${charX}px`;
        this.character.style.top = `${charY}px`;
        this.bubble.style.left = `${bubbleX}px`;
        this.bubble.style.top = `${bubbleY}px`;
    }
    
    nextStep() {
        this.currentStep++;
        if (this.currentStep < this.currentSteps.length) {
            this.showStep();
        } else {
            this.complete();
        }
    }
    
    skip() {
        this.complete();
    }
    
    complete() {
        this.isActive = false;
        this.overlay.style.display = 'none';
        this.spotlight.style.display = 'none';
        this.character.style.display = 'none';
        this.bubble.style.display = 'none';
        
        // Mark as completed
        this.tutorialCompleted[this.currentPage] = true;
        localStorage.setItem('tutorialCompleted', JSON.stringify(this.tutorialCompleted));
        
        // Clean up any modified elements
        document.querySelectorAll('[style*="z-index"]').forEach(el => {
            if (el.style.zIndex === '10002') {
                el.style.zIndex = '';
                el.style.pointerEvents = '';
            }
        });
    }
    
    reset() {
        localStorage.removeItem('tutorialCompleted');
        this.tutorialCompleted = {};
        location.reload();
    }
}

// Initialize tutorial system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.tutorialSystem = new TutorialSystem();
    });
} else {
    window.tutorialSystem = new TutorialSystem();
}

// Add reset button to navbar for testing (can be removed in production)
setTimeout(() => {
    const navRight = document.querySelector('.nav-right');
    if (navRight) {
        const resetBtn = document.createElement('button');
        resetBtn.className = 'nav-btn';
        resetBtn.textContent = '📖';
        resetBtn.title = '튜토리얼 다시보기';
        resetBtn.style.padding = '0.75rem';
        resetBtn.style.width = '45px';
        resetBtn.style.height = '45px';
        resetBtn.addEventListener('click', () => {
            if (window.tutorialSystem) {
                window.tutorialSystem.reset();
            }
        });
        navRight.insertBefore(resetBtn, navRight.firstChild);
    }
}, 1000);
