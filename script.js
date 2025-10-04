const canvas = document.getElementById('gradient-canvas');
const ctx = canvas.getContext('2d');

let animationId = null;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
 
window.addEventListener('resize', () => {
    resizeCanvas();
});

class GradientAnimation {
    constructor() {
        this.time = 0;
        this.lastFrame = Date.now();
        this.colors = [
            { r: 15, g: 35, b: 85 },    // Deep navy blue
            { r: 25, g: 70, b: 140 },   // Deep blue
            { r: 35, g: 100, b: 180 },  // Medium blue
            { r: 50, g: 130, b: 210 },  // Light blue
            { r: 30, g: 80, b: 150 }    // Ocean blue
        ];
        this.orbs = [];
        this.initOrbs();
    }

    initOrbs() {
        for (let i = 0; i < 4; i++) {
            this.orbs.push({
                x: Math.random(),
                y: Math.random(),
                speedX: 0.00005 + Math.random() * 0.00015,
                speedY: 0.00005 + Math.random() * 0.00015,
                size: 0.4 + Math.random() * 0.3,
                colorIndex: i % this.colors.length
            });
        }
    }

    interpolateColor(color1, color2, factor) {
        return {
            r: Math.round(color1.r + (color2.r - color1.r) * factor),
            g: Math.round(color1.g + (color2.g - color1.g) * factor),
            b: Math.round(color1.b + (color2.b - color1.b) * factor)
        };
    }

    createBaseGradient() {
        const gradient = ctx.createLinearGradient(
            0,
            0,
            canvas.width,
            canvas.height
        );

        const t = (this.time * 0.00005) % 1;
        
        for (let i = 0; i <= 4; i++) {
            const offset = i / 4;
            const colorIndex = Math.floor(t * this.colors.length + i) % this.colors.length;
            const nextColorIndex = (colorIndex + 1) % this.colors.length;
            const factor = (t * this.colors.length + i) % 1;
            
            const color = this.interpolateColor(
                this.colors[colorIndex],
                this.colors[nextColorIndex],
                factor
            );
            
            gradient.addColorStop(
                offset,
                `rgb(${color.r}, ${color.g}, ${color.b})`
            );
        }

        return gradient;
    }

    updateOrbs(deltaTime) {
        this.orbs.forEach(orb => {
            orb.x += orb.speedX * deltaTime;
            orb.y += orb.speedY * deltaTime;
            
            if (orb.x > 1.2) orb.x = -0.2;
            if (orb.x < -0.2) orb.x = 1.2;
            if (orb.y > 1.2) orb.y = -0.2;
            if (orb.y < -0.2) orb.y = 1.2;
        });
    }

    drawOrbs() {
        this.orbs.forEach(orb => {
            const x = orb.x * canvas.width;
            const y = orb.y * canvas.height;
            const radius = orb.size * Math.min(canvas.width, canvas.height) * 0.6;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            
            const color = this.colors[orb.colorIndex];
            const brightColor = {
                r: Math.min(255, color.r + 40),
                g: Math.min(255, color.g + 40),
                b: Math.min(255, color.b + 40)
            };
            
            gradient.addColorStop(0, `rgba(${brightColor.r}, ${brightColor.g}, ${brightColor.b}, 0.4)`);
            gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`);
            gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
    }

    animate() {
        const now = Date.now();
        const deltaTime = now - this.lastFrame;
        this.lastFrame = now;
        
        // Draw base gradient
        ctx.fillStyle = this.createBaseGradient();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw orbs
        this.updateOrbs(deltaTime);
        this.drawOrbs();
        
        this.time += deltaTime;
        
        animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        if (!animationId) {
            this.lastFrame = Date.now();
            this.animate();
        }
    }

    stop() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
}

const animation = new GradientAnimation();
animation.start();

// Handle page visibility to prevent background tab issues
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        animation.stop();
    } else {
        animation.start();
    }
});
