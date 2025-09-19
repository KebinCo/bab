// App State
let currentUser = null;
let currentSection = 'home';

// Sample Data
const sampleRestaurants = [
    { id: 1, name: '김치찌개마을', cuisine: 'Korean', rating: 4.8, price: '₩₩', image: '🍲', description: 'Authentic Korean stew restaurant with traditional flavors' },
    { id: 2, name: 'Pizza Heaven', cuisine: 'Italian', rating: 4.6, price: '₩₩₩', image: '🍕', description: 'Wood-fired pizza with fresh ingredients' },
    { id: 3, name: 'Sushi Zen', cuisine: 'Japanese', rating: 4.9, price: '₩₩₩₩', image: '🍣', description: 'Premium sushi experience with master chef' },
    { id: 4, name: 'Burger Lab', cuisine: 'American', rating: 4.4, price: '₩₩', image: '🍔', description: 'Gourmet burgers made with local ingredients' },
    { id: 5, name: 'Thai Garden', cuisine: 'Thai', rating: 4.7, price: '₩₩', image: '🍜', description: 'Authentic Thai cuisine in a cozy atmosphere' },
    { id: 6, name: 'Coffee Roasters', cuisine: 'Cafe', rating: 4.5, price: '₩', image: '☕', description: 'Artisan coffee and fresh pastries' }
];

const sampleRecipes = [
    { id: 1, name: '김치볶음밥', difficulty: 'Easy', time: '15 min', rating: 4.7, image: '🍳', description: 'Quick and delicious kimchi fried rice' },
    { id: 2, name: 'Avocado Toast', difficulty: 'Easy', time: '5 min', rating: 4.3, image: '🥑', description: 'Healthy breakfast option with fresh avocado' },
    { id: 3, name: 'Chicken Teriyaki', difficulty: 'Medium', time: '25 min', rating: 4.8, image: '🍗', description: 'Sweet and savory Japanese-style chicken' },
    { id: 4, name: 'Veggie Pasta', difficulty: 'Easy', time: '20 min', rating: 4.5, image: '🍝', description: 'Colorful pasta with seasonal vegetables' }
];

const samplePosts = [
    { id: 1, author: 'FoodLover123', avatar: '👨', time: '2h ago', content: 'Just tried the new ramen place downtown! The broth was incredible 🍜✨', likes: 24, comments: 8 },
    { id: 2, author: 'HealthyEats', avatar: '👩', time: '4h ago', content: 'Made this amazing quinoa bowl for lunch. Recipe coming soon! 🥗', likes: 31, comments: 12 },
    { id: 3, author: 'ChefMike', avatar: '👨‍🍳', time: '1d ago', content: 'Teaching my kids how to make homemade pizza. Family cooking time! 🍕👨‍👩‍👧‍👦', likes: 45, comments: 15 }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize App
function initializeApp() {
    setupNavigation();
    setupModals();
    setupSearch();
    setupFloatingActionButton();
    loadContent();
    animateProgressBars();
    setupMobileMenu();
}

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            switchSection(target);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Section Switching
function switchSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId || (sectionId === 'home' && section.classList.contains('hero-section'))) {
            section.classList.add('active');
        }
    });
    currentSection = sectionId;
    
    // Load content for the section
    if (sectionId === 'restaurants') {
        loadRestaurants();
    } else if (sectionId === 'recipes') {
        loadRecipes();
    } else if (sectionId === 'social') {
        loadSocialFeed();
    }
}

