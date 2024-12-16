//// CONSTANTS AND LEVEL SETUP VARIABLES /////////////////////////////////////////////////////////
const canvas = document.getElementById('elevatorCanvas');
const ctx = canvas.getContext('2d');
ctx.setTransform(1,0,0,-1,0,canvas.height);

  const buildingWidth = 100;
  const buildingHeight = 100;
  const elevatorWidth = 100;
  const elevatorHeight = 100;
  
  let elevatorFloor = 1; // current elevator floor
  const floorTot = levelConfigurations.floorTot;
  
  let doorsOpen = false;
  let alignedFloor = false;
  let overweight = false;
  
  const MAX_WEIGHT = levelConfigurations.MAX_WEIGHT;
  document.getElementById("weightLimit").textContent = `weight limit: ${MAX_WEIGHT}`;
  
  let timer = levelConfigurations.timer;
  let gameended = false;
  
  // elevator face orientation
  const elevatorFaces = ["N", "E", "S", "W"];
  let currFaceIndex = 0; // current face starts with face "N"

  const winSound = document.getElementById('win');
  const loseSound = document.getElementById('lose');

//// INITIALIZING PASSENGERS AND THEIR BEHAVIORS ///////////////////////////////////////////////////
class Passenger {
    constructor(originFace, origin, destination, destinationFace, weight) {
      this.originFace = originFace;
      this.origin = origin;                // e.g. {orientation: 'A', floor: 1}
      this.destination = destination;      // e.g. {orientation: 'B', floor: 2}
      this.destinationFace = destinationFace
      this.weight = weight;
      this.inElevator = false;             // track if passenger in in elevator
      this.created = false;
      this.delivered = false;
      this.transported = false;
      ctx.fillText
    }
}

// creates initial singular passengers and sets them up with correct values
function createPassengerElement(passenger) {
    passenger.el = {
      width: 20,
      height: 40,
    };
}

// adds a new passenger
const passengers = [];
function addPassenger(originFace, origin, destination, destinationFace, weight) {
  const newPassenger = new Passenger(originFace, origin, destination, destinationFace, weight);
  passengers.push(newPassenger);
  createPassengerElement(newPassenger);
}

function initializePassengers() {
  levelConfigurations.passengers.forEach(passenger => {
      addPassenger(passenger.originFace, passenger.origin, passenger.destination, passenger.destinationFace, passenger.weight);
  });
}

function drawText(ctx, textLines, x, y, lineHeight) {
  textLines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
}

// draws the weight, origin and destination on each individual passenger
function passengerLabel(passenger) {

  //// incremental transformation
  ctx.save();

  // move to the text position
  ctx.translate(passenger.el.x, passenger.el.y);

  // apply transformations
  ctx.scale(-1, 1);     // flip horizontally
  ctx.rotate(Math.PI);

  // adjust pos for flipped canvas
  const adjustedX = 10;
  const adjustedY = -45;

  ctx.font = '10px Consolas, "Courier New", monospace';  
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  
  // draw the label text
  drawText(ctx, [
    `${passenger.weight}`,
    `${passenger.originFace} ${passenger.origin}`,
    `${passenger.destinationFace} ${passenger.destination}`
  ], adjustedX, adjustedY, 20);

  ctx.restore();
}

