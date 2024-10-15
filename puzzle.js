const rows = 5;
const columns = 5;

let currTile = null;
let otherTile = null;
let turns = 0;
let countdown;
let timeLeft;

let timerStarted = false;
let timerInterval;
let timeElapsed = 0;

window.onload = function () {
  initializeGame();

  document.getElementById("startAgain").addEventListener("click", startAgain);
  document
    .getElementById("clearLastPlayer")
    .addEventListener("click", clearLastPlayer);
};

//Initialize the game
function initializeGame() {
  turns = 0;
  timeLeft = 300; // 5 minutes
  timerStarted = false;

  document.getElementById("turns").innerText = turns;

  //Resetting timer
  let timerElement = document.getElementById("timer");
  timerElement.innerText = "5:00";

  //Clear previous board and pieces
  document.getElementById("board").innerHTML = "";
  document.getElementById("pieces").innerHTML = "";

  //Clear any existing timer
  if (countdown) {
    clearInterval(countdown);
  }

  //Creating the board and pieces again
  createBoard();
  createPieces();
  updateLeaderBoard();
}

function createBoard() {
  //initialize the 5x5 board
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("img");
      tile.src = "./images/blank.jpg";
      tile.draggable = true;

      // Drag and drop functionality
      tile.addEventListener("dragstart", handleDragStart); // click on image to drag
      tile.addEventListener("dragover", dragOver); // drag an image
      tile.addEventListener("dragenter", dragEnter); // dragging an image into another one
      tile.addEventListener("dragleave", dragLeave); // dragging an image away from another one
      tile.addEventListener("drop", dragDrop); // drop an image onto another one
      tile.addEventListener("dragend", dragEnd); // after you completed dragDrop

      document.getElementById("board").append(tile);
    }
  }
}

//pieces
function createPieces() {
  let pieces = [];
  for (let i = 1; i <= rows * columns; i++) {
    pieces.push(i.toString()); //put "1" to "25" into the array (puzzle images names)
  }
  pieces.push("blank");

  //to shuffle the pieces
  for (let i = 0; i < pieces.length; i++) {
    let j = Math.floor(Math.random() * pieces.length);
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }

  //adding the pieces to the DOM
  for (let i = 0; i < pieces.length; i++) {
    let tile = document.createElement("img");
    tile.src = "./images/" + pieces[i] + ".jpg";
    tile.draggable = true;

    // Drag and drop functionality

    tile.addEventListener("dragstart", handleDragStart); // click on image to drag
    tile.addEventListener("dragover", dragOver); // drag an image
    tile.addEventListener("dragenter", dragEnter); // dragging an image into another one
    tile.addEventListener("dragleave", dragLeave); // dragging an image away from another one
    tile.addEventListener("drop", dragDrop); // drop an image onto another one
    tile.addEventListener("dragend", dragEnd); // after you completed dragDrop

    document.getElementById("pieces").append(tile);
  }
}

// Timer

