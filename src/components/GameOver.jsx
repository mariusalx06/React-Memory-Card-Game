import styles from "./GameOver.module.css";

export default function GameOver(props) {
  const { playerName, score } = props.scores[0];
  return (
    <div className={styles.gameOver}>
      <h2>
        Congrats <span className={styles.greenSpan}>{playerName}</span>!
      </h2>
      <p>
        Your Time: <span className={styles.greenSpan}>{score}</span>s
      </p>
      <p>
        Best Time: <span className={styles.greenSpan}>{props.bestScore}</span>s
      </p>
      <p>
        <button onClick={props.onRestart}>Rematch!</button>
      </p>
    </div>
  );
}
