// Kitchen Streaming Page Script

let stream = null;
let isStreaming = false;
let streamStartTime = null;
let streamTimer = null;
let viewerInterval = null;
let aiAnalysisInterval = null;
let currentViewers = 0;
let maxViewers = 0;

// DOM Elements
const videoPlaceholder = document.getElementById('videoPlaceholder');
const streamVideo = document.getElementById('streamVideo');
const streamOverlay = document.getElementById('streamOverlay');
const aiScanning = document.getElementById('aiScanning');
const startStreamBtn = document.getElementById('startStreamBtn');
const stopStreamBtn = document.getElementById('stopStreamBtn');
const switchCameraBtn = document.getElementById('switchCameraBtn');
const viewerCount = document.getElementById('viewerCount');
const streamTime = document.getElementById('streamTime');
const maxViewersEl = document.getElementById('maxViewers');
const avgRating = document.getElementById('avgRating');

// Score elements
const scoreValue = document.getElementById('scoreValue');
const scoreRing = document.getElementById('scoreRing');
const scoreStatus = document.getElementById('scoreStatus');
const feedbackContent = document.getElementById('feedbackContent');

// Individual evaluation scores
const cleanScore = document.getElementById('cleanScore');
const equipScore = document.getElementById('equipScore');
const organScore = document.getElementById('organScore');
const ventScore = document.getElementById('ventScore');
const compScore = document.getElementById('compScore');

// Progress bars
const cleanProgress = document.getElementById('cleanProgress');
const equipProgress = document.getElementById('equipProgress');
const organProgress = document.getElementById('organProgress');
const ventProgress = document.getElementById('ventProgress');
const compProgress = document.getElementById('compProgress');

// Start Stream Button
startStreamBtn.addEventListener('click', async () => {
    try {
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }, 
            audio: true 
        });
        
        // Set video stream
        streamVideo.srcObject = stream;
        
        // Update UI
        videoPlaceholder.style.display = 'none';
        streamVideo.classList.add('active');
        streamOverlay.classList.add('active');
        startStreamBtn.classList.add('hidden');
        stopStreamBtn.classList.remove('hidden');
        
        isStreaming = true;
        streamStartTime = Date.now();
        
        // Show AI scanning
        setTimeout(() => {
            aiScanning.classList.add('active');
            startAIAnalysis();
        }, 2000);
        
        // Start stream timer
        startStreamTimer();
        
        // Start viewer simulation
        startViewerSimulation();
        
        showNotification('스트리밍이 시작되었습니다!', 'success');
        
    } catch (error) {
        console.error('Camera access error:', error);
        showNotification('카메라 접근 권한이 필요합니다', 'error');
    }
});

// Stop Stream Button
stopStreamBtn.addEventListener('click', () => {
    stopStreaming();
});

// Switch Camera Button
switchCameraBtn.addEventListener('click', async () => {
    if (!isStreaming) {
        showNotification('먼저 스트리밍을 시작하세요', 'info');
        return;
    }
    
    showNotification('카메라 전환 기능은 곧 제공됩니다', 'info');
});

// Stop streaming function
function stopStreaming() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    // Update UI
    streamVideo.srcObject = null;
    streamVideo.classList.remove('active');
    videoPlaceholder.style.display = 'flex';
    streamOverlay.classList.remove('active');
    aiScanning.classList.remove('active');
    startStreamBtn.classList.remove('hidden');
    stopStreamBtn.classList.add('hidden');
    
    isStreaming = false;
    
    // Clear timers
    if (streamTimer) clearInterval(streamTimer);
    if (viewerInterval) clearInterval(viewerInterval);
    if (aiAnalysisInterval) clearInterval(aiAnalysisInterval);
    
    // Reset scores
    resetScores();
    
    showNotification('스트리밍이 종료되었습니다', 'info');
}

// Stream timer
function startStreamTimer() {
    streamTimer = setInterval(() => {
        if (!streamStartTime) return;
        
        const elapsed = Date.now() - streamStartTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        streamTime.textContent = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// Viewer simulation
function startViewerSimulation() {
    currentViewers = Math.floor(Math.random() * 15) + 5;
    maxViewers = currentViewers;
    viewerCount.textContent = currentViewers;
    maxViewersEl.textContent = maxViewers;
    
    viewerInterval = setInterval(() => {
        // Randomly change viewer count
        const change = Math.floor(Math.random() * 7) - 3;
        currentViewers = Math.max(1, currentViewers + change);
        
        if (currentViewers > maxViewers) {
            maxViewers = currentViewers;
            maxViewersEl.textContent = maxViewers;
        }
        
        viewerCount.textContent = currentViewers;
        
        // Update average rating
        const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
        avgRating.textContent = rating;
        
    }, 5000);
}

// AI Analysis
function startAIAnalysis() {
    // Show scanning for 5 seconds
    setTimeout(() => {
        aiScanning.classList.remove('active');
        performAnalysis();
    }, 5000);
}

function performAnalysis() {
    // Generate random scores (typically high for good kitchens)
    const scores = {
        clean: Math.floor(Math.random() * 20) + 75,
        equip: Math.floor(Math.random() * 20) + 75,
        organ: Math.floor(Math.random() * 20) + 70,
        vent: Math.floor(Math.random() * 20) + 80,
        comp: Math.floor(Math.random() * 20) + 75
    };
    
    // Calculate overall score
    const overall = Math.floor((scores.clean + scores.equip + scores.organ + scores.vent + scores.comp) / 5);
    
    // Animate scores
    setTimeout(() => animateScore(cleanScore, cleanProgress, scores.clean), 200);
    setTimeout(() => animateScore(equipScore, equipProgress, scores.equip), 400);
    setTimeout(() => animateScore(organScore, organProgress, scores.organ), 600);
    setTimeout(() => animateScore(ventScore, ventProgress, scores.vent), 800);
    setTimeout(() => animateScore(compScore, compProgress, scores.comp), 1000);
    
    // Animate overall score
    setTimeout(() => {
        animateOverallScore(overall);
        updateFeedback(overall, scores);
    }, 1500);
    
    // Re-analyze every 30 seconds
    aiAnalysisInterval = setInterval(() => {
        aiScanning.classList.add('active');
        setTimeout(() => {
            aiScanning.classList.remove('active');
            performAnalysis();
        }, 5000);
    }, 30000);
}

function animateScore(scoreEl, progressEl, value) {
    let current = 0;
    const increment = value / 50;
    
    const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
            current = value;
            clearInterval(interval);
        }
        
        scoreEl.textContent = Math.floor(current);
        progressEl.style.width = `${current}%`;
    }, 20);
}

