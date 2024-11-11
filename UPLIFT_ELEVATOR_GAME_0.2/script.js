//// CONSTANTS /////////////////////////////////////////////////////////
const elevator = document.getElementById('elevator');
const building = document.querySelector('.building');
const elevatorHeight = 100; // height of the elevator box
const buildingHeight = 600; // height of the building container
//let elevatorPosition = [];
let elevatorFloor = 0; // elevator starts at the bottom floor

let doorsOpen = false;
let alignedFloor = false;
let overweight = false;

const elevatorFaces = ["N", "E", "S", "W"];
let currFaceIndex = 0; //starts with face "A"


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

function createPassengerElement(passenger, index) {
  const passengerContainer = document.getElementById('passengers');

  // create container
  
  const passengerWrapper = document.createElement('div');
  passengerWrapper.style.position = 'absolute';
  passengerWrapper.style.bottom = `${(passenger.origin * 100)+120}px`;
  passengerWrapper.style.right = '200px'; // Align passengers within the building

  // label for passenger's text
  const labelEl = document.createElement('div');
  labelEl.classList.add('passenger-label');
  //labelEl.textContent = `[ ${passenger.origin} | ${passenger.destination} ]`; // Set the text content for the label
  

  // create the passenger box
  const passengerEl = document.createElement('div');
  passengerEl.classList.add('passenger');
  passengerEl.textContent = `[ ${passenger.originFace} | ${passenger.origin} | ${passenger.weight} | ${passenger.destination} | ${passenger.destinationFace}]`;

  // Append the label and the passenger box to the wrapper
  passengerWrapper.appendChild(labelEl);
  passengerWrapper.appendChild(passengerEl);

  // Append the wrapper to the passengers container
  passengerContainer.appendChild(passengerWrapper);

  // store reference to element in passenger object if needed
  passenger.el = passengerEl;
}

// adds a new passenger
const passengers = [];
function addPassenger(originFace, origin, destination, destinationFace, weight) {
  const newPassenger = new Passenger(originFace, origin, destination, destinationFace, weight);
  passengers.push(newPassenger);

  createPassengerElement(newPassenger, passengers.length - 1);
}

// initialize passengers visually
addPassenger(elevatorFaces[0], 6, 4, elevatorFaces[1], 180);
addPassenger(elevatorFaces[0], 4, 1, elevatorFaces[3], 205);
addPassenger(elevatorFaces[2], 3, 5, elevatorFaces[1], 50);


function checkFloor(elevatorFloor) {
  if ([0, 100, 200, 300, 400, 500].includes(elevatorFloor)) {
    document.getElementById("output").textContent = `current floor: ${elevatorFloor/100 + 1}`;
    //console.log(`Car is at floor ${elevatorPosition / 100}`, elevatorPosition);
    alignedFloor = true;
  } else {
    alignedFloor = false;
  }
  return alignedFloor;
}

const MAX_WEIGHT = 400;

function checkWeight(newWeight) {
  let currentWeight = passengers
    .filter(passenger => passenger.inElevator)
    .reduce((total, passenger) => total + passenger.weight, 0);
  let weightTot = currentWeight + newWeight;
  console.log(weightTot);
  overweight = (weightTot < MAX_WEIGHT) ? false : true;
  console.log("exceeded weight? ", overweight); 
  return weightTot <= MAX_WEIGHT;
}

function openDoor(elevatorFloor) {
  let elevatorFace = elevatorFaces[currFaceIndex];
  console.log(elevatorFace);
  passengers.forEach((passenger, index) => {

    console.log(passenger, "floor:", elevatorFloor);

    if (passenger.origin === elevatorFloor/100 + 1 && passenger.originFace === elevatorFace && !passenger.inElevator && !passenger.transported) {
      console.log("passenger matches elevator to pick up!")
      if (checkWeight(passenger.weight)) {
        // allow passenger to enter
        passenger.inElevator = true;
        passenger.el.classList.add('in-elevator'); // move passenger inside elevator
        passenger.el.style.left = '-300px';
        console.log(`Passenger ${index} entered at floor ${passenger.origin} :)`);
      }
    } else if (passenger.destination === elevatorFloor/100 + 1 && passenger.destinationFace === elevatorFace && passenger.inElevator) {
      console.log("passenger matches elevator to drop off!")
      // passenger exits at their destination
      passenger.inElevator = false;
      passenger.transported = true;
      passenger.el.classList.remove('in-elevator'); // move passenger out
      passenger.el.style.left = '-400px';
      passenger.el.style.bottom = `${(elevatorFloor / 100) * 100}px`; // position at destination floor
      console.log(`Passenger ${index} exited at floor ${passenger.destination}`);
    }
  });
}

function updateElevatorPosition(elevatorFloor) {
  // upate elevator's pos
  elevator.style.bottom = `${elevatorFloor}px`;

  // update passenger's pos
  passengers.forEach(passenger => {
    if (passenger.inElevator) {
      // set equal to elevator's pos
      passenger.el.style.bottom = `${elevatorFloor}px`;
    }
  });
}

// move elevator controls [ UP / DOWN ]
document.addEventListener('keydown', (event) => {
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
  
  updateElevatorPosition(elevatorFloor); // updates elevator and passenger pos
  
});
