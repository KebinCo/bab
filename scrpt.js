const canvas = document.getElementById('gradient-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class GradientAnimation {
    constructor() {
        this.time = 0;
        this.colors = [
            { r: 20, g: 40, b: 100 },   // Deep blue
            { r: 30, g: 80, b: 150 },   // Medium blue
            { r: 50, g: 120, b: 200 },  // Light blue
            { r: 70, g: 140, b: 220 },  // Sky blue
            { r: 40, g: 90, b: 160 }    // Ocean blue
        ];
    }

    interpolateColor(color1, color2, factor) {
        return {
            r: Math.round(color1.r + (color2.r - color1.r) * factor),
            g: Math.round(color1.g + (color2.g - color1.g) * factor),
            b: Math.round(color1.b + (color2.b - color1.b) * factor)
        };
    }

    createGradient() {
        const gradient = ctx.createLinearGradient(
            0,
            0,
            canvas.width,
            canvas.height
        );

        const t = this.time * 0.0005;
        
        for (let i = 0; i < 5; i++) {
            const offset = i / 4;
            const colorIndex = Math.floor((i + t) % this.colors.length);
            const nextColorIndex = (colorIndex + 1) % this.colors.length;
            const factor = ((i + t) % 1);
            
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

    createRadialGradients() {
        const gradients = [];
        const numGradients = 3;
        
        for (let i = 0; i < numGradients; i++) {
            const x = canvas.width * (0.3 + Math.sin(this.time * 0.0003 + i * 2) * 0.3);
            const y = canvas.height * (0.3 + Math.cos(this.time * 0.0004 + i * 2) * 0.3);
            const radius = Math.min(canvas.width, canvas.height) * 0.5;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            
            const colorIndex = (i + Math.floor(this.time * 0.001)) % this.colors.length;
            const color = this.colors[colorIndex];
            
            gradient.addColorStop(0, `rgba(${color.r + 30}, ${color.g + 30}, ${color.b + 30}, 0.3)`);
            gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            
            gradients.push(gradient);
        }
        
        return gradients;
    }

    animate() {
        ctx.fillStyle = this.createGradient();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const radialGradients = this.createRadialGradients();
        radialGradients.forEach(gradient => {
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
        
        this.time++;
        requestAnimationFrame(() => this.animate());
    }
}

const animation = new GradientAnimation();
animation.animate();
