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

/*
function loadLevel(levelNum) {

    if (levelNum === 1) {
        const script2 = document.createElement("script");
        script2.src = "levels/level0.js";
        script2.onload = function () {
            console.log("level0.js loaded successfully");
        
            // Load canvasScript.js only after level0.js is fully loaded
            const script = document.createElement("script");
            script.src = "js/canvasScript.js";
            script.onload = function () {
                console.log("canvasScript.js loaded successfully");
            };
            document.body.appendChild(script);
        };
         // append the script to the body to load it
        document.body.appendChild(script2);
        
    } else if (levelNum === 2) {
        const script2 = document.createElement("script");
        script2.src = "levels/level1.js";
        script2.onload = function () {
            console.log("level1.js loaded successfully");
        
            // Load canvasScript.js only after level0.js is fully loaded
            const script = document.createElement("script");
            script.src = "js/canvasScript.js";
            script.onload = function () {
                console.log("canvasScript.js loaded successfully");
            };
            document.body.appendChild(script);
        };
         // append the script to the body to load it
        document.body.appendChild(script2);
    
    } else if (levelNum === 3) {
        const script2 = document.createElement("script");
        script2.src = "levels/level2.js";
        script2.onload = function () {
            console.log("level2.js loaded successfully");
        
            // Load canvasScript.js only after level0.js is fully loaded
            const script = document.createElement("script");
            script.src = "js/canvasScript.js";
            script.onload = function () {
                console.log("canvasScript.js loaded successfully");
            };
            document.body.appendChild(script);
        };
         // append the script to the body to load it
        document.body.appendChild(script2);
    
    } else if (levelNum === 4) {
        const script2 = document.createElement("script");
        script2.src = "levels/level3.js";
        script2.onload = function () {
            console.log("level3.js loaded successfully");
        
            // Load canvasScript.js only after level0.js is fully loaded
            const script = document.createElement("script");
            script.src = "js/canvasScript.js";
            script.onload = function () {
                console.log("canvasScript.js loaded successfully");
            };
            document.body.appendChild(script);
        };
         // append the script to the body to load it
        document.body.appendChild(script2);
    } 
}
*/

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
            return loadScript(canvasScript); // load canvasScript.js after level script so can refresh page now
        })
        .then((message) => {
            console.log(message);
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