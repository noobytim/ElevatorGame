//// CONSTANTS /////////////////////////////////////////////////////////
const canvas = document.getElementById('elevatorCanvas');
const ctx = canvas.getContext('2d');
ctx.setTransform(1,0,0,-1,0,canvas.height);

// constants and variables for drawing on canvas
const buildingWidth = 100;
const buildingHeight = 100;

const elevatorWidth = 100;
const elevatorHeight = 100;

let elevatorFloor = 1; // current elevator floor, starting at 0 (floor 1)
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
let currFaceIndex = 0; // starts with face "N"


//// INITIALIZING PASSENGERS AND THEIR BEHAVIORS //////////////////////
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

// initialize passengers properties
initializePassengers();

function drawText(ctx, textLines, x, y, lineHeight) {
  textLines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
}

function passengerLabel(passenger) {

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
  //ctx.fillText(`${passenger.originFace}${passenger.origin} | ${passenger.weight} | ${passenger.destinationFace}${passenger.destination}`, adjustedX, adjustedY);
  drawText(ctx, [
    `${passenger.weight}`,
    `${passenger.originFace} ${passenger.origin}`,
    `${passenger.destinationFace} ${passenger.destination}`
  ], adjustedX, adjustedY, 20);

  ctx.restore();
}

// draws the passengers
// function drawPassengers1() {

//   let passengerElevatorDisplacement = 0;

//   passengers.forEach((passenger) => {
//       if (passenger.inElevator && !passenger.delivered) {
//           // move with elevator
//           passenger.el.x = ((canvas.width - buildingWidth) / 2) + 10 + passengerElevatorDisplacement;
//           passenger.el.y = 100 + elevatorFloor;
//           ctx.fillStyle = '#F9CCCA';
//           passengerElevatorDisplacement += 30;

      // } else if (passenger.transported) {
      //     // move to left of elevator
      //     console.log("trasnported");
      //     passenger.transported = false;
      //     passenger.delivered = true;
      //     passenger.el.x = 100;
      //     passenger.el.y = 100 + elevatorFloor;
      //     ctx.fillStyle = '#E8AC41';

      // } else if (passenger.delivered) {
      //     ctx.fillStyle = '#E8AC41';

      // } else if (!passenger.inElevator && !passenger.delivered) {
      //     // remain outside elevator
      //     passenger.el.x = 450;
      //     passenger.el.y = (passenger.origin * 100);
      //     ctx.fillStyle = '#4B61D1';
      // }

//       // draw the passenger rectangle
//       ctx.fillRect(passenger.el.x, passenger.el.y, passenger.el.width, passenger.el.height);

//       passengerLabel(passenger);
//   });
// }

function drawPassengers() {
  passengers.forEach((passenger) => {
    // Only draw the passenger if their origin floor matches the current elevator floor
    if (passenger.origin === elevatorFloor && !passenger.inElevator && !passenger.delivered) {
      // Position the passenger around the elevator based on the origin face (NESW)
      switch (passenger.originFace) {
        case 'N':
          // Place passenger above the elevator
          passenger.el.x = ((canvas.width - buildingWidth) / 2) + elevatorWidth / 2 - passenger.el.width / 2;
          passenger.el.y = 450 + elevatorHeight;
          break;
        case 'E':
          // Place passenger to the right of the elevator
          passenger.el.x = ((canvas.width - buildingWidth) / 2) + 150;
          passenger.el.y = 100 + elevatorFloor * 100 + elevatorHeight / 2 - passenger.el.height / 2;
          break;
        case 'S':
          // Place passenger below the elevator
          passenger.el.x = ((canvas.width - buildingWidth) / 2) + elevatorWidth / 2 - passenger.el.width / 2;
          passenger.el.y = 400 - elevatorHeight;
          break;
        case 'W':
          // Place passenger to the left of the elevator
          passenger.el.x = ((canvas.width - buildingWidth) / 2) - 70;
          passenger.el.y = 430;
          break;
      }

      // Additional logic for transported, delivered, or other states
      if (passenger.transported) {
        passenger.transported = false;
        passenger.delivered = true;
        passenger.el.x = 100;
        passenger.el.y = 100 + elevatorFloor;
        ctx.fillStyle = '#E8AC41'; // Delivered color
      } else if (passenger.delivered) {
        ctx.fillStyle = '#E8AC41'; // Delivered color
      } else if (!passenger.inElevator && !passenger.delivered) {
        passenger.el.x = 450;
        passenger.el.y = passenger.origin * 100;
        ctx.fillStyle = '#4B61D1'; // Waiting outside elevator color
      } else {
        ctx.fillStyle = '#4B61D1'; // Default color
      }

      // Draw the passenger rectangle and label
      ctx.fillRect(passenger.el.x, passenger.el.y, passenger.el.width, passenger.el.height);
      passengerLabel(passenger);
    }
  });
}




