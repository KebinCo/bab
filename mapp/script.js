// Restaurant Search Page

// Mock restaurant database
const restaurants = [
    { id: 1, name: '강남 파스타하우스', category: 'western', region: 'gangnam', rating: 4.5, reviews: 128, location: '강남역 3번 출구' },
    { id: 2, name: '홍대 김치찌개', category: 'korean', region: 'mapo', rating: 4.2, reviews: 89, location: '홍대입구역 9번 출구' },
    { id: 3, name: '스시 마스터', category: 'japanese', region: 'gangnam', rating: 4.8, reviews: 215, location: '신논현역 5번 출구' },
    { id: 4, name: '북경반점', category: 'chinese', region: 'jongno', rating: 4.3, reviews: 156, location: '종각역 2번 출구' },
    { id: 5, name: '커피 앤 크림', category: 'cafe', region: 'mapo', rating: 4.6, reviews: 342, location: '홍대입구역 1번 출구' },
    { id: 6, name: '서울 한정식', category: 'korean', region: 'jongno', rating: 4.7, reviews: 198, location: '광화문역 6번 출구' },
    { id: 7, name: '이탈리아 트라토리아', category: 'western', region: 'yongsan', rating: 4.4, reviews: 167, location: '이태원역 1번 출구' },
    { id: 8, name: '라멘 하우스', category: 'japanese', region: 'songpa', rating: 4.5, reviews: 203, location: '잠실역 3번 출구' },
    { id: 9, name: '차이나타운', category: 'chinese', region: 'gangbuk', rating: 4.1, reviews: 94, location: '미아사거리역 2번 출구' },
    { id: 10, name: '디저트 카페', category: 'cafe', region: 'gangnam', rating: 4.6, reviews: 287, location: '강남역 11번 출구' },
    { id: 11, name: '백반 맛집', category: 'korean', region: 'seodaemun', rating: 4.3, reviews: 112, location: '신촌역 4번 출구' },
    { id: 12, name: '프렌치 레스토랑', category: 'western', region: 'gangnam', rating: 4.9, reviews: 156, location: '청담역 8번 출구' },
    { id: 13, name: '도쿄 돈카츠', category: 'japanese', region: 'mapo', rating: 4.4, reviews: 178, location: '공덕역 5번 출구' },
    { id: 14, name: '마라탕 전문점', category: 'chinese', region: 'gwanak', rating: 4.2, reviews: 134, location: '서울대입구역 3번 출구' },
    { id: 15, name: '브런치 카페', category: 'cafe', region: 'yongsan', rating: 4.7, reviews: 298, location: '한강진역 2번 출구' },
];

// State
let currentRegion = 'all';
let currentCategory = 'all';
let currentSort = 'name';
let searchQuery = '';

// DOM elements
const searchInput = document.getElementById('search-input');
const restaurantGrid = document.getElementById('restaurant-grid');
const emptyState = document.getElementById('empty-state');
const selectedRegionDisplay = document.getElementById('selected-region');
const regionItems = document.querySelectorAll('.region-item');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortBtns = document.querySelectorAll('.sort-btn');

// Initialize
renderRestaurants();

// Search input handler
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderRestaurants();
});

// Region selection
regionItems.forEach(item => {
    item.addEventListener('click', () => {
        regionItems.forEach(r => r.classList.remove('selected'));
        item.classList.add('selected');
        
        currentRegion = item.dataset.region;
        const regionName = item.querySelector('.region-label').textContent;
        selectedRegionDisplay.textContent = regionName;
        
        renderRestaurants();
    });
});

// Add "전체" region option
const regionMap = document.querySelector('.region-map');
const allRegionItem = document.createElement('div');
allRegionItem.className = 'region-item selected';
allRegionItem.dataset.region = 'all';
allRegionItem.innerHTML = `
    <div class="region-label">전체</div>
    <div class="region-count">${restaurants.length}</div>
`;
regionMap.insertBefore(allRegionItem, regionMap.firstChild);

allRegionItem.addEventListener('click', () => {
    regionItems.forEach(r => r.classList.remove('selected'));
    allRegionItem.classList.add('selected');
    currentRegion = 'all';
    selectedRegionDisplay.textContent = '전체';
    renderRestaurants();
});

// Category filter
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentCategory = btn.dataset.category;
        renderRestaurants();
    });
});

// Sort buttons
sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sortBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentSort = btn.dataset.sort;
        renderRestaurants();
    });
});

