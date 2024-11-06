const elevator = document.getElementById('elevator');
const building = document.querySelector('.building');
const elevatorHeight = 100; // Height of the elevator box
const buildingHeight = 600; // Height of the building container

const elevatorFaces = ["NORTH", "EAST", "SOUTH", "WEST"];
let currFaceIndex = 0; //starts with face "A"

let elevatorPosition = 0; // Elevator starts at the bottom

function checkFloor(elevatorPosition) {
  let boolean = true;
  if ([0, 100, 200, 300, 400, 500].includes(elevatorPosition)) {
    document.getElementById("output").textContent = `current floor: ${elevatorPosition/100}`;
    console.log(`Car is at floor ${elevatorPosition / 100}`, elevatorPosition);
    boolean = true;
  } else {
    console.log("car is not at floor");
    boolean = false;
  }
  return boolean;
}

function checkWeight() {

}

function openDoor(elevatorPosition) {

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
    currFaceIndex = (currFaceIndex + 1) % elevatorFaces.length;
    //console.log("Elevator is now facing: " + elevatorFaces[currFaceIndex]);
    document.getElementById("faceDirection").textContent = `Facing floor: ${elevatorFaces[currFaceIndex]}`;

  } else if (event.key === 'ArrowLeft') {
    currFaceIndex = (currFaceIndex - 1 + elevatorFaces.length) % elevatorFaces.length;
    //console.log("Elevator is now facing: " + elevatorFaces[currFaceIndex]);
    document.getElementById("faceDirection").textContent = `Facing floor: ${elevatorFaces[currFaceIndex]}`;
  }


  checkFloor(elevatorPosition);

  // update elevator's pos
  elevator.style.bottom = `${elevatorPosition}px`;
});
