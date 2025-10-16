// Animated gradient canvas background
const canvas = document.getElementById('gradient-canvas');
const ctx = canvas.getContext('2d');

let w, h;
let particles = [];
let mouse = { x: null, y: null };

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

// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
    updateThemeIcon();
}

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        
        updateThemeIcon();
        
        // Trigger canvas redraw with new colors
        animate();
    });
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
    }
}

// Particle system for silk-like flowing effect
class Particle {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.updateColor();
    }
    
    updateColor() {
        const isLight = document.body.classList.contains('light-mode');
        this.color = Math.random() > 0.5 
            ? (isLight ? 'rgba(138, 43, 226, 0.3)' : 'rgba(138, 43, 226, 0.4)')
            : (isLight ? 'rgba(218, 165, 32, 0.25)' : 'rgba(218, 165, 32, 0.3)');
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Mouse interaction
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
        
        // Boundary wrap
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
        
        // Velocity damping
        this.vx *= 0.99;
        this.vy *= 0.99;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particles
for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
}

// Animation loop
function animate() {
    const isLight = document.body.classList.contains('light-mode');
    
    // Create gradient background based on theme
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    if (isLight) {
        gradient.addColorStop(0, '#f8f9fa');
        gradient.addColorStop(0.5, '#e9ecef');
        gradient.addColorStop(1, '#f8f9fa');
    } else {
        gradient.addColorStop(0, '#0a0a14');
        gradient.addColorStop(0.5, '#12121e');
        gradient.addColorStop(1, '#0a0a14');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    
    // Update particle colors if theme changed
    particles.forEach(p => {
        if (p.needsColorUpdate) {
            p.updateColor();
            p.needsColorUpdate = false;
        }
    });
    
    // Update and draw particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    // Connect nearby particles
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 120) {
                const opacity = isLight ? 0.15 : 0.2;
                ctx.strokeStyle = `rgba(138, 43, 226, ${opacity * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });
    
    requestAnimationFrame(animate);
}

// Mark particles for color update on theme change
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        particles.forEach(p => p.needsColorUpdate = true);
    });
}

animate();

// Info block glow follow mouse
const infoBlocks = document.querySelectorAll('.info-block');

infoBlocks.forEach(block => {
    block.addEventListener('mousemove', (e) => {
        const rect = block.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const glow = block.querySelector('.block-glow');
        glow.style.left = `${x - glow.offsetWidth / 2}px`;
        glow.style.top = `${y - glow.offsetHeight / 2}px`;
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
        
        // Handle navigation
        const page = btn.dataset.page;
        const action = btn.dataset.action;
        
        if (page) {
            console.log(`Navigating to: ${page}`);
            // Add your navigation logic here
        }
        
        if (action) {
            console.log(`Action: ${action}`);
            // Add your auth logic here
        }
    });
});

// Add ripple animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(138, 43, 226, 0.5);
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
document.head.appendChild(style);

// Scroll-triggered shimmer intensity
window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const shimmer = document.querySelector('.shimmer-overlay');
    shimmer.style.opacity = 0.3 + (scrollPercent * 0.3);
});
