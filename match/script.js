// Matching Page - Tinder-style swipe interface

// Mock user database
const users = [
    {
        id: 1,
        name: '김민지',
        age: 27,
        location: '강남구',
        avatar: '👩',
        bio: '맛있는 음식과 좋은 사람들과의 만남을 좋아해요!',
        favoriteFood: ['한식', '일식', '디저트'],
        eatingStyle: '풍성하고 호쾌하게',
        preferences: '고기 전문점과 그릴 레스토랑'
    }
];

// State
let currentIndex = 0;
let swipeHistory = [];
let matches = [];

// DOM elements
const swipeCardsWrapper = document.getElementById('swipe-cards-wrapper');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');
const matchesGrid = document.getElementById('matches-grid');
const emptyMatches = document.getElementById('empty-matches');
const resetBtn = document.getElementById('reset-btn');
const passBtn = document.getElementById('pass-btn');
const undoBtn = document.getElementById('undo-btn');
const matchBtn = document.getElementById('match-btn');

// Initialize
renderCurrentCard();
updateCounter();
renderMatches();

// Create card HTML
function createCardHTML(user) {
    return `
        <div class="swipe-card" data-id="${user.id}">
            <div class="profile-header">
                <div class="profile-picture">${user.avatar}</div>
                <div class="profile-name">${user.name}</div>
                <div class="profile-age-location">${user.age}세 · ${user.location}</div>
            </div>
            <div class="profile-body">
                <div class="profile-section">
                    <div class="section-label">소개</div>
                    <div class="section-content">${user.bio}</div>
                </div>
                <div class="profile-section">
                    <div class="section-label">좋아하는 음식</div>
                    <div class="tags-container">
                        ${user.favoriteFood.map(food => `<span class="tag">${food}</span>`).join('')}
                    </div>
                </div>
                <div class="profile-section">
                    <div class="section-label">식사 스타일</div>
                    <div class="section-content">${user.eatingStyle}</div>
                </div>
                <div class="profile-section">
                    <div class="section-label">선호하는 곳</div>
                    <div class="section-content">${user.preferences}</div>
                </div>
            </div>
        </div>
    `;
}

// Render current card
function renderCurrentCard() {
    if (currentIndex >= users.length) {
        showEmptyState();
        return;
    }
    
    swipeCardsWrapper.innerHTML = createCardHTML(users[currentIndex]);
    emptyState.style.display = 'none';
    
    // Add swipe functionality
    const card = swipeCardsWrapper.querySelector('.swipe-card');
    addSwipeListeners(card);
}

// Add swipe listeners
function addSwipeListeners(card) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    const onStart = (e) => {
        isDragging = true;
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        card.classList.add('grabbing');
    };
    
    const onMove = (e) => {
        if (!isDragging) return;
        
        currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const deltaX = currentX - startX;
        const rotation = deltaX / 20;
        
        card.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
        
        // Visual feedback
        if (deltaX > 50) {
            card.classList.add('swiping-right');
            card.classList.remove('swiping-left');
        } else if (deltaX < -50) {
            card.classList.add('swiping-left');
            card.classList.remove('swiping-right');
        } else {
            card.classList.remove('swiping-right', 'swiping-left');
        }
    };
    
    const onEnd = () => {
        if (!isDragging) return;
        
        isDragging = false;
        card.classList.remove('grabbing');
        
        const deltaX = currentX - startX;
        
        if (deltaX > 100) {
            // Swiped right - match
            swipeRight();
        } else if (deltaX < -100) {
            // Swiped left - pass
            swipeLeft();
        } else {
            // Return to center
            card.style.transform = '';
            card.classList.remove('swiping-right', 'swiping-left');
        }
    };
    
    // Mouse events
    card.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    
    // Touch events
    card.addEventListener('touchstart', onStart);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);
}

// Swipe right (match)
function swipeRight() {
    const user = users[currentIndex];
    matches.push(user);
    swipeHistory.push({ index: currentIndex, action: 'match' });
    
    animateCardExit('right', () => {
        currentIndex++;
        renderCurrentCard();
        updateCounter();
        renderMatches();
        showNotification(`${user.name}님에게 매치를 요청했습니다!`, 'success');
    });
}

// Swipe left (pass)
function swipeLeft() {
    const user = users[currentIndex];
    swipeHistory.push({ index: currentIndex, action: 'pass' });
    
    animateCardExit('left', () => {
        currentIndex++;
        renderCurrentCard();
        updateCounter();
        showNotification('패스했습니다', 'info');
    });
}

