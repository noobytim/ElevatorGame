//// CONSTANTS /////////////////////////////////////////////////////////
const canvas = document.getElementById('elevatorCanvas');
const ctx = canvas.getContext('2d');
ctx.setTransform(1,0,0,-1,0,canvas.height);

// Constants for drawing on canvas
const buildingWidth = 100;
const elevatorHeight = 100; // Height of elevator in pixels on the canvas
const buildingHeight = 600; // Height of building in pixels on the canvas
const elevatorWidth = 100;

let elevatorFloor = 0; // Current elevator floor, starting at 0 (bottom)
let floorTot = 6;

let doorsOpen = false;
let alignedFloor = false;
let overweight = false;

// elevator face orientation
const elevatorFaces = ["N", "E", "S", "W"];
let currFaceIndex = 0; // Starts with face "N"

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
    }
}

// creaes initial singular passengers and sets them up with correct values
function createPassengerElement(passenger) {
        passenger.el = {
            width: 20,
            height: 40,
          };
          passenger.inElevator = false;
          passenger.transported = false;
          passenger.delivered = false;
        ctx.fillText
}

// adds a new passenger
const passengers = [];
function addPassenger(originFace, origin, destination, destinationFace, weight) {
  const newPassenger = new Passenger(originFace, origin, destination, destinationFace, weight);
  passengers.push(newPassenger);
  createPassengerElement(newPassenger);
}

// initialize passengers properties
addPassenger(elevatorFaces[0], 1, 6, elevatorFaces[0], 50);
addPassenger(elevatorFaces[1], 4, 1, elevatorFaces[3], 50);
addPassenger(elevatorFaces[2], 3, 5, elevatorFaces[1], 50);


function passengerLabel(passenger) {
  // Save the current canvas state
  ctx.save();

  // Move to the text position
  ctx.translate(passenger.el.x, passenger.el.y);

  // Apply transformations
  ctx.scale(-1, 1); // Flip horizontally
  ctx.rotate(Math.PI); // Rotate 180 degrees (flip vertically)

  // Adjust the position for the flipped canvas
  const adjustedX = 10;  // Since we're flipping, we need to adjust x
  const adjustedY = -45;  // You can adjust y if needed

  ctx.font = '10px italic';
  ctx.fillStyle = 'darkpurple';
  ctx.textAlign = 'center';
  
  // draw the text
  ctx.fillText(`${passenger.originFace}${passenger.origin} | ${passenger.weight} | ${passenger.destinationFace}${passenger.destination}`, adjustedX, adjustedY);
  
  // restores canvas state
  ctx.restore();
}

// draws the passengers
function drawPassengers() {

  let passengerDisplacement = 0;

  passengers.forEach((passenger) => {
      if (passenger.inElevator && !passenger.delivered) {
          // move with elevator
          passenger.el.x = ((canvas.width - buildingWidth) / 2) + 10 + passengerDisplacement;
          passenger.el.y = 100 + elevatorFloor;
          ctx.fillStyle = 'maroon';
          passengerDisplacement += 60;

      } else if (passenger.transported) {
          // move to left of elevator
          console.log("trasnported");
          passenger.transported = false;
          passenger.delivered = true;
          passenger.el.x = 100;
          passenger.el.y = 100 + elevatorFloor;
          ctx.fillStyle = '#E8AC41';

      } else if (passenger.delivered) {
          ctx.fillStyle = '#E8AC41';

      } else if (!passenger.inElevator && !passenger.delivered) {
          // Remain outside elevator
          passenger.el.x = 450;
          passenger.el.y = (passenger.origin * 100);
          ctx.fillStyle = '#4B61D1';
      }

      // draw the passenger rectangle
      ctx.fillRect(passenger.el.x, passenger.el.y, passenger.el.width, passenger.el.height);
      passengerLabel(passenger);
  });
}

//// BUILD GAME'S VISUALS /////////////////////////////////////////////
function drawBuilding() {
    ctx.fillStyle = '#FFFFFF';
    const x = (canvas.width - buildingWidth) / 2;
    const y = 100;
    ctx.fillRect(x, y, buildingWidth, buildingHeight);

    ctx.strokeStyle = '#FFFFF';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, buildingWidth, buildingHeight);
}
 
