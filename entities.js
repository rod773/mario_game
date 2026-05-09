class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.vx = 0;
        this.vy = 0;
        this.dead = false;
    }

    update(dt) {}
    draw(ctx, cameraX) {}
    
    getLeft() { return this.x; }
    getRight() { return this.x + this.width; }
    getTop() { return this.y; }
    getBottom() { return this.y + this.height; }
}

class Player extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.speed = 250;
        this.jumpForce = -700;
        this.gravity = 1500;
        this.onGround = false;
        this.color = '#ef4444'; // Mario red
        this.facingRight = true;
    }

    update(dt, input) {
        // Horizontal movement
        if (input.isDown('ArrowLeft') || input.isDown('KeyA')) {
            this.vx = -this.speed;
            this.facingRight = false;
        } else if (input.isDown('ArrowRight') || input.isDown('KeyD')) {
            this.vx = this.speed;
            this.facingRight = true;
        } else {
            this.vx = 0;
        }

        // Jumping
        if ((input.isDown('ArrowUp') || input.isDown('KeyW') || input.isDown('Space')) && this.onGround) {
            this.vy = this.jumpForce;
            this.onGround = false;
        }

        // Apply gravity
        this.vy += this.gravity * dt;

        // Velocity cap
        if (this.vy > 800) this.vy = 800;
    }

    draw(ctx, cameraX) {
        const marioPixels = [
            ". . . . R R R R R R . . . . . .",
            ". . . R R R R R R R R R R . . .",
            ". . . B B B S S B S . . . . . .",
            ". . B S B S S S B S S S . . . .",
            ". . B S B B S S S B S S S . . .",
            ". . B B S S S S B B B B . . . .",
            ". . . . S S S S S S . . . . . .",
            ". . . R R O R R O R R . . . . .",
            ". . R R R O R R O R R R . . . .",
            ". R R R R O O O O R R R R . . .",
            ". S S R O Y O O Y O R S S . . .",
            ". S S S O O O O O O S S S . . .",
            ". S S O O O O O O O O S S . . .",
            ". . . O O O . . O O O . . . . .",
            ". . B B B . . . . B B B . . . .",
            ". B B B B . . . . B B B B . . ."
        ];
        
        const colors = {
            '.': 'transparent',
            'R': '#e52521', // Mario Red
            'B': '#432817', // Mario Brown
            'S': '#ffcca5', // Skin
            'O': '#049cd8', // Overalls Blue
            'Y': '#ffff00'  // Yellow Buttons
        };

        const pixelSizeW = this.width / 16;
        const pixelSizeH = this.height / 16;
        const drawX = this.x - cameraX;
        
        ctx.save();
        if (!this.facingRight) {
            ctx.translate(drawX + this.width, this.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(drawX, this.y);
        }

        for (let row = 0; row < 16; row++) {
            const cols = marioPixels[row].split(' ');
            for (let col = 0; col < 16; col++) {
                const colorCode = cols[col];
                if (colorCode !== '.') {
                    ctx.fillStyle = colors[colorCode];
                    // Overlap by 0.5 to prevent sub-pixel gaps
                    ctx.fillRect(col * pixelSizeW, row * pixelSizeH, pixelSizeW + 0.5, pixelSizeH + 0.5);
                }
            }
        }
        ctx.restore();
    }
}

class Enemy extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.vx = -50; // Patrol left initially
        this.gravity = 1500;
        this.onGround = false;
        this.color = '#8b5a2b'; // Goomba brown
    }

    update(dt) {
        this.vy += this.gravity * dt;
        if (this.vy > 800) this.vy = 800;
    }

    draw(ctx, cameraX) {
        if (this.dead) return;
        
        const goombaPixels = [
            ". . . . . . . M M . . . . . . .",
            ". . . . . . M M M M . . . . . .",
            ". . . . . M M M M M M . . . . .",
            ". . . . M M M M M M M M . . . .",
            ". . . M M M M M M M M M M . . .",
            ". . M M M M M M M M M M M M . .",
            ". M M W W M M M M M M W W M M .",
            "M M W W W W M M M M W W W W M M",
            "M M W W D W M M M M W D W W M M",
            "M M W D W W M M M M W W D W M M",
            "M M W W W M M M M M M W W W M M",
            "M M M M M M M M M M M M M M M M",
            ". . M M M M . . . . M M M M . .",
            ". L L L . . . . . . . . L L L .",
            "L L L L L . . . . . . L L L L L",
            "L L L L L . . . . . . L L L L L"
        ];
        
        const colors = {
            '.': 'transparent',
            'M': '#c84c0c', // Main Orange/Brown
            'D': '#000000', // Black Eyes
            'W': '#ffffff', // White Eyes
            'L': '#fca044'  // Light Orange Feet
        };

        const pixelSizeW = this.width / 16;
        const pixelSizeH = this.height / 16;
        const drawX = this.x - cameraX;

        for (let row = 0; row < 16; row++) {
            const cols = goombaPixels[row].split(' ');
            for (let col = 0; col < 16; col++) {
                const colorCode = cols[col];
                if (colorCode !== '.') {
                    ctx.fillStyle = colors[colorCode];
                    ctx.fillRect(drawX + col * pixelSizeW, this.y + row * pixelSizeH, pixelSizeW + 0.5, pixelSizeH + 0.5);
                }
            }
        }
    }
}

