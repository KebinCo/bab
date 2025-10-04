const loginForm = document.getElementById('login-form');

// Form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Basic validation
    if (!email || !password) {
        alert('이메일과 비밀번호를 입력해주세요.');
        return;
    }
    
    // Collect login data
    const loginData = {
        email: email,
        password: password,
        remember: remember
    };
    
    console.log('Login attempt:', loginData);
    alert(`로그인 시도\n이메일: ${email}`);
    
    // Here you would typically send the data to your backend for authentication
    // fetch('/api/login', { 
    //     method: 'POST', 
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(loginData) 
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.success) {
    //         window.location.href = '/dashboard';
    //     } else {
    //         alert('로그인 실패: ' + data.message);
    //     }
    // });
});

// Forgot password link
document.querySelector('.forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    alert('비밀번호 찾기 기능은 곧 추가될 예정입니다.');
});
