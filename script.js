let timer;
let timeLeft = 0;
let isRunning = false;
let isPaused = false;
let currentImageIndex = 0;

const keisukeImages = [
    'images/keisuke_happy.png',
    'images/keisuke_thinking.png',
    'images/keisuke_excited.png',
    'images/keisuke_sleepy.png',
    'images/keisuke_surprised.png',
    'images/keisuke_confident.png',
    'images/keisuke_wink.png',
    'images/keisuke_shy.png',
    'images/keisuke_determined.png',
    'images/keisuke_relaxed.png'
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
const hoursInput = document.getElementById('hours-input');
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');
const hoursDisplay = document.getElementById('hours');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const messageDisplay = document.getElementById('message');
let keisukeImg = document.getElementById('keisuke-img');

function updateDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    hoursDisplay.textContent = hours.toString().padStart(2, '0');
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function changeKeisukeImage(specificImage = null) {
    const oldImg = keisukeImg;
    const newImg = document.createElement('img');
    
    if (specificImage !== null) {
        newImg.src = specificImage;
    } else {
        currentImageIndex = (currentImageIndex + 1) % keisukeImages.length;
        newImg.src = keisukeImages[currentImageIndex];
    }
    
    newImg.className = 'fade-out';
    newImg.alt = 'けいすけ';
    
    // 新しい画像を追加
    keisukeImg.parentElement.appendChild(newImg);
    
    // フェードアウト・フェードイン
    setTimeout(() => {
        oldImg.className = 'fade-out';
        newImg.className = 'fade-in';
        
        // 古い画像を削除
        setTimeout(() => {
            oldImg.remove();
            newImg.id = 'keisuke-img';
            keisukeImg = newImg; // 参照を更新
        }, 500);
    }, 50);
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
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(secondsInput.value) || 0;
        timeLeft = hours * 3600 + minutes * 60 + seconds;
        
        // 入力が0の場合はデフォルトで5分
        if (timeLeft === 0) {
            timeLeft = 300; // 5分
        }
        
        updateDisplay();
    }
    
    isRunning = true;
    isPaused = false;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    hoursInput.disabled = true;
    minutesInput.disabled = true;
    secondsInput.disabled = true;
    
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
                changeKeisukeImage(keisukeImages[1]); // thinking pose
            } else if (timeLeft === 10) {
                changeKeisukeImage(keisukeImages[2]); // excited pose
            }
        } else if (timeLeft === 0) {
            clearInterval(timer);
            clearInterval(imageInterval);
            isRunning = false;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            hoursInput.disabled = false;
            minutesInput.disabled = false;
            secondsInput.disabled = false;
            updateMessage('finished');
            changeKeisukeImage(keisukeImages[2]); // excited pose
            
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
            changeKeisukeImage(keisukeImages[1]); // thinking pose
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
    hoursInput.disabled = false;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
    updateMessage('idle');
    changeKeisukeImage(keisukeImages[0]); // happy pose
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