// draws the passenger blocks and determines their positions on screen
function drawPassengers() {

  // offsets
  let passengerElevatorDisplacement = 0;
  let faceDisplacement = {
      N: 0, E: 0, S: 0, W: 0
  };

  passengers.forEach((passenger) => {

      // check if the passenger is on the current elevator floor
      if (passenger.origin === elevatorFloor) {
        ctx.fillStyle = '#E8AC41'; // orange  color for waiting passengers
      } else {
        ctx.fillStyle = 'rgba(186, 172, 145, 0.5)'; // grey for mismatched waiting passegners
      }

    // check if the passenger is waiting on the current floor
    if (!passenger.inElevator && !passenger.delivered && !passenger.transported) {
      let xOffset = 0;
      let yOffset = 0;

      // position the passenger around the elevator based on the origin face direction
      switch (passenger.originFace) {
        case 'N':
          yOffset = -faceDisplacement.N;
          passenger.el.x = ((canvas.width - buildingWidth) / 2) + elevatorWidth / 2 - passenger.el.width / 2;
          passenger.el.y = 450 + elevatorHeight + yOffset;
          faceDisplacement.N -= 60;
          break;
        case 'E':
          xOffset = faceDisplacement.E;
          passenger.el.x = ((canvas.width - buildingWidth) / 2) + 150 + xOffset;
          passenger.el.y = 430;
          faceDisplacement.E += 40;
          break;
        case 'S':
          yOffset = faceDisplacement.S;
          passenger.el.x = ((canvas.width - buildingWidth) / 2) + elevatorWidth / 2 - passenger.el.width / 2;
          passenger.el.y = 400 - elevatorHeight + yOffset;
          faceDisplacement.S -= 60;
          break;
        case 'W':
          xOffset = faceDisplacement.W;
          passenger.el.x = ((canvas.width - buildingWidth) / 2) - 70 + xOffset;
          passenger.el.y = 430;
          faceDisplacement.W -= 40;
          break;
      }

      ctx.fillRect(passenger.el.x, passenger.el.y, passenger.el.width, passenger.el.height);
      passengerLabel(passenger);
    }

    // passengers inside the elevator
    if (passenger.inElevator && !passenger.delivered) {
      passenger.el.x = ((canvas.width - buildingWidth) / 2) + 10 + passengerElevatorDisplacement;
      passenger.el.y = 410;
      ctx.fillStyle = '#4B61D1'; // blue color for passengers inside the elevator
      ctx.fillRect(passenger.el.x, passenger.el.y, passenger.el.width, passenger.el.height);
      passengerLabel(passenger);
      passengerElevatorDisplacement += 30;
    }

    // passengers who have been transported
    if (passenger.transported) {
      console.log("transported");
      passenger.transported = false;
      passenger.delivered = true;
    }
  });
}

//// BUILD GAME'S VISUALS /////////////////////////////////////////////
function drawBuilding() {
    ctx.fillStyle = '#FFFFFF';
    let x = (canvas.width - buildingWidth) / 2;
    let y = 400;
    ctx.fillRect(x, y, buildingWidth, buildingHeight);

    ctx.strokeStyle = '	#960018';
    ctx.lineWidth = 10;
    ctx.strokeRect(x, y, buildingWidth, buildingHeight);
}

// draws the elevator car with matrix transformations
function drawElevator() {

  ctx.fillStyle = 'rgba(245, 207, 114, 0.5)';

  const x = (canvas.width - buildingWidth) / 2;
  const y = 300;

  // get angle for rotation
  const angle = currFaceIndex * (Math.PI / 2);

  ctx.save();

  /// LINQ ///

  // (1) sets TRANSFORMATION MATRIX to the TRANSLATION MATRIX
  // which moves the origin to the center of elevator car
  ctx.setTransform(1, 0, 0, 1, x + elevatorWidth / 2, y + elevatorHeight / 2);

  // (2) multiply the current TRANSFORMATION MATRIX by the ROTATION MATRIX
  // which rotates the drawing about the translated origin
  ctx.transform(Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), 0, 0); // ROTATION MATRIX

  // (3) draw the elevator car at the new position, which is at the rotated origin
  ctx.fillRect(-elevatorWidth / 2, -elevatorHeight / 2, elevatorWidth, elevatorHeight);

    // adds a line at the entrance of the elevator to visually act as the door
    ctx.strokeStyle = '	#65000B';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(-elevatorWidth / 2, -elevatorHeight / 2);
    ctx.lineTo(elevatorWidth / 2, -elevatorHeight / 2); 
    ctx.stroke(); // draws the line
    
  ctx.restore();
}

// draws floor numbers on elevator
function drawFloors() {
  ctx.font = '45px Arial Black';
  ctx.fillStyle = 'rgb(188, 110, 110, 0.5)';
  ctx.textAlign = 'center';
    for (let i = 0; i < floorTot; i++) {
        x = (canvas.width - buildingWidth) / 2 + 50;
        y = 440;

        // only draw floor number if the current floor matches the elevator floor
        if (i + 1 === elevatorFloor) {

          //// incremental transformation
          ctx.save();

          // move to the text position, rotate 180 degrees, and draw the number
          ctx.translate(x, y);
          ctx.scale(-1, 1);
          ctx.rotate(Math.PI);
          ctx.fillText(i + 1, 0, 0);

          ctx.restore();
        }
  }
}

// draws the NESW cardinal directions around the elevator car
function drawNESW() {
  const x = (canvas.width - buildingWidth) / 2 + elevatorWidth / 2;
  const y = 446;
  const labels = ["N", "E", "S", "W"];
  const angleROT = Math.PI / 2; // 90 degrees

  ctx.font = '20px Arial Black';
  ctx.fillStyle = '#65000B';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < labels.length; i++) {

    //// incremental transformation
    ctx.save();

    ctx.translate(x, y);
    ctx.scale(-1, 1);
    ctx.rotate(Math.PI);

    // rotate to correct faces
    const angle = i * angleROT; // 0 for N, 90 degrees for E, ...
    ctx.rotate(angle);
    // move text
    ctx.translate(0, -elevatorHeight / 2 - 20);
    ctx.rotate(-angle);
    ctx.fillText(labels[i], 0, 0);

    ctx.restore();
  }
}