//// BUILD GAME'S VISUALS /////////////////////////////////////////////
function drawBuilding() {
    ctx.fillStyle = '#FFFFFF';
    let x = (canvas.width - buildingWidth) / 2;
    let y = 400;
    ctx.fillRect(x, y, buildingWidth, buildingHeight);

    ctx.strokeStyle = '#FFFFF';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, buildingWidth, buildingHeight);
}

// draws the elevator car with matrix transformations
function drawElevator() {

  ctx.fillStyle = 'rgba(245, 207, 114, 0.5)';

  const x = (canvas.width - buildingWidth) / 2;
  const y = 300;

  // Calculate the angle for rotation (90 degrees per face change)
  const angle = currFaceIndex * (Math.PI / 2);  // 0 for N, 90 degrees for E, 180 for S, 270 for W

  ctx.save();

  // Multiply the current transformation matrix by the translation matrix
  ctx.setTransform(1, 0, 0, 1, x + elevatorWidth / 2, y + elevatorHeight / 2); // move to the center

  // Multiply the current transformation matrix by the rotation matrix
  ctx.transform(Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), 0, 0); // rotation matrix

  // Now draw the elevator car at the new position, which is at the rotated origin
  ctx.fillRect(-elevatorWidth / 2, -elevatorHeight / 2, elevatorWidth, elevatorHeight); // draw at the rotated position

    // add a line at the top of the elevator 
    ctx.strokeStyle = 'rgb(188, 110, 110)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-elevatorWidth / 2, -elevatorHeight / 2);
    ctx.lineTo(elevatorWidth / 2, -elevatorHeight / 2); 
    ctx.stroke(); // draws the line
    
  ctx.restore();
}

// draws floor numbers on elevator
function drawFloors() {
  ctx.font = '45px Arial Black';
  ctx.fillStyle = 'rgb(188, 110, 110)';
  ctx.textAlign = 'center';
    for (let i = 0; i < floorTot; i++) {
        x = (canvas.width - buildingWidth) / 2 + 50;
        y = 440;

        // only draw floor number if the current floor matches the elevator floor
        if (i + 1 === elevatorFloor) {

          // save the current state
          ctx.save();

          // move to the text position, rotate 180 degrees, and draw the number
          ctx.translate(x, y);
          ctx.scale(-1, 1); // flip horizontally
          ctx.rotate(Math.PI); // 180 degrees in radians
          ctx.fillText(i + 1, 0, 0); // draw at the rotated origin

          ctx.restore();
        }
  }
}

function drawNESW() {
  const x = (canvas.width - buildingWidth) / 2 + elevatorWidth / 2;
  const y = 446;
  const labels = ["N", "E", "S", "W"];
  const angleStep = Math.PI / 2; // 90 degrees in radians

  ctx.font = '20px Arial Black';
  ctx.fillStyle = 'rgb(188, 110, 110)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < labels.length; i++) {
    ctx.save();

    ctx.translate(x, y);
    ctx.scale(-1, 1);
    ctx.rotate(Math.PI);

    // Rotate to the correct face (0, 90, 180, 270 degrees)
    const angle = i * angleStep; // 0 for N, 90 degrees for E, etc.
    ctx.rotate(angle);

    // Move text outward from the center
    ctx.translate(0, -elevatorHeight / 2 - 20); // Adjust the offset (-20 for spacing)

    // Reset the rotation so the text appears upright
    ctx.rotate(-angle);

    // Draw the label
    ctx.fillText(labels[i], 0, 0);

    ctx.restore();
  }
}

function newCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBuilding();
    drawNESW();
    drawFloors();
    drawElevator();
    drawPassengers();
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

// check weight capacity of the elevator
function checkWeight(newWeight) {
    let currentWeight = passengers
      .filter(passenger => passenger.inElevator)
      .reduce((total, passenger) => total + passenger.weight, 0);
    let weightTot = currentWeight + newWeight;
    overweight = (weightTot > MAX_WEIGHT);
    console.log("overweight?:", overweight);
    return !overweight;
}


// handles passenger entering or exiting the elevator
function openDoor(elevatorFloor) {
    let elevatorFace = elevatorFaces[currFaceIndex];
    passengers.forEach((passenger) => {
        if (passenger.origin === elevatorFloor && passenger.originFace === elevatorFace && !passenger.inElevator && !passenger.transported && !passenger.delivered) {
            console.log("passenger matches elevator to pick up!")
            if (checkWeight(passenger.weight)) {
                // allow passenger to enter
                passenger.inElevator = true;
                console.log(`Passenger entered at floor ${passenger.origin}`);
            }
        } else if (passenger.destination === elevatorFloor && passenger.destinationFace === elevatorFace && passenger.inElevator) {
            console.log("passenger with desired floor", passenger.destination, "matches elevator", elevatorFloor, "to drop off!")
            passenger.inElevator = false;
            passenger.transported = true;
            console.log(`Passenger exited at floor ${passenger.destination}`);
        }
    });
}

// the timer
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

function checkWinCondition() {
  for (let i = 0; i < passengers.length; i++) {
    if (!passengers[i].delivered && timer > 0) {
      return;
    }
  }
  endGame(true);
}

function drawEnd(text, color) {
  ctx.save(); 
  ctx.translate(canvas.width / 2, canvas.height - 50);
  ctx.scale(1, -1);
  ctx.font = '60px Consolas, "Courier New", monospace';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function endGame(won) {
clearInterval(timerRange);
if (won) {
  //console.log("you win!");
  drawEnd("LEVEL COMPLETE", "#E8AC41");
} else {
  //console.log("you lost!");
  drawEnd("LEVEL FAILED", "#501572");
}
gameended = true;
retryButton();
}

startTimer();

// move elevator controls [ UP / DOWN ]
document.addEventListener('keydown', (event) => {
    // prevent default action for arrow keys to avoid page scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft', ' '].includes(event.key)) {
        event.preventDefault();
    }

    if (event.key === 'ArrowUp') {
        // move up but not above building
        if (elevatorFloor < floorTot) {
            elevatorFloor += 1;
            console.log("moved up!");
          }
    
      } else if (event.key === 'ArrowDown') {
        // move down but not below building
        if (elevatorFloor > 1) {
            elevatorFloor -= 1;
            console.log("moved down!");
          }
    
      } else if (event.key === 'ArrowRight') {
        // orient to right
        currFaceIndex = (currFaceIndex + 1) % elevatorFaces.length;
        document.getElementById("faceDirection").textContent = `facing side: ${elevatorFaces[currFaceIndex]}`;

        //changeElevatorFace('left');  // rotate clockwise by 90 degrees

    
      } else if (event.key === 'ArrowLeft') {
        // orient to left
        currFaceIndex = (currFaceIndex - 1 + elevatorFaces.length) % elevatorFaces.length;
        document.getElementById("faceDirection").textContent = `facing side: ${elevatorFaces[currFaceIndex]}`;

        //changeElevatorFace('right');

    
      } else if (event.key === ' ' && alignedFloor == true) {
        // space to open and close doors
        openDoor(elevatorFloor);
        console.log("doors are opening / closing");
        console.log("-----------------------------------------------");
    
      } else if (doorsOpen && (event.key === 'a' || event.key === 'd')) { // [ A | D ] for selecting passenger
        moveSelection(event.key === 'a' ? 'left' : 'right');
    
      } else if (doorsOpen && event.key === 'Enter') { // enter to pick up/drop off
        handlePassengerPickupOrDropoff();
      }
    
      checkFloor(elevatorFloor); // outputs current floor text

      if (!gameended) {
        newCanvas(); // Update the canvas with the new positions
      }
});



newCanvas();