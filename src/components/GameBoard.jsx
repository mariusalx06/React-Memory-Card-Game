import styles from "./GameBoard.module.css";

export default function GameBoard(props) {
  return (
    <ol>
      {props.cards.map((card) => (
        <li key={card.id}>
          {card.isFlipped || card.isMatched ? (
            <button
              className={`${styles.cardButton} ${
                card.isMatched ? styles.cardComplete : ""
              }`}
              onClick={() => props.onFlip(card.id)}
              disabled={card.isMatched}
            >
              {card.value}
            </button>
          ) : (
            <button
              className={styles.cardButton}
              onClick={() => props.onFlip(card.id)}
            ></button>
          )}
        </li>
      ))}
    </ol>
  );
}
