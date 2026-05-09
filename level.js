const TILE_SIZE = 40;

const levelData = [
    "............................................................",
    "............................................................",
    "............................................................",
    "............................................................",
    "............................................................",
    "............................................................",
    "..................B?B.......................................",
    "............................................................",
    ".......................BBB..................................",
    "........?...................................................",
    ".................................E..........................",
    "..................E.........................BBB.............",
    "............P..........BBBB.................................",
    "............................................................",
    "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG"
];

function parseLevel(levelMap) {
    const blocks = [];
    const enemies = [];
    let playerStart = { x: 50, y: 50 };

    for (let row = 0; row < levelMap.length; row++) {
        for (let col = 0; col < levelMap[row].length; col++) {
            const char = levelMap[row][col];
            const x = col * TILE_SIZE;
            const y = row * TILE_SIZE;

            if (char === 'G') {
                blocks.push(new Block(x, y, TILE_SIZE, TILE_SIZE, 'ground'));
            } else if (char === 'B') {
                blocks.push(new Block(x, y, TILE_SIZE, TILE_SIZE, 'brick'));
            } else if (char === '?') {
                blocks.push(new Block(x, y, TILE_SIZE, TILE_SIZE, 'question'));
            } else if (char === 'E') {
                enemies.push(new Enemy(x, y, TILE_SIZE, TILE_SIZE));
            } else if (char === 'P') {
                playerStart = { x, y };
            }
        }
    }
    return { blocks, enemies, playerStart };
}
