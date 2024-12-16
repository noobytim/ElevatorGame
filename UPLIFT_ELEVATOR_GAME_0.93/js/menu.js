let gameStarted = false;
let gameLevelLoaded = false;

// check for space to go from title screen to menu (this is only one way btw)
document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !gameStarted) {

        titleSound.play();
        // hides title screen + shows menu screen
        document.getElementById("title-screen").style.display = "none";
        document.getElementById("menu").style.display = "block";

        // can't go back to title screen now
        gameStarted = true;

    }
});

// loads the selected elevator level and canvas container elements
function startGame(levelNum) {

    // plays music when starting a game level
    const gameMusic = document.getElementById('gameMusic3');
    gameMusic.play();

    // menu screen disappears and game-area with shader are visible
    document.getElementById("menu").style.display = "none";
    document.getElementById("game-area").style.display = "block";

    gameAreaLoaded = true;

    loadLevel(levelNum);
    
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(`${src} loaded successfully`);
        script.onerror = () => reject(new Error(`${src} failed to load`));
        document.body.appendChild(script);
    });
}

// loads the desired level number and then the canvas accordingly
function loadLevel(levelNum) {
    const levelScript = `levels/level${levelNum}.js`;
    const canvasScript = "js/canvas.js";

    loadScript(levelScript)
        .then((message) => {
            console.log(message);
            return loadScript(canvasScript);
        })
        .catch((error) => {
            console.error(error);
        });
}

function retry(answer) {
    if (answer) {
        document.getElementById("retry").style.display = "none";
        startGame(levelNum);
    } else {
        document.getElementById("retry").style.display = "none";
        document.getElementById("menu").style.display = "block";
    }
}