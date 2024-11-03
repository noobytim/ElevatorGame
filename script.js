const elevator = document.getElementById('elevator');
const building = document.querySelector('.building');
const elevatorHeight = 100; // Height of the elevator box
const buildingHeight = 600; // Height of the building container

let elevatorPosition = 0; // Elevator starts at the bottom

// Move the elevator up or down based on key presses
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    // Move up, but don't go above the building
    if (elevatorPosition + elevatorHeight < buildingHeight) {
      elevatorPosition += 10;
    }
  } else if (event.key === 'ArrowDown') {
    // Move down, but don't go below the building floor
    if (elevatorPosition > 0) {
      elevatorPosition -= 10;
    }
  }
  
  // Update the elevator's position
  elevator.style.bottom = `${elevatorPosition}px`;
});
