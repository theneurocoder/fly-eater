const gameButton = document.getElementById("game-button");
const scoreCounter = document.getElementById("score-counter");
const timeCounter = document.getElementById("time-counter");
const gameDifficulty = document.getElementById("game-difficulty");
const instructions = document.getElementById("instructions");
const body = document.querySelector("body");

// Initialize game variables
let gameStarted = false;
let speed = 1000;
let game;
let timer;
let frog;
let frogX;
let frogY;

// Update game difficulty when dropdown changes
gameDifficulty.addEventListener("change", function () {
  speed = Number(gameDifficulty.value);
});

// Start game when game button is clicked
gameButton.addEventListener("click", function () {
  if (!gameStarted) {
    startGame();
  } else {
    endGame();
  }
});

// Move frog on keydown
document.addEventListener("keydown", moveFrog);

// Function to start game
function startGame() {
  // Change state of game to 'true'
  gameStarted = true;

  // Change game button text to 'End game'
  gameButton.textContent = "End game";

  // Set score counter to '0'
  scoreCounter.textContent = "0";

  // Disable game level dropdown when game starts
  gameDifficulty.setAttribute("disabled", "true");

  const gameOver = document.getElementById("game-over");

  // Remove instructions if they are present
  if (instructions) {
    instructions.remove();
  }

  // Remove 'game over' div if it is present
  if (gameOver) {
    gameOver.remove();
  }

  // Create frog
  frog = document.createElement("img");
  frog.id = "frog";
  frog.setAttribute("src", "images/frog.png");
  frog.setAttribute("alt", "An illustration of a frog.");
  body.append(frog);

  // Set beginning frog position
  frogX = window.innerWidth / 2 - frog.getBoundingClientRect().width / 2;
  frogY = window.innerHeight - 300;

  frog.style.left = frogX + "px";
  frog.style.top = frogY + "px";

  // Create 'yum'
  const yum = document.createElement("span");
  yum.id = "yum";
  yum.textContent = "Yum!";
  yum.classList.add("hidden");
  body.append(yum);

  // Initialize time counter
  timeCounter.textContent = 59;

  // Create initial fly
  createFly();

  // Create subsequent flies based on selected speed
  game = setInterval(function () {
    createFly();
  }, speed);

  // Count down time
  timer = setInterval(function () {
    const timeLeft = Number(timeCounter.textContent);

    // Use 'padStart' to add 0 to single-digit numbers
    timeCounter.textContent = String(timeLeft - 1).padStart(2, "0");

    // End game when time is up
    if (timeLeft === 1) {
      endGame();
    }
  }, 1000);
}

// Function to end game
function endGame() {
  clearInterval(game);
  clearInterval(timer);

  // Remove frog when game is over
  frog.remove();

  // Remove 'yum' when game is over (this is necessary to prevent duplicates of elements with #yum)
  yum.remove();

  // Remove fly when game is over
  const fly = document.getElementById("fly");
  if (fly) {
    fly.remove();
  }

  // Change state of game to 'false'
  gameStarted = false;

  // Set time counter to 00
  timeCounter.textContent = "00";

  // Change game button text to 'Start game'
  gameButton.textContent = "Start game";

  // Reenable game level dropdown when game is over
  gameDifficulty.removeAttribute("disabled");

  // Create 'game over' div and display score
  const gameOver = document.createElement("div");
  gameOver.id = "game-over";
  gameOver.textContent =
    "Game over! Your score is " + scoreCounter.textContent + ".";
  body.append(gameOver);
}

// Function to create fly
function createFly() {
  const fly = document.createElement("img");
  fly.id = "fly";
  fly.setAttribute("src", "images/fly.png");
  fly.setAttribute("alt", "An illustration of a fly.");
  body.append(fly);

  // Set position of fly:
  // Limit it to viewport width minus fly width and viewport height minus fly height
  // to prevent fly from going out the edge
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const flyWidth = fly.getBoundingClientRect().width;
  const flyHeight = fly.getBoundingClientRect().height;

  const flyX = Math.random() * (viewportWidth - flyWidth);
  const flyY = Math.random() * (viewportHeight - flyHeight);
  const flyRotation = Math.random() * 360;

  fly.style.left = flyX + "px";
  fly.style.top = flyY + "px";
  fly.style.transform = "rotate(" + flyRotation + "deg)";

  setTimeout(function () {
    fly.remove();
  }, speed - 100);
}

// Function to move frog
function moveFrog(event) {
  const frog = document.getElementById("frog");
  const yum = document.getElementById("yum");

  // Maximum allowable coordinates for frog position:
  // Limit it to viewport width minus frog width and viewport height minus frog height
  // to prevent frog from going out the edge
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Move frog
  if (frog) {
    const frogWidth = frog.getBoundingClientRect().width;
    const frogHeight = frog.getBoundingClientRect().height;

    const maxFrogX = viewportWidth - frogWidth;
    const maxFrogY = viewportHeight - frogHeight;
    if (event.key === "ArrowRight" || event.key === "d") {
      frogX += 50;
      frog.style.transform = "rotate(90deg)";
    } else if (event.key === "ArrowLeft" || event.key === "a") {
      frogX -= 50;
      frog.style.transform = "rotate(-90deg)";
    } else if (event.key === "ArrowUp" || event.key === "w") {
      frogY -= 50;
      frog.style.transform = "rotate(0deg)";
    } else if (event.key === "ArrowDown" || event.key === "s") {
      frogY += 50;
      frog.style.transform = "rotate(180deg)";
    } else {
      return;
    }

    event.preventDefault();

    // Minimum and maximum values for frog position
    frogX = Math.max(0, Math.min(maxFrogX, frogX));
    frogY = Math.max(0, Math.min(maxFrogY, frogY));

    frog.style.left = frogX + "px";
    frog.style.top = frogY + "px";

    const fly = document.getElementById("fly");

    // Detect if frog overlaps with fly
    if (fly) {
      const flyRect = fly.getBoundingClientRect();
      const frogRect = frog.getBoundingClientRect();

      if (
        frogRect.left < flyRect.right &&
        frogRect.right > flyRect.left &&
        frogRect.top < flyRect.bottom &&
        frogRect.bottom > flyRect.top
      ) {

        // Increase score
        const score = Number(scoreCounter.textContent);
        scoreCounter.textContent = score + 10;

        // Eat fly
        fly.remove();

        // Display 'yum'
        yum.classList.remove("hidden");
        yum.style.top = flyRect.top + "px";
        yum.style.left = flyRect.left + "px";

        // Hide 'yum' after 200ms
        setTimeout(function () {
          yum.classList.add("hidden");
        }, 200);
      }
    }
  }
}
