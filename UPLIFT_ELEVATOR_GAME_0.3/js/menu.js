let gameStarted = false;

// check for space to start
document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !gameStarted) {
        // hides title screen + shows menu screen
        document.getElementById("title-screen").style.display = "none";
        document.getElementById("menu").style.display = "block";

        // can't go back to title screen now
        gameStarted = true;
    }
});

function startGame() {
    // plays music when starting a game level
    const gameMusic = document.getElementById('gameMusic2');
    gameMusic2.play();

    document.getElementById("menu").style.display = "none";
    document.getElementById("game-area").style.display = "block";


    initLevel1(); // or initLevel(1); if dynamic level loading ?
}
