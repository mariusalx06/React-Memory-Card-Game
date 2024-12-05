import { useEffect, useState } from "react";
import styles from "./App.module.css";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import GameOver from "./components/GameOver";
import ScoreHistory from "./components/ScoreHistory";
import { CARDS } from "./Cards.js";

const INITIAL_PLAYER_NAME = "Player Name";

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
  const [cards, setCards] = useState(() => shuffleCards(CARDS));
  const [flipped, setFlipped] = useState([]);
  const [winner, setWinner] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [scores, setScores] = useState([]);
  const [bestScore, setBestScore] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(INITIAL_PLAYER_NAME);

  function handleClick(cardId) {
    if (flipped.length === 2 || winner) return;
    setCards((prevCards) => {
      return prevCards.map((card) =>
        card.id === cardId && !card.isFlipped && !card.isMatched
          ? { ...card, isFlipped: true }
          : card
      );
    });
  }

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
      if (intervalId) {
        clearInterval(intervalId);
      }
      setScores((prevScores) => [
        { playerName: currentPlayer, score: timer },
        ...prevScores,
      ]);
      if (bestScore === null || timer < bestScore) {
        setBestScore(timer);
      }
      setWinner(true);
    }

    const allUnMatched = cards.every((card) => !card.isMatched);

    if (allUnMatched && !intervalId && !winner) {
      const newIntervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
      setIntervalId(newIntervalId);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [cards, timer, winner, intervalId]);

  function handleRestart() {
    setCards(() => shuffleCards(CARDS));
    setWinner(false);
    setFlipped([]);
    setTimer(0);
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIntervalId(null);
  }

  function handlePlayerNameChange(newName) {
    setCurrentPlayer(newName);
  }

  return (
    <main>
      <div className={styles.gameContainer}>
        <Player
          name={currentPlayer}
          bestScore={bestScore}
          onChangeName={handlePlayerNameChange}
        />
        <div className={styles.gameBoard}>
          {winner && (
            <GameOver
              onRestart={handleRestart}
              scores={scores}
              bestScore={bestScore}
            />
          )}
          <GameBoard cards={cards} onFlip={handleClick} />
          <div className={styles.timer}></div>
        </div>
      </div>
      <ScoreHistory scores={scores}></ScoreHistory>
    </main>
  );
}
