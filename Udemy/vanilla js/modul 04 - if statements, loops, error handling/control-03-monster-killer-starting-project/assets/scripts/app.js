//static valued global variable
const MODE_REGULAR_ATTACK = 'REGULAR_ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

//global variable
const PLAYER_ATTACK_VALUE = 10;
const PLAYER_STRONG_ATTACK_VALUE = 14;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

//log variables
let battleLog = [];
let currentLogEntries;

function getMaxLifeValue() {
  // input value HP monster dan player menggunakan prompt
  const enteredValue = prompt('Masukkan Max Life Monster dan Player!', '100');

  const parsedValue = +enteredValue;
  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { message: 'Invalid user input, not a number!' };
  }
  return parsedValue;
}

let chosenMaxLife;

try {
  chosenMaxLife = getMaxLifeValue();
} catch (error) {
  console.log(error);
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
// set value health bars
adjustHealthBars(chosenMaxLife);

// some additional functions
// writing every single thing that is happening in-game to log
function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };

  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry.target = 'MONSTER';
      break;
    case LOG_EVENT_PLAYER_HEAL:
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry.target = 'PLAYER';
      break;
  }
  battleLog.push(logEntry);
}

// reset the health
function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

//function that being executed at the end of every round
function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const monsterDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= monsterDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    monsterDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife === true) {
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    hasBonusLife = false;
    removeBonusLife();
    alert("You could've died, but the bonus life saved you!");
  }
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You Win!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'PLAYER WIN!',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You Lose!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'MONSTER WIN!',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert("It's a draw!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'DRAW!',
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

//function that being executed everytime attack/strong attack button pressed
function attackz(mode) {
  let maxDamage;
  let logEvent;
  if (mode === MODE_REGULAR_ATTACK) {
    maxDamage = PLAYER_ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_ATTACK;
  } else if (mode === MODE_STRONG_ATTACK) {
    maxDamage = PLAYER_STRONG_ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

// event listener's functions
function attackHandler() {
  attackz(MODE_REGULAR_ATTACK);
}

function strongAttackHandler() {
  attackz(MODE_STRONG_ATTACK);
}

function healHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function logHandler() {
  //for loop
  // for(let i = 0;i < battleLog.length;i++){
  //   console.log(battleLog[i]);
  // }
  let i = 0;
  //for of loop
  for (const log of battleLog) {
    if (
      (!currentLogEntries && currentLogEntries !== 0) ||
      currentLogEntries < i
    ) {
      console.log(`index ke ${i}`);
      //for in loop
      for (const key in log) {
        console.log(`${key} -> ${log[key]}`);
      }
      currentLogEntries = i;
      break;
    }
    i++;
  }

  //while loop
  // let i = 0;
  // while (i < battleLog.length) {
  //   console.log(battleLog[i]);
  //   i++;
  // }
}

// event listener
attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healHandler);
logBtn.addEventListener('click', logHandler);
