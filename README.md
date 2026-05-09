# Super Mario Bros Clone - HTML5 Canvas & Vanilla JavaScript

A retro, functional Super Mario Bros platformer clone built entirely from scratch using HTML5 Canvas and Vanilla JavaScript. The project aims to recreate the classic 8-bit experience, featuring custom pixel-art rendering, fluid physics, collision detection, and enemy AI.

## 🚀 Project Overview

The core objective of this project was to develop a playable Mario clone that feels authentic to the original NES game while maintaining a modern, premium aesthetic (glassmorphism UI overlays and classic 8-bit fonts). The entire game logic, physics, and rendering are handled natively in the browser without any external game engines like Phaser or Unity.

## 🛠️ Technologies Used

- **HTML5 Canvas**: Provides the drawing API for rendering the game world, player, enemies, and UI.
- **Vanilla JavaScript (ES6+)**: Powers the game loop, object-oriented entity system, physics engine, and input handling.
- **CSS3**: Styles the out-of-game UI, including the start screen and game over overlays, utilizing modern techniques like glassmorphism.
- **Web Audio API**: Dynamically synthesizes retro 8-bit sound effects (square waves and oscillators) and background music directly in the browser, eliminating the need for external audio files.
- **Docker**: Included for easy containerization and deployment via a simple static file server.

## 🏗️ Architecture & Creation Process

The creation process was structured around building a robust foundation before adding gameplay mechanics. Here's a breakdown of the architecture:

### 1. The Game Loop (`game.js`)
At the heart of the game is the `Game` class, which manages the core state (`MENU`, `PLAYING`, `GAMEOVER`). It utilizes `requestAnimationFrame` for a smooth, high-performance game loop. The `loop` function calculates the delta time (`dt`) between frames to ensure movement and physics remain consistent across different monitor refresh rates.

### 2. Entity System (`entities.js`)
The game relies on an object-oriented approach with a base `Entity` class.
- **`Player`**: Inherits from `Entity`. It handles user input for movement and jumping, applies gravity, and renders the Mario pixel art.
- **`Enemy`**: A simple AI that patrols left and right. It inherits from `Entity` and responds to gravity and basic block collisions.
- **`Block`**: Represents ground, destructible bricks, and interactive question mark blocks.

### 3. Custom Pixel-Art Rendering
To maintain the authentic retro feel without loading external image assets, all sprites (Mario, Goombas, and Blocks) are rendered procedurally using string arrays representing 16x16 pixel grids. This approach gives ultimate control over scaling and color palettes directly within the JavaScript code.

### 4. Physics and Collision Detection (`game.js`)
The game implements a custom physics engine:
- **AABB Collision (Axis-Aligned Bounding Box)**: The `checkCollision` function verifies overlaps between entity boundaries.
- **Axis Separation**: When a collision is detected, movement is resolved per axis (X first, then Y). This prevents the player from getting stuck in walls and correctly identifies whether the player landed on a platform, hit their head, or ran into a wall.
- **Entity Interaction**: Landing on an enemy's head bounces the player and defeats the enemy, while touching the side results in a Game Over.

### 5. Level Parsing (`level.js`)
Levels are designed using a simple ASCII-based grid system. The `parseLevel` function translates string arrays (where `G` is ground, `B` is a brick, `?` is a coin block, `E` is an enemy, and `P` is the player spawn) into the game objects mapped to specific coordinates based on a constant `TILE_SIZE`.

### 6. Parallax Camera & HUD
The camera dynamically centers on the player's X-axis. As the player moves forward, the background (hills and clouds) shifts at a slower rate using modulo math to create a parallax scrolling effect. The Heads-Up Display (HUD) overlays the canvas to track the score and coins in real-time.

### 7. Audio System (`sounds.js`)
To avoid loading external copyright-infringing MP3/WAV files, all game audio is generated procedurally using the browser's native **Web Audio API**. 
The `SoundManager` class creates `AudioContext` oscillators to generate classic 8-bit square waves:
- **Background Music**: Plays a looped, multi-note melody sequence.
- **Sound Effects**: Procedurally creates precise frequencies and pitch bends for actions like jumping, stomping enemies, hitting blocks, and the game over sequence.

## 🎮 How to Play

### Controls
- **Move Left**: `Left Arrow` or `A`
- **Move Right**: `Right Arrow` or `D`
- **Jump**: `Up Arrow`, `W`, or `Spacebar`

### Running Locally
To play the game on your local machine, you simply need to serve the project directory using any static web server (e.g., VS Code Live Server, Python's `http.server`, or Node.js `serve`).

Alternatively, if you want to use the provided Docker setup:
```bash
docker build -t mario-clone .
docker run -p 8080:80 mario-clone
```
Then navigate to `http://localhost:8080` in your web browser.
