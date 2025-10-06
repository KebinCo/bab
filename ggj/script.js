// Logout functionality
const logoutBtn = document.querySelector('.logout-btn');
logoutBtn.addEventListener('click', () => {
    if (confirm('로그아웃 하시겠습니까?')) {
        alert('로그아웃 되었습니다.');
        // Redirect to login page
        // window.location.href = 'login.html';
    }
});

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
        // Handle navigation based on the clicked item
    });
});

// Activity items interaction
const activityItems = document.querySelectorAll('.activity-item');
activityItems.forEach(item => {
    item.addEventListener('click', () => {
        const activityText = item.querySelector('.activity-text').textContent;
        alert(`활동 상세: ${activityText}`);
        // Show activity details
    });
});
