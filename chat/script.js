// Chat Page

// Mock chat data
const chats = [
    { id: 1, name: '김민지', avatar: '👩', lastMessage: '강남 파스타 좋아요!', time: '5분 전', unread: 2, online: true },
    { id: 2, name: '이준호', avatar: '👨', lastMessage: '내일 저녁 어때요?', time: '1시간 전', unread: 0, online: true },
    { id: 3, name: '박서연', avatar: '👧', lastMessage: '비건 레스토랑 찾았어요', time: '3시간 전', unread: 1, online: false },
    { id: 4, name: '최동욱', avatar: '🧑', lastMessage: '사진 찍기 좋은 곳 알아요', time: '어제', unread: 0, online: false },
    { id: 5, name: '정수빈', avatar: '👱‍♀️', lastMessage: '매운 음식 가실래요?', time: '어제', unread: 0, online: true },
];

// Mock messages for current chat
const mockMessages = [
    { id: 1, sender: 'them', avatar: '👩', text: '안녕하세요! 프로필 봤어요', time: '14:30', type: 'text' },
    { id: 2, sender: 'me', avatar: '👤', text: '안녕하세요! 반가워요', time: '14:32', type: 'text' },
    { id: 3, sender: 'them', avatar: '👩', text: '저도 파스타 정말 좋아해요', time: '14:33', type: 'text' },
    { id: 4, sender: 'me', avatar: '👤', text: '오 정말요? 강남에 좋은 이탈리안 레스토랑 알아요', time: '14:35', type: 'text' },
    { id: 5, sender: 'system', text: '김민지님이 매치를 수락했습니다 🎉', time: '14:36', type: 'system' },
    { id: 6, sender: 'them', avatar: '👩', text: '강남 파스타 좋아요! 언제 시간 되세요?', time: '14:37', type: 'text' },
];

let currentChatId = 1;
let messages = [...mockMessages];

// DOM elements
const chatList = document.getElementById('chat-list');
const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');
const attachBtn = document.getElementById('attach-btn');
const scheduleBtn = document.getElementById('schedule-btn');
const scheduleModal = document.getElementById('schedule-modal');
const closeScheduleModal = document.getElementById('close-schedule-modal');
const cancelSchedule = document.getElementById('cancel-schedule');
const confirmSchedule = document.getElementById('confirm-schedule');

// Render chat list
function renderChatList() {
    chatList.innerHTML = chats.map(chat => `
        <div class="chat-item ${chat.id === currentChatId ? 'active' : ''}" data-id="${chat.id}">
            <div class="chat-avatar">
                ${chat.avatar}
                ${chat.online ? '<span class="status-badge"></span>' : ''}
            </div>
            <div class="chat-info">
                <div class="chat-name">${chat.name}</div>
                <div class="chat-preview">${chat.lastMessage}</div>
            </div>
            <div class="chat-meta">
                <div class="chat-time">${chat.time}</div>
                ${chat.unread > 0 ? `<div class="unread-badge">${chat.unread}</div>` : ''}
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.chat-item').forEach(item => {
        item.addEventListener('click', () => {
            const chatId = parseInt(item.dataset.id);
            switchChat(chatId);
        });
    });
}

// Switch chat
function switchChat(chatId) {
    currentChatId = chatId;
    const chat = chats.find(c => c.id === chatId);
    
    if (chat) {
        document.getElementById('current-user-name').textContent = chat.name;
        document.querySelector('.user-avatar-small').textContent = chat.avatar;
        
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');
        
        if (chat.online) {
            statusIndicator.classList.add('online');
            statusIndicator.classList.remove('offline');
            statusText.textContent = '온라인';
        } else {
            statusIndicator.classList.add('offline');
            statusIndicator.classList.remove('online');
            statusText.textContent = '오프라인';
        }
        
        // Clear unread
        chat.unread = 0;
        renderChatList();
        renderMessages();
    }
}

// Render messages
function renderMessages() {
    const dateDiv = messagesContainer.querySelector('.date-divider');
    
    messagesContainer.innerHTML = '';
    messagesContainer.appendChild(dateDiv);
    
    messages.forEach(msg => {
        if (msg.type === 'system') {
            const systemMsg = document.createElement('div');
            systemMsg.className = 'system-message';
            systemMsg.textContent = msg.text;
            messagesContainer.appendChild(systemMsg);
        } else {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender === 'me' ? 'sent' : 'received'}`;
            
            messageDiv.innerHTML = `
                <div class="message-avatar">${msg.avatar}</div>
                <div class="message-content">
                    <div class="message-bubble">${msg.text}</div>
                    <div class="message-time">${msg.time}</div>
                </div>
            `;
            
            messagesContainer.appendChild(messageDiv);
        }
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send message
function sendMessage() {
    const text = messageInput.value.trim();
    
    if (!text) return;
    
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    
    const newMessage = {
        id: messages.length + 1,
        sender: 'me',
        avatar: '👤',
        text: text,
        time: time,
        type: 'text'
    };
    
    messages.push(newMessage);
    renderMessages();
    messageInput.value = '';
    
    // Simulate response after 2 seconds
    setTimeout(() => {
        const chat = chats.find(c => c.id === currentChatId);
        if (chat) {
            const responseTime = (now.getHours()).toString().padStart(2, '0') + ':' + (now.getMinutes() + 1).toString().padStart(2, '0');
            
            const responses = [
                '좋아요!',
                '그거 좋네요',
                '오 괜찮은데요?',
                '언제가 좋으세요?',
                '저도 가고 싶어요!',
            ];
            
            const response = {
                id: messages.length + 1,
                sender: 'them',
                avatar: chat.avatar,
                text: responses[Math.floor(Math.random() * responses.length)],
                time: responseTime,
                type: 'text'
            };
            
            messages.push(response);
            renderMessages();
            
            // Update chat list
            chat.lastMessage = response.text;
            chat.time = '방금';
            renderChatList();
        }
    }, 2000);
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Emoji picker
emojiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
});

