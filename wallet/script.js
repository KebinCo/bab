// FoodLink Wallet Page Script

// Sample data
let paymentMethods = [
    {
        id: 1,
        type: 'credit',
        number: '**** **** **** 1234',
        expiry: '12/25',
        nickname: '회사카드',
        isDefault: true
    },
    {
        id: 2,
        type: 'debit',
        number: '**** **** **** 5678',
        expiry: '08/26',
        nickname: '개인카드',
        isDefault: false
    }
];

let bankAccounts = [
    {
        id: 1,
        bank: 'KB국민',
        accountNumber: '123-456-789012',
        holder: '골든키친',
        nickname: '급여통장'
    },
    {
        id: 2,
        bank: '신한',
        accountNumber: '987-654-321098',
        holder: '골든키친',
        nickname: '거래용'
    }
];

const recentTransactions = [
    {
        id: 1,
        type: 'charge',
        title: '계좌 충전',
        date: '2024-10-15',
        amount: 500000
    },
    {
        id: 2,
        type: 'payment',
        title: '신선농산 결제',
        date: '2024-10-14',
        amount: -245000
    },
    {
        id: 3,
        type: 'payment',
        title: '한마음 농장 결제',
        date: '2024-10-13',
        amount: -450000
    },
    {
        id: 4,
        type: 'point',
        title: '포인트 적립',
        date: '2024-10-12',
        amount: 5000
    },
    {
        id: 5,
        type: 'withdraw',
        title: '출금',
        date: '2024-10-10',
        amount: -300000
    }
];

// DOM Elements
const paymentMethodsGrid = document.getElementById('paymentMethodsGrid');
const bankAccountsList = document.getElementById('bankAccountsList');
const recentTransactionsList = document.getElementById('recentTransactionsList');
const addMethodBtn = document.getElementById('addMethodBtn');
const addAccountBtn = document.getElementById('addAccountBtn');
const chargeBtn = document.getElementById('chargeBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const usePointsBtn = document.getElementById('usePointsBtn');

// Modal elements
const addPaymentModal = document.getElementById('addPaymentModal');
const addAccountModal = document.getElementById('addAccountModal');
const closePaymentModal = document.getElementById('closePaymentModal');
const closeAccountModal = document.getElementById('closeAccountModal');
const confirmAddPayment = document.getElementById('confirmAddPayment');
const confirmAddAccount = document.getElementById('confirmAddAccount');
const cancelAddPayment = document.getElementById('cancelAddPayment');
const cancelAddAccount = document.getElementById('cancelAddAccount');

// Form inputs
const cardType = document.getElementById('cardType');
const cardNumber = document.getElementById('cardNumber');
const cardExpiry = document.getElementById('cardExpiry');
const cardCvc = document.getElementById('cardCvc');
const cardNickname = document.getElementById('cardNickname');
const setDefault = document.getElementById('setDefault');

const bankName = document.getElementById('bankName');
const accountNumber = document.getElementById('accountNumber');
const accountHolder = document.getElementById('accountHolder');
const accountNickname = document.getElementById('accountNickname');

const sidebarBtns = document.querySelectorAll('.sidebar-btn');
const sidebar = document.getElementById('foodlinkSidebar');

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    renderPaymentMethods();
    renderBankAccounts();
    renderRecentTransactions();
    setupEventListeners();
    setupSidebarScroll();
    setupCardNumberFormatting();
});

// Render payment methods
function renderPaymentMethods() {
    paymentMethodsGrid.innerHTML = '';
    
    paymentMethods.forEach(method => {
        const card = document.createElement('div');
        card.className = `payment-method-card ${method.isDefault ? 'default' : ''}`;
        
        const cardIcon = method.type === 'credit' ? '💳' : '💵';
        
        card.innerHTML = `
            ${method.isDefault ? '<div class="default-badge">기본</div>' : ''}
            <div class="card-type-icon">${cardIcon}</div>
            <div class="card-number">${method.number}</div>
            <div class="card-nickname">${method.nickname}</div>
            <div class="card-expiry">유효기간: ${method.expiry}</div>
            <div class="card-actions">
                ${!method.isDefault ? `<button class="card-action-btn" onclick="setDefaultPayment(${method.id})">기본설정</button>` : ''}
                <button class="card-action-btn" onclick="editPaymentMethod(${method.id})">수정</button>
                <button class="card-action-btn delete" onclick="deletePaymentMethod(${method.id})">삭제</button>
            </div>
        `;
        
        paymentMethodsGrid.appendChild(card);
    });
}

// Render bank accounts
function renderBankAccounts() {
    bankAccountsList.innerHTML = '';
    
    bankAccounts.forEach(account => {
        const card = document.createElement('div');
        card.className = 'bank-account-card';
        
        card.innerHTML = `
            <div class="bank-icon">🏦</div>
            <div class="bank-info">
                <div class="bank-name">${account.bank}은행</div>
                <div class="account-number">${account.accountNumber}</div>
                <div class="account-holder">${account.holder} ${account.nickname ? `(${account.nickname})` : ''}</div>
            </div>
            <div class="account-actions">
                <button class="card-action-btn" onclick="editBankAccount(${account.id})">수정</button>
                <button class="card-action-btn delete" onclick="deleteBankAccount(${account.id})">삭제</button>
            </div>
        `;
        
        bankAccountsList.appendChild(card);
    });
}

