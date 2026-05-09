document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    const uiOverlay = document.getElementById('uiOverlay');
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const coinDisplay = document.getElementById('coinDisplay');

    const game = new Game(canvas);

    game.onGameOver = () => {
        gameOverOverlay.classList.remove('hidden');
    };

    game.onScoreUpdate = (score, coins) => {
        scoreDisplay.textContent = score.toString().padStart(6, '0');
        coinDisplay.textContent = coins.toString().padStart(2, '0');
    };

    function startGame() {
        uiOverlay.classList.add('hidden');
        gameOverOverlay.classList.add('hidden');
        
        if (!window.soundManager) {
            window.soundManager = new SoundManager();
        }
        window.soundManager.playMusic();
        
        game.init();
        canvas.focus(); // Ensure canvas/window has focus for keyboard
    }

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
});
