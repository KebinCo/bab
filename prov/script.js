// Animated gradient canvas background with gold theme
const canvas = document.getElementById('gradient-canvas');
const ctx = canvas.getContext('2d');

let w, h;
let particles = [];
let mouse = { x: null, y: null };
let animationId = null;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);

// Track mouse movement for interactive shimmer
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Theme toggle functionality
const currentTheme = 'dark'; // Start with dark theme (gold background)
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        updateThemeIcon();
        
        // Update particle colors immediately
        particles.forEach(p => p.updateColor());
    });
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
    }
}

// Particle system for gold silk-like flowing effect
class Particle {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2.5 + 1;
        
        // Random movement parameters
        this.angle = Math.random() * Math.PI * 2;
        this.angleVelocity = (Math.random() - 0.5) * 0.02;
        this.randomForce = Math.random() * 0.02 + 0.01;
        
        this.updateColor();
    }
    
    updateColor() {
        const isLight = document.body.classList.contains('light-mode');
        // Gold and bronze particles
        const rand = Math.random();
        if (rand > 0.66) {
            this.color = isLight ? 'rgba(218, 165, 32, 0.5)' : 'rgba(218, 165, 32, 0.65)';
        } else if (rand > 0.33) {
            this.color = isLight ? 'rgba(205, 127, 50, 0.45)' : 'rgba(205, 127, 50, 0.6)';
        } else {
            this.color = isLight ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255, 215, 0, 0.55)';
        }
    }
    
    update() {
        // Add random movement
        this.angle += this.angleVelocity;
        this.vx += Math.cos(this.angle) * this.randomForce;
        this.vy += Math.sin(this.angle) * this.randomForce;
        
        // Mouse interaction - attract particles
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.vx += (dx / dist) * force * 0.1;
                this.vy += (dy / dist) * force * 0.1;
            }
        }
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Boundary wrap
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
        
        // Velocity damping
        this.vx *= 0.98;
        this.vy *= 0.98;
        
        // Keep minimum movement
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed < 0.1) {
            this.vx += (Math.random() - 0.5) * 0.05;
            this.vy += (Math.random() - 0.5) * 0.05;
        }
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    for (let i = 0; i < 120; i++) {
        particles.push(new Particle());
    }
}

initParticles();

// Animation loop
function animate() {
    const isLight = document.body.classList.contains('light-mode');
    
    // Create gradient background based on theme
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    if (isLight) {
        gradient.addColorStop(0, '#fffbf0');
        gradient.addColorStop(0.5, '#fff8e7');
        gradient.addColorStop(1, '#fffbf0');
    } else {
        gradient.addColorStop(0, '#0f0a05');
        gradient.addColorStop(0.5, '#1a1308');
        gradient.addColorStop(1, '#0f0a05');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    
    // Update and draw particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    // Connect nearby particles with gold lines
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 120) {
                const opacity = isLight ? 0.25 : 0.3;
                ctx.strokeStyle = `rgba(218, 165, 32, ${opacity * (1 - dist / 120)})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });
    
    animationId = requestAnimationFrame(animate);
}

// Start animation
animate();

// Section glow follow mouse
const userInfoSection = document.querySelector('.user-info-section');
const activitySection = document.querySelector('.activity-section');

function addSectionGlowEffect(section) {
    if (!section) return;
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
            glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(218, 165, 32, 0.3) 0%, transparent 70%)`;
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
    });
});

// Action buttons handlers
const actionButtons = document.querySelectorAll('.action-btn');

actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const text = btn.textContent.trim();
        console.log('Action button clicked:', text);
        
        if (text.includes('설정')) {
            showNotification('매장 설정 페이지로 이동합니다', 'info');
        } else if (text.includes('분석')) {
            showNotification('매출 분석을 불러오는 중...', 'info');
        }
    });
});

// Dropdown menu interactions
const dropdownItems = document.querySelectorAll('.dropdown-item');

dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const text = item.textContent.trim();
        console.log('Dropdown item clicked:', text);
        showNotification(`"${text}" 페이지로 이동합니다`, 'info');
    });
});

// Logout button handler
const logoutBtn = document.querySelector('.logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        showNotification('로그아웃 중...', 'info');
        
        setTimeout(() => {
            console.log('Supplier logged out');
            showNotification('로그아웃되었습니다', 'success');
        }, 1000);
    });
}

// Sparkles animation with gold theme
const sparklesContainer = document.getElementById('sparkles');
const sparkleCount = 40;

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
}, 150);

// Initial sparkles
for (let i = 0; i < sparkleCount; i++) {
    setTimeout(createSparkle, i * 80);
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
        background: rgba(25, 18, 8, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 12px;
        border: 1px solid rgba(218, 165, 32, 0.4);
        color: #f5e6d3;
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
        border-color: rgba(218, 165, 32, 0.6);
        box-shadow: 0 8px 32px rgba(218, 165, 32, 0.2);
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
        
        // Handle different formats
        const originalText = element.getAttribute('data-original');
        if (originalText && originalText.includes('.')) {
            element.textContent = (current / 10).toFixed(1);
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
        
        // Store original for decimal values
        if (text.includes('.')) {
            stat.setAttribute('data-original', text);
            const value = Math.floor(parseFloat(text) * 10);
            setTimeout(() => {
                animateValue(stat, 0, value, 1500);
            }, index * 100);
        } else {
            const value = parseInt(text.replace(/[^0-9]/g, ''));
            setTimeout(() => {
                animateValue(stat, 0, value, 1500);
            }, index * 100);
        }
    });
});

// Button interaction effects
const buttons = document.querySelectorAll('.nav-btn');

buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');
        
        btn.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation styles dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(218, 165, 32, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Mobile dropdown toggle
if (window.innerWidth <= 768) {
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');
    
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
