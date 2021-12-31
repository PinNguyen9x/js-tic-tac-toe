import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import {
  getCellElementAtIdx,
  getCellElementList,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButtonElement,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

const updateGameStatus = (newGameStatus) => {
  gameStatus = newGameStatus;
  const gameStatusElement = getGameStatusElement();
  if (gameStatusElement) gameStatusElement.textContent = newGameStatus;
};

const showReplayButton = () => {
  const replayButtonElement = getReplayButtonElement();
  if (replayButtonElement) replayButtonElement.classList.add("show");
};

const hideReplayButton = () => {
  const replayButtonElement = getReplayButtonElement();
  if (replayButtonElement) replayButtonElement.classList.remove("show");
};

const highlightWinCell = (winPositions) => {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error("Invalid win cell position");
  }
  for (const position of winPositions) {
    const cell = getCellElementAtIdx(position);
    if (cell) cell.classList.add("win");
  }
};

const toggleCurrentTurn = () => {
  const currentTurnElement = getCurrentTurnElement();
  currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;
  currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
  currentTurnElement.classList.add(currentTurn);
};
const handleCellClick = (cell, index) => {
  const isClicked =
    cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE);

  if (isClicked || gameStatus !== GAME_STATUS.PLAYING) return;

  cell.classList.add(currentTurn);

  // update cell values
  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

  // check gae status
  const game = checkGameStatus(cellValues);
  switch (game?.status) {
    case GAME_STATUS.ENDED: {
      updateGameStatus(game.status);
      showReplayButton();
      break;
    }

    case GAME_STATUS.O_WIN:
    case GAME_STATUS.X_WIN: {
      updateGameStatus(game.status);
      highlightWinCell(game.winPositions);
      showReplayButton();
      break;
    }
    default:
    // playing
  }
  toggleCurrentTurn();
};

const resetGame = () => {
  // reset global vars
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(() => "");

  // reser game status
  updateGameStatus(GAME_STATUS.PLAYING);
  // reset current turn
  const currentTurnElement = getCurrentTurnElement();
  currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
  currentTurnElement.classList.add(TURN.CROSS);

  // reset game board
  const cellElementList = getCellElementList();
  if (cellElementList) {
    for (const cellElement of cellElementList) {
      cellElement.className='';
    }
  }
  // hide replay button
  hideReplayButton();
};

const initCellElementList = () => {
  const cellElementList = getCellElementList();
  cellElementList.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
  });
};
const initReplayButtonElement = () => {
  const replayButtonElement = getReplayButtonElement();
  console.log("replayButtonElement", replayButtonElement);
  if (replayButtonElement)
    replayButtonElement.addEventListener("click", resetGame);
};
(() => {
  // bind click event for all li element
  initCellElementList();
  // bind click evet for replay button
  initReplayButtonElement();
})();
