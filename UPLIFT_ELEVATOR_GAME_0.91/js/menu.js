let gameStarted = false;
let gameLevelLoaded = false;

// check for space to go from title screen to menu (this is only one way btw)
document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !gameStarted) {

        titleSound.play();
        // hides title screen + shows menu screen
        document.getElementById("title-screen").style.display = "none";
        document.getElementById("menu").style.display = "block";

        console.log("I am at addEventListener now");

        // can't go back to title screen now
        gameStarted = true;

        //document.removeEventListener("keydown", handleSpacebar);
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

    console.log("I am at startgame function right now");

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

function loadLevel(levelNum) {
    const levelScript = `levels/level${levelNum - 1}.js`;
    const canvasScript = "js/canvasScript.js";

    loadScript(levelScript)
        .then((message) => {
            console.log(message);
            return loadScript(canvasScript);
        })
        .catch((error) => {
            console.error(error);
        });
}



function retryButton() {

    //document.getElementById("menu").style.display = "none";
    //document.getElementById("game-area").style.display = "none";
    //document.getElementById("retry").style.display = "block";

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