// redraws entire canvas :)
function newCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBuilding();
    drawNESW();
    drawElevator();
    drawPassengers();
    drawFloors();
    checkWinCondition();
}

// check if the elevator is aligned to the floor
function checkFloor(elevatorFloor) {
    if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(elevatorFloor)) {
      document.getElementById("floorNum").textContent = `current floor: ${elevatorFloor}`;
      alignedFloor = true;
    } else {
      alignedFloor = false;
    }
    return alignedFloor;
}

// check weight capacity of the elevator against passengers
function checkWeight(newWeight) {
    let currentWeight = passengers
      .filter(passenger => passenger.inElevator)
      .reduce((total, passenger) => total + passenger.weight, 0);
    let weightTot = currentWeight + newWeight;
    overweight = (weightTot > MAX_WEIGHT);
    return !overweight;
}

// handles passenger entering or exiting the elevator
function openDoor(elevatorFloor) {
    let elevatorFace = elevatorFaces[currFaceIndex];
    passengers.forEach((passenger) => {
        if (passenger.origin === elevatorFloor && passenger.originFace === elevatorFace && !passenger.inElevator && !passenger.transported && !passenger.delivered) {
            if (checkWeight(passenger.weight)) {
                // allow passenger to enter
                passenger.inElevator = true;
            }
        } else if (passenger.destination === elevatorFloor && passenger.destinationFace === elevatorFace && passenger.inElevator) {
            passenger.inElevator = false;
            passenger.transported = true;
        }
    });
}

// the timer which incrementally decreases
function startTimer() {
  document.getElementById("timerDisplay").textContent = `time left: ${timer}`;
  timerRange = setInterval(() => {
    timer--;
    timerDisplay.textContent = `time left: ${timer}`;
    if (timer == 0) {
      clearInterval(timerRange);
      endGame(false);
    }
  }, 1000);
}

// checks if all passengers are delivered to correct destination before timer runs out
function checkWinCondition() {
  for (let i = 0; i < passengers.length; i++) {
    if (!passengers[i].delivered && timer > 0) {
      return;
    }
  }
  endGame(true);
}

// aesthetics for endgame text
function drawEnd(text, color) {

  //// incremental transformation
  ctx.save(); 
  ctx.translate(canvas.width / 2, canvas.height - 50);
  ctx.scale(1, -1);
  ctx.font = '40px Consolas, "Courier New", monospace';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

// tells player if they completed or failed a given level
function endGame(won) {
  clearInterval(timerRange);
  if (won) {
    drawEnd("LEVEL COMPLETE", "#E8AC41");
    winSound.play();
  } else {
    drawEnd("LEVEL FAILED", "#501572");
    loseSound.play();
  }
  gameended = true;
  retryButton();
}

// move elevator controls [ UP / DOWN / LEFT / RIGHT / OPENDOOR ]
document.addEventListener('keydown', (event) => {

    // prevent default action for arrow keys to avoid page scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft', ' '].includes(event.key)) {
        event.preventDefault();
    }

    if (event.key === 'ArrowUp') {
        // move up but not above building
        if (elevatorFloor < floorTot) {
            elevatorFloor += 1;
          }
    
      } else if (event.key === 'ArrowDown') {
        // move down but not below building
        if (elevatorFloor > 1) {
            elevatorFloor -= 1;
          }
    
      } else if (event.key === 'ArrowRight') {
        // orient to right
        currFaceIndex = (currFaceIndex + 1) % elevatorFaces.length;
        document.getElementById("faceDirection").textContent = `facing side: ${elevatorFaces[currFaceIndex]}`;
    
      } else if (event.key === 'ArrowLeft') {
        // orient to left
        currFaceIndex = (currFaceIndex - 1 + elevatorFaces.length) % elevatorFaces.length;
        document.getElementById("faceDirection").textContent = `facing side: ${elevatorFaces[currFaceIndex]}`;
    
      } else if (event.key === ' ' && alignedFloor == true) {
        // space to open and close doors
        openDoor(elevatorFloor);
    
      } else if (doorsOpen && event.key === 'Enter') { 
        // enter to pick up/drop off
        handlePassengerPickupOrDropoff();
      }
    
      checkFloor(elevatorFloor); // outputs current floor text

      if (!gameended) {
        newCanvas(); // update the canvas with the new positions
      }
});

// initialize passengers properties
initializePassengers();

newCanvas();

startTimer();