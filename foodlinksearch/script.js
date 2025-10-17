// FoodLink Search Page Script

// Sample ingredient data
const ingredients = [
    { id: 1, name: '양파', icon: '🧅', price: '2,500원/kg', suppliers: 15, category: 'vegetables' },
    { id: 2, name: '돼지고기', icon: '🥩', price: '12,000원/kg', suppliers: 8, category: 'meat' },
    { id: 3, name: '당근', icon: '🥕', price: '1,800원/kg', suppliers: 12, category: 'vegetables' },
    { id: 4, name: '감자', icon: '🥔', price: '2,000원/kg', suppliers: 18, category: 'vegetables' },
    { id: 5, name: '소고기', icon: '🥩', price: '25,000원/kg', suppliers: 6, category: 'meat' },
    { id: 6, name: '고등어', icon: '🐟', price: '8,500원/kg', suppliers: 10, category: 'seafood' },
    { id: 7, name: '쌀', icon: '🌾', price: '45,000원/20kg', suppliers: 14, category: 'grains' },
    { id: 8, name: '마늘', icon: '🧄', price: '4,500원/kg', suppliers: 13, category: 'vegetables' },
    { id: 9, name: '간장', icon: '🥢', price: '6,000원/1.8L', suppliers: 9, category: 'seasoning' },
    { id: 10, name: '우유', icon: '🥛', price: '3,200원/L', suppliers: 7, category: 'dairy' },
    { id: 11, name: '대파', icon: '🌿', price: '2,800원/kg', suppliers: 11, category: 'vegetables' },
    { id: 12, name: '닭고기', icon: '🍗', price: '5,500원/kg', suppliers: 9, category: 'meat' }
];

// Cart storage
let cart = [];
let cartCount = 0;

// DOM Elements
const ingredientsGrid = document.getElementById('ingredientsGrid');
const ingredientSearch = document.getElementById('ingredientSearch');
const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const cartBadge = document.getElementById('cartBadge');
const filterTags = document.querySelectorAll('.filter-tag');
const categoryCards = document.querySelectorAll('.category-card');
const sidebarBtns = document.querySelectorAll('.sidebar-btn');
const sidebar = document.getElementById('foodlinkSidebar');

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    renderIngredients(ingredients);
    setupEventListeners();
    setupSidebarScroll();
    loadCart();
});

