// Dashboard page specific interactions

// Section glow follow mouse
const userInfoSection = document.querySelector('.user-info-section');
const activitySection = document.querySelector('.activity-section');

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

addSectionGlowEffect(userInfoSection);
addSectionGlowEffect(activitySection);

// Stat cards glow effect
const statCards = document.querySelectorAll('.stat-card');

statCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const glow = card.querySelector('.card-glow-small');
        if (glow) {
            glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(138, 43, 226, 0.3) 0%, transparent 70%)`;
        }
    });
});

// Activity items click handler
const activityItems = document.querySelectorAll('.activity-item');

activityItems.forEach(item => {
    item.addEventListener('click', () => {
        const text = item.querySelector('.activity-text').textContent;
        console.log('Activity clicked:', text);
        showNotification('활동 상세 정보를 불러오는 중...', 'info');
        // Add navigation logic here
    });
});

// Action buttons handlers
const actionButtons = document.querySelectorAll('.action-btn');

actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const text = btn.textContent.trim();
        console.log('Action button clicked:', text);
        
        if (text.includes('설정')) {
            showNotification('설정 페이지로 이동합니다', 'info');
            // Navigate to settings
        } else if (text.includes('활동')) {
            showNotification('활동 내역을 불러오는 중...', 'info');
            // Navigate to activity history
        }
    });
});

// Dropdown menu interactions
const dropdownBtns = document.querySelectorAll('.dropdown-btn');
const dropdownItems = document.querySelectorAll('.dropdown-item');

dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const text = item.textContent.trim();
        console.log('Dropdown item clicked:', text);
        showNotification(`"${text}" 페이지로 이동합니다`, 'info');
        // Add navigation logic here
    });
});

// Logout button handler
const logoutBtn = document.querySelector('.logout-btn');

logoutBtn.addEventListener('click', () => {
    showNotification('로그아웃 중...', 'info');
    
    setTimeout(() => {
        console.log('User logged out');
        showNotification('로그아웃되었습니다', 'success');
        // Redirect to login page
        // window.location.href = '../login/index.html';
    }, 1000);
});

// Sparkles animation
const sparklesContainer = document.getElementById('sparkles');
const sparkleCount = 30;

function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.animationDelay = `${Math.random() * 3}s`;
    sparkle.style.animationDuration = `${2 + Math.random() * 2}s`;
    
    sparklesContainer.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 5000);
}

// Generate sparkles periodically
setInterval(() => {
    if (sparklesContainer.children.length < sparkleCount) {
        createSparkle();
    }
}, 200);

// Initial sparkles
for (let i = 0; i < sparkleCount; i++) {
    setTimeout(createSparkle, i * 100);
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

// Stat value count-up animation on page load
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        
        // Handle different formats (numbers vs points)
        if (element.textContent.includes('P')) {
            element.textContent = current.toLocaleString() + 'P';
        } else {
            element.textContent = current.toLocaleString();
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate stats on load
window.addEventListener('load', () => {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach((stat, index) => {
        const text = stat.textContent.trim();
        const value = parseInt(text.replace(/[^0-9]/g, ''));
        
        setTimeout(() => {
            animateValue(stat, 0, value, 1500);
        }, index * 100);
    });
});

// Mobile dropdown toggle
if (window.innerWidth <= 768) {
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const parent = btn.closest('.nav-item-dropdown');
            const menu = parent.querySelector('.dropdown-menu');
            
            // Close other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(m => {
                if (m !== menu) {
                    m.style.display = 'none';
                }
            });
            
            // Toggle current dropdown
            if (menu.style.display === 'block') {
                menu.style.display = 'none';
            } else {
                menu.style.display = 'block';
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    });
}