function startTimer() {
  countdown = setInterval(() => {
    timeElapsed += 1; // increment time by 1 second

    let timerElement = document.getElementById("timer");

    if (timeLeft <= 0) {
      clearInterval(countdown);
      alert("Time's up! Game over!");
      return;
    }

    timeLeft--;
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerElement.innerText = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(countdown); // Clear the countdown interval
}

//function to handle the drag start
function handleDragStart(event) {
  //Start timer only on the first drag
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }
  currTile = event.target;
}

function dragOver(e) {
  e.preventDefault(); // it allows the image to be dropped
}

function dragEnter(e) {
  e.preventDefault(); // necessary to allow the drop
}

function dragLeave() {}

function dragDrop() {
  otherTile = this; // refers to the image that is being dropped on
}

function dragEnd() {
  if (currTile.src.includes("blank")) {
    return;
  }
  let currImg = currTile.src;
  let otherImg = otherTile.src;

  // to swap the tiles
  currTile.src = otherImg;
  otherTile.src = currImg;

  // increment the turns only if a non-blank tile was moved
  if (!currImg.includes("blank") || !otherImg.includes("blank")) {
    turns += 1;
    document.getElementById("turns").innerText = turns;

    checkCompletion();
  }
}

// Checking if the puzzle is complete

function checkCompletion() {
  let pieces = document.querySelectorAll("#board img");
  let isComplete = true;

  for (let i = 0; i < pieces.length - 1; i++) {
    // excluding the blank tile
    if (!pieces[i].src.includes(`${i + 1}.jpg`)) {
      isComplete = false;
      break;
    }
  }

  if (isComplete) {
    clearInterval(countdown);

    alert("Congratulations! You solved the puzzle!");

    let playerName = prompt("Enter your name:");

    if (!playerName) {
      playerName = "Anonymous"; // in case the player doesn't want to enter his/her name
    }

    let moves = turns;
    let timeTaken = document.getElementById("timer").innerText;

    //Saving to local storage
    saveScore(playerName, moves, timeTaken);

    //Updating the leaderboard
    updateLeaderBoard();
  }
}

// Hints system

function showHint() {
  let pieces = document.querySelectorAll("#board img");
  for (let i = 0; i < pieces.length - 1; i++) {
    if (pieces[i].src.includes(`${i + 1}.jpg`)) {
      pieces[i].style.border = "2px solid green"; // Highlight correct tiles
    }
  }

  setTimeout(() => {
    pieces.forEach((piece) => (piece.style.border = "")); //remove highlight after 2 seconds
  }, 2000);
}

//Start again

function startAgain() {
  initializeGame(); // reset game state
}

//Saving the score in local storage

function saveScore(playerName, moves, timeTaken) {
  let leaderBoard = JSON.parse(localStorage.getItem("leaderBoard")) || [];

  // Add new score
  leaderBoard.push({
    name: playerName,
    moves: moves,
    time: timeTaken,
  });

  //Sorting leaderBoard by moves
  leaderBoard.sort((a, b) => a.moves - b.moves);

  //Keeping only top 5 scores
  leaderBoard = leaderBoard.slice(0, 10);

  // Saving back to localStorage
  localStorage.setItem("leaderBoard", JSON.stringify(leaderBoard));

  updateLeaderBoard();
}

// Displaying the leaderBoard

function updateLeaderBoard() {
  let leaderBoard = JSON.parse(localStorage.getItem("leaderBoard")) || [];

  let tableBody = document.querySelector("#leaderboard tbody");
  tableBody.innerHTML = ""; // clear existing entries

  leaderBoard.forEach((entry, index) => {
    let row = document.createElement("tr");

    let rankCell = document.createElement("td");
    rankCell.innerText = index + 1;

    let nameCell = document.createElement("td");
    nameCell.innerText = entry.name;

    let movesCell = document.createElement("td");
    movesCell.innerText = entry.moves;

    let timeCell = document.createElement("td");
    timeCell.innerText = entry.time;

    // append cells to row
    row.append(rankCell, nameCell, movesCell, timeCell);

    // append row to the table body
    tableBody.appendChild(row);
  });
}

// clear stats
function clearLastPlayer() {
  // retrieving the leaderboard from localStorage
  let leaderBoard = JSON.parse(localStorage.getItem("leaderBoard")) || [];

  //Checking if there are any entries
  if (leaderBoard.length > 0) {
    const isConfirmed = confirm(
      "Are you sure you want to delete the last player?"
    );

    if (isConfirmed) {
      // if confirmed, deleting the last player
      leaderBoard.pop();
    }

    //Save the updated leaderboard back to localStorage
    localStorage.setItem("leaderBoard", JSON.stringify(leaderBoard));

    updateLeaderBoard();
  } else {
    alert("No players to remove!");
  }
}

//to make the bg work also on GitHub
const isGithubPages = window.location.hostname === 'manudd25.github.io';
const backgroundUrl = isGithubPages ? '/avengers-puzzle/images/ave.jpg' : 'images/ave.jpg';
document.body.style.backgroundImage = `url(${backgroundUrl})`;