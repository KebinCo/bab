// Google Maps variables
let map;
let service;
let markers = [];
let selectedPlace = null;

// Initialize Google Map
function initMap() {
    // Default center: Seoul City Hall
    const defaultCenter = { lat: 37.5665, lng: 126.9780 };
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultCenter,
        zoom: 13,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [{ "color": "#1d2c4d" }]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#8ec3b9" }]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{ "color": "#1a3646" }]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{ "color": "#0e1626" }]
            }
        ]
    });
    
    service = new google.maps.places.PlacesService(map);
}

// Search for restaurants
function searchRestaurants() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('검색어를 입력해주세요.');
        return;
    }
    
    const request = {
        query: query,
        fields: ['name', 'formatted_address', 'place_id', 'geometry', 'types'],
        locationBias: map.getCenter()
    };
    
    service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            displaySearchResults(results);
        } else {
            alert('검색 결과가 없습니다.');
        }
    });
}

// Display search results
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';
    resultsContainer.classList.add('active');
    
    results.forEach((place, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.style.animationDelay = `${index * 0.05}s`;
        
        resultItem.innerHTML = `
            <div class="result-name">${place.name}</div>
            <div class="result-address">${place.formatted_address || '주소 정보 없음'}</div>
        `;
        
        resultItem.addEventListener('click', () => {
            selectRestaurant(place);
        });
        
        resultsContainer.appendChild(resultItem);
    });
}

// Select a restaurant
function selectRestaurant(place) {
    selectedPlace = place;
    
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    
    // Add marker to map
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP
    });
    markers.push(marker);
    
    // Center map on selected location
    map.setCenter(place.geometry.location);
    map.setZoom(16);
    
    // Get detailed place information
    service.getDetails({
        placeId: place.place_id,
        fields: ['name', 'formatted_address', 'types', 'rating', 'user_ratings_total']
    }, (placeDetails, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            displaySelectedRestaurant(placeDetails);
        }
    });
    
    // Hide search results
    document.getElementById('search-results').classList.remove('active');
}

// Display selected restaurant info
function displaySelectedRestaurant(place) {
    const selectedSection = document.getElementById('selected-restaurant');
    const nameElement = document.getElementById('restaurant-name');
    const addressElement = document.getElementById('restaurant-address');
    const typeElement = document.getElementById('restaurant-type');
    
    nameElement.textContent = place.name;
    addressElement.textContent = place.formatted_address;
    
    // Get restaurant type
    const types = place.types || [];
    const foodTypes = types.filter(type => 
        ['restaurant', 'food', 'cafe', 'bar', 'meal_takeaway', 'meal_delivery'].some(t => type.includes(t))
    );
    typeElement.textContent = foodTypes.length > 0 ? 
        `종류: ${foodTypes.slice(0, 2).join(', ')}` : 
        '음식점';
    
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
    if (selectedPlace) {
        // Store selected restaurant in sessionStorage
        const restaurantData = {
            name: document.getElementById('restaurant-name').textContent,
            address: document.getElementById('restaurant-address').textContent,
            type: document.getElementById('restaurant-type').textContent,
            placeId: selectedPlace.place_id
        };
        
        sessionStorage.setItem('selectedRestaurant', JSON.stringify(restaurantData));
        
        // Navigate to review page
        window.location.href = 'review-form.html';
    }
});

// Initialize map when page loads
window.addEventListener('load', () => {
    if (typeof google !== 'undefined') {
        initMap();
    } else {
        console.error('Google Maps API not loaded. Please add your API key to the HTML file.');
    }
});
