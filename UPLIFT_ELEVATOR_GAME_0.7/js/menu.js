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

function startGame(levelNum) {

    // plays music when starting a game level
    const gameMusic = document.getElementById('gameMusic3');
    gameMusic.play();

    document.getElementById("menu").style.display = "none";
    document.getElementById("game-area").style.display = "block";

    console.log("I am at startgame function right now");

    gameAreaLoaded = true;

    loadLevel(levelNum);
    
}

function loadLevel(levelNum) {

    if (levelNum === 1) {
        const script2 = document.createElement("script");
        script2.src = "levels/level0.js";
        script2.onload = function() {
        console.log("level0.js loaded successfully");
        };
         // append the script to the body to load it
        document.body.appendChild(script2);

        const script = document.createElement("script");
        script.src = "js/canvasScript.js";
        script.onload = function() {
        console.log("canvasScript.js loaded successfully");
        };
         // append the script to the body to load it
        document.body.appendChild(script);
        
    } else if (levelNum === 2) {
        const script2 = document.createElement("script");
        script2.src = "levels/level1.js";
        script2.onload = function() {
        console.log("level1.js loaded successfully");
        };
         // append the script to the body to load it
        document.body.appendChild(script2);

        const script = document.createElement("script");
        script.src = "js/canvasScript.js";
        script.onload = function() {
        console.log("canvasScript.js loaded successfully");
        };
         // append the script to the body to load it
        document.body.appendChild(script);
    
    } else if (levelNum === 3) {
        const script2 = document.createElement("script");
        script2.src = "levels/level2.js";
        script2.onload = function() {
        console.log("level2.js loaded successfully");
        };
        // append the script to the body to load it
        document.body.appendChild(script2);

        const script = document.createElement("script");
        script.src = "js/canvasScript.js";
        script.onload = function() {
        console.log("canvasScript.js loaded successfully");
        };
        // append the script to the body to load it
        document.body.appendChild(script);
    
    } else if (levelNum === 4) {
        const script2 = document.createElement("script");
        script2.src = "levels/level3.js";
        script2.onload = function() {
        console.log("level3.js loaded successfully");
        };
        // append the script to the body to load it
        document.body.appendChild(script2);

        const script = document.createElement("script");
        script.src = "js/canvasScript.js";
        script.onload = function() {
        console.log("canvasScript.js loaded successfully");
        };
        // append the script to the body to load it
        document.body.appendChild(script);
    }
    
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