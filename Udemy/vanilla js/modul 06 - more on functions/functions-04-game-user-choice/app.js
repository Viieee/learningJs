const startGameBtn = document.getElementById('start-game-btn');

const ROCK = 'ROCK';
const PAPER = 'PAPER';
const SCISSORS = 'SCISSORS';
const DEFAULT_USER_CHOICE = ROCK;
const RESULT_DRAW = 'DRAW';
const PLAYER_WIN = 'PLAYER WIN!';
const COMPUTER_WIN = 'COMPUTER WIN!';
let gameIsRunning = false;

const getPlayerChoice = function () {
  const selection = prompt(
    `${ROCK}, ${PAPER} or ${SCISSORS}?`,
    ''
  ).toUpperCase();
  if (selection !== ROCK && selection !== PAPER && selection !== SCISSORS) {
    alert(`Invalid choice! We chose ${DEFAULT_USER_CHOICE} for you!`);
    return; //returning undefined
  }
  return selection;
};

const getComputerChoice = function () {
  const randomValue = Math.random();
  console.log(randomValue);
  if (randomValue < 0.34) {
    return ROCK;
  } else if (randomValue < 0.67) {
    return PAPER;
  } else {
    return SCISSORS;
  }
};

//ternary condition implementation with arrow function
// implementing default value for the 2nd argument
const getWinner = (computerChoice, playerChoice = DEFAULT_USER_CHOICE) =>
  computerChoice === playerChoice
    ? RESULT_DRAW
    : (computerChoice === ROCK && playerChoice === PAPER) ||
      (computerChoice === PAPER && playerChoice === SCISSORS) ||
      (computerChoice === SCISSORS && playerChoice === ROCK)
    ? PLAYER_WIN
    : COMPUTER_WIN;

startGameBtn.addEventListener('click', () => {
  if (gameIsRunning) {
    // sama dengan gameIsRunning === true
    return;
  }

  gameIsRunning = true;
  console.log('Game is starting...');
  const playerSelection = getPlayerChoice();
  const computerSelection = getComputerChoice();
  const winner = getWinner(computerSelection, playerSelection);
  // pada message, playerSelection || DEFAULT_USER_CHOICE akan mengecek mana yang menghasilkan true
  // in this case yang memiliki value, karena yang false adalah yang undefined
  let message = `You picked ${
    playerSelection || DEFAULT_USER_CHOICE
  } and the computer picked ${computerSelection}, so `;
  if (winner === RESULT_DRAW) {
    message = message + "it's a draw!";
  } else if (winner === PLAYER_WIN) {
    message = message + 'you win.';
  } else {
    message = message + 'you lose';
  }
  alert(message);
  console.log(`PLAYER's CHOICE : ${playerSelection || DEFAULT_USER_CHOICE}`);
  console.log(`COMPUTER's CHOICE : ${computerSelection}`);
  console.log(winner);
  gameIsRunning = false;
});