// Render ingredient cards
function renderIngredients(items) {
    ingredientsGrid.innerHTML = '';
    
    if (items.length === 0) {
        ingredientsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                검색 결과가 없습니다.
            </div>
        `;
        return;
    }
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'ingredient-card';
        card.innerHTML = `
            <div class="ingredient-icon">${item.icon}</div>
            <h3 class="ingredient-name">${item.name}</h3>
            <div class="ingredient-info">
                <span>공급자: ${item.suppliers}명</span>
            </div>
            <div class="ingredient-price">${item.price}</div>
            <div class="ingredient-actions">
                <button class="action-icon-btn" onclick="viewDetails(${item.id})" title="상세보기">👁️</button>
                <button class="action-icon-btn" onclick="addToCart(${item.id})" title="장바구니">🛒</button>
            </div>
        `;
        
        ingredientsGrid.appendChild(card);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search button
    searchBtn.addEventListener('click', performSearch);
    
    // Enter key on search inputs
    ingredientSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    // Filter tags
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const category = tag.textContent.trim();
            filterByCategory(category);
            showNotification(`${category} 필터가 적용되었습니다`, 'info');
        });
    });
    
    // Category cards
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterByCategory(getCategoryName(category));
            showNotification(`카테고리가 선택되었습니다`, 'info');
        });
    });
    
    // Sidebar buttons
    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            
            // Update active state
            sidebarBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Handle navigation
            handleSidebarNavigation(page);
        });
    });
}

// Perform search
function performSearch() {
    const searchTerm = ingredientSearch.value.trim().toLowerCase();
    const location = locationInput.value.trim();
    
    if (!searchTerm && !location) {
        showNotification('검색어 또는 지역을 입력하세요', 'info');
        return;
    }
    
    let filtered = ingredients;
    
    if (searchTerm) {
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );
    }
    
    renderIngredients(filtered);
    
    if (location) {
        showNotification(`"${searchTerm || '전체'}" 검색 완료 - 지역: ${location}`, 'success');
    } else {
        showNotification(`"${searchTerm}" 검색 완료`, 'success');
    }
}

// Filter by category
function filterByCategory(categoryName) {
    const categoryMap = {
        '채소류': 'vegetables',
        '육류': 'meat',
        '해산물': 'seafood',
        '곡물': 'grains',
        '양념/소스': 'seasoning',
        '유제품': 'dairy'
    };
    
    const category = categoryMap[categoryName];
    
    if (category) {
        const filtered = ingredients.filter(item => item.category === category);
        renderIngredients(filtered);
    }
}

// Get category name
function getCategoryName(category) {
    const nameMap = {
        'vegetables': '채소류',
        'meat': '육류',
        'seafood': '해산물',
        'grains': '곡물',
        'seasoning': '양념/소스',
        'dairy': '유제품',
        'fruits': '과일',
        'frozen': '냉동식품'
    };
    
    return nameMap[category] || '전체';
}

// View ingredient details
function viewDetails(id) {
    const item = ingredients.find(i => i.id === id);
    if (item) {
        showNotification(`${item.name} 상세 페이지로 이동합니다`, 'info');
        // Navigate to details page (map view will be next)
        console.log('Navigate to details for:', item);
    }
}

// Add to cart
function addToCart(id) {
    const item = ingredients.find(i => i.id === id);
    if (!item) return;
    
    // Check if already in cart
    const existingItem = cart.find(c => c.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`${item.name} 수량이 증가했습니다`, 'success');
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
        showNotification(`${item.name}을(를) 장바구니에 담았습니다`, 'success');
    }
    
    updateCartBadge();
    saveCart();
}

// Update cart badge
function updateCartBadge() {
    cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = cartCount;
    
    if (cartCount > 0) {
        cartBadge.style.display = 'block';
    } else {
        cartBadge.style.display = 'none';
    }
}

// Save cart
function saveCart() {
    // In a real app, this would save to backend
    console.log('Cart saved:', cart);
}

// Load cart
function loadCart() {
    // In a real app, this would load from backend
    cart = [];
    updateCartBadge();
}

// Handle sidebar navigation
function handleSidebarNavigation(page) {
    switch(page) {
        case 'search':
            showNotification('검색 페이지입니다', 'info');
            break;
        case 'history':
            showNotification('이전거래보기 페이지로 이동합니다', 'info');
            break;
        case 'wallet':
            showNotification('지갑 페이지로 이동합니다', 'info');
            break;
        case 'cart':
            showNotification(`장바구니에 ${cartCount}개 상품이 있습니다`, 'info');
            // Navigate to cart page
            break;
        case 'register':
            showNotification('상품 등록 페이지로 이동합니다', 'info');
            break;
    }
}

// Setup sidebar scroll behavior with lag
function setupSidebarScroll() {
    let ticking = false;
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let targetTop = 2; // Initial top position in rem
    
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
        
        // Calculate new target position with lag
        if (currentScrollTop > navbarHeight) {
            targetTop = Math.max(2, Math.min(20, targetTop + scrollDiff * 0.3));
        } else {
            targetTop = 2;
        }
        
        // Apply smooth position
        sidebar.style.top = `${targetTop}rem`;
        
        lastScrollTop = currentScrollTop;
    }
}

// Notification system (if not already defined)
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

// Auto-complete suggestions (bonus feature)
const ingredientNames = ingredients.map(i => i.name);

ingredientSearch.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    
    if (value.length < 2) return;
    
    const suggestions = ingredientNames.filter(name => 
        name.toLowerCase().includes(value)
    );
    
    // You can implement a dropdown here if desired
    console.log('Suggestions:', suggestions);
});

// Handle window resize for responsive sidebar
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