// Animate card exit
function animateCardExit(direction, callback) {
    const card = swipeCardsWrapper.querySelector('.swipe-card');
    if (!card) return;
    
    const distance = direction === 'right' ? 1000 : -1000;
    card.style.transition = 'transform 0.4s ease';
    card.style.transform = `translateX(${distance}px) rotate(${direction === 'right' ? 30 : -30}deg)`;
    
    setTimeout(callback, 400);
}

// Undo last action
function undo() {
    if (swipeHistory.length === 0) {
        showNotification('되돌릴 액션이 없습니다', 'error');
        return;
    }
    
    const lastAction = swipeHistory.pop();
    
    if (lastAction.action === 'match') {
        matches.pop();
        renderMatches();
    }
    
    currentIndex = lastAction.index;
    renderCurrentCard();
    updateCounter();
    showNotification('이전으로 돌아갔습니다', 'info');
}

// Button handlers
passBtn.addEventListener('click', () => {
    if (currentIndex < users.length) swipeLeft();
});

matchBtn.addEventListener('click', () => {
    if (currentIndex < users.length) swipeRight();
});

undoBtn.addEventListener('click', undo);

resetBtn.addEventListener('click', () => {
    currentIndex = 0;
    swipeHistory = [];
    renderCurrentCard();
    updateCounter();
    showNotification('처음부터 다시 시작합니다', 'info');
});

// Update counter
function updateCounter() {
    const remaining = users.length - currentIndex;
    remainingCount.textContent = remaining;
}

// Show empty state
function showEmptyState() {
    swipeCardsWrapper.innerHTML = '';
    emptyState.style.display = 'block';
}

// Render matches
function renderMatches() {
    if (matches.length === 0) {
        matchesGrid.style.display = 'none';
        emptyMatches.style.display = 'block';
        return;
    }
    
    matchesGrid.style.display = 'grid';
    emptyMatches.style.display = 'none';
    
    matchesGrid.innerHTML = matches.map(user => `
        <div class="match-card" data-id="${user.id}">
            <div class="match-picture">${user.avatar}</div>
            <div class="match-name">${user.name}</div>
            <div class="match-status">매치 대기중</div>
        </div>
    `).join('');
    
    // Add click handlers
    const matchCards = matchesGrid.querySelectorAll('.match-card');
    matchCards.forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.dataset.id);
            const user = matches.find(u => u.id === id);
            if (user) {
                showNotification(`${user.name}님과의 채팅방으로 이동합니다`, 'info');
                console.log('Open chat with:', user);
            }
        });
    });
}

// Section glow effects
function addSectionGlowEffect(section) {
    const glow = section.querySelector('.section-glow');
    if (!glow) return;
    
    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        glow.style.left = `${x - glow.offsetWidth / 2}px`;
        glow.style.top = `${y - glow.offsetHeight / 2}px`;
    });
}

const matchingContainer = document.querySelector('.matching-container');
const matchesSection = document.querySelector('.matches-section');

addSectionGlowEffect(matchingContainer);
addSectionGlowEffect(matchesSection);

// Navbar dropdown handlers
const dropdownItems = document.querySelectorAll('.dropdown-item');

dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const text = item.textContent.trim();
        console.log('Dropdown item clicked:', text);
        showNotification(`"${text}" 페이지로 이동합니다`, 'info');
    });
});

// Logout button
const logoutBtn = document.querySelector('.logout-btn');

logoutBtn.addEventListener('click', () => {
    showNotification('로그아웃 중...', 'info');
    setTimeout(() => {
        showNotification('로그아웃되었습니다', 'success');
    }, 1000);
});

