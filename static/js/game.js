// Game Constants
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const FPS = 60;

// Colors
const WHITE = "rgb(255, 255, 255)";
const BLACK = "rgb(0, 0, 0)";
const RED = "rgb(255, 0, 0)";
const GREEN = "rgb(0, 255, 0)";
const BLUE = "rgb(0, 0, 255)";
const LIGHT_BLUE = "rgb(100, 100, 255)";
const YELLOW = "rgb(255, 255, 0)";

// Game Variables
let canvas;
let ctx;
let lastTime = 0;
let deltaTime = 0;
let score = 0;
let gameOver = false;
let gameRunning = true;
let highScore = 0; // Track high score
let animationFrameId = null; // Store animation frame ID

// Game Objects
let player;
let bullets = [];
let enemies = [];
let stars = [];

// Input Handling
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    Space: false,
    KeyR: false // For restart
};

// Game Classes
class Star {
    constructor() {
        this.size = Math.floor(Math.random() * 3) + 1;
        this.brightness = Math.floor(Math.random() * 105) + 150;
        this.color = `rgb(${this.brightness}, ${this.brightness}, ${this.brightness})`;
        this.x = Math.random() * SCREEN_WIDTH;
        this.y = Math.random() * SCREEN_HEIGHT;
        this.speed = Math.floor(Math.random() * 2) + 1;
    }

    update() {
        this.y += this.speed;
        if (this.y > SCREEN_HEIGHT) {
            this.y = 0;
            this.x = Math.random() * SCREEN_WIDTH;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

class Player {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = SCREEN_WIDTH / 2 - this.width / 2;
        this.y = SCREEN_HEIGHT - this.height - 10;
        this.speed = 8;
        this.shootDelay = 150; // milliseconds
        this.lastShot = 0;
    }

    update(deltaTime) {
        // Movement
        if (keys.ArrowLeft) this.x -= this.speed;
        if (keys.ArrowRight) this.x += this.speed;
        if (keys.ArrowUp) this.y -= this.speed;
        if (keys.ArrowDown) this.y += this.speed;

        // Keep player on screen
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > SCREEN_WIDTH) this.x = SCREEN_WIDTH - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > SCREEN_HEIGHT) this.y = SCREEN_HEIGHT - this.height;

        // Shooting
        if (keys.Space && lastTime - this.lastShot > this.shootDelay) {
            this.shoot();
            this.lastShot = lastTime;
        }
    }

    shoot() {
        const bullet = new Bullet(this.x + this.width / 2, this.y);
        bullets.push(bullet);
    }

    draw() {
        ctx.fillStyle = GREEN;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collidesWith(enemy) {
        return (
            this.x < enemy.x + enemy.width &&
            this.x + this.width > enemy.x &&
            this.y < enemy.y + enemy.height &&
            this.y + this.height > enemy.y
        );
    }
}

class Enemy {
    constructor() {
        this.width = 30;
        this.height = 30;
        this.x = Math.random() * (SCREEN_WIDTH - this.width);
        this.y = Math.random() * -100 - 40;
        this.speedY = Math.floor(Math.random() * 4) + 1;
        this.speedX = Math.floor(Math.random() * 4) - 2;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;

        // Respawn if off screen
        if (this.y > SCREEN_HEIGHT || 
            this.x < -this.width || 
            this.x > SCREEN_WIDTH) {
            this.x = Math.random() * (SCREEN_WIDTH - this.width);
            this.y = Math.random() * -100 - 40;
            this.speedY = Math.floor(Math.random() * 4) + 1;
            this.speedX = Math.floor(Math.random() * 4) - 2;
        }
    }

