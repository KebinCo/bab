// Aurora Background Animation
const canvas = document.getElementById('aurora-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class AuroraBackground {
    constructor() {
        this.time = 0;
        this.colors = [
            { r: 11, g: 27, b: 63 },    // deep navy
            { r: 30, g: 60, b: 120 },   // midnight blue
            { r: 50, g: 120, b: 180 },  // ocean blue
            { r: 79, g: 195, b: 247 },  // cyan
            { r: 120, g: 200, b: 255 }  // light cyan
        ];
    }

    interpolate(a, b, factor) {
        return a + (b - a) * factor;
    }

    getColorAt(position) {
        const index = position * (this.colors.length - 1);
        const i = Math.floor(index);
        const next = Math.min(i + 1, this.colors.length - 1);
        const factor = index - i;
        
        return {
            r: Math.round(this.interpolate(this.colors[i].r, this.colors[next].r, factor)),
            g: Math.round(this.interpolate(this.colors[i].g, this.colors[next].g, factor)),
            b: Math.round(this.interpolate(this.colors[i].b, this.colors[next].b, factor))
        };
    }

    draw() {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        
        // Slow hue transition (40 second loop)
        const shift = (this.time % 40000) / 40000;
        
        for (let i = 0; i <= 10; i++) {
            const position = (i / 10 + shift) % 1;
            const color = this.getColorAt(position);
            gradient.addColorStop(i / 10, `rgb(${color.r}, ${color.g}, ${color.b})`);
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    animate(timestamp) {
        this.time = timestamp;
        this.draw();
        requestAnimationFrame((t) => this.animate(t));
    }

    start() {
        requestAnimationFrame((t) => this.animate(t));
    }
}

const aurora = new AuroraBackground();
aurora.start();

// Sparkles Effect
const sparklesContainer = document.getElementById('sparkles');
const numSparkles = 50;

for (let i = 0; i < numSparkles; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 3 + 's';
    sparklesContainer.appendChild(sparkle);
}

// Logout functionality
const logoutBtn = document.querySelector('.logout-btn');
logoutBtn.addEventListener('click', () => {
    if (confirm('로그아웃 하시겠습니까?')) {
        alert('로그아웃 되었습니다.');
        // window.location.href = 'login.html';
    }
});

// Action buttons
const actionButtons = document.querySelectorAll('.action-btn');
actionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const text = e.currentTarget.textContent.trim();
        
        if (text.includes('설정 변경')) {
            alert('설정 페이지로 이동합니다.');
            // window.location.href = 'settings.html';
        } else if (text.includes('활동 내역')) {
            alert('활동 내역 페이지로 이동합니다.');
            // window.location.href = 'activity.html';
        }
    });
});

// Dropdown menu items
const dropdownItems = document.querySelectorAll('.dropdown-item');
dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const text = e.target.textContent;
        alert(`"${text}" 페이지로 이동합니다.`);
    });
});

// Activity items interaction
const activityItems = document.querySelectorAll('.activity-item');
activityItems.forEach(item => {
    item.addEventListener('click', () => {
        const activityText = item.querySelector('.activity-text').textContent;
        alert(`활동 상세: ${activityText}`);
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.filter = 'blur(0)';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all fade-in elements
const fadeElements = document.querySelectorAll('.fade-in-up');
fadeElements.forEach(el => observer.observe(el));
