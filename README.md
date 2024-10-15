# Avengers-Puzzle

This project is a 5x5 tile-based sliding puzzle game where the objective is to rearrange the scrambled pieces to form a complete image. The game has a timer, a turns counter, and a leaderboard system to track top players. It also includes features like hints to help players identify correctly placed tiles and the ability to restart the game or clear the last player's score from the leaderboard.

Key Features:


Drag-and-Drop Puzzle Tiles:

Players can drag tiles and drop them into empty spaces to swap positions with the blank tile.
Tiles are shuffled randomly at the beginning of the game.
Drag-and-drop functionality is implemented using JavaScript event listeners (dragstart, dragend, drop).


Timer and Turns Counter:

A 5-minute countdown timer starts as soon as the player makes the first move.
The number of turns (or moves) is tracked and displayed.
When the player solves the puzzle, the timer stops and the player's score is recorded.
Leaderboard:

After completing the puzzle, players can enter their name and their score (based on the number of turns and time taken) is saved to the leaderboard.
The leaderboard is stored in local storage, showing the top 5 scores.
Players can also clear the last player's score.


Hints:

A hint system highlights the correctly placed tiles in green for a short duration, helping the player track progress.


Game Reset:

The game can be restarted at any point, which resets the timer, the turns counter, and shuffles the puzzle pieces again.


Technologies Used:

HTML: Structure of the game, with elements for the board, pieces, timer, and turns.
CSS: Styling for the board, pieces, and UI elements (such as the timer, turns counter, and leaderboard).
JavaScript: Handles game logic, including:
Shuffling and managing the puzzle tiles.
Drag-and-drop functionality.
Timer and turns tracking.
Storing and updating the leaderboard in local storage.
