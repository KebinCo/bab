// Review Write Page

// State
let overallRating = 0;
let menuTags = [];

// DOM elements
const reviewForm = document.getElementById('review-form');
const starRating = document.getElementById('star-rating');
const stars = starRating.querySelectorAll('.star');
const ratingValue = document.getElementById('rating-value');
const reviewContent = document.getElementById('review-content');
const charCount = document.getElementById('char-count');
const menuInput = document.getElementById('menu-input');
const tagsDisplay = document.getElementById('tags-display');
const cancelBtn = document.getElementById('cancel-btn');

// Rating sliders
const tasteSlider = document.getElementById('taste-rating');
const serviceSlider = document.getElementById('service-rating');
const atmosphereSlider = document.getElementById('atmosphere-rating');
const valueSlider = document.getElementById('value-rating');

const tasteValue = document.getElementById('taste-value');
const serviceValue = document.getElementById('service-value');
const atmosphereValue = document.getElementById('atmosphere-value');
const valueValue = document.getElementById('value-value');

// Star rating interaction
stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        overallRating = index + 1;
        updateStars();
        ratingValue.textContent = overallRating.toFixed(1);
    });
    
    star.addEventListener('mouseenter', () => {
        highlightStars(index + 1);
    });
});

starRating.addEventListener('mouseleave', () => {
    updateStars();
});

function updateStars() {
    stars.forEach((star, index) => {
        if (index < overallRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function highlightStars(count) {
    stars.forEach((star, index) => {
        if (index < count) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Slider updates
function setupSlider(slider, valueDisplay) {
    slider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        valueDisplay.textContent = value.toFixed(1);
        
        // Update slider background gradient
        const percentage = (value / 5) * 100;
        slider.style.background = `linear-gradient(to right, rgba(138, 43, 226, 0.6) 0%, rgba(218, 165, 32, 0.6) ${percentage}%, rgba(138, 43, 226, 0.2) ${percentage}%, rgba(138, 43, 226, 0.2) 100%)`;
    });
}

setupSlider(tasteSlider, tasteValue);
setupSlider(serviceSlider, serviceValue);
setupSlider(atmosphereSlider, atmosphereValue);
setupSlider(valueSlider, valueValue);

// Character counter
reviewContent.addEventListener('input', (e) => {
    const length = e.target.value.length;
    charCount.textContent = length;
    
    if (length > 500) {
        charCount.style.color = '#ef4444';
        e.target.value = e.target.value.substring(0, 500);
        charCount.textContent = 500;
    } else {
        charCount.style.color = '#808090';
    }
});

// Menu tags
menuInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const tag = menuInput.value.trim();
        
        if (tag && !menuTags.includes(tag)) {
            menuTags.push(tag);
            renderTags();
            menuInput.value = '';
        }
    }
});

function renderTags() {
    tagsDisplay.innerHTML = menuTags.map((tag, index) => `
        <span class="menu-tag">
            ${tag}
            <span class="tag-remove" data-index="${index}">×</span>
        </span>
    `).join('');
    
    // Add remove handlers
    document.querySelectorAll('.tag-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            menuTags.splice(index, 1);
            renderTags();
        });
    });
}

// Form validation
function validateForm() {
    const restaurantName = document.getElementById('restaurant-name').value.trim();
    const category = document.getElementById('category').value;
    const location = document.getElementById('location').value.trim();
    const reviewTitle = document.getElementById('review-title').value.trim();
    const reviewText = reviewContent.value.trim();
    
    if (!restaurantName) {
        showNotification('음식점 이름을 입력해주세요', 'error');
        return false;
    }
    
    if (!category) {
        showNotification('음식 카테고리를 선택해주세요', 'error');
        return false;
    }
    
    if (!location) {
        showNotification('위치를 입력해주세요', 'error');
        return false;
    }
    
    if (overallRating === 0) {
        showNotification('전체 평점을 선택해주세요', 'error');
        return false;
    }
    
    if (!reviewTitle) {
        showNotification('후기 제목을 입력해주세요', 'error');
        return false;
    }
    
    if (!reviewText) {
        showNotification('후기 내용을 입력해주세요', 'error');
        return false;
    }
    
    if (reviewText.length < 20) {
        showNotification('후기 내용을 20자 이상 입력해주세요', 'error');
        return false;
    }
    
    return true;
}

// Form submission
reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const formData = {
        restaurantName: document.getElementById('restaurant-name').value.trim(),
        category: document.getElementById('category').value,
        location: document.getElementById('location').value.trim(),
        overallRating: overallRating,
        tasteRating: parseFloat(tasteSlider.value),
        serviceRating: parseFloat(serviceSlider.value),
        atmosphereRating: parseFloat(atmosphereSlider.value),
        valueRating: parseFloat(valueSlider.value),
        title: document.getElementById('review-title').value.trim(),
        content: reviewContent.value.trim(),
        recommendedMenus: menuTags,
        visitDate: document.getElementById('visit-date').value,
        priceRange: document.getElementById('price-range').value,
        recommend: document.getElementById('recommend').checked,
        revisit: document.getElementById('revisit').checked
    };
    
    console.log('Review data:', formData);
    
    // Simulate submission
    const submitBtn = reviewForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.querySelector('.btn-text').textContent = '등록 중...';
    
    setTimeout(() => {
        showNotification('후기가 성공적으로 등록되었습니다!', 'success');
        
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.querySelector('.btn-text').textContent = '후기 등록';
        
        // Reset or redirect
        setTimeout(() => {
            // window.location.href = '../dashboard/index.html';
            console.log('Would redirect to dashboard');
        }, 1500);
    }, 2000);
});

// Cancel button
cancelBtn.addEventListener('click', () => {
    if (confirm('작성 중인 내용이 모두 사라집니다. 정말 취소하시겠습니까?')) {
        showNotification('작성이 취소되었습니다', 'info');
        setTimeout(() => {
            // window.history.back();
            console.log('Would go back');
        }, 1000);
    }
});

// Section glow effect
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

const formContainer = document.querySelector('.review-form-container');
addSectionGlowEffect(formContainer);

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

// Auto-save draft (every 30 seconds)
let autoSaveInterval;

function saveDraft() {
    const draftData = {
        restaurantName: document.getElementById('restaurant-name').value,
        category: document.getElementById('category').value,
        location: document.getElementById('location').value,
        title: document.getElementById('review-title').value,
        content: reviewContent.value,
        timestamp: new Date().toISOString()
    };
    
    // In a real app, you'd save to localStorage or send to server
    console.log('Draft saved:', draftData);
}

// Start auto-save when user starts typing
let hasStartedTyping = false;

reviewContent.addEventListener('input', () => {
    if (!hasStartedTyping) {
        hasStartedTyping = true;
        autoSaveInterval = setInterval(saveDraft, 30000);
        console.log('Auto-save enabled');
    }
});

// Clear auto-save on submit or cancel
reviewForm.addEventListener('submit', () => {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
});

cancelBtn.addEventListener('click', () => {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
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
document.head.appendChild(notificationStyle);

// Set today as max date for visit date
const visitDateInput = document.getElementById('visit-date');
const today = new Date().toISOString().split('T')[0];
visitDateInput.setAttribute('max', today);
