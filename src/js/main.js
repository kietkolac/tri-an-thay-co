// ===== CONFIG DỄ CHỈNH =====
const CONFIG = {
    hearts: {
        interval: 300,
        minDuration: 3,
        maxDuration: 7,
        minSize: 20,
        maxSize: 40,
    },
    heartsTwinkling: {
        interval: 80,
        minDuration: 2,
        maxDuration: 4,
        minSize: 30,
        maxSize: 60,
    },
    fallingImages: {
        imagesPerSecond: 1,
        minDuration: 3,
        maxDuration: 5,
        scale: 1,
    }
};

// ===== Biến toàn cục =====
const PASSWORD = '1102025';
let inputPassword = '';
const passwordDisplay = document.getElementById('passwordDisplay');
const errorMessage = document.getElementById('errorMessage');
const deleteBtn = document.getElementById('deleteBtn');
const enterBtn = document.getElementById('enterBtn');
const keypadButtons = document.querySelectorAll('.key[data-num]');
const loginScreen = document.getElementById('loginScreen');
const giftBox = document.getElementById('giftBox');
const giftScreen = document.getElementById('giftScreen');
const openGiftBtn = document.getElementById('openGiftBtn');
const heartsBackground = document.getElementById('heartsBackground');
let allGiftImages = [];
let usedGifts = [];
let isRaining = false;
let twinkling = false;
let rainInterval = null;

// ===== Load 17 ảnh từ gifts/1.jpg → gifts/17.jpg =====
async function loadGiftsList() {
    allGiftImages = [];
    const totalImages = 17;
    
    for (let i = 1; i <= totalImages; i++) {
        const img = new Image();
        img.src = `gifts/${i}.jpg`;
        img.onload = () => {
            allGiftImages.push(`gifts/${i}.jpg`);
            if (allGiftImages.length === 1) loadFirstGift();
        };
        img.onerror = () => console.warn(`Không load được: gifts/${i}.jpg`);
    }
    
    setTimeout(() => {
        if (allGiftImages.length === 0) {
            allGiftImages = ['gifts/1.jpg'];
            loadFirstGift();
        }
    }, 100);
}

loadGiftsList();

// ===== Background Hearts =====
function createBackgroundHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '❤️';
        heart.style.left = Math.random() * 75 + '%';
        
        const size = Math.random() * (CONFIG.hearts.maxSize - CONFIG.hearts.minSize) + CONFIG.hearts.minSize;
        heart.style.fontSize = size + 'px';
        
        const duration = Math.random() * (CONFIG.hearts.maxDuration - CONFIG.hearts.minDuration) + CONFIG.hearts.minDuration;
        heart.style.animation = `heartRise ${duration}s ease-in forwards`;
        
        heartsBackground.appendChild(heart);
        setTimeout(() => heart.remove(), duration * 1000);
    }, CONFIG.hearts.interval);
}

createBackgroundHearts();

// ===== Keypad & Password =====
keypadButtons.forEach(b => b.addEventListener('click', () => {
    if (inputPassword.length < PASSWORD.length) {
        inputPassword += b.dataset.num;
        updateDisplay();
        // Thêm hiệu ứng rung nhẹ
        passwordDisplay.style.animation = 'none';
        setTimeout(() => {
            passwordDisplay.style.animation = 'inputPulse 0.3s ease';
        }, 10);
    }
}));

deleteBtn.addEventListener('click', () => {
    if (inputPassword.length > 0) {
        inputPassword = inputPassword.slice(0, -1);
        updateDisplay();
        // Hiệu ứng xóa
        passwordDisplay.style.animation = 'none';
        setTimeout(() => {
            passwordDisplay.style.animation = 'inputShake 0.4s ease';
        }, 10);
    }
});

enterBtn.addEventListener('click', checkPassword);

document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        checkPassword();
    } else if (e.key === 'Backspace') {
        if (inputPassword.length > 0) {
            inputPassword = inputPassword.slice(0, -1);
            updateDisplay();
        }
    } else if (e.key >= '0' && e.key <= '9' && inputPassword.length < PASSWORD.length) {
        inputPassword += e.key;
        updateDisplay();
    }
});

function updateDisplay() {
    // Hiển thị số thật thay vì 'x'
    passwordDisplay.value = inputPassword;
    errorMessage.textContent = '';
}

function checkPassword() {
    if (inputPassword === PASSWORD) {
        errorMessage.textContent = '✨ Đúng rồi! 20/11 vui vẻ! 🎉';
        errorMessage.style.color = '#4CAF50';
        errorMessage.style.fontWeight = 'bold';
        
        // Hiệu ứng thành công
        passwordDisplay.style.animation = 'inputSuccess 0.6s ease';
        
        setTimeout(moveScreenUp, 600);
    } else {
        const entered = inputPassword.length;
        const required = PASSWORD.length;
        
        if (entered === 0) {
            errorMessage.textContent = '🤔 Chưa nhập gì!';
        } else if (entered < required) {
            errorMessage.textContent = `❌ Sai! Nhập ${entered}/${required} ký tự.`;
        } else {
            errorMessage.textContent = '❌ Sai rồi! Xóa hết thử lại.';
        }
        
        errorMessage.style.color = '#FF6B6B';
        errorMessage.style.fontWeight = 'bold';
        
        // Hiệu ứng rung khi sai
        passwordDisplay.style.animation = 'none';
        setTimeout(() => {
            passwordDisplay.style.animation = 'inputError 0.5s ease';
        }, 10);
        
        inputPassword = '';
        updateDisplay();
    }
}

