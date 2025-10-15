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
    
    if
