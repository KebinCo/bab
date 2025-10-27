// Signup page specific interactions

// Card glow follow mouse
const signupCard = document.querySelector('.signup-card');
const cardGlow = document.querySelector('.card-glow');

if (signupCard && cardGlow) {
    signupCard.addEventListener('mousemove', (e) => {
        const rect = signupCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        cardGlow.style.left = `${x - cardGlow.offsetWidth / 2}px`;
        cardGlow.style.top = `${y - cardGlow.offsetHeight / 2}px`;
    });
}

// User type selection
const typeButtons = document.querySelectorAll('.type-btn');
let selectedType = null;

typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        typeButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedType = btn.dataset.type;
        console.log('Selected user type:', selectedType);
    });
});

// Form inputs
const signupForm = document.getElementById('signup-form');
const emailInput = document.getElementById('email');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('password-confirm');
const termsCheckbox = document.getElementById('terms');
const strengthBar = document.querySelector('.strength-bar');

// Email validation
emailInput.addEventListener('input', (e) => {
    const email = e.target.value;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    if (email.length > 0) {
        emailInput.style.borderColor = isValid 
            ? 'rgba(34, 197, 94, 0.6)' 
            : 'rgba(239, 68, 68, 0.6)';
    } else {
        emailInput.style.borderColor = 'rgba(138, 43, 226, 0.2)';
    }
});

// Name validation (Korean/English only)
nameInput.addEventListener('input', (e) => {
    const name = e.target.value;
    const isValid = /^[가-힣a-zA-Z\s]+$/.test(name);
    
    if (name.length > 0) {
        nameInput.style.borderColor = isValid && name.length >= 2
            ? 'rgba(34, 197, 94, 0.6)'
            : 'rgba(239, 68, 68, 0.6)';
    } else {
        nameInput.style.borderColor = 'rgba(138, 43, 226, 0.2)';
    }
});

// Phone number formatting and validation
phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    
    // Format: 010-1234-5678
    if (value.length >= 7) {
        value = value.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{0,4})/, '$1-$2');
    }
    
    e.target.value = value;
    
    const isValid = /^010-\d{4}-\d{4}$/.test(value);
    phoneInput.style.borderColor = value.length > 0
        ? (isValid ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)')
        : 'rgba(138, 43, 226, 0.2)';
});

// Password strength checker
passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;
    
    strengthBar.style.width = `${strength}%`;
    
    if (password.length > 0) {
        passwordInput.style.borderColor = password.length >= 8
            ? 'rgba(34, 197, 94, 0.6)'
            : 'rgba(239, 68, 68, 0.6)';
    } else {
        passwordInput.style.borderColor = 'rgba(138, 43, 226, 0.2)';
        strengthBar.style.width = '0';
    }
    
    // Check password match if confirm field has value
    if (passwordConfirmInput.value.length > 0) {
        checkPasswordMatch();
    }
});

// Password confirmation
function checkPasswordMatch() {
    const password = passwordInput.value;
    const confirm = passwordConfirmInput.value;
    
    if (confirm.length > 0) {
        passwordConfirmInput.style.borderColor = password === confirm
            ? 'rgba(34, 197, 94, 0.6)'
            : 'rgba(239, 68, 68, 0.6)';
    } else {
        passwordConfirmInput.style.borderColor = 'rgba(138, 43, 226, 0.2)';
    }
}

passwordConfirmInput.addEventListener('input', checkPasswordMatch);

// Form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate user type selection
    if (!selectedType) {
        showNotification('공급자 또는 소비자를 선택해주세요', 'error');
        return;
    }
    
    // Get form values
    const email = emailInput.value.trim();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    const termsAccepted = termsCheckbox.checked;
    
    // Validation
    if (!email || !name || !phone || !password || !passwordConfirm) {
        showNotification('모든 필드를 입력해주세요', 'error');
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('유효한 이메일 주소를 입력해주세요', 'error');
        return;
    }
    
    if (!/^[가-힣a-zA-Z\s]+$/.test(name) || name.length < 2) {
        showNotification('이름은 2자 이상의 한글 또는 영문이어야 합니다', 'error');
        return;
    }
    
    if (!/^010-\d{4}-\d{4}$/.test(phone)) {
        showNotification('올바른 전화번호 형식을 입력해주세요 (010-1234-5678)', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('비밀번호는 8자 이상이어야 합니다', 'error');
        return;
    }
    
    if (password !== passwordConfirm) {
        showNotification('비밀번호가 일치하지 않습니다', 'error');
        return;
    }
    
    if (!termsAccepted) {
        showNotification('이용약관에 동의해주세요', 'error');
        return;
    }
    
    // Store the selected type before processing
    const userType = selectedType;
    console.log('Selected type before redirect:', userType);
    
    // Simulate signup process
    const submitBtn = signupForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.querySelector('.btn-text').textContent = '가입 처리 중...';
    
    // Simulate API call
    setTimeout(() => {
        console.log('Signup data:', {
            userType: userType,
            email,
            name,
            phone,
            termsAccepted
        });
        
        showNotification('회원가입이 완료되었습니다!', 'success');
        
        // Redirect based on user type
        setTimeout(() => {
            console.log('Redirecting for user type:', userType);
            
            if (userType === 'supplier') {
                console.log('Redirecting to supplier page...');
                window.location.href = 'https://kebinco.github.io/bab/prov/index.html';
            } else if (userType === 'consumer') {
                console.log('Redirecting to consumer page...');
                window.location.href = 'https://kebinco.github.io/bab/sbj/index.html';
            } else {
                console.error('No valid user type selected:', userType);
                showNotification('사용자 유형을 다시 선택해주세요', 'error');
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.querySelector('.btn-text').textContent = '가입하기';
            }
        }, 1500);
    }, 1500);
});

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
    }, 3500);
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
        max-width: 320px;
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
