// FoodLink Suppliers Map Page Script

// Sample suppliers data
const suppliers = [
    {
        id: 1,
        name: '신선농산',
        location: '서울시 강남구 역삼동',
        distance: '1.2km',
        rating: 4.8,
        reviews: 156,
        price: '2,500원/kg',
        minOrder: '10kg',
        delivery: '당일배송',
        lat: 37.5000,
        lng: 127.0360
    },
    {
        id: 2,
        name: '한마음 농장',
        location: '서울시 서초구 서초동',
        distance: '2.5km',
        rating: 4.6,
        reviews: 98,
        price: '2,300원/kg',
        minOrder: '20kg',
        delivery: '익일배송',
        lat: 37.4950,
        lng: 127.0320
    },
    {
        id: 3,
        name: '금강농산물',
        location: '서울시 강남구 삼성동',
        distance: '1.8km',
        rating: 4.9,
        reviews: 234,
        price: '2,700원/kg',
        minOrder: '5kg',
        delivery: '당일배송',
        lat: 37.5080,
        lng: 127.0420
    },
    {
        id: 4,
        name: '푸른들 직거래',
        location: '서울시 송파구 잠실동',
        distance: '3.2km',
        rating: 4.7,
        reviews: 189,
        price: '2,400원/kg',
        minOrder: '15kg',
        delivery: '당일배송',
        lat: 37.5130,
        lng: 127.0500
    },
    {
        id: 5,
        name: '대박농수산',
        location: '서울시 강남구 청담동',
        distance: '2.1km',
        rating: 4.5,
        reviews: 67,
        price: '2,600원/kg',
        minOrder: '10kg',
        delivery: '익일배송',
        lat: 37.5200,
        lng: 127.0450
    },
    {
        id: 6,
        name: '자연마당',
        location: '서울시 서초구 반포동',
        distance: '3.5km',
        rating: 4.8,
        reviews: 145,
        price: '2,450원/kg',
        minOrder: '20kg',
        delivery: '당일배송',
        lat: 37.4900,
        lng: 127.0250
    },
    {
        id: 7,
        name: '농부의 마음',
        location: '서울시 강남구 논현동',
        distance: '1.5km',
        rating: 4.9,
        reviews: 201,
        price: '2,550원/kg',
        minOrder: '10kg',
        delivery: '당일배송',
        lat: 37.5050,
        lng: 127.0300
    },
    {
        id: 8,
        name: '햇살농장',
        location: '서울시 강남구 대치동',
        distance: '2.8km',
        rating: 4.6,
        reviews: 112,
        price: '2,350원/kg',
        minOrder: '15kg',
        delivery: '익일배송',
        lat: 37.4980,
        lng: 127.0480
    },
    {
        id: 9,
        name: '초록마을',
        location: '서울시 서초구 서초3동',
        distance: '3.0km',
        rating: 4.7,
        reviews: 178,
        price: '2,500원/kg',
        minOrder: '10kg',
        delivery: '당일배송',
        lat: 37.4920,
        lng: 127.0200
    },
    {
        id: 10,
        name: '산들농원',
        location: '서울시 강남구 개포동',
        distance: '2.3km',
        rating: 4.8,
        reviews: 156,
        price: '2,650원/kg',
        minOrder: '20kg',
        delivery: '당일배송',
        lat: 37.4850,
        lng: 127.0550
    },
    {
        id: 11,
        name: '별빛농장',
        location: '서울시 송파구 문정동',
        distance: '3.8km',
        rating: 4.5,
        reviews: 89,
        price: '2,400원/kg',
        minOrder: '15kg',
        delivery: '익일배송',
        lat: 37.4870,
        lng: 127.1200
    },
    {
        id: 12,
        name: '황금들판',
        location: '서울시 강남구 도곡동',
        distance: '1.9km',
        rating: 4.9,
        reviews: 267,
        price: '2,500원/kg',
        minOrder: '10kg',
        delivery: '당일배송',
        lat: 37.4920,
        lng: 127.0400
    }
];

// Current state
let currentFilter = 'all';
let selectedSupplier = null;
let userLocation = { lat: 37.5000, lng: 127.0370 };

// DOM Elements
const suppliersList = document.getElementById('suppliersList');
const filterBtns = document.querySelectorAll('.filter-btn');
const ingredientIcon = document.getElementById('ingredientIcon');
const ingredientName = document.getElementById('ingredientName');
const allCount = document.getElementById('allCount');
const nearbyCount = document.getElementById('nearbyCount');
const myLocationBtn = document.getElementById('myLocationBtn');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const resetMapBtn = document.getElementById('resetMapBtn');
const userLocationEl = document.getElementById('userLocation');
const sidebarBtns = document.querySelectorAll('.sidebar-btn');
const sidebar = document.getElementById('foodlinkSidebar');

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Get ingredient from URL params or use default
    const urlParams = new URLSearchParams(window.location.search);
    const ingredient = urlParams.get('ingredient') || '양파';
    const icon = urlParams.get('icon') || '🧅';
    
    ingredientName.textContent = ingredient;
    ingredientIcon.textContent = icon;
    
    // Update counts
    allCount.textContent = suppliers.length;
    const nearby = suppliers.filter(s => parseFloat(s.distance) <= 2.5);
    nearbyCount.textContent = nearby.length;
    
    // Render suppliers
    renderSuppliers(suppliers);
    
    // Setup event listeners
    setupEventListeners();
    setupSidebarScroll();
    
    // Get user location (placeholder)
    getUserLocation();
});

