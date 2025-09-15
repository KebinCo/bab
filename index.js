// Dark/Light mode toggle
const toggleButton = document.querySelector('.dark-light');
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});

// Sidebar menu interaction
document.querySelectorAll('.sidebar-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.sidebar-menu a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Header menu interaction
document.querySelectorAll('.header-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.header-menu a').forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
    });
});

// Feature cards hover effect
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Search functionality (placeholder)
const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        console.log('검색어:', e.target.value);
        // 실제 검색 기능은 여기에 구현
    }
});

// Auth button interactions
document.querySelectorAll('.auth-button').forEach(button => {
    button.addEventListener('click', () => {
        console.log(button.textContent + ' clicked');
        // 로그인/회원가입 모달 또는 페이지 이동 로직
    });
});