class Block extends Entity {
    constructor(x, y, width, height, type) {
        super(x, y, width, height);
        this.type = type; // 'ground', 'brick', 'question'
        this.hit = false;
    }

    draw(ctx, cameraX) {
        const drawX = this.x - cameraX;
        const pixelSizeW = this.width / 16;
        const pixelSizeH = this.height / 16;

        let pixels = [];
        let colors = {};

        if (this.type === 'ground' || this.type === 'brick') {
            pixels = [
                "H H H H H H H B H H H H H H H B",
                "M M M M M M M B M M M M M M M B",
                "M M M M M M M B M M M M M M M B",
                "B B B B B B B B B B B B B B B B",
                "H H H B H H H H H H H B H H H H",
                "M M M B M M M M M M M B M M M M",
                "M M M B M M M M M M M B M M M M",
                "B B B B B B B B B B B B B B B B",
                "H H H H H H H B H H H H H H H B",
                "M M M M M M M B M M M M M M M B",
                "M M M M M M M B M M M M M M M B",
                "B B B B B B B B B B B B B B B B",
                "H H H B H H H H H H H B H H H H",
                "M M M B M M M M M M M B M M M M",
                "M M M B M M M M M M M B M M M M",
                "B B B B B B B B B B B B B B B B"
            ];
            colors = {
                'H': '#fca044', // Highlight
                'M': '#c84c0c', // Main Orange
                'B': '#000000'  // Black Line
            };
        } else if (this.type === 'question') {
            if (this.hit) {
                pixels = [
                    "B B B B B B B B B B B B B B B B",
                    "B M M M M M M M M M M M M M M B",
                    "B M b B M M M M M M M M B b M B",
                    "B M B b M M M M M M M M b B M B",
                    "B M M M M M M M M M M M M M M B",
                    "B M M M M M M M M M M M M M M B",
                    "B M M M M M M M M M M M M M M B",
                    "B M M M M M M M M M M M M M M B",
                    "B M M M M M M M M M M M M M M B",
                    "B M M M M M M M M M M M M M M B",
                    "B M M M M M M M M M M M M M M B",
                    "B M M M M M M M M M M M M M M B",
                    "B M M M M M M M M M M M M M M B",
                    "B M b B M M M M M M M M B b M B",
                    "B M B b M M M M M M M M b B M B",
                    "B B B B B B B B B B B B B B B B"
                ];
                colors = {
                    'B': '#000000', // Black
                    'M': '#c84c0c', // Darker Orange
                    'b': '#000000'  // Bolt
                };
            } else {
                pixels = [
                    "B B B B B B B B B B B B B B B B",
                    "B M M M M M M M M M M M M M M B",
                    "B M b B M M M M M M M M B b M B",
                    "B M B b M M M M M M M M b B M B",
                    "B M M M M B B B B B B M M M M B",
                    "B M M M B B M M M M B B M M M B",
                    "B M M M B B M M M M B B M M M B",
                    "B M M M M M M M M B B M M M M B",
                    "B M M M M M M M B B M M M M M B",
                    "B M M M M M M B B M M M M M M B",
                    "B M M M M M M B B M M M M M M B",
                    "B M M M M M M M M M M M M M M B",
                    "B M M M M M M B B M M M M M M B",
                    "B M b B M M M B B M M M B b M B",
                    "B M B b M M M M M M M M b B M B",
                    "B B B B B B B B B B B B B B B B"
                ];
                colors = {
                    'B': '#000000', // Black
                    'M': '#fca044', // Orange
                    'b': '#c84c0c'  // Bolt Dark
                };
            }
        }

        for (let row = 0; row < 16; row++) {
            const cols = pixels[row].split(' ');
            for (let col = 0; col < 16; col++) {
                const colorCode = cols[col];
                ctx.fillStyle = colors[colorCode];
                ctx.fillRect(drawX + col * pixelSizeW, this.y + row * pixelSizeH, pixelSizeW + 0.5, pixelSizeH + 0.5);
            }
        }
    }
}
