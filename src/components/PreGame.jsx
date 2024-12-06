import styles from "./PreGame.module.css";
import { useState } from "react";

export default function PreGame(props) {
  const [newName, setNewName] = useState(props.initialName);
  const [message, setMessage] = useState("");

  function handleInputChange(e) {
    setNewName(e.target.value);
    setMessage("");
  }

  function handleStart() {
    if (!newName.trim()) {
      setMessage("Please enter a name before starting!");
    } else {
      props.onSetName(newName);
    }
  }

  return (
    <div className={styles.startGame}>
      <h2>Welcome!</h2>
      <input
        required
        name="newName"
        value={newName}
        onChange={handleInputChange}
        placeholder="Enter Name"
        autoFocus
      />
      {message && <p className={styles.errorMessage}>{message}</p>}{" "}
      <p className={styles.errorMessage}>
        <button onClick={handleStart}>Start!</button>
      </p>
    </div>
  );
}
