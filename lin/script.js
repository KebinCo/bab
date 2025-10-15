// Login page specific interactions

// Card glow follow mouse
const loginCard = document.querySelector('.login-card');
const cardGlow = document.querySelector('.card-glow');

if (loginCard && cardGlow) {
    loginCard.addEventListener('mousemove', (e) => {
        const rect = loginCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        cardGlow.style.left = `${x - cardGlow.offsetWidth / 2}px`;
        cardGlow.style.top = `${y - cardGlow.offsetHeight / 2}px`;
    });
}

// Form validation and submission
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Real-time validation feedback
emailInput.addEventListener('input', (e) => {
    const email = e.target.value;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    if (email.length > 0) {
        if (isValid) {
            emailInput.style.borderColor = 'rgba(34, 197, 94, 0.6)';
        } else {
            emailInput.style.borderColor = 'rgba(239, 68, 68, 0.6)';
        }
    } else {
        emailInput.style.borderColor = 'rgba(138, 43, 226, 0.2)';
    }
});

passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    
    if (password.length > 0) {
        if (password.length >= 6) {
            passwordInput.style.borderColor = 'rgba(34, 197, 94, 0.6)';
        } else {
            passwordInput.style.borderColor = 'rgba(239, 68, 68, 0.6)';
        }
    } else {
        passwordInput.style.borderColor = 'rgba(138, 43, 226, 0.2)';
    }
});

// Form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = document.getElementById('remember').checked;
    
    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Simulate login process
    const submitBtn = loginForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.querySelector('.btn-text').textContent = '로그인 중...';
    
    // Simulate API call
    setTimeout(() => {
        console.log('Login attempt:', { email, remember });
        showNotification('로그인 성공!', 'success');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.querySelector('.btn-text').textContent = '로그인';
        
        // Redirect or handle successful login
        // window.location.href = '../dashboard/index.html';
    }, 1500);
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
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

// Input focus animations
const inputs = document.querySelectorAll('.form-group input');

inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Forgot password handler
const forgotPasswordLink = document.querySelector('.forgot-password');

forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('비밀번호 재설정 링크를 이메일로 전송합니다', 'info');
    console.log('Forgot password clicked');
    // Add your password reset logic here
});
