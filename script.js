let timer;
let timeLeft = 0;
let isRunning = false;
let isPaused = false;
let currentImageIndex = 0;

const keisukeImages = [
    'images/keisuke_happy.png',
    'images/keisuke_thinking.png',
    'images/keisuke_excited.png'
];

const messages = {
    idle: 'タイマーを設定してスタートボタンを押してね！',
    running: [
        '頑張って！応援してるよ！',
        'もう少しだよ、ファイト！',
        '集中して頑張ろう！',
        'いいペースだよ！'
    ],
    paused: 'ちょっと休憩中...',
    finished: 'お疲れ様！よく頑張ったね！'
};

const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const timerInput = document.getElementById('timer-input');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const messageDisplay = document.getElementById('message');
const keisukeImg = document.getElementById('keisuke-img');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function changeKeisukeImage() {
    currentImageIndex = (currentImageIndex + 1) % keisukeImages.length;
    keisukeImg.src = keisukeImages[currentImageIndex];
    
    // アニメーション効果
    keisukeImg.style.transform = 'scale(0.9)';
    setTimeout(() => {
        keisukeImg.style.transform = 'scale(1)';
    }, 200);
}

function updateMessage(type) {
    if (type === 'running') {
        const randomMessage = messages.running[Math.floor(Math.random() * messages.running.length)];
        messageDisplay.textContent = randomMessage;
    } else {
        messageDisplay.textContent = messages[type];
    }
}

function startTimer() {
    if (!isRunning && !isPaused) {
        const minutes = parseInt(timerInput.value) || 5;
        timeLeft = minutes * 60;
        updateDisplay();
    }
    
    isRunning = true;
    isPaused = false;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    timerInput.disabled = true;
    
    updateMessage('running');
    
    // 5秒ごとに画像を切り替え
    const imageInterval = setInterval(() => {
        if (isRunning && !isPaused) {
            changeKeisukeImage();
            updateMessage('running');
        }
    }, 5000);
    
    timer = setInterval(() => {
        if (timeLeft > 0 && !isPaused) {
            timeLeft--;
            updateDisplay();
            
            // 残り時間に応じて画像を変更
            if (timeLeft === 30) {
                keisukeImg.src = keisukeImages[1]; // thinking pose
            } else if (timeLeft === 10) {
                keisukeImg.src = keisukeImages[2]; // excited pose
            }
        } else if (timeLeft === 0) {
            clearInterval(timer);
            clearInterval(imageInterval);
            isRunning = false;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            timerInput.disabled = false;
            updateMessage('finished');
            keisukeImg.src = keisukeImages[2]; // excited pose
            
            // 完了音を鳴らす（ブラウザが対応している場合）
            playSound();
        }
    }, 1000);
}

function pauseTimer() {
    if (isRunning) {
        isPaused = !isPaused;
        if (isPaused) {
            pauseBtn.textContent = '再開';
            updateMessage('paused');
            keisukeImg.src = keisukeImages[1]; // thinking pose
        } else {
            pauseBtn.textContent = '一時停止';
            updateMessage('running');
        }
    }
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isPaused = false;
    timeLeft = 0;
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = '一時停止';
    timerInput.disabled = false;
    updateMessage('idle');
    keisukeImg.src = keisukeImages[0]; // happy pose
    currentImageIndex = 0;
}

function playSound() {
    // Web Audio APIを使用して簡単な完了音を生成
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('音声再生がサポートされていません');
    }
}

// イベントリスナー
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// 初期表示
updateDisplay();