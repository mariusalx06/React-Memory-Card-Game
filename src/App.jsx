import { useEffect, useState } from "react";
import styles from "./App.module.css";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import GameOver from "./components/GameOver";
import ScoreHistory from "./components/ScoreHistory";
import { CARDS } from "./Cards.js";
import PreGame from "./components/PreGame.jsx";

function shuffleCards(cards) {
  const shuffledCards = [...cards];
  for (let i = shuffledCards.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffledCards[i], shuffledCards[randomIndex]] = [
      shuffledCards[randomIndex],
      shuffledCards[i],
    ];
  }
  return shuffledCards;
}

export default function App() {
  const [cards, setCards] = useState(CARDS);
  const [flipped, setFlipped] = useState([]);
  const [winner, setWinner] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [scores, setScores] = useState([]);
  const [bestScore, setBestScore] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [startGame, setStartGame] = useState(false);

  useEffect(() => {
    const shuffleAndSetCards = async () => {
      const shuffled = await shuffleCards(cards);
      setCards(shuffled);
    };

    shuffleAndSetCards();
  }, []);

  function handleClick(cardId) {
    if (flipped.length === 2 || winner) return;
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId && !card.isFlipped && !card.isMatched
          ? { ...card, isFlipped: true }
          : card
      )
    );
  }

  useEffect(() => {
    let newIntervalId = null;

    if (startGame && !winner) {
      newIntervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    return () => {
      if (newIntervalId) {
        clearInterval(newIntervalId);
      }
    };
  }, [startGame, winner]);

  useEffect(() => {
    const currentlyFlippedCards = cards.filter(
      (card) => card.isFlipped && !card.isMatched
    );
    setFlipped(currentlyFlippedCards);

    if (currentlyFlippedCards.length === 2) {
      const [card1, card2] = currentlyFlippedCards;

      if (card1.value === card2.value) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === card1.id || card.id === card2.id
              ? { ...card, isMatched: true }
              : card
          )
        );
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === card1.id || card.id === card2.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }, 1000);
      }
    }

    const allMatched = cards.every((card) => card.isMatched);

    if (allMatched && !winner) {
      setScores((prevScores) => [
        { playerName: currentPlayer, score: timer },
        ...prevScores,
      ]);
      if (bestScore === null || timer < bestScore) {
        setBestScore(timer);
      }
      setWinner(true);
    }
  }, [cards, timer, winner, intervalId, bestScore, currentPlayer]);

  function handlePlayerNameChange(newName) {
    setCurrentPlayer(newName);
    setCards(shuffleCards(CARDS));
    setTimer(0);
  }
  function handleStartGame(newName) {
    setCurrentPlayer(newName);
    setStartGame(true);
    setTimer(0);
  }

  return (
    <main>
      <div className={styles.gameContainer}>
        {!startGame && (
          <PreGame onSetName={handleStartGame} initialName={currentPlayer} />
        )}
        {startGame && (
          <Player
            name={currentPlayer}
            bestScore={bestScore}
            onChangeName={handlePlayerNameChange}
          />
        )}

        <div className={styles.gameBoard}>
          {winner && (
            <GameOver
              onRestart={() => {
                setCards(shuffleCards(CARDS));
                setWinner(false);
                setFlipped([]);
                setTimer(0);
              }}
              scores={scores}
              bestScore={bestScore}
            />
          )}
          <GameBoard cards={cards} onFlip={handleClick} />
          <div className={styles.timer}>{timer}</div>
          <button
            className={styles.resetButton}
            onClick={() => {
              setCards(shuffleCards(CARDS));
              setTimer(0);
            }}
          >
            RESET
          </button>
        </div>
      </div>
      <ScoreHistory scores={scores}></ScoreHistory>
    </main>
  );
}