function animateOverallScore(value) {
    let current = 0;
    const increment = value / 50;
    const circumference = 2 * Math.PI * 54;
    
    const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
            current = value;
            clearInterval(interval);
        }
        
        scoreValue.textContent = Math.floor(current);
        
        // Update ring
        const offset = circumference - (current / 100) * circumference;
        scoreRing.style.strokeDashoffset = offset;
    }, 20);
    
    // Update status
    updateScoreStatus(value);
}

function updateScoreStatus(score) {
    let icon, text, color;
    
    if (score >= 90) {
        icon = '✨';
        text = '최우수 등급';
        color = '#daa520';
    } else if (score >= 80) {
        icon = '⭐';
        text = '우수 등급';
        color = '#daa520';
    } else if (score >= 70) {
        icon = '👍';
        text = '양호 등급';
        color = '#cd7f32';
    } else if (score >= 60) {
        icon = '⚠️';
        text = '개선 필요';
        color = '#f59e0b';
    } else {
        icon = '❌';
        text = '즉시 개선 필요';
        color = '#ef4444';
    }
    
    scoreStatus.innerHTML = `
        <span class="status-icon">${icon}</span>
        <span class="status-text">${text}</span>
    `;
    scoreStatus.style.borderColor = color;
}

function updateFeedback(overall, scores) {
    let feedback = '';
    
    if (overall >= 90) {
        feedback = '🎉 훌륭합니다! 주방 위생 상태가 매우 우수합니다. 현재의 청결도를 계속 유지해주세요. ';
    } else if (overall >= 80) {
        feedback = '👏 우수한 위생 관리를 하고 계십니다. ';
    } else if (overall >= 70) {
        feedback = '👍 전반적으로 양호한 상태입니다. ';
    } else {
        feedback = '⚠️ 위생 관리에 더 신경써주세요. ';
    }
    
    // Add specific recommendations
    const recommendations = [];
    
    if (scores.clean < 75) {
        recommendations.push('조리대와 바닥 청소를 더 철저히 해주세요');
    }
    if (scores.equip < 75) {
        recommendations.push('위생 장갑과 모자 착용을 권장합니다');
    }
    if (scores.organ < 75) {
        recommendations.push('식재료와 조리도구 정리정돈이 필요합니다');
    }
    if (scores.vent < 80) {
        recommendations.push('환기 시스템을 점검하고 조명을 개선해주세요');
    }
    if (scores.comp < 75) {
        recommendations.push('식품 안전 수칙 준수를 강화해주세요');
    }
    
    if (recommendations.length > 0) {
        feedback += '<br><br><strong>개선 사항:</strong><br>• ' + recommendations.join('<br>• ');
    } else {
        feedback += '모든 평가 항목에서 우수한 결과를 보이고 있습니다!';
    }
    
    feedbackContent.innerHTML = feedback;
}

function resetScores() {
    scoreValue.textContent = '--';
    scoreRing.style.strokeDashoffset = 339.292;
    
    [cleanScore, equipScore, organScore, ventScore, compScore].forEach(el => {
        el.textContent = '--';
    });
    
    [cleanProgress, equipProgress, organProgress, ventProgress, compProgress].forEach(el => {
        el.style.width = '0%';
    });
    
    scoreStatus.innerHTML = `
        <span class="status-icon">⏳</span>
        <span class="status-text">분석 대기 중</span>
    `;
    
    feedbackContent.textContent = '스트리밍을 시작하면 실시간 AI 분석이 시작됩니다.';
    
    streamTime.textContent = '0:00:00';
    viewerCount.textContent = '0';
    currentViewers = 0;
}

// Notification system (if not already defined in supplier-script.js)
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

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (isStreaming) {
        stopStreaming();
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Kitchen Streaming page loaded');
    
    // Check if camera is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showNotification('이 브라우저는 카메라를 지원하지 않습니다', 'error');
        startStreamBtn.disabled = true;
    }
});
