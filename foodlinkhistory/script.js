// FoodLink Transaction History Page Script

// Sample transactions data
const transactions = [
    {
        id: 'TX2024100145',
        date: '2024-10-15',
        supplier: '신선농산',
        items: [
            { icon: '🧅', name: '양파', quantity: '50kg' },
            { icon: '🥕', name: '당근', quantity: '30kg' }
        ],
        amount: 245000,
        status: 'completed'
    },
    {
        id: 'TX2024100132',
        date: '2024-10-14',
        supplier: '한마음 농장',
        items: [
            { icon: '🥩', name: '돼지고기', quantity: '25kg' }
        ],
        amount: 450000,
        status: 'completed'
    },
    {
        id: 'TX2024100128',
        date: '2024-10-13',
        supplier: '금강농산물',
        items: [
            { icon: '🥔', name: '감자', quantity: '40kg' },
            { icon: '🧄', name: '마늘', quantity: '15kg' }
        ],
        amount: 198000,
        status: 'pending'
    },
    {
        id: 'TX2024100115',
        date: '2024-10-12',
        supplier: '푸른들 직거래',
        items: [
            { icon: '🌾', name: '쌀', quantity: '100kg' }
        ],
        amount: 320000,
        status: 'completed'
    },
    {
        id: 'TX2024100109',
        date: '2024-10-11',
        supplier: '대박농수산',
        items: [
            { icon: '🐟', name: '고등어', quantity: '20kg' },
            { icon: '🦐', name: '새우', quantity: '10kg' }
        ],
        amount: 385000,
        status: 'completed'
    },
    {
        id: 'TX2024100098',
        date: '2024-10-10',
        supplier: '자연마당',
        items: [
            { icon: '🥬', name: '배추', quantity: '30kg' }
        ],
        amount: 125000,
        status: 'pending'
    },
    {
        id: 'TX2024100087',
        date: '2024-10-09',
        supplier: '농부의 마음',
        items: [
            { icon: '🌿', name: '대파', quantity: '20kg' },
            { icon: '🧅', name: '양파', quantity: '35kg' }
        ],
        amount: 168000,
        status: 'completed'
    },
    {
        id: 'TX2024100076',
        date: '2024-10-08',
        supplier: '햇살농장',
        items: [
            { icon: '🍗', name: '닭고기', quantity: '40kg' }
        ],
        amount: 280000,
        status: 'cancelled'
    },
    {
        id: 'TX2024100065',
        date: '2024-10-07',
        supplier: '초록마을',
        items: [
            { icon: '🥛', name: '우유', quantity: '50L' },
            { icon: '🧈', name: '버터', quantity: '10kg' }
        ],
        amount: 215000,
        status: 'completed'
    },
    {
        id: 'TX2024100054',
        date: '2024-10-06',
        supplier: '산들농원',
        items: [
            { icon: '🍎', name: '사과', quantity: '25kg' }
        ],
        amount: 145000,
        status: 'completed'
    },
    {
        id: 'TX2024100043',
        date: '2024-10-05',
        supplier: '별빛농장',
        items: [
            { icon: '🥩', name: '소고기', quantity: '15kg' }
        ],
        amount: 625000,
        status: 'pending'
    },
    {
        id: 'TX2024100032',
        date: '2024-10-04',
        supplier: '황금들판',
        items: [
            { icon: '🌶️', name: '고추', quantity: '10kg' },
            { icon: '🧄', name: '마늘', quantity: '20kg' }
        ],
        amount: 195000,
        status: 'completed'
    }
];

// State
let currentPage = 1;
const itemsPerPage = 5;
let filteredTransactions = [...transactions];

// DOM Elements
const transactionsList = document.getElementById('transactionsList');
const periodFilter = document.getElementById('periodFilter');
const statusFilter = document.getElementById('statusFilter');
const sortFilter = document.getElementById('sortFilter');
const searchInput = document.getElementById('searchInput');
const exportBtn = document.getElementById('exportBtn');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const pageNumbers = document.getElementById('pageNumbers');
const sidebarBtns = document.querySelectorAll('.sidebar-btn');
const sidebar = document.getElementById('foodlinkSidebar');

// Stats elements
const totalTransactionsEl = document.getElementById('totalTransactions');
const totalAmountEl = document.getElementById('totalAmount');
const completedTransactionsEl = document.getElementById('completedTransactions');
const pendingTransactionsEl = document.getElementById('pendingTransactions');

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    renderTransactions();
    setupEventListeners();
    setupSidebarScroll();
});

// Update statistics
function updateStats() {
    const completed = transactions.filter(t => t.status === 'completed').length;
    const pending = transactions.filter(t => t.status === 'pending').length;
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    totalTransactionsEl.textContent = transactions.length;
    totalAmountEl.textContent = total.toLocaleString() + '원';
    completedTransactionsEl.textContent = completed;
    pendingTransactionsEl.textContent = pending;
}

// Setup event listeners
function setupEventListeners() {
    // Filters
    periodFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
    
    // Search
    searchInput.addEventListener('input', debounce(applyFilters, 300));
    
    // Export button
    exportBtn.addEventListener('click', () => {
        showNotification('거래 내역을 내보내는 중...', 'info');
        setTimeout(() => {
            showNotification('거래 내역이 내보내기 완료되었습니다', 'success');
        }, 1000);
    });
    
    // Pagination
    prevPage.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTransactions();
        }
    });
    
    nextPage.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTransactions();
        }
    });
    
    // Sidebar buttons
    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            
            sidebarBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            showNotification(`${btn.querySelector('.sidebar-label').textContent} 페이지로 이동`, 'info');
        });
    });
}

