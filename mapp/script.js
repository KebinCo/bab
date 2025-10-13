// Mock restaurant database (temporary solution without Google Maps API)
const mockRestaurants = [
    { id: 1, name: '강남 스시 오마카세', address: '서울 강남구 테헤란로 123', type: '일식, 스시', lat: 37.5665, lng: 126.9780 },
    { id: 2, name: '홍대 파스타 하우스', address: '서울 마포구 홍익로 45', type: '이탈리안, 파스타', lat: 37.5563, lng: 126.9245 },
    { id: 3, name: '이태원 타코 레스토랑', address: '서울 용산구 이태원로 78', type: '멕시칸, 타코', lat: 37.5347, lng: 126.9947 },
    { id: 4, name: '명동 칼국수', address: '서울 중구 명동길 90', type: '한식, 칼국수', lat: 37.5636, lng: 126.9834 },
    { id: 5, name: '강남역 삼겹살 맛집', address: '서울 강남구 강남대로 456', type: '한식, 고기', lat: 37.4979, lng: 127.0276 },
    { id: 6, name: '신사동 브런치 카페', address: '서울 강남구 압구정로 234', type: '카페, 브런치', lat: 37.5240, lng: 127.0206 },
    { id: 7, name: '종로 전통 한정식', address: '서울 종로구 종로 567', type: '한식, 한정식', lat: 37.5703, lng: 126.9910 },
    { id: 8, name: '여의도 초밥 전문점', address: '서울 영등포구 여의대로 890', type: '일식, 초밥', lat: 37.5219, lng: 126.9245 },
    { id: 9, name: '압구정 스테이크 하우스', address: '서울 강남구 압구정로 345', type: '양식, 스테이크', lat: 37.5273, lng: 127.0386 },
    { id: 10, name: '건대 중국집', address: '서울 광진구 능동로 123', type: '중식, 짜장면', lat: 37.5403, lng: 127.0695 }
];

let selectedRestaurant = null;

// Simple map implementation without API
class SimpleMap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.markers = [];
        this.center = { lat: 37.5665, lng: 126.9780 }; // Seoul City Hall
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #1a2847 0%, #27496d 100%); border-radius: 16px; overflow: hidden;">
                <div id="map-markers" style="position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center; color: rgba(255,255,255,0.6);">
                        <div style="font-size: 48px; margin-bottom: 10px;">🗺️</div>
                        <div style="font-size: 16px;">맛집을 검색하고 선택해주세요</div>
                    </div>
                </div>
            </div>
        `;
    }

    addMarker(restaurant) {
        this.clearMarkers();
        const markersContainer = document.getElementById('map-markers');
        markersContainer.innerHTML = `
            <div style="text-align: center; color: rgba(255,255,255,0.9);">
                <div style="font-size: 64px; margin-bottom: 15px; animation: bounce 1s ease;">📍</div>
                <div style="font-size: 20px; font-weight: 600; margin-bottom: 5px; text-shadow: 0 0 20px rgba(120,200,255,0.8);">${restaurant.name}</div>
                <div style="font-size: 14px; color: rgba(180,220,255,0.8);">${restaurant.address}</div>
            </div>
            <style>
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
            </style>
        `;
    }

    clearMarkers() {
        const markersContainer = document.getElementById('map-markers');
        if (markersContainer) {
            markersContainer.innerHTML = '';
        }
    }
}

let map;

// Initialize map
function initMap() {
    map = new SimpleMap('map');
}

// Search restaurants
function searchRestaurants() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        alert('검색어를 입력해주세요.');
        return;
    }
    
    // Filter restaurants based on query
    const results = mockRestaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.address.toLowerCase().includes(query) ||
        restaurant.type.toLowerCase().includes(query)
    );
    
    if (results.length > 0) {
        displaySearchResults(results);
    } else {
        alert('검색 결과가 없습니다. 다른 검색어를 시도해보세요.');
    }
}

// Display search results
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';
    resultsContainer.classList.add('active');
    
    results.forEach((restaurant, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.style.animationDelay = `${index * 0.05}s`;
        
        resultItem.innerHTML = `
            <div class="result-name">${restaurant.name}</div>
            <div class="result-address">${restaurant.address} · ${restaurant.type}</div>
        `;
        
        resultItem.addEventListener('click', () => {
            selectRestaurant(restaurant);
        });
        
        resultsContainer.appendChild(resultItem);
    });
}

// Select restaurant
function selectRestaurant(restaurant) {
    selectedRestaurant = restaurant;
    
    // Update map
    map.addMarker(restaurant);
    
    // Display selected restaurant
    displaySelectedRestaurant(restaurant);
    
    // Hide search results
    document.getElementById('search-results').classList.remove('active');
}

// Display selected restaurant info
function displaySelectedRestaurant(restaurant) {
    const selectedSection = document.getElementById('selected-restaurant');
    const nameElement = document.getElementById('restaurant-name');
    const addressElement = document.getElementById('restaurant-address');
    const typeElement = document.getElementById('restaurant-type');
    
    nameElement.textContent = restaurant.name;
    addressElement.textContent = restaurant.address;
    typeElement.textContent = `종류: ${restaurant.type}`;
    
    selectedSection.style.display = 'flex';
}

// Event listeners
document.getElementById('search-btn').addEventListener('click', searchRestaurants);

document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchRestaurants();
    }
});

document.getElementById('review-btn').addEventListener('click', () => {
    if (selectedRestaurant) {
        // Store selected restaurant data
        const restaurantData = {
            name: selectedRestaurant.name,
            address: selectedRestaurant.address,
            type: selectedRestaurant.type,
            id: selectedRestaurant.id
        };
        
        sessionStorage.setItem('selectedRestaurant', JSON.stringify(restaurantData));
        
        // Navigate to review form page
        alert(`"${selectedRestaurant.name}" 후기 작성 페이지로 이동합니다.`);
        // window.location.href = 'review-form.html';
    }
});

// Initialize when page loads
window.addEventListener('load', () => {
    initMap();
});
