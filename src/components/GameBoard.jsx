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
              disabled={card.isMatched || card.isFlipped}
            >
              {card.value}
            </button>
          ) : (
            <button
              className={styles.cardButton}
              onClick={(e) => {
                props.onFlip(card.id);
              }}
            ></button>
          )}
        </li>
      ))}
    </ol>
  );
}
