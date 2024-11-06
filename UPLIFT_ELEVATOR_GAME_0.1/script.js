//// CONSTANTS /////////////////////////////////////////////////////////
const elevator = document.getElementById('elevator');
const building = document.querySelector('.building');
const elevatorHeight = 100; // height of the elevator box
const buildingHeight = 600; // height of the building container
let elevatorPosition = 0; // elevator starts at the bottom floor

const elevatorFaces = ["N", "E", "S", "W"];
let currFaceIndex = 0; //starts with face "A"


//// INITIALIZING PASSENGERS AND THEIR BEHAVIORS //////////////////////
class Passenger {
  constructor(origin, destination, weight) {
    this.origin = origin;                // e.g. {orientation: 'A', floor: 1}
    this.destination = destination;      // e.g. {orientation: 'B', floor: 2}
    this.weight = weight;
    this.inElevator = false;             // track if passenger in in elevator
  }
}

/*
const passengers = [
  new Passenger(6, 3, 60),  // Starting on floor 0, going to floor 3
  new Passenger(2, 5, 70),  // Starting on floor 2, going to floor 5
];
*/

function createPassengerElement(passenger, index) {
  const passengerContainer = document.getElementById('passengers');

  // create container
  const passengerWrapper = document.createElement('div');
  passengerWrapper.style.position = 'absolute';
  passengerWrapper.style.bottom = `${(passenger.origin * 100)+200}px`;
  passengerWrapper.style.right = '10px'; // Align passengers within the building

  // label for passenger's text
  const labelEl = document.createElement('div');
  labelEl.classList.add('passenger-label');
  labelEl.textContent = `[ ${passenger.origin} | ${passenger.destination} ]`; // Set the text content for the label

  // create the passenger box
  const passengerEl = document.createElement('div');
  passengerEl.classList.add('passenger');
  passengerEl.textContent = `${passenger.weight}`;

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
function addPassenger(origin, destination, weight) {
  const newPassenger = new Passenger(origin, destination, weight);
  passengers.push(newPassenger);

  createPassengerElement(newPassenger, passengers.length - 1);
}

// initialize passengers visually
addPassenger(5, 3, 100);
addPassenger(0, 3, 258);



function checkFloor(elevatorPosition) {
  let boolean = true;
  if ([0, 100, 200, 300, 400, 500].includes(elevatorPosition)) {
    document.getElementById("output").textContent = `current floor: ${elevatorPosition/100}`;
    //console.log(`Car is at floor ${elevatorPosition / 100}`, elevatorPosition);
    boolean = true;
  } else {
    boolean = false;
  }
  return boolean;
}

const MAX_WEIGHT = 400;

function checkWeight(newWeight) {
  let currentWeight = passengers
    .filter(passenger => passenger.inElevator)
    .reduce((total, passenger) => total + passenger.weight, 0);
  return currentWeight + newWeight <= MAX_WEIGHT;
}

function openDoor(elevatorPosition) {
  passengers.forEach((passenger, index) => {
    if (passenger.origin * 100 === elevatorPosition && !passenger.inElevator) {
      if (checkWeight(passenger.weight)) {
        // allow passenger to enter
        passenger.inElevator = true;
        passenger.el.classList.add('in-elevator'); // move passenger inside elevator
        console.log(`Passenger ${index} entered at floor ${passenger.origin}`);
      }
    } else if (passenger.destination * 100 === elevatorPosition && passenger.inElevator) {
      // passenger exits at their destination
      passenger.inElevator = false;
      passenger.el.classList.remove('in-elevator'); // move passenger out
      passenger.el.style.bottom = `${passenger.destination * 100}px`; // position at destination floor
      console.log(`Passenger ${index} exited at floor ${passenger.destination}`);
    }
  });
}

// move elevator controls [ UP / DOWN ]
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    // move up but not above building
    if (elevatorPosition + elevatorHeight < buildingHeight) {
      elevatorPosition += 10;
    }

  } else if (event.key === 'ArrowDown') {
    // move down but not below building
    if (elevatorPosition > 0) {
      elevatorPosition -= 10;
    }

  } else if (event.key === 'ArrowRight') {
    // orient to right
    currFaceIndex = (currFaceIndex + 1) % elevatorFaces.length;
    //console.log("Elevator is now facing: " + elevatorFaces[currFaceIndex]);
    document.getElementById("faceDirection").textContent = `Facing side: ${elevatorFaces[currFaceIndex]}`;

  } else if (event.key === 'ArrowLeft') {
    // orient to left
    currFaceIndex = (currFaceIndex - 1 + elevatorFaces.length) % elevatorFaces.length;
    //console.log("Elevator is now facing: " + elevatorFaces[currFaceIndex]);
    document.getElementById("faceDirection").textContent = `Facing side: ${elevatorFaces[currFaceIndex]}`;

  } else if (event.key == 'Space' && elevatorPosition == (passenger.origin * 100) + 200 && !passenger.inElevator) {
    
  }

  checkFloor(elevatorPosition);

  // update elevator's pos
  elevator.style.bottom = `${elevatorPosition}px`;
});