// ===== Thêm CSS animations động =====
const style = document.createElement('style');
style.textContent = `
    @keyframes inputPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
    
    @keyframes inputShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes inputError {
        0%, 100% { transform: translateX(0); border-color: #FF6B6B; }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
        20%, 40%, 60%, 80% { transform: translateX(8px); }
    }
    
    @keyframes inputSuccess {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); border-color: #4CAF50; }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// ===== Màn hình chuyển =====
function moveScreenUp() {
    loginScreen.style.transform = 'translateY(-150vh)';
    loginScreen.style.opacity = '0';
    
    setTimeout(() => {
        loginScreen.style.pointerEvents = 'none';
        showGiftBox();
    }, 600);
}

function showGiftBox() {
    giftBox.style.opacity = '1';
    giftBox.style.pointerEvents = 'auto';
    
    setTimeout(showGiftScreen, 500);
}

function showGiftScreen() {
    giftBox.style.opacity = '0';
    giftBox.style.pointerEvents = 'none';
    giftScreen.style.opacity = '1';
    giftScreen.style.pointerEvents = 'auto';
}

// ===== Load ảnh đầu =====
function loadFirstGift() {
    if (allGiftImages.length > 0) {
        document.getElementById('giftImage').src = getRandomGift();
    }
}

function getRandomGift() {
    if (allGiftImages.length === 0) return 'gifts/1.jpg';
    
    let available = allGiftImages.filter((_, i) => !usedGifts.includes(i));
    if (available.length === 0) {
        usedGifts = [];
        available = [...allGiftImages];
    }
    
    const idx = Math.floor(Math.random() * available.length);
    const src = available[idx];
    const globalIdx = allGiftImages.indexOf(src);
    usedGifts.push(globalIdx);
    
    return src;
}

// ===== MỞ QUÀ: MƯA ẢNH VÔ TẬN + TO HƠN =====
openGiftBtn.addEventListener('click', () => {
    openGift();
    
    // Hiệu ứng nút biến mất
    openGiftBtn.style.transform = 'scale(0) rotate(180deg)';
    openGiftBtn.style.opacity = '0';
    
    setTimeout(() => {
        openGiftBtn.style.display = 'none';
        openGiftBtn.disabled = true;
    }, 2000);
});

function openGift() {
    if (isRaining) return;
    isRaining = true;
    
    startHeartsTwinkling();
    
    // Đổi ảnh chính với hiệu ứng
    setTimeout(() => {
        const giftImg = document.getElementById('giftImage');
        giftImg.style.animation = 'none';
        
        setTimeout(() => {
            giftImg.src = getRandomGift();
            giftImg.style.animation = 'imageAppear 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }, 50);
    }, 500);
    
    // MƯA ẢNH VÔ TẬN
    const imagesPerSecond = CONFIG.fallingImages.imagesPerSecond;
    const intervalMs = 1000 / imagesPerSecond;
    
    rainInterval = setInterval(() => {
        const count = Math.random() < 0.6 ? 1 : 2; // 60% rơi 1, 40% rơi 2
        for (let i = 0; i < count; i++) {
            createFallingImage();
        }
    }, intervalMs);
}

// ===== Tạo ảnh rơi (TO HƠN + RANDOM 17 ẢNH) =====
function createFallingImage() {
    if (allGiftImages.length === 0) return;
    
    const img = document.createElement('img');
    img.className = 'falling-image';
    img.src = allGiftImages[Math.floor(Math.random() * allGiftImages.length)];
    
    const baseSize = 500;
    const duration = CONFIG.fallingImages.minDuration + 
                    Math.random() * (CONFIG.fallingImages.maxDuration - CONFIG.fallingImages.minDuration);
    const leftPercent = 8 + Math.random() * 84; // 8% → 92%
    
    img.style.position = 'fixed';
    img.style.width = baseSize + 'px';
    img.style.height = baseSize + 'px';
    img.style.objectFit = 'cover';
    img.style.left = leftPercent + '%';
    img.style.top = '-260px';
    img.style.pointerEvents = 'none';
    img.style.zIndex = '9999';
    img.style.transform = `translateX(-50%) scale(${CONFIG.fallingImages.scale})`;
    img.style.animation = `imageFall ${duration}s linear forwards, imageFadeOut ${duration}s linear forwards`;
    
    document.body.appendChild(img);
    
    setTimeout(() => img.remove(), duration * 1000 + 200);
}

// ===== Tim lắp lánh =====
function startHeartsTwinkling() {
    if (twinkling) return;
    twinkling = true;
    
    document.querySelectorAll('.heart').forEach(h => h.remove());
    
    const twinkleInterval = setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        
        const size = Math.random() * (CONFIG.heartsTwinkling.maxSize - CONFIG.heartsTwinkling.minSize) + CONFIG.heartsTwinkling.minSize;
        heart.style.fontSize = size + 'px';
        
        const duration = Math.random() * (CONFIG.heartsTwinkling.maxDuration - CONFIG.heartsTwinkling.minDuration) + CONFIG.heartsTwinkling.minDuration;
        heart.style.animation = `heartRise ${duration}s ease-in forwards`;
        
        heartsBackground.appendChild(heart);
        setTimeout(() => heart.remove(), duration * 1000);
    }, CONFIG.heartsTwinkling.interval);
    
    setTimeout(() => {
        clearInterval(twinkleInterval);
        twinkling = false;
        // Không khôi phục tim nền → để mưa ảnh nổi bật
    }, 5000);
}

// ===== Easter Egg: Click vào ảnh để đổi ảnh mới =====
document.getElementById('giftImage').addEventListener('click', function() {
    if (isRaining) {
        this.style.animation = 'none';
        setTimeout(() => {
            this.src = getRandomGift();
            this.style.animation = 'imageAppear 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }, 50);
    }
});

console.log('🎉 Happy Teacher\'s Day 20/11! 🎉');