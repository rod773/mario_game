# Mario Clone - Agent Notes

## Running
- No build step. Serve `index.html` with any static server (`python -m http.server`, `npx serve`, VS Code Live Server)
- Docker: `docker build -t mario-clone . && docker run -p 8081:80 mario-clone`

## Architecture
- **Entry**: `index.html` → `main.js` → `Game` class in `game.js`
- **Script load order matters** (in `index.html`): `sounds.js` → `input.js` → `entities.js` → `level.js` → `game.js` → `main.js`. Classes reference each other by name across files; wrong order causes ReferenceError.
- **Levels**: ASCII grids in `level.js`, `TILE_SIZE = 40`. Char legend: `G`=ground, `B`=brick, `?`=coin block, `M`=mushroom block, `E`=Goomba, `K`=Koopa, `F`=Flagpole, `P`=player spawn.
- **Entities**: base `Entity` class with subclasses `Player`, `Enemy` (Goomba), `Koopa`, `Block`, `Flagpole`, `Item` (mushroom). `Flagpole` extends `Block` (not `Entity` directly).
- **Koopa states**: `walking` → `shell` (stomped, shrinks) → `sliding` (kicked, kills other enemies on contact).
- **All sprites** are procedural pixel string arrays (no image assets). **Audio** is Web Audio API square-wave oscillators (`sounds.js`, no external files).
- **Physics**: AABB + axis separation, resolved X then Y. `dt` capped at 0.1s to prevent large jumps after tab inactivity.
- Enemies are removed **immediately** (`splice` in same frame) when `dead` flag is set.

## Debugging / Dev
- `window.game` and `window.soundManager` expose live instances
- Game states: `MENU`, `PLAYING`, `GAMEOVER` (plus transient `LEVEL_COMPLETE` during level transition)
- Controls: Arrow keys, WASD, Spacebar
- No TypeScript, no bundler, no linter, no tests — modify JS and refresh
- SoundManager `AudioContext` starts suspended; requires user click to resume (handled by start button)
