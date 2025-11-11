// ===== CONFIG DỄ CHỈNH =====
const CONFIG = {
    // Tim background - bình thường
    hearts: {
        interval: 300,        // Mỗi bao lâu tạo 1 tim (ms) - GIỮ NHỎ = NHIỀU TIM
        minDuration: 3,       // Thời gian bay tối thiểu (s)
        maxDuration: 7,       // Thời gian bay tối đa (s)
        minSize: 20,          // Kích thước tối thiểu (px)
        maxSize: 40,          // Kích thước tối đa (px)
    },
    
    // Tim lắp lánh khi mở quà
    heartsTwinkling: {
        interval: 80,         // ⬅️ NHANH HƠN (từ 300 → 80)
        minDuration: 2,       // Bay nhanh hơn
        maxDuration: 4,
        minSize: 30,          // To hơn
        maxSize: 60,
    },
    
    // Ảnh rơi (mở quà)
    fallingImages: {
        imagesPerSecond: 3,   // Số ảnh mỗi giây (2-3 = tự nhiên, 5+ = mưa nặng)
        minDuration: 1.5,     // Thời gian bay tối thiểu (s)
        maxDuration: 2.5,     // Thời gian bay tối đa (s)
        scale: 0.1,           // Kích thước ảnh (0.3-0.6 = nhỏ gọn)
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
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
const heartsBackground = document.getElementById('heartsBackground');

let particles = [];
let usedGifts = [];
let allGiftImages = []; // Sẽ được load từ folder

// ===== Load danh sách ảnh từ folder gifts =====
async function loadGiftsList() {
    try {
        // Thử load từ 1-30 để support nhiều ảnh
        for (let i = 1; i <= 30; i++) {
            const img = new Image();
            img.src = `/gifts/${i}.jpg`;
            img.onload = () => {
                allGiftImages.push(`gifts/${i}.jpg`);
            };
            img.onerror = () => {
                // Ảnh ko tồn tại, skip
            };
        }
    } catch (e) {
        console.log('Không load được ảnh từ folder');
    }
}

// Load ảnh khi trang load
loadGiftsList();

// ===== Canvas setup =====
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== Background Hearts =====
function createBackgroundHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        
        // Size random
        const randomSize = Math.random() * (CONFIG.hearts.maxSize - CONFIG.hearts.minSize) + CONFIG.hearts.minSize;
        heart.style.fontSize = randomSize + 'px';
        
        // Speed random
        const randomDuration = Math.random() * (CONFIG.hearts.maxDuration - CONFIG.hearts.minDuration) + CONFIG.hearts.minDuration;
        heart.style.animation = `heartRise ${randomDuration}s ease-in infinite`;
        
        heartsBackground.appendChild(heart);
        
        setTimeout(() => heart.remove(), randomDuration * 1000);
    }, CONFIG.hearts.interval);
}

createBackgroundHearts();

// ===== Xử lý nhấn nút số =====
keypadButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (inputPassword.length < PASSWORD.length) {
            inputPassword += this.dataset.num;
            updateDisplay();
        }
    });
});

// ===== Xử lý nút xóa =====
deleteBtn.addEventListener('click', function() {
    inputPassword = inputPassword.slice(0, -1);
    updateDisplay();
});

// ===== Xử lý nút Enter =====
enterBtn.addEventListener('click', checkPassword);

// ===== Hỗ trợ phím =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    } else if (e.key === 'Backspace') {
        inputPassword = inputPassword.slice(0, -1);
        updateDisplay();
    } else if (e.key >= '0' && e.key <= '9') {
        if (inputPassword.length < PASSWORD.length) {
            inputPassword += e.key;
            updateDisplay();
        }
    }
});

// ===== Cập nhật display =====
function updateDisplay() {
    passwordDisplay.value = 'x'.repeat(inputPassword.length);
    errorMessage.textContent = ''; // Xóa thông báo cũ
    errorMessage.style.color = '#ff72b4'; // Reset color mặc định
}

// ===== Kiểm tra mật khẩu =====
function checkPassword() {
    if (inputPassword === PASSWORD) {
        errorMessage.textContent = '✓ Đúng rồi! 20/11 vui vẻ! 🎉';
        errorMessage.style.color = '#4CAF50';
        errorMessage.style.fontWeight = 'bold';
        
        setTimeout(() => {
            moveScreenUp();
        }, 500);
    } else {
        // Báo sai + hướng dẫn
        const entered = inputPassword.length;
        const required = PASSWORD.length;
        
        if (entered === 0) {
            errorMessage.textContent = '❌ Chưa nhập gì cả!';
        } else if (entered < required) {
            errorMessage.textContent = `❌ Sai rồi! Nhập ${entered}/${required} ký tự. Sửa lại đi!`;
        } else {
            errorMessage.textContent = `❌ Sai rồi! Xóa hết và thử lại.`;
        }
        
        errorMessage.style.color = '#FF6B6B';
        errorMessage.style.fontWeight = 'bold';
        
        // Xóa và reset display
        inputPassword = '';
        updateDisplay();
    }
}

// ===== Chạy màn hình lên trên =====
function moveScreenUp() {
    loginScreen.style.transform = 'translateY(-150vh)';
    loginScreen.style.opacity = '0';
    
    setTimeout(() => {
        loginScreen.style.pointerEvents = 'none';
        showGiftBox();
    }, 600);
}