// Mobile dropdown toggle
if (window.innerWidth <= 768) {
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');
    
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const parent = btn.closest('.nav-item-dropdown');
            const menu = parent.querySelector('.dropdown-menu');
            
            document.querySelectorAll('.dropdown-menu').forEach(m => {
                if (m !== menu) m.style.display = 'none';
            });
            
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    });
    
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (currentIndex >= users.length) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            swipeLeft();
            break;
        case 'ArrowRight':
            swipeRight();
            break;
        case 'z':
        case 'Z':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                undo();
            }
            break;
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: rgba(15, 15, 30, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 12px;
        border: 1px solid rgba(138, 43, 226, 0.4);
        color: #e8e8f0;
        font-size: 0.95rem;
        font-weight: 500;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 10000;
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-success {
        border-color: rgba(34, 197, 94, 0.6);
        box-shadow: 0 8px 32px rgba(34, 197, 94, 0.2);
    }
    
    .notification-error {
        border-color: rgba(239, 68, 68, 0.6);
        box-shadow: 0 8px 32px rgba(239, 68, 68, 0.2);
    }
    
    .notification-info {
        border-color: rgba(138, 43, 226, 0.6);
        box-shadow: 0 8px 32px rgba(138, 43, 226, 0.2);
    }
    
    @media (max-width: 768px) {
        .notification {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            max-width: none;
        }
    }
`;
document.head.appendChild(notificationStyle);천천히 음미하며 먹는 편',
        preferences: '조용한 분위기의 레스토랑을 선호해요'
    },
    {
        id: 2,
        name: '이준호',
        age: 31,
        location: '마포구',
        avatar: '👨',
        bio: '새로운 음식을 시도하는 걸 좋아하는 푸디입니다.',
        favoriteFood: ['양식', '중식', '퓨전'],
        eatingStyle: '모험적이고 다양하게',
        preferences: '트렌디한 맛집 탐방을 즐겨요'
    },
    {
        id: 3,
        name: '박서연',
        age: 25,
        location: '송파구',
        avatar: '👧',
        bio: '비건 음식에 관심이 많아요. 건강한 식사 함께해요!',
        favoriteFood: ['비건', '샐러드', '스무디'],
        eatingStyle: '건강하고 가볍게',
        preferences: '채식 위주 레스토랑을 선호합니다'
    },
    {
        id: 4,
        name: '최동욱',
        age: 29,
        location: '강남구',
        avatar: '🧑',
        bio: '맛집 인스타그래머! 사진 찍기 좋은 곳 좋아해요.',
        favoriteFood: ['브런치', '카페', '디저트'],
        eatingStyle: '분위기를 중시하는',
        preferences: '인스타그램 감성 맛집'
    },
    {
        id: 5,
        name: '정수빈',
        age: 26,
        location: '용산구',
        avatar: '👱‍♀️',
        bio: '매운 음식 마니아! 불닭볶음면 5단계까지 가능합니다.',
        favoriteFood: ['한식', '매운음식', '찜닭'],
        eatingStyle: '맵고 강렬하게',
        preferences: '매운 음식 전문점'
    },
    {
        id: 6,
        name: '강태민',
        age: 33,
        location: '종로구',
        avatar: '👨‍🦱',
        bio: '전통 한식의 진수를 아는 사람. 할머니 손맛 최고!',
        favoriteFood: ['한정식', '전통요리', '막걸리'],
        eatingStyle: '정통적이고 깊은 맛',
        preferences: '오래된 전통 맛집'
    },
    {
        id: 7,
        name: '윤하은',
        age: 24,
        location: '서대문구',
        avatar: '👩‍🦰',
        bio: '파스타와 와인을 사랑하는 이탈리안 러버입니다.',
        favoriteFood: ['이탈리안', '와인', '피자'],
        eatingStyle: '우아하고 여유롭게',
        preferences: '분위기 좋은 이탈리안 레스토랑'
    },
    {
        id: 8,
        name: '임재현',
        age: 30,
        location: '관악구',
        avatar: '👨‍💼',
        bio: '저녁 회식보다 점심 맛집 탐방이 좋아요.',
        favoriteFood: ['백반', '국밥', '찌개'],
        eatingStyle: '든든하고 푸짐하게',
        preferences: '가성비 좋은 현지인 맛집'
    },
    {
        id: 9,
        name: '한지우',
        age: 28,
        location: '강남구',
        avatar: '👩‍💻',
        bio: '오마카세와 스시를 좋아하는 일식 애호가입니다.',
        favoriteFood: ['일식', '스시', '사시미'],
        eatingStyle: '신선하고 정갈하게',
        preferences: '고급 일식당과 스시 오마카세'
    },
    {
        id: 10,
        name: '오성민',
        age: 32,
        location: '마포구',
        avatar: '🧔',
        bio: '고기 없이는 못 살아요. 삼겹살부터 스테이크까지!',
        favoriteFood: ['고기', '스테이크', '삼겹살'],
        eatingStyle: '