// Render recent transactions
function renderRecentTransactions() {
    recentTransactionsList.innerHTML = '';
    
    recentTransactions.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        
        const icons = {
            'charge': '💰',
            'payment': '💸',
            'point': '⭐',
            'withdraw': '🏦'
        };
        
        const amountClass = transaction.amount < 0 ? 'negative' : '';
        const amountText = transaction.amount > 0 
            ? `+${transaction.amount.toLocaleString()}원` 
            : `${transaction.amount.toLocaleString()}원`;
        
        item.innerHTML = `
            <div class="transaction-icon">${icons[transaction.type]}</div>
            <div class="transaction-details">
                <div class="transaction-title">${transaction.title}</div>
                <div class="transaction-date">${formatDate(transaction.date)}</div>
            </div>
            <div class="transaction-amount ${amountClass}">${amountText}</div>
        `;
        
        recentTransactionsList.appendChild(item);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Balance actions
    chargeBtn.addEventListener('click', () => {
        showNotification('충전 페이지로 이동합니다', 'info');
    });
    
    withdrawBtn.addEventListener('click', () => {
        showNotification('출금 페이지로 이동합니다', 'info');
    });
    
    usePointsBtn.addEventListener('click', () => {
        showNotification('포인트 사용 페이지로 이동합니다', 'info');
    });
    
    // Add method buttons
    addMethodBtn.addEventListener('click', () => {
        openModal(addPaymentModal);
    });
    
    addAccountBtn.addEventListener('click', () => {
        openModal(addAccountModal);
    });
    
    // Modal close buttons
    closePaymentModal.addEventListener('click', () => {
        closeModal(addPaymentModal);
    });
    
    closeAccountModal.addEventListener('click', () => {
        closeModal(addAccountModal);
    });
    
    cancelAddPayment.addEventListener('click', () => {
        closeModal(addPaymentModal);
    });
    
    cancelAddAccount.addEventListener('click', () => {
        closeModal(addAccountModal);
    });
    
    // Confirm buttons
    confirmAddPayment.addEventListener('click', addPaymentMethod);
    confirmAddAccount.addEventListener('click', addBankAccount);
    
    // Close modal on outside click
    [addPaymentModal, addAccountModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
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

// Setup card number formatting
function setupCardNumberFormatting() {
    cardNumber.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = value.match(/.{1,4}/g)?.join('-') || value;
        e.target.value = formatted;
    });
    
    cardExpiry.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });
    
    cardCvc.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });
    
    accountNumber.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9-]/g, '');
    });
}

// Modal functions
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    resetForms();
}

function resetForms() {
    cardType.value = 'credit';
    cardNumber.value = '';
    cardExpiry.value = '';
    cardCvc.value = '';
    cardNickname.value = '';
    setDefault.checked = false;
    
    bankName.value = '';
    accountNumber.value = '';
    accountHolder.value = '';
    accountNickname.value = '';
}

// Add payment method
function addPaymentMethod() {
    const number = cardNumber.value.trim();
    const expiry = cardExpiry.value.trim();
    const cvc = cardCvc.value.trim();
    
    if (!number || !expiry || !cvc) {
        showNotification('모든 필수 항목을 입력하세요', 'error');
        return;
    }
    
    const newMethod = {
        id: paymentMethods.length + 1,
        type: cardType.value,
        number: number.replace(/\d(?=\d{4})/g, '*'),
        expiry: expiry,
        nickname: cardNickname.value || `${cardType.value === 'credit' ? '신용' : '체크'}카드`,
        isDefault: setDefault.checked
    };
    
    if (setDefault.checked) {
        paymentMethods.forEach(m => m.isDefault = false);
    }
    
    paymentMethods.push(newMethod);
    renderPaymentMethods();
    closeModal(addPaymentModal);
    showNotification('결제수단이 추가되었습니다', 'success');
}

// Add bank account
function addBankAccount() {
    const bank = bankName.value;
    const number = accountNumber.value.trim();
    const holder = accountHolder.value.trim();
    
    if (!bank || !number || !holder) {
        showNotification('모든 필수 항목을 입력하세요', 'error');
        return;
    }
    
    const newAccount = {
        id: bankAccounts.length + 1,
        bank: bank,
        accountNumber: number,
        holder: holder,
        nickname: accountNickname.value || ''
    };
    
    bankAccounts.push(newAccount);
    renderBankAccounts();
    closeModal(addAccountModal);
    showNotification('계좌가 추가되었습니다', 'success');
}

// Set default payment
function setDefaultPayment(id) {
    paymentMethods.forEach(m => m.isDefault = m.id === id);
    renderPaymentMethods();
    showNotification('기본 결제수단이 설정되었습니다', 'success');
}

// Edit payment method
function editPaymentMethod(id) {
    showNotification('결제수단 수정 기능은 곧 제공됩니다', 'info');
}

// Delete payment method
function deletePaymentMethod(id) {
    if (confirm('이 결제수단을 삭제하시겠습니까?')) {
        paymentMethods = paymentMethods.filter(m => m.id !== id);
        renderPaymentMethods();
        showNotification('결제수단이 삭제되었습니다', 'success');
    }
}

// Edit bank account
function editBankAccount(id) {
    showNotification('계좌 수정 기능은 곧 제공됩니다', 'info');
}

// Delete bank account
function deleteBankAccount(id) {
    if (confirm('이 계좌를 삭제하시겠습니까?')) {
        bankAccounts = bankAccounts.filter(a => a.id !== id);
        renderBankAccounts();
        showNotification('계좌가 삭제되었습니다', 'success');
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}월 ${day}일`;
}

// Setup sidebar scroll
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
