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
        }, 150);
    }, 150);
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




// Feedback Page

// State
let selectedIssues = [];
let selectedSeverity = null;

// DOM elements
const feedbackForm = document.getElementById('feedback-form');
const feedbackContent = document.getElementById('feedback-content');
const charCount = document.getElementById('char-count');
const cancelBtn = document.getElementById('cancel-btn');
const responseWantedCheckbox = document.getElementById('response-wanted');
const contactInfo = document.getElementById('contact-info');
const anonymousCheckbox = document.getElementById('anonymous');

// Character counter
feedbackContent.addEventListener('input', (e) => {
    const length = e.target.value.length;
    charCount.textContent = length;
    
    if (length > 1000) {
        charCount.style.color = '#ef4444';
        e.target.value = e.target.value.substring(0, 1000);
        charCount.textContent = 1000;
    } else {
        charCount.style.color = '#808090';
    }
});

// Issue categories tracking
const issueCheckboxes = document.querySelectorAll('input[name="issue"]');

issueCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            selectedIssues.push(e.target.value);
        } else {
            selectedIssues = selectedIssues.filter(issue => issue !== e.target.value);
        }
        console.log('Selected issues:', selectedIssues);
    });
});

// Severity tracking
const severityRadios = document.querySelectorAll('input[name="severity"]');

severityRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        selectedSeverity = e.target.value;
        console.log('Selected severity:', selectedSeverity);
    });
});

// Show/hide contact info
responseWantedCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        contactInfo.style.display = 'block';
        document.getElementById('contact-email').required = true;
    } else {
        contactInfo.style.display = 'none';
        document.getElementById('contact-email').required = false;
    }
});

// Anonymous checkbox handling
anonymousCheckbox.addEventListener('change', (e) => {
    if (!e.target.checked && responseWantedCheckbox.checked) {
        if (!confirm('익명 해제 시 운영자가 귀하의 정보를 확인할 수 있습니다. 계속하시겠습니까?')) {
            e.target.checked = true;
        }
    }
});

// Form validation
function validateForm() {
    const restaurantName = document.getElementById('restaurant-name').value.trim();
    const location = document.getElementById('location').value.trim();
    const feedbackTitle = document.getElementById('feedback-title').value.trim();
    const feedbackText = feedbackContent.value.trim();
    
    if (!restaurantName) {
        showNotification('음식점 이름을 입력해주세요', 'error');
        return false;
    }
    
    if (!location) {
        showNotification('위치를 입력해주세요', 'error');
        return false;
    }
    
    if (selectedIssues.length === 0) {
        showNotification('최소 하나의 개선 필요 항목을 선택해주세요', 'error');
        return false;
    }
    
    if (!selectedSeverity) {
        showNotification('문제 심각도를 선택해주세요', 'error');
        return false;
    }
    
    if (!feedbackTitle) {
        showNotification('피드백 제목을 입력해주세요', 'error');
        return false;
    }
    
    if (!feedbackText) {
        showNotification('구체적인 상황 설명을 입력해주세요', 'error');
        return false;
    }
    
    if (feedbackText.length < 50) {
        showNotification('상황 설명을 50자 이상 작성해주세요 (현재: ' + feedbackText.length + '자)', 'error');
        return false;
    }
    
    if (responseWantedCheckbox.checked) {
        const email = document.getElementById('contact-email').value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('유효한 이메일 주소를 입력해주세요', 'error');
            return false;
        }
    }
    
    return true;
}