// Modal Setup
function setupModals() {
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeBtns = document.querySelectorAll('.close');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');

    // Open modals
    loginBtn.addEventListener('click', () => openModal(loginModal));
    signupBtn.addEventListener('click', () => openModal(signupModal));

    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeModal(this.closest('.modal'));
        });
    });

    // Switch between modals
    switchToSignup.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal(loginModal);
        openModal(signupModal);
    });

    switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal(signupModal);
        openModal(loginModal);
    });

    // Close on outside click
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Form submissions
    setupAuthForms();
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Auth Forms Setup
function setupAuthForms() {
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate login/signup process
            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Simulate successful auth
                currentUser = {
                    name: 'John Doe',
                    email: 'john@example.com',
                    avatar: '👤'
                };
                
                updateUIForLoggedInUser();
                closeModal(this.closest('.modal'));
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    });

    // Social login buttons
    const socialBtns = document.querySelectorAll('.btn-social');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Simulate social login
            console.log(`Logging in with ${this.textContent}`);
        });
    });
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const navAuth = document.querySelector('.nav-auth');
    navAuth.innerHTML = `
        <div class="user-profile">
            <span class="user-avatar">${currentUser.avatar}</span>
            <span class="user-name">${currentUser.name}</span>
            <button class="logout-btn">Logout</button>
        </div>
    `;
    
    // Add logout functionality
    const logoutBtn = navAuth.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', logout);
}

function logout() {
    currentUser = null;
    location.reload(); // Simple way to reset the UI
}

// Search Setup
function setupSearch() {
    const searchInput = document.getElementById('main-search');
    const searchBtn = document.querySelector('.search-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyFilter(this.textContent);
        });
    });
}

function performSearch() {
    const query = document.getElementById('main-search').value;
    console.log('Searching for:', query);
    
    // Simulate search animation
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        searchBtn.style.transform = 'scale(1)';
    }, 150);
    
    // Switch to restaurants section and filter results
    switchSection('restaurants');
    // In a real app, you'd filter the results based on the query
}

function applyFilter(filter) {
    console.log('Applying filter:', filter);
    // In a real app, you'd filter the content based on the selected filter
}

// Content Loading
function loadContent() {
    loadRestaurants();
    loadRecipes();
    loadSocialFeed();
}

function loadRestaurants() {
    const grid = document.getElementById('restaurants-grid');
    grid.innerHTML = '';
    
    sampleRestaurants.forEach((restaurant, index) => {
        const card = createRestaurantCard(restaurant);
        card.style.animationDelay = `${index * 0.1}s`;
        grid.appendChild(card);
    });
}

function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-image">${restaurant.image}</div>
        <div class="card-content">
            <h3 class="card-title">${restaurant.name}</h3>
            <p class="card-description">${restaurant.description}</p>
            <div class="card-meta">
                <span class="rating">⭐ ${restaurant.rating}</span>
                <span class="price">${restaurant.price}</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        console.log('Opening restaurant:', restaurant.name);
        // In a real app, you'd navigate to the restaurant detail page
    });
    
    return card;
}

function loadRecipes() {
    const grid = document.getElementById('recipes-grid');
    grid.innerHTML = '';
    
    sampleRecipes.forEach((recipe, index) => {
        const card = createRecipeCard(recipe);
        card.style.animationDelay = `${index * 0.1}s`;
        grid.appendChild(card);
    });
}

function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-image">${recipe.image}</div>
        <div class="card-content">
            <h3 class="card-title">${recipe.name}</h3>
            <p class="card-description">${recipe.description}</p>
            <div class="card-meta">
                <span class="rating">⭐ ${recipe.rating}</span>
                <span class="difficulty">${recipe.difficulty} • ${recipe.time}</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        console.log('Opening recipe:', recipe.name);
    });
    
    return card;
}

function loadSocialFeed() {
    const feed = document.getElementById('social-feed');
    feed.innerHTML = '';
    
    samplePosts.forEach((post, index) => {
        const postElement = createSocialPost(post);
        postElement.style.animationDelay = `${index * 0.1}s`;
        feed.appendChild(postElement);
    });
}

