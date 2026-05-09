class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.input = new InputHandler();
        this.lastTime = 0;
        this.cameraX = 0;
        
        this.blocks = [];
        this.enemies = [];
        this.player = null;
        
        this.score = 0;
        this.coins = 0;
        this.state = 'MENU'; // MENU, PLAYING, GAMEOVER
        
        this.onGameOver = null;
        this.onScoreUpdate = null;
    }

    init() {
        const level = parseLevel(levelData);
        this.blocks = level.blocks;
        this.enemies = level.enemies;
        this.player = new Player(level.playerStart.x, level.playerStart.y, 30, 40);
        
        this.cameraX = 0;
        this.score = 0;
        this.coins = 0;
        this.updateHUD();
        this.state = 'PLAYING';
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    stop() {
        this.state = 'MENU';
    }

    updateHUD() {
        if (this.onScoreUpdate) {
            this.onScoreUpdate(this.score, this.coins);
        }
    }

    loop(currentTime) {
        if (this.state !== 'PLAYING') return;

        const dt = (currentTime - this.lastTime) / 1000; // Delta time in seconds
        this.lastTime = currentTime;

        // Prevent huge jumps if tab is inactive
        if (dt < 0.1) {
            this.update(dt);
        }
        this.draw();

        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        // Update Player
        this.player.update(dt, this.input);

        // Apply Player Physics & Collisions
        this.applyPhysics(this.player, dt);

        // Update Camera (center on player)
        this.cameraX = Math.max(0, this.player.x - this.canvas.width / 2 + this.player.width / 2);

        // Update Enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Only update enemies near camera
            if (enemy.x > this.cameraX - 200 && enemy.x < this.cameraX + this.canvas.width + 200) {
                enemy.update(dt);
                this.applyPhysics(enemy, dt);

                // Player-Enemy Collision
                if (!enemy.dead && this.checkCollision(this.player, enemy)) {
                    // Check if player landed on top
                    if (this.player.vy > 0 && this.player.getBottom() < enemy.getTop() + 15) {
                        enemy.dead = true;
                        this.player.vy = this.player.jumpForce * 0.7; // Bounce
                        this.score += 100;
                        this.updateHUD();
                    } else {
                        // Player takes damage
                        this.gameOver();
                        return; // Stop update
                    }
                }
            }
            
            if (enemy.dead) {
                // Remove immediately for MVP
                this.enemies.splice(i, 1);
            }
        }

        // Check falling out of bounds
        if (this.player.y > this.canvas.height + 100) {
            this.gameOver();
        }
    }

    applyPhysics(entity, dt) {
        // X movement
        entity.x += entity.vx * dt;
        this.handleCollisions(entity, 'x');

        // Y movement
        entity.y += entity.vy * dt;
        entity.onGround = false;
        this.handleCollisions(entity, 'y');
    }

    checkCollision(rect1, rect2) {
        return (
            rect1.getLeft() < rect2.getRight() &&
            rect1.getRight() > rect2.getLeft() &&
            rect1.getTop() < rect2.getBottom() &&
            rect1.getBottom() > rect2.getTop()
        );
    }

    handleCollisions(entity, axis) {
        for (const block of this.blocks) {
            if (this.checkCollision(entity, block)) {
                if (axis === 'x') {
                    if (entity.vx > 0) { // Moving right
                        entity.x = block.getLeft() - entity.width;
                    } else if (entity.vx < 0) { // Moving left
                        entity.x = block.getRight();
                    }
                    entity.vx = 0;
                    if (entity instanceof Enemy) {
                        entity.vx *= -1; // Reverse direction
                    }
                } else if (axis === 'y') {
                    if (entity.vy > 0) { // Falling down
                        entity.y = block.getTop() - entity.height;
                        entity.onGround = true;
                        entity.vy = 0;
                    } else if (entity.vy < 0) { // Jumping up
                        entity.y = block.getBottom();
                        entity.vy = 0;
                        
                        // Hit block from below
                        if (entity instanceof Player) {
                            if (block.type === 'question' && !block.hit) {
                                block.hit = true;
                                this.coins++;
                                this.score += 200;
                                this.updateHUD();
                            } else if (block.type === 'brick') {
                                // Break brick (optional, for now just score)
                                this.score += 50;
                                this.updateHUD();
                            }
                        }
                    }
                }
            }
        }
    }

    drawBackground() {
        const bgOffset = (this.cameraX * 0.5) % 800; // Parallax effect
        
        this.ctx.save();
        // Repeat background to cover the scrolling camera
        for (let i = -1; i < 4; i++) {
            const offsetX = i * 800 - bgOffset + Math.floor(this.cameraX / 800) * 800;
            
            // Hill 1
            this.ctx.fillStyle = '#00a800'; // Classic Green
            this.ctx.beginPath();
            this.ctx.arc(150 + offsetX, 560, 100, Math.PI, 0); // 560 is ground level
            this.ctx.fill();
            
            // Hill 2
            this.ctx.beginPath();
            this.ctx.arc(500 + offsetX, 560, 60, Math.PI, 0);
            this.ctx.fill();

            // Cloud 1
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(100 + offsetX, 150, 30, 0, Math.PI * 2);
            this.ctx.arc(130 + offsetX, 130, 40, 0, Math.PI * 2);
            this.ctx.arc(160 + offsetX, 150, 30, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Cloud 2
            this.ctx.beginPath();
            this.ctx.arc(450 + offsetX, 200, 20, 0, Math.PI * 2);
            this.ctx.arc(470 + offsetX, 180, 30, 0, Math.PI * 2);
            this.ctx.arc(490 + offsetX, 200, 20, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();

        // Draw blocks
        for (const block of this.blocks) {
            if (block.getRight() > this.cameraX && block.getLeft() < this.cameraX + this.canvas.width) {
                block.draw(this.ctx, this.cameraX);
            }
        }

        // Draw enemies
        for (const enemy of this.enemies) {
            if (enemy.getRight() > this.cameraX && enemy.getLeft() < this.cameraX + this.canvas.width) {
                enemy.draw(this.ctx, this.cameraX);
            }
        }

        // Draw player
        if (this.player) {
            this.player.draw(this.ctx, this.cameraX);
        }
    }

    gameOver() {
        this.state = 'GAMEOVER';
        if (this.onGameOver) {
            this.onGameOver();
        }
    }
}