// Form submission
feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const formData = {
        restaurantName: document.getElementById('restaurant-name').value.trim(),
        location: document.getElementById('location').value.trim(),
        visitDate: document.getElementById('visit-date').value,
        issues: selectedIssues,
        severity: selectedSeverity,
        title: document.getElementById('feedback-title').value.trim(),
        description: feedbackContent.value.trim(),
        improvement: document.getElementById('improvement-suggestion').value.trim(),
        anonymous: anonymousCheckbox.checked,
        wantResponse: responseWantedCheckbox.checked,
        publicShare: document.getElementById('public-share').checked,
        contactEmail: responseWantedCheckbox.checked ? document.getElementById('contact-email').value.trim() : null,
        timestamp: new Date().toISOString()
    };
    
    console.log('Feedback data:', formData);
    
    // Simulate submission
    const submitBtn = feedbackForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.querySelector('.btn-text').textContent = '제출 중...';
    
    setTimeout(() => {
        showNotification('피드백이 성공적으로 제출되었습니다!', 'success');
        
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.querySelector('.btn-text').textContent = '피드백 제출';
        
        // Show confirmation message
        setTimeout(() => {
            showNotification('음식점 운영자에게 전달되었습니다', 'info');
            
            // Reset or redirect
            setTimeout(() => {
                // window.location.href = '../dashboard/index.html';
                console.log('Would redirect to dashboard');
            }, 1500);
        }, 1000);
    }, 2000);
});

// Cancel button
cancelBtn.addEventListener('click', () => {
    if (confirm('작성 중인 내용이 모두 사라집니다. 정말 취소하시겠습니까?')) {
        showNotification('작성이 취소되었습니다', 'info');
        setTimeout(() => {
            // window.history.back();
            console.log('Would go back');
        }, 1000);
    }
});

// Section glow effect
function addSectionGlowEffect(section) {
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

const formContainer = document.querySelector('.feedback-form-container');
addSectionGlowEffect(formContainer);

// Navbar dropdown handlers
const dropdownItems = document.querySelectorAll('.dropdown-item');

dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const text = item.textContent.trim();
        console.log('Dropdown item clicked:', text);
        showNotification(`"${text}" 페이지로 이동합니다`, 'info');
    });
});

// Logout button
const logoutBtn = document.querySelector('.logout-btn');

logoutBtn.addEventListener('click', () => {
    showNotification('로그아웃 중...', 'info');
    setTimeout(() => {
        showNotification('로그아웃되었습니다', 'success');
    }, 1000);
});

// Mobile dropdown toggle
if (window.innerWidth <= 768) {
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');
    
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const parent = btn.closest('.nav-item-dropdown');
            const menu = parent.querySelector('.dropdown-menu');
            
            document.querySelectorAll('.dropdown-menu').forEach(m => {
                if (m !== menu) m.style.display = 'none';
            });
            
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    });
    
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    });
}

// Auto-save draft
let autoSaveInterval;
let hasStartedTyping = false;

function saveDraft() {
    const draftData = {
        restaurantName: document.getElementById('restaurant-name').value,
        location: document.getElementById('location').value,
        issues: selectedIssues,
        severity: selectedSeverity,
        title: document.getElementById('feedback-title').value,
        content: feedbackContent.value,
        timestamp: new Date().toISOString()
    };
    
    console.log('Draft saved:', draftData);
    showNotification('임시 저장되었습니다', 'info');
}

feedbackContent.addEventListener('input', () => {
    if (!hasStartedTyping && feedbackContent.value.length > 10) {
        hasStartedTyping = true;
        autoSaveInterval = setInterval(saveDraft, 60000); // Save every minute
        console.log('Auto-save enabled');
    }
});

// Clear auto-save on submit or cancel
feedbackForm.addEventListener('submit', () => {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
});

cancelBtn.addEventListener('click', () => {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
});

// Keyboard shortcut to save draft (Ctrl/Cmd + S)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (feedbackContent.value.length > 0) {
            saveDraft();
        }
    }
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

// Set today as max date for visit date
const visitDateInput = document.getElementById('visit-date');
const today = new Date().toISOString().split('T')[0];
visitDateInput.setAttribute('max', today);

// Add helpful hints based on severity selection
severityRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        const severity = e.target.value;
        const hints = {
            minor: '작은 개선사항이라도 소중한 피드백입니다. 구체적으로 작성해주세요.',
            moderate: '개선이 필요한 부분을 자세히 설명해주시면 큰 도움이 됩니다.',
            serious: '심각한 문제입니다. 상황을 자세히 설명해주시면 빠른 개선이 이루어질 수 있습니다.',
            critical: '매우 심각한 문제입니다. 가능한 한 구체적으로 상황을 설명해주세요.'
        };
        
        if (hints[severity]) {
            showNotification(hints[severity], 'info');
        }
    });
});