function createSocialPost(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'social-post';
    postDiv.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">${post.avatar}</div>
            <div class="post-info">
                <div class="post-author">${post.author}</div>
                <div class="post-time">${post.time}</div>
            </div>
        </div>
        <div class="post-content">${post.content}</div>
        <div class="post-actions">
            <button class="action-btn like-btn">❤️ ${post.likes}</button>
            <button class="action-btn comment-btn">💬 ${post.comments}</button>
            <button class="action-btn share-btn">📤 Share</button>
        </div>
    `;
    
    // Add interaction handlers
    const likeBtn = postDiv.querySelector('.like-btn');
    let isLiked = false;
    
    likeBtn.addEventListener('click', function() {
        isLiked = !isLiked;
        const currentLikes = parseInt(this.textContent.match(/\d+/)[0]);
        this.textContent = `${isLiked ? '❤️' : '🤍'} ${isLiked ? currentLikes + 1 : currentLikes - 1}`;
        this.style.color = isLiked ? '#ff6b6b' : '';
    });
    
    return postDiv;
}

// Floating Action Button
function setupFloatingActionButton() {
    const fabBtn = document.querySelector('.fab-btn');
    const fabMenu = document.querySelector('.fab-menu');
    const fabItems = document.querySelectorAll('.fab-item');

    let isMenuOpen = false;

    fabBtn.addEventListener('click', function() {
        isMenuOpen = !isMenuOpen;
        fabMenu.classList.toggle('active', isMenuOpen);
        this.style.transform = isMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)';
    });

    // FAB item actions
    fabItems.forEach(item => {
        item.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleFabAction(action);
            
            // Close menu
            isMenuOpen = false;
            fabMenu.classList.remove('active');
            fabBtn.style.transform = 'rotate(0deg)';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.fab') && isMenuOpen) {
            isMenuOpen = false;
            fabMenu.classList.remove('active');
            fabBtn.style.transform = 'rotate(0deg)';
        }
    });
}

function handleFabAction(action) {
    console.log('FAB action:', action);
    
    switch(action) {
        case 'add-restaurant':
            alert('Add Restaurant feature - coming soon!');
            break;
        case 'add-recipe':
            alert('Add Recipe feature - coming soon!');
            break;
        case 'log-meal':
            switchSection('nutrition');
            break;
        case 'share-photo':
            alert('Share Photo feature - coming soon!');
            break;
    }
}

// Progress Bar Animations
function animateProgressBars() {
    // Animate macro progress bars
    const macroProgressBars = document.querySelectorAll('.macro-progress');
    macroProgressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, 500);
    });

    // Animate calories circle
    const caloriesCircle = document.querySelector('.progress-bar');
    if (caloriesCircle) {
        const progress = caloriesCircle.getAttribute('data-progress');
        const circumference = 2 * Math.PI * 50; // radius = 50
        const offset = circumference - (progress / 100) * circumference;
        
        setTimeout(() => {
            caloriesCircle.style.strokeDashoffset = offset;
        }, 500);
    }
}

// Mobile Menu
function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// View Toggle (Grid/List)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('view-btn')) {
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        const view = e.target.getAttribute('data-view');
        toggleView(view);
    }
});

function toggleView(view) {
    const grids = document.querySelectorAll('.restaurants-grid, .recipes-grid');
    grids.forEach(grid => {
        if (view === 'list') {
            grid.style.gridTemplateColumns = '1fr';
        } else {
            grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        }
    });
}

// Smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add loading states
function showLoading(element) {
    element.innerHTML = '<div class="loading">Loading...</div>';
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('App error:', e.error);
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add some CSS for animations that need JavaScript
const style = document.createElement('style');
style.textContent = `
    .card {
        opacity: 0;
        transform: translateY(20px);
        animation: cardFadeIn 0.6s ease forwards;
    }
    
    .social-post {
        opacity: 0;
        transform: translateY(20px);
        animation: cardFadeIn 0.6s ease forwards;
    }
    
    @keyframes cardFadeIn {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .loading {
        text-align: center;
        color: white;
        padding: 40px;
        font-size: 1.2rem;
    }
    
    .user-profile {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .user-avatar {
        font-size: 1.5rem;
    }
    
    .user-name {
        color: white;
        font-weight: 500;
    }
    
    .logout-btn {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        padding: 8px 15px;
        border-radius: 15px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }
    
    .logout-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;

document.head.appendChild(style);
