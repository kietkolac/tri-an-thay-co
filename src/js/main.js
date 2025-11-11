// ===== Biến toàn cục =====
const PASSWORD = '1102025';
let inputPassword = '';
const passwordDisplay = document.getElementById('passwordDisplay');
const errorMessage = document.getElementById('errorMessage');
const deleteBtn = document.getElementById('deleteBtn');
const enterBtn = document.getElementById('enterBtn');
const keypadButtons = document.querySelectorAll('.key[data-num]');

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

// ===== Hỗ trợ phím Enter trên bàn phím =====
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
    passwordDisplay.value = '●'.repeat(inputPassword.length);
    errorMessage.textContent = '';
}

// ===== Kiểm tra mật khẩu =====
function checkPassword() {
    if (inputPassword === PASSWORD) {
        errorMessage.textContent = '✓ Đúng rồi! 20/11 vui vẻ!';
        errorMessage.style.color = '#007A5E';
        
        // Ẩn form sau khi nhập đúng
        setTimeout(() => {
            hideLoginForm();
        }, 500);
        
        // Tạo hiệu ứng pháo hoa
        createFireworks();
    } else {
        errorMessage.textContent = '✗ Sai mật khẩu! Thử lại.';
        errorMessage.style.color = '#CE1126';
        inputPassword = '';
        updateDisplay();
    }
}

// ===== Ẩn form login với hiệu ứng slide =====
function hideLoginForm() {
    const loginBox = document.querySelector('.login-box');
    loginBox.style.transition = 'all 0.6s ease';
    loginBox.style.opacity = '0';
    loginBox.style.transform = 'translateX(100vw)';
    
    setTimeout(() => {
        loginBox.style.display = 'none';
    }, 600);
}

// ===== Hiệu ứng pháo hoa =====
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 12;
        this.vy = (Math.random() - 0.5) * 12;
        this.life = 1;
        this.color = ['#CE1126', '#FFD700', '#007A5E', '#FF6B6B', '#FFA500'][Math.floor(Math.random() * 5)];
        this.size = Math.random() * 4 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // gravity
        this.life -= 0.015;
    }

    draw() {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function createFireworks() {
    // Tạo nhiều pháo hoa ở các vị trí khác nhau
    const positions = [
        { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3 },
        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.2 },
        { x: window.innerWidth * 0.8, y: window.innerHeight * 0.35 },
        { x: window.innerWidth * 0.3, y: window.innerHeight * 0.6 },
        { x: window.innerWidth * 0.7, y: window.innerHeight * 0.5 },
    ];

    positions.forEach(pos => {
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle(pos.x, pos.y));
        }
    });

    animateFireworks();
}

function animateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }

    if (particles.length > 0) {
        requestAnimationFrame(animateFireworks);
    }
}

// ===== Responsive canvas =====
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});