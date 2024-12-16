###### README
Timothy Jeon, Ren-Zhi Zheng, and Dante Ottaviani.

Our project evolved significantly throughout the course of this semester. Originally, we went through different iterations on how we wanted our game to look visually and how the players would interact with the game. An example would be how we initally tried to make our game in 3D using ggslac but then pivoted to 2D using Javascript, CSS, and HTML as it was a better direction to take our game. Another example would be our elevator building initially being designed to be viewed on the side but then changed it to a top-down view to implement rotations and better readability on passenger location. In the end, we implemented a design we think best suits the needs for both Computer Graphics and Intro to Game Studies as well as our personal goal to create a simple, yet complex game based on the concept of elevators. 

Despite having a working prototype that our group is somewhat satisfied with, we weren't able to implement every goal we had in mind. Some examples include a retry button, infinite mode, passengers showing up randomly instead of presetting them, and shaders to make the game more vibrant. 

In our game, we accomplished many of our goals through our implementations. One accomplishment was pushing ourselves to learn more about Javascript and how it works with CSS and HTML. Another accomplishment was developing better teamwork skills and code organization on a large project that dealt with many conditionals which are skills useful for the future. The main accomplishment though was figuring out how to visually respresent the elevator while incorporating rotations using matrices, a concept learned from class, in a way that's easily readable to the players. 

###### Getting Started

# How to run the game

1. Please download Visual Studio Code. 
2. Then open this folder in Visual Studio Code. 
3. On lefthand side bar, click on EXTENSIONS, and install Live Server. 
4. After installation, navigate back to explorer on sidebar, and right-click the game.html file and click "Open with Live Server" to open up the game in a browser.

# Directions + Controls

1. Use the up or down arrow keys to move the elevator up or down.
2. Use the left and right arrow keys to change the elevator direction. 
3. Each passenger has a specific origin and destination depending on the direction and floor, as well as a weight. 
4. If the elevator direction and floor matches the specifics of that passenger, press space to either pickup or drop that passenger.
5. The passengers located in the current floor number will turn orange to indicate their origin. Otherwise, the 
   passengers will appear grey to indicate their origin in a different floor.
6. You can pickup multiple passengers if the total weight is less than or equal to the weight limit of the elevator. 
   Otherwise, you can't pick up any more. The passengers will turn blue to indicate them boarding the elevator.
7. The player wins by transporting all the passengers before the time limit. Otherwise, the player loses. 
8. Once the end screen appears, the player can refresh the page to return to the menu screen. 
   From there, the player can either retry or continue and play another level. 
9. For more indepth instructions, refer to the Elevator Game Manual.
