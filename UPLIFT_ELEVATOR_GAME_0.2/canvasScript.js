//// CONSTANTS /////////////////////////////////////////////////////////
const canvas = document.getElementById('elevatorCanvas');
const ctx = canvas.getContext('2d');

// Constants for drawing on canvas
const buildingWidth = 100;
const elevatorHeight = 100; // Height of elevator in pixels on the canvas
const buildingHeight = 600; // Height of building in pixels on the canvas
const elevatorWidth = 96;

let elevatorFloor = buildingHeight - elevatorHeight; // Current elevator floor, starting at 0 (bottom)
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
    }
}

// creates singular passengers
function createPassengerElement(passenger) {
    passenger.el = {
      x: 450, // Set fixed x-position for passenger on the right side of the building
      y: (passenger.origin * 100) + 60, // Set y-position based on the origin floor
      width: 20,
      height: 40,
    };
    passenger.inElevator = false;
}

// adds a new passenger
const passengers = [];
function addPassenger(origin, destination, weight) {
  const newPassenger = new Passenger(origin, destination, weight);
  passengers.push(newPassenger);
  createPassengerElement(newPassenger);
}

// initialize passengers properties
addPassenger(elevatorFaces[0], 1, 4, elevatorFaces[1], 180);
addPassenger(elevatorFaces[0], 4, 1, elevatorFaces[3], 205);
addPassenger(elevatorFaces[2], 3, 5, elevatorFaces[1], 50);


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

// draws floor lines and numbers on building
function drawFloors() {
    ctx.fillStyle = 'rgb(121, 74, 35)';
    for (let i = 0; i < floorTot; i++) {
        x = (canvas.width - buildingWidth) / 2;
        y = 100 + i * 100;
        ctx.fillRect(x, y, buildingWidth, 2);
    }
  }
 
function drawElevator() {
    ctx.fillStyle = '#f5cf72';
    x = ((canvas.width - buildingWidth) / 2)+2;
    y = 100 + elevatorFloor;
    ctx.fillRect(x,y, elevatorWidth, elevatorHeight);
}

// draws the passengers
function drawPassengers() {
    passengers.forEach((passenger) => {
      if (passenger.inElevator) {
        ctx.fillStyle = 'maroon';
        ctx.fillRect(passenger.el.x, passenger.el.y, passenger.el.width, passenger.el.height);
        // Draw the passenger label inside or next to the elevator rectangle
        ctx.fillStyle = 'black';
        ctx.font = '10px Arial';
        ctx.fillText(`[ ${passenger.originFace} ${passenger.origin} | ${passenger.weight} | ${passenger.destinationFace} ${passenger.destination} ]`,
                    passenger.origin + passenger.el.width + 5, 40 + passenger.el.height / 2);
      } else {
        // draws passengers outside elevator
        ctx.fillStyle = 'violet';
        ctx.fillRect(passenger.el.x, passenger.el.y, passenger.el.width, passenger.el.height);
        // Draw the passenger label inside or next to the elevator rectangle
        ctx.fillStyle = 'black';
        ctx.font = '10px Arial';
        ctx.fillText(`[ ${passenger.origin} | ${passenger.weight} | ${passenger.destination} ]`,
                     40 + passenger.el.width + 5, 40 + passenger.el.height / 2);
      }
    });
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

let MAX_WEIGHT = 400;
// check weight capacity of the elevator
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
    console.log(elevatorFace);
    passengers.forEach((passenger) => {
        console.log(passenger, "floor:", elevatorFloor);

        if (passenger.origin === elevatorFloor/100 && passenger.originFace === elevatorFace && !passenger.inElevator && !passenger.transported) {
            console.log("passenger matches elevator to pick up!")
            if (checkWeight(passenger.weight)) {
                // allow passenger to enter
                passenger.inElevator = true;
                //passenger.el.x = elevatorXPosition; // Set this to elevator's X position on canvas
                //passenger.el.y = elevatorYPosition; // Set this to elevator's Y position on canvas
                console.log(`Passenger entered at floor ${passenger.origin}`);
            }
        } else if (passenger.destination === elevatorFloor/100 && passenger.destinationFace === elevatorFace && passenger.inElevator) {
            console.log("passenger", passenger.destination, "matches elevator", elevatorFloor, "to drop off!")
            passenger.inElevator = false;
            passenger.transported = true;
            //passenger.el.classList.remove('in-elevator'); // move passenger out
            console.log(`Passenger exited at floor ${passenger.destination}`);
        }
    });
}

function updateElevatorPosition(elevatorFloor) {
    // upate elevator's pos
    //elevator.style.bottom = `${elevatorFloor}px`;
  
    // update passenger's pos
    passengers.forEach(passenger => {
      if (passenger.inElevator) {
        // set equal to elevator's pos
        //console.log(passenger.el.style.bottom);
        console.log(elevatorFloor);
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
        if (elevatorFloor > 0) {
          elevatorFloor -= 100;
        }
    
      } else if (event.key === 'ArrowDown') {
        // move down but not below building
        if (elevatorFloor + elevatorHeight < buildingHeight) {
          elevatorFloor += 100;
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
      
      updateElevatorPosition(elevatorFloor); // updates elevator and passenger pos
    
    newCanvas(); // Update the canvas with the new positions
});

newCanvas();