import styles from "./ScoreHistory.module.css";

export default function ScoreHistory(props) {
  return (
    <ol className={styles.log}>
      {props.scores.map((score, index) => (
        <div key={index}>
          <p>
            {score.playerName}: {score.score}s
          </p>
        </div>
      ))}
    </ol>
  );
}