function drawElevator() {
    ctx.fillStyle = 'rgba(245, 207, 114, 0.5)';
    x = ((canvas.width - buildingWidth) / 2);
    y = 100 + elevatorFloor;
    ctx.fillRect(x,y, elevatorWidth, elevatorHeight);
}

// draws floor lines and numbers on building
function drawFloors() {
  //ctx.font = "80px Georgia, 'Times New Roman', Times, serif";
  ctx.font = '45px Arial Black';
  ctx.fillStyle = 'rgb(188, 110, 110)';
  ctx.textAlign = 'center';
    for (let i = 0; i < floorTot; i++) {
        x = (canvas.width - buildingWidth) / 2;
        y = 100 + i * 100;
        ctx.fillRect(x, y, buildingWidth, 2);
        let floorX = x + 50;
        let floorY = y + 30;

      // save the current state
      ctx.save();
    
      // Move to the text position, rotate 180 degrees, and draw the number
      ctx.translate(floorX, floorY);
      ctx.scale(-1,1); // flip horiz
      ctx.rotate(Math.PI); // 180 degrees in radians
      ctx.fillText(i + 1, 0, 0); // Draw at the rotated origin
      
      // restore the canvas state
      ctx.restore();
    }
  }

function newCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBuilding();
    drawFloors();
    drawElevator();
    drawPassengers();
}

// check if the elevator is aligned to the floor
function checkFloor(elevatorFloor) {
    if ([0, 100, 200, 300, 400, 500].includes(elevatorFloor)) {
      document.getElementById("floorNum").textContent = `current floor: ${elevatorFloor / 100 + 1}`;
      alignedFloor = true;
    } else {
      alignedFloor = false;
    }
    return alignedFloor;
}

let MAX_WEIGHT = 100;
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
        if (passenger.origin === elevatorFloor/100 + 1 && passenger.originFace === elevatorFace && !passenger.inElevator && !passenger.transported && !passenger.delivered) {
            console.log("passenger matches elevator to pick up!")
            if (checkWeight(passenger.weight)) {
                // allow passenger to enter
                passenger.inElevator = true;
                console.log(`Passenger entered at floor ${passenger.origin}`);
            }
        } else if (passenger.destination === elevatorFloor/100 + 1 && passenger.destinationFace === elevatorFace && passenger.inElevator) {
            console.log("passenger with desired floor", passenger.destination, "matches elevator", elevatorFloor, "to drop off!")
            passenger.inElevator = false;
            passenger.transported = true;
            console.log(`Passenger exited at floor ${passenger.destination}`);
        }
    });
}


// move elevator controls [ UP / DOWN ]
document.addEventListener('keydown', (event) => {
    // Prevent default action for arrow keys to avoid page scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft', ' '].includes(event.key)) {
        event.preventDefault();
    }

    if (event.key === 'ArrowUp') {
        // move up but not above building
        if (elevatorFloor + elevatorHeight < buildingHeight) {
            elevatorFloor += 100;
          }
    
      } else if (event.key === 'ArrowDown') {
        // move down but not below building
        if (elevatorFloor > 0) {
            elevatorFloor -= 100;
          }
    
      } else if (event.key === 'ArrowRight') {
        // orient to right
        currFaceIndex = (currFaceIndex + 1) % elevatorFaces.length;
        //console.log("Elevator is now facing: " + elevatorFaces[currFaceIndex]);
        document.getElementById("faceDirection").textContent = `facing side: ${elevatorFaces[currFaceIndex]}`;
    
      } else if (event.key === 'ArrowLeft') {
        // orient to left
        currFaceIndex = (currFaceIndex - 1 + elevatorFaces.length) % elevatorFaces.length;
        //console.log("Elevator is now facing: " + elevatorFaces[currFaceIndex]);
        document.getElementById("faceDirection").textContent = `facing side: ${elevatorFaces[currFaceIndex]}`;
    
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
      //updateElevatorPosition(elevatorFloor); // updates elevator and passenger pos
    
    newCanvas(); // Update the canvas with the new positions
});

newCanvas();