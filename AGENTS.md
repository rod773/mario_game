# Mario Clone - Agent Notes

## Running
- No build step. Serve `index.html` directly with any static server (e.g., VS Code Live Server, `python -m http.server`, `npx serve`)
- Docker: `docker build -t mario-clone . && docker run -p 8081:80 mario-clone`

## Architecture
- Entry: `index.html` → `main.js` → `Game` class in `game.js`
- Entities: base `Entity` class in `entities.js`
- Levels: ASCII grids in `level.js` (char legend: `G`=ground, `B`=brick, `?`=coin, `M`=mushroom, `E`=Goomba, `K`=Koopa, `F`=Flagpole, `P`=player spawn)
- Audio: `SoundManager` in `sounds.js` (Web Audio API oscillators, no external files)
- All sprites rendered procedurally from pixel string arrays (no image assets)

## Debugging / Dev
- `window.game` exposes the live `Game` instance
- `window.soundManager` exposes the `SoundManager` instance
- Game states: `MENU`, `PLAYING`, `GAMEOVER`
- Physics: AABB + axis separation, resolved X then Y

## No Build Tooling
- No TypeScript, no bundler, no linter, no tests
- Modify JS files directly and refresh the browser