// Filter and sort restaurants
function getFilteredRestaurants() {
    let filtered = restaurants;
    
    // Filter by region
    if (currentRegion !== 'all') {
        filtered = filtered.filter(r => r.region === currentRegion);
    }
    
    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(r => r.category === currentCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
        filtered = filtered.filter(r => 
            r.name.toLowerCase().includes(searchQuery) ||
            getCategoryName(r.category).includes(searchQuery)
        );
    }
    
    // Sort
    filtered.sort((a, b) => {
        switch(currentSort) {
            case 'rating':
                return b.rating - a.rating;
            case 'reviews':
                return b.reviews - a.reviews;
            case 'name':
            default:
                return a.name.localeCompare(b.name, 'ko');
        }
    });
    
    return filtered;
}

// Get category name in Korean
function getCategoryName(category) {
    const names = {
        korean: '한식',
        western: '양식',
        japanese: '일식',
        chinese: '중식',
        cafe: '카페'
    };
    return names[category] || category;
}

// Render restaurants
function renderRestaurants() {
    const filtered = getFilteredRestaurants();
    
    if (filtered.length === 0) {
        restaurantGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    restaurantGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    restaurantGrid.innerHTML = filtered.map(restaurant => `
        <div class="restaurant-card" data-id="${restaurant.id}">
            <div class="card-header">
                <div>
                    <div class="restaurant-name">${restaurant.name}</div>
                    <div class="restaurant-category">${getCategoryName(restaurant.category)}</div>
                </div>
                <div class="restaurant-rating">
                    ⭐ ${restaurant.rating}
                </div>
            </div>
            <div class="card-body">
                <div class="restaurant-location">
                    📍 ${restaurant.location}
                </div>
                <div class="restaurant-info">
                    <div class="info-item">
                        💬 ${restaurant.reviews}개 후기
                    </div>
                    <button class="write-review-btn" onclick="handleWriteReview(${restaurant.id})">
                        후기 작성
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click handlers to cards
    const cards = restaurantGrid.querySelectorAll('.restaurant-card');
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('write-review-btn')) {
                const id = parseInt(card.dataset.id);
                handleRestaurantClick(id);
            }
        });
    });
}

// Handle restaurant card click
function handleRestaurantClick(id) {
    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant) return;
    
    showNotification(`"${restaurant.name}" 상세 정보를 불러오는 중...`, 'info');
    console.log('Restaurant clicked:', restaurant);
    // Navigate to restaurant details page
}

// Handle write review button click
function handleWriteReview(id) {
    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant) return;
    
    showNotification(`"${restaurant.name}" 후기 작성 페이지로 이동합니다`, 'success');
    console.log('Write review for:', restaurant);
    
    // Store restaurant info for review page
    const reviewData = {
        restaurantId: id,
        restaurantName: restaurant.name,
        category: restaurant.category,
        location: restaurant.location
    };
    
    console.log('Review data:', reviewData);
    
    // Navigate to review writing page after short delay
    setTimeout(() => {
        // window.location.href = `../review-write/index.html?restaurant=${id}`;
        console.log('Would navigate to review page with data:', reviewData);
    }, 800);
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

const searchSection = document.querySelector('.search-section');
const locationBrowser = document.querySelector('.location-browser');
const restaurantListSection = document.querySelector('.restaurant-list-section');

addSectionGlowEffect(searchSection);
addSectionGlowEffect(locationBrowser);
addSectionGlowEffect(restaurantListSection);

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
        max-width: 320px;
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
document.head.appendChild(notificationStyle);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Focus search on '/' key
    if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Clear search on 'Escape' key
    if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchQuery = '';
        searchInput.blur();
        renderRestaurants();
    }
});

// Animation on scroll for cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 50);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply animation styles and observe cards
function observeCards() {
    const cards = document.querySelectorAll('.restaurant-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// Re-observe cards after rendering
const originalRender = renderRestaurants;
renderRestaurants = function() {
    originalRender();
    setTimeout(observeCards, 10);
};

// Initial render with animation
renderRestaurants();

// Search input placeholder animation
const searchPlaceholders = [
    '음식점 이름 또는 음식 종류로 검색...',
    '예: 파스타, 김치찌개, 스시...',
    '예: 강남 맛집, 홍대 카페...',
];

let placeholderIndex = 0;

setInterval(() => {
    if (document.activeElement !== searchInput && !searchInput.value) {
        placeholderIndex = (placeholderIndex + 1) % searchPlaceholders.length;
        searchInput.placeholder = searchPlaceholders[placeholderIndex];
    }
}, 3000);
