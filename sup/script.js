const supplierBtn = document.getElementById('supplier-btn');
const consumerBtn = document.getElementById('consumer-btn');
const signupForm = document.getElementById('signup-form');

let selectedUserType = null;

// User type selection
supplierBtn.addEventListener('click', () => {
    selectedUserType = 'supplier';
    supplierBtn.classList.add('active');
    consumerBtn.classList.remove('active');
});

consumerBtn.addEventListener('click', () => {
    selectedUserType = 'consumer';
    consumerBtn.classList.add('active');
    supplierBtn.classList.remove('active');
});

// Form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!selectedUserType) {
        alert('공급자 또는 소비자를 선택해주세요.');
        return;
    }
    
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const termsAccepted = document.getElementById('terms').checked;
    
    // Validation
    if (password.length < 8) {
        alert('비밀번호는 8자 이상이어야 합니다.');
        return;
    }
    
    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }
    
    if (!termsAccepted) {
        alert('이용약관에 동의해주세요.');
        return;
    }
    
    // Collect form data
    const formData = {
        userType: selectedUserType,
        email: email,
        name: name,
        phone: phone,
        password: password
    };
    
    console.log('Form submitted:', formData);
    alert(`회원가입이 완료되었습니다!\n유저 타입: ${selectedUserType === 'supplier' ? '공급자' : '소비자'}`);
    
    // Here you would typically send the data to your backend
    // fetch('/api/signup', { method: 'POST', body: JSON.stringify(formData) })
});
