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
        this.startTime = Date.now();
        this.colors = [
            { r: 11, g: 27, b: 63 },    // deep navy
            { r: 30, g: 60, b: 120 },   // midnight blue
            { r: 50, g: 120, b: 180 },  // ocean blue
            { r: 79, g: 195, b: 247 },  // cyan
            { r: 120, g: 200, b: 255 }  // light cyan
        ];
        this.waves = [
            { offset: 0, speed: 0.00003, amplitude: 0.3 },
            { offset: 0.3, speed: 0.00005, amplitude: 0.25 },
            { offset: 0.6, speed: 0.00004, amplitude: 0.2 }
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
        const now = Date.now();
        const elapsed = now - this.startTime;
        
        // Base gradient
        const baseGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const shift = (elapsed * 0.000025) % 1; // Smooth 40 second loop
        
        for (let i = 0; i <= 5; i++) {
            const position = (i / 5 + shift) % 1;
            const color = this.getColorAt(position);
            baseGradient.addColorStop(i / 5, `rgb(${color.r}, ${color.g}, ${color.b})`);
        }
        
        ctx.fillStyle = baseGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Aurora wave layers
        this.waves.forEach((wave, index) => {
            const waveGradient = ctx.createRadialGradient(
                canvas.width * (0.5 + Math.sin(elapsed * wave.speed + wave.offset) * wave.amplitude),
                canvas.height * (0.5 + Math.cos(elapsed * wave.speed * 0.8 + wave.offset) * wave.amplitude),
                0,
                canvas.width * 0.5,
                canvas.height * 0.5,
                Math.max(canvas.width, canvas.height) * 0.8
            );
            
            const colorIndex = (index + Math.floor(elapsed * 0.0001)) % this.colors.length;
            const color = this.colors[colorIndex];
            
            waveGradient.addColorStop(0, `rgba(${color.r + 30}, ${color.g + 30}, ${color.b + 30}, 0.15)`);
            waveGradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.08)`);
            waveGradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            
            ctx.fillStyle = waveGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    start() {
        this.animate();
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
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm('로그아웃 하시겠습니까?')) {
            alert('로그아웃 되었습니다.');
            // window.location.href = 'login.html';
        }
    });
}

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