document.addEventListener('click', (e) => {
    if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
        emojiPicker.style.display = 'none';
    }
});

// Emoji selection
document.querySelectorAll('.emoji-grid span').forEach(emoji => {
    emoji.addEventListener('click', () => {
        messageInput.value += emoji.textContent;
        messageInput.focus();
        emojiPicker.style.display = 'none';
    });
});

// Attach button
attachBtn.addEventListener('click', () => {
    showNotification('파일 첨부 기능은 준비 중입니다', 'info');
});

// Schedule modal
scheduleBtn.addEventListener('click', () => {
    scheduleModal.style.display = 'flex';
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('meeting-date').value = tomorrow.toISOString().split('T')[0];
    document.getElementById('meeting-date').min = new Date().toISOString().split('T')[0];
});

closeScheduleModal.addEventListener('click', () => {
    scheduleModal.style.display = 'none';
});

cancelSchedule.addEventListener('click', () => {
    scheduleModal.style.display = 'none';
});

confirmSchedule.addEventListener('click', () => {
    const date = document.getElementById('meeting-date').value;
    const time = document.getElementById('meeting-time').value;
    const location = document.getElementById('meeting-location').value;
    const notes = document.getElementById('meeting-notes').value;
    
    if (!date || !time || !location) {
        showNotification('날짜, 시간, 장소를 모두 입력해주세요', 'error');
        return;
    }
    
    const formattedDate = new Date(date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
    
    const scheduleMessage = {
        id: messages.length + 1,
        sender: 'system',
        text: `📅 식사 일정 제안: ${formattedDate} ${time} | ${location}`,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        type: 'system'
    };
    
    messages.push(scheduleMessage);
    renderMessages();
    
    scheduleModal.style.display = 'none';
    showNotification('일정 제안을 보냈습니다', 'success');
    
    // Clear form
    document.getElementById('meeting-location').value = '';
    document.getElementById('meeting-notes').value = '';
});

// Restaurant button
document.getElementById('restaurant-btn').addEventListener('click', () => {
    showNotification('맛집 추천 기능은 준비 중입니다', 'info');
});

// Menu button
document.getElementById('menu-btn').addEventListener('click', () => {
    showNotification('추가 옵션은 준비 중입니다', 'info');
});

// Section glow effects
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

const chatSidebar = document.querySelector('.chat-sidebar');
const chatWindow = document.querySelector('.chat-window');

addSectionGlowEffect(chatSidebar);
addSectionGlowEffect(chatWindow);

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

// Initialize
renderChatList();
renderMessages();

// Typing indicator simulation
let typingTimeout;

messageInput.addEventListener('input', () => {
    clearTimeout(typingTimeout);
    
    // In a real app, send typing indicator to server
    console.log('User is typing...');
    
    typingTimeout = setTimeout(() => {
        console.log('User stopped typing');
    }, 1000);
});
