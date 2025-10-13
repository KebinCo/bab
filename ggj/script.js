// Simple CSS-based Aurora Background (no heavy canvas rendering)
const body = document.body;

// Create simple gradient background with CSS animation
const style = document.createElement('style');
style.textContent = `
    body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        background: linear-gradient(135deg, 
            #0b1b3f 0%,
            #1e3a5f 25%,
            #2a5a8f 50%,
            #4fc3f7 75%,
            #78c8ff 100%
        );
        background-size: 400% 400%;
        animation: aurora-gradient 40s ease infinite;
    }
    
    @keyframes aurora-gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;
document.head.appendChild(style);

// Remove canvas (not needed anymore)
const canvas = document.getElementById('aurora-canvas');
if (canvas) {
    canvas.remove();
}

// Simple sparkles with CSS only
const sparklesContainer = document.getElementById('sparkles');
const numSparkles = 30; // Reduced from 50

for (let i = 0; i < numSparkles; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 3 + 's';
    sparkle.style.animationDuration = (2 + Math.random() * 2) + 's';
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

// Simple scroll reveal (no Intersection Observer needed)
window.addEventListener('scroll', () => {
    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        
        if (isVisible && el.style.opacity !== '1') {
            el.style.opacity = '1';
            el.style.filter = 'blur(0)';
            el.style.transform = 'translateY(0)';
        }
    });
}, { passive: true });

// Trigger initial scroll check
window.dispatchEvent(new Event('scroll'));