// Apply filters
function applyFilters() {
    let filtered = [...transactions];
    
    // Period filter
    const period = periodFilter.value;
    if (period !== 'all') {
        const today = new Date();
        const filterDate = new Date();
        
        switch(period) {
            case 'week':
                filterDate.setDate(today.getDate() - 7);
                break;
            case 'month':
                filterDate.setMonth(today.getMonth() - 1);
                break;
            case '3months':
                filterDate.setMonth(today.getMonth() - 3);
                break;
            case 'year':
                filterDate.setFullYear(today.getFullYear() - 1);
                break;
        }
        
        filtered = filtered.filter(t => new Date(t.date) >= filterDate);
    }
    
    // Status filter
    const status = statusFilter.value;
    if (status !== 'all') {
        filtered = filtered.filter(t => t.status === status);
    }
    
    // Search filter
    const search = searchInput.value.toLowerCase().trim();
    if (search) {
        filtered = filtered.filter(t => 
            t.supplier.toLowerCase().includes(search) ||
            t.items.some(item => item.name.toLowerCase().includes(search)) ||
            t.id.toLowerCase().includes(search)
        );
    }
    
    // Sort
    const sort = sortFilter.value;
    switch(sort) {
        case 'date-desc':
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-asc':
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'amount-desc':
            filtered.sort((a, b) => b.amount - a.amount);
            break;
        case 'amount-asc':
            filtered.sort((a, b) => a.amount - b.amount);
            break;
    }
    
    filteredTransactions = filtered;
    currentPage = 1;
    renderTransactions();
}

// Render transactions
function renderTransactions() {
    transactionsList.innerHTML = '';
    
    if (filteredTransactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <p class="empty-text">거래 내역이 없습니다</p>
                <p class="empty-subtext">검색 조건을 변경해보세요</p>
            </div>
        `;
        updatePagination();
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageTransactions = filteredTransactions.slice(startIndex, endIndex);
    
    // Render transaction cards
    pageTransactions.forEach(transaction => {
        const card = document.createElement('div');
        card.className = 'transaction-card';
        
        const statusText = {
            'completed': '완료',
            'pending': '진행중',
            'cancelled': '취소'
        };
        
        const itemsHTML = transaction.items.map(item => `
            <div class="item-tag">
                <span class="item-icon">${item.icon}</span>
                <span>${item.name}</span>
                <span class="item-quantity">${item.quantity}</span>
            </div>
        `).join('');
        
        card.innerHTML = `
            <div class="transaction-header">
                <div class="transaction-main-info">
                    <div class="transaction-date">${formatDate(transaction.date)}</div>
                    <h3 class="transaction-supplier">${transaction.supplier}</h3>
                    <div class="transaction-id">거래번호: ${transaction.id}</div>
                </div>
                <div class="transaction-status ${transaction.status}">
                    ${statusText[transaction.status]}
                </div>
            </div>
            
            <div class="transaction-items">
                ${itemsHTML}
            </div>
            
            <div class="transaction-footer">
                <div class="transaction-amount">${transaction.amount.toLocaleString()}원</div>
                <div class="transaction-actions">
                    <button class="action-btn" onclick="viewTransactionDetail('${transaction.id}')">
                        상세보기
                    </button>
                    ${transaction.status === 'completed' ? `
                        <button class="action-btn" onclick="reorder('${transaction.id}')">
                            재주문
                        </button>
                    ` : ''}
                    ${transaction.status === 'pending' ? `
                        <button class="action-btn" onclick="cancelTransaction('${transaction.id}')">
                            취소
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        transactionsList.appendChild(card);
    });
    
    updatePagination();
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    
    // Update buttons state
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages || totalPages === 0;
    
    // Render page numbers
    pageNumbers.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderTransactions();
        });
        pageNumbers.appendChild(pageBtn);
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = days[date.getDay()];
    
    return `${year}년 ${month}월 ${day}일 (${dayName})`;
}

// View transaction detail
function viewTransactionDetail(id) {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
        showNotification(`${transaction.supplier} 거래 상세보기`, 'info');
        console.log('View detail:', transaction);
    }
}

// Reorder
function reorder(id) {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
        showNotification(`${transaction.supplier}에서 재주문하시겠습니까?`, 'info');
        console.log('Reorder:', transaction);
    }
}

// Cancel transaction
function cancelTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
        if (confirm(`거래번호 ${id}를 취소하시겠습니까?`)) {
            transaction.status = 'cancelled';
            updateStats();
            applyFilters();
            showNotification('거래가 취소되었습니다', 'success');
        }
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Setup sidebar scroll behavior with lag
function setupSidebarScroll() {
    let ticking = false;
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let targetTop = 2;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleSidebarScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    function handleSidebarScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const scrollDiff = currentScrollTop - lastScrollTop;
        
        if (currentScrollTop > navbarHeight) {
            targetTop = Math.max(2, Math.min(20, targetTop + scrollDiff * 0.3));
        } else {
            targetTop = 2;
        }
        
        sidebar.style.top = `${targetTop}rem`;
        lastScrollTop = currentScrollTop;
    }
}

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

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth <= 1200) {
            sidebar.style.top = '0';
        } else {
            setupSidebarScroll();
        }
    }, 250);
});
