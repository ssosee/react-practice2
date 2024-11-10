import Player from "./components/Player.jsx";
import GameBoard from "./components/GameBoard.jsx";
import {useState} from "react";
import Log from "./components/Log.jsx";
import {WINNING_COMBINATIONS} from "./winning-combination.js";
import GameOver from "./components/GameOver.jsx";

const PLAYERS = {
    X: 'Player 1',
    O: 'Player 2'
}

const INITIAL_GAME_BOARD = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

const Symbol = {
    X: 'X',
    O: 'O'
};

function deriveActivePlayer(gameTurns) {
    if(gameTurns.length > 0 && gameTurns[0].player === Symbol.X) {
        return Symbol.O;
    }

    return Symbol.X;
}

function deriveWinner(gameBoard, players) {
    let winner = null;

    // 우승자 계산
    for(const combination of WINNING_COMBINATIONS) {
        const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
        const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
        const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

        if(firstSquareSymbol
            && firstSquareSymbol === secondSquareSymbol
            && firstSquareSymbol === thirdSquareSymbol) {
            winner = players[firstSquareSymbol];
        }
    }

    return winner;
}

function deriveGameBoard(gameTurns) {
    let gameBoard = [...INITIAL_GAME_BOARD.map(innerArray => [...innerArray])];

    for(const turn of gameTurns) {
        const {square, player} = turn;
        const {row, col} = square;

        gameBoard[row][col] = player;
    }

    return gameBoard;
}

function App() {
    const [players, setPlayers] = useState(PLAYERS);
    const [gameTurns, setGameTurns] = useState([]);

    const activePlayer = deriveActivePlayer(gameTurns);
    const gameBoard = deriveGameBoard(gameTurns);
    const winner = deriveWinner(gameBoard, players);
    const hasDraw = gameTurns.length === 9 && !winner;

    function handleSelectSquare(rowIndex, colIndex) {
        setGameTurns(prevTurns => {
            const currentPlayer = deriveActivePlayer(prevTurns);

            return [{
                    square: {
                        row: rowIndex,
                        col: colIndex
                    },
                    player: currentPlayer
                },
                ...prevTurns
            ];
        })
    }

    function handleRestartGame() {
        setGameTurns([]);
    }

    function handlePlayerNameChange(symbol, newName) {
        setPlayers(prevPlayers => {
            return {
                ...prevPlayers,
                [symbol]: newName
            };
        });
    }

    return (
        <>
            <main>
                <div id="game-container">
                    <ol id="players" className="highlight-player">
                        <Player initialName={PLAYERS.X}
                                symbol={Symbol.X}
                                isActive={activePlayer === Symbol.X}
                                onChangeName={handlePlayerNameChange}
                        />
                        <Player initialName={PLAYERS.O}
                                symbol={Symbol.O}
                                isActive={activePlayer === Symbol.O}
                                onChangeName={handlePlayerNameChange}
                        />
                    </ol>
                    {(winner || hasDraw) && <GameOver winner={winner} onRestartGame={handleRestartGame}></GameOver>}
                    <GameBoard onSelectSquare={handleSelectSquare}
                               board={gameBoard}>
                    </GameBoard>
                </div>
                <Log turns={gameTurns}></Log>
            </main>
        </>
    );
}

export default App
