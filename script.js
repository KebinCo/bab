const canvas = document.getElementById('gradient-canvas');
const ctx = canvas.getContext('2d');

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setCanvasSize();
window.addEventListener('resize', setCanvasSize);

class GradientBackground {
    constructor() {
        this.time = 0;
        this.colors = [
            [15, 35, 85],
            [25, 70, 140],
            [35, 100, 180],
            [50, 130, 210],
            [30, 80, 150]
        ];
        this.orbs = [
            { x: 0.2, y: 0.3, dx: 0.0001, dy: 0.00015, radius: 0.5 },
            { x: 0.7, y: 0.6, dx: -0.00012, dy: 0.0001, radius: 0.4 },
            { x: 0.5, y: 0.8, dx: 0.00015, dy: -0.0001, radius: 0.45 },
            { x: 0.9, y: 0.2, dx: -0.0001, dy: -0.00012, radius: 0.35 }
        ];
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    getColor(index, offset = 0) {
        const i = Math.floor(index + offset) % this.colors.length;
        const next = (i + 1) % this.colors.length;
        const t = (index + offset) % 1;
        
        return [
            Math.round(this.lerp(this.colors[i][0], this.colors[next][0], t)),
            Math.round(this.lerp(this.colors[i][1], this.colors[next][1], t)),
            Math.round(this.lerp(this.colors[i][2], this.colors[next][2], t))
        ];
    }

    drawBackground() {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const t = this.time * 0.00002;
        
        for (let i = 0; i <= 4; i++) {
            const stop = i / 4;
            const colorIndex = t + i * 0.5;
            const [r, g, b] = this.getColor(colorIndex);
            gradient.addColorStop(stop, `rgb(${r}, ${g}, ${b})`);
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    updateOrbs() {
        this.orbs.forEach(orb => {
            orb.x += orb.dx;
            orb.y += orb.dy;
            
            if (orb.x < -0.2 || orb.x > 1.2) orb.dx *= -1;
            if (orb.y < -0.2 || orb.y > 1.2) orb.dy *= -1;
        });
    }

    drawOrbs() {
        this.orbs.forEach((orb, index) => {
            const x = orb.x * canvas.width;
            const y = orb.y * canvas.height;
            const radius = orb.radius * Math.min(canvas.width, canvas.height);
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            const [r, g, b] = this.colors[index % this.colors.length];
            
            gradient.addColorStop(0, `rgba(${r + 40}, ${g + 40}, ${b + 40}, 0.4)`);
            gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.2)`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
    }

    animate() {
        this.drawBackground();
        this.updateOrbs();
        this.drawOrbs();
        
        this.time++;
        requestAnimationFrame(() => this.animate());
    }

    start() {
        this.animate();
    }
}

const bg = new GradientBackground();
bg.start();