    draw() {
        ctx.fillStyle = RED;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Bullet {
    constructor(x, y) {
        this.width = 5;
        this.height = 10;
        this.x = x - this.width / 2;
        this.y = y;
        this.speed = 15;
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.fillStyle = LIGHT_BLUE;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collidesWith(enemy) {
        return (
            this.x < enemy.x + enemy.width &&
            this.x + this.width > enemy.x &&
            this.y < enemy.y + enemy.height &&
            this.y + this.height > enemy.y
        );
    }
}

// Game Functions
function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    // Create game objects and reset game state
    resetGame();

    // Set up keyboard listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Add click event listener for restart button
    canvas.addEventListener("click", handleCanvasClick);

    // Start game loop
    if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function handleKeyDown(e) {
    if (e.key === "ArrowLeft") keys.ArrowLeft = true;
    if (e.key === "ArrowRight") keys.ArrowRight = true;
    if (e.key === "ArrowUp") keys.ArrowUp = true;
    if (e.key === "ArrowDown") keys.ArrowDown = true;
    if (e.key === " ") keys.Space = true;
    if (e.key.toLowerCase() === "r") {
        console.log("R key pressed");
        keys.KeyR = true;
        
        // If game is over and R is pressed, restart
        if (gameOver) {
            console.log("Game is over, restarting game");
            resetGame();
        } else {
            console.log("Game is not over, not restarting");
        }
    }
    
    // Prevent scrolling with arrow keys and space
    if (["ArrowUp", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
    }
}

function handleKeyUp(e) {
    if (e.key === "ArrowLeft") keys.ArrowLeft = false;
    if (e.key === "ArrowRight") keys.ArrowRight = false;
    if (e.key === "ArrowUp") keys.ArrowUp = false;
    if (e.key === "ArrowDown") keys.ArrowDown = false;
    if (e.key === " ") keys.Space = false;
    if (e.key.toLowerCase() === "r") keys.KeyR = false;
}

function handleCanvasClick(event) {
    if (!gameOver) return;
    
    // Check if click is within restart button area
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (x >= SCREEN_WIDTH / 2 - 100 && 
        x <= SCREEN_WIDTH / 2 + 100 && 
        y >= SCREEN_HEIGHT / 2 + 50 && 
        y <= SCREEN_HEIGHT / 2 + 90) {
        resetGame();
    }
}

function resetGame() {
    console.log("Resetting game...");
    
    // Update high score before resetting
    if (score > highScore) {
        highScore = score;
    }
    
    // Reset game state
    gameOver = false;
    gameRunning = true;
    score = 0;
    
    // Clear arrays
    bullets = [];
    enemies = [];
    stars = [];
    
    // Create Player
    player = new Player();

    // Create Stars
    for (let i = 0; i < 100; i++) {
        stars.push(new Star());
    }

    // Create Enemies
    for (let i = 0; i < 8; i++) {
        enemies.push(new Enemy());
    }
    
    // Ensure animation frame is canceled before starting a new one
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    // Start the game loop again
    console.log("Restarting game loop");
    animationFrameId = requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    if (!gameRunning) return;

    // Update player
    player.update(deltaTime);

    // Update stars
    stars.forEach(star => star.update());

    // Update bullets and check for offscreen
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        if (bullets[i].y + bullets[i].height < 0) {
            bullets.splice(i, 1);
        }
    }

    // Update enemies
    enemies.forEach(enemy => enemy.update());

    // Check for collisions
    checkCollisions();
}

function checkCollisions() {
    // Check bullets hitting enemies
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (bullets[i] && bullets[i].collidesWith(enemies[j])) {
                // Remove bullet and enemy
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                
                // Add new enemy and increment score
                enemies.push(new Enemy());
                score++;
                break;
            }
        }
    }

    // Check player collision with enemies
    for (let i = 0; i < enemies.length; i++) {
        if (player.collidesWith(enemies[i])) {
            gameOver = true;
            gameRunning = false;
            break;
        }
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = BLACK;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw stars
    stars.forEach(star => star.draw());

    // Draw bullets
    bullets.forEach(bullet => bullet.draw());

    // Draw enemies
    enemies.forEach(enemy => enemy.draw());

    // Draw player if game is running
    if (gameRunning) {
        player.draw();
    }

    // Draw score
    drawScore();
    
    // Draw game over screen if needed
    if (gameOver) {
        drawGameOver();
    }
}

function drawScore() {
    ctx.fillStyle = WHITE;
    ctx.font = "24px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 10, 30);
    
    // Draw high score
    ctx.textAlign = "right";
    ctx.fillText(`High Score: ${highScore}`, SCREEN_WIDTH - 10, 30);
}

function drawGameOver() {
    // Game over text
    ctx.fillStyle = RED;
    ctx.font = "72px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
    
    // Draw restart button
    ctx.fillStyle = GREEN;
    ctx.fillRect(SCREEN_WIDTH / 2 - 100, SCREEN_HEIGHT / 2 + 50, 200, 40);
    
    ctx.fillStyle = WHITE;
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("RESTART (R)", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 75);
    
    // Draw final score
    ctx.fillStyle = WHITE;
    ctx.font = "36px Arial";
    ctx.fillText(`Final Score: ${score}`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 80);
}

function gameLoop(timestamp) {
    // Calculate delta time
    deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Update and draw
    update(deltaTime);
    draw();

    // Cancel previous animation frame if game is over
    if (gameOver) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    } else {
        // Continue loop if game isn't over
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

// Initialize game when page loads
window.onload = init; 