// Render supplier cards
function renderSuppliers(items) {
    suppliersList.innerHTML = '';
    
    items.forEach(supplier => {
        const card = document.createElement('div');
        card.className = 'supplier-card';
        card.dataset.supplierId = supplier.id;
        
        const isNearby = parseFloat(supplier.distance) <= 2.5;
        
        card.innerHTML = `
            ${isNearby ? `<div class="distance-badge">📍 ${supplier.distance}</div>` : ''}
            
            <div class="supplier-header">
                <div class="supplier-info">
                    <h3 class="supplier-name">${supplier.name}</h3>
                    <div class="supplier-location">
                        <span>📍</span>
                        <span>${supplier.location}</span>
                    </div>
                </div>
                <div class="supplier-rating">
                    <span class="rating-stars">⭐</span>
                    <span class="rating-value">${supplier.rating}</span>
                </div>
            </div>
            
            <div class="supplier-details">
                <div class="detail-item">
                    <div class="detail-label">가격</div>
                    <div class="detail-value">${supplier.price}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">최소주문</div>
                    <div class="detail-value">${supplier.minOrder}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">배송</div>
                    <div class="detail-value">${supplier.delivery}</div>
                </div>
            </div>
            
            <div class="supplier-actions">
                <button class="supplier-btn" onclick="viewSupplierDetail(${supplier.id})">
                    <span>ℹ️</span>
                    <span>상세보기</span>
                </button>
                <button class="supplier-btn primary" onclick="contactSupplier(${supplier.id})">
                    <span>💬</span>
                    <span>연락하기</span>
                </button>
            </div>
        `;
        
        // Click to select
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.supplier-btn')) {
                selectSupplier(supplier.id);
            }
        });
        
        suppliersList.appendChild(card);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Apply filter
            applyFilter(filter);
        });
    });
    
    // Map control buttons
    myLocationBtn.addEventListener('click', () => {
        showNotification('내 위치로 이동합니다', 'info');
        // In real implementation, center map on user location
    });
    
    zoomInBtn.addEventListener('click', () => {
        showNotification('지도 확대', 'info');
    });
    
    zoomOutBtn.addEventListener('click', () => {
        showNotification('지도 축소', 'info');
    });
    
    resetMapBtn.addEventListener('click', () => {
        showNotification('지도 초기화', 'info');
    });
    
    // Sidebar buttons
    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            
            if (page === 'search') {
                window.history.back();
            } else {
                sidebarBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                showNotification(`${btn.querySelector('.sidebar-label').textContent} 페이지로 이동`, 'info');
            }
        });
    });
}

// Apply filter
function applyFilter(filter) {
    currentFilter = filter;
    let filtered = [...suppliers];
    
    switch(filter) {
        case 'nearby':
            filtered = filtered.filter(s => parseFloat(s.distance) <= 2.5);
            break;
        case 'rated':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'price':
            filtered.sort((a, b) => {
                const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
                const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
                return priceA - priceB;
            });
            break;
    }
    
    renderSuppliers(filtered);
    showNotification(`필터 적용: ${filter}`, 'info');
}

// Select supplier
function selectSupplier(id) {
    selectedSupplier = id;
    
    // Update visual selection
    document.querySelectorAll('.supplier-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-supplier-id="${id}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        
        // Scroll to card if needed
        selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
        showNotification(`${supplier.name} 선택됨`, 'success');
        // In real implementation, highlight on map
    }
}

// View supplier detail
function viewSupplierDetail(id) {
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
        showNotification(`${supplier.name} 상세 페이지로 이동`, 'info');
        console.log('View detail for:', supplier);
    }
}

// Contact supplier
function contactSupplier(id) {
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
        showNotification(`${supplier.name}에게 연락하기`, 'success');
        console.log('Contact supplier:', supplier);
        // In real implementation, open chat or contact form
    }
}

// Get user location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation.lat = position.coords.latitude;
                userLocation.lng = position.coords.longitude;
                
                // Update location display (placeholder - would need reverse geocoding)
                userLocationEl.textContent = `위도: ${userLocation.lat.toFixed(4)}, 경도: ${userLocation.lng.toFixed(4)}`;
                
                showNotification('위치 정보를 가져왔습니다', 'success');
            },
            (error) => {
                console.log('Location error:', error);
                // Use default location
                userLocationEl.textContent = '서울시 강남구 역삼동';
            }
        );
    } else {
        userLocationEl.textContent = '서울시 강남구 역삼동';
    }
}

// Setup sidebar scroll behavior with lag
function setupSidebarScroll() {
    let ticking = false;
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let targetTop = 2;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleSidebarScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    function handleSidebarScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const scrollDiff = currentScrollTop - lastScrollTop;
        
        if (currentScrollTop > navbarHeight) {
            targetTop = Math.max(2, Math.min(20, targetTop + scrollDiff * 0.3));
        } else {
            targetTop = 2;
        }
        
        sidebar.style.top = `${targetTop}rem`;
        lastScrollTop = currentScrollTop;
    }
}

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

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth <= 1200) {
            sidebar.style.top = '0';
        } else {
            setupSidebarScroll();
        }
    }, 250);
});