// ===== Hiện hộp quà =====
function showGiftBox() {
    giftBox.style.opacity = '1';
    giftBox.style.pointerEvents = 'auto';
    
    setTimeout(() => {
        showGiftScreen();
    }, 500); // Tăng từ 2000ms → 3000ms để thấy animation lâu hơn
}

// ===== Hiện màn hình quà =====
function showGiftScreen() {
    giftBox.style.opacity = '0';
    giftBox.style.pointerEvents = 'none';
    giftScreen.style.opacity = '1';
    giftScreen.style.pointerEvents = 'auto';
    
    loadFirstGift();
}

// ===== Load ảnh quà đầu tiên =====
function loadFirstGift() {
    const giftImage = document.getElementById('giftImage');
    const randomImage = getRandomGift();
    giftImage.src = randomImage;
}

// ===== Lấy ảnh quà random (không trùng) =====
function getRandomGift() {
    if (allGiftImages.length === 0) {
        return 'gifts/1.jpg'; // Fallback nếu ko load được ảnh
    }
    
    let availableGifts = [];
    for (let i = 0; i < allGiftImages.length; i++) {
        if (!usedGifts.includes(i)) {
            availableGifts.push(i);
        }
    }
    
    // Reset nếu hết ảnh
    if (availableGifts.length === 0) {
        usedGifts = [];
        availableGifts = [];
        for (let i = 0; i < allGiftImages.length; i++) {
            availableGifts.push(i);
        }
    }
    
    const randomIndex = Math.floor(Math.random() * availableGifts.length);
    const selectedIndex = availableGifts[randomIndex];
    usedGifts.push(selectedIndex);
    
    return allGiftImages[selectedIndex];
}

// ===== Nút mở quà =====
openGiftBtn.addEventListener('click', () => {
    openGift();
    openGiftBtn.style.display = 'none'; // Ẩn nút sau khi nhấn
    openGiftBtn.disabled = true;
});

// ===== Mở quà - ảnh rơi như mưa =====
let isRaining = false;

function openGift() {
    if (isRaining) return;
    isRaining = true;
    
    // Tim lắp lánh + nhanh hơn khi mở quà
    startHeartsTwinkling();
    
    // Load ảnh quà mới
    setTimeout(() => {
        const newImage = getRandomGift();
        document.getElementById('giftImage').src = newImage;
    }, 500);
    
    // Clone liên tục: theo CONFIG
    const rainInterval = setInterval(() => {
        const numImages = Math.floor(Math.random() * 2) + CONFIG.fallingImages.imagesPerSecond - 1;
        
        for (let i = 0; i < numImages; i++) {
            createFallingImage();
        }
    }, 1000);
}

function createFallingImage() {
    const fallingImg = document.createElement('img');
    fallingImg.className = 'falling-image';
    
    // Lấy ảnh từ gift display hiện tại (clone từ ảnh đang hiển thị)
    const currentGiftImage = document.getElementById('giftImage');
    fallingImg.src = currentGiftImage.src; // Clone từ ảnh hiện tại
    
    // Random vị trí rơi từ ngoài screen (gấp đôi screen width)
    const randomLeft = Math.random() * 300 - 150; // -150% tới 150% (ngoài gấp đôi screen)
    const randomDuration = 4; // Speed cố định 4s (linear = mượt)
    
    // Style - Base size 200px sau đó scale theo config
    const baseSize = 200; // Base size (px) - scale sẽ nhân từ đây
    fallingImg.style.width = baseSize + 'px';
    fallingImg.style.height = baseSize + 'px';
    fallingImg.style.objectFit = 'contain'; // Giữ tỷ lệ ảnh
    fallingImg.style.left = randomLeft + '%';
    fallingImg.style.top = '-200px'; // Bắt đầu cao hơn (ngoài screen)
    fallingImg.style.borderRadius = '12px';
    fallingImg.style.animation = `imageFall ${randomDuration}s linear forwards`;
    fallingImg.style.transform = `scale(${CONFIG.fallingImages.scale})`; // ⬅️ Scale từ 200px base
    
    document.body.appendChild(fallingImg);
    
    setTimeout(() => fallingImg.remove(), randomDuration * 1000);
}

// ===== Tim lắp lánh khi mở quà =====
let twinkling = false;

function startHeartsTwinkling() {
    if (twinkling) return;
    twinkling = true;
    
    // Dừng tim bình thường
    document.querySelectorAll('.heart').forEach(h => h.remove());
    
    // Tạo tim lắp lánh nhanh hơn
    const twinkleInterval = setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        
        const randomSize = Math.random() * (CONFIG.heartsTwinkling.maxSize - CONFIG.heartsTwinkling.minSize) + CONFIG.heartsTwinkling.minSize;
        heart.style.fontSize = randomSize + 'px';
        
        const randomDuration = Math.random() * (CONFIG.heartsTwinkling.maxDuration - CONFIG.heartsTwinkling.minDuration) + CONFIG.heartsTwinkling.minDuration;
        heart.style.animation = `heartRise ${randomDuration}s ease-in infinite`;
        
        heartsBackground.appendChild(heart);
        
        setTimeout(() => heart.remove(), randomDuration * 1000);
    }, CONFIG.heartsTwinkling.interval);
}


// ===== Responsive canvas =====
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});