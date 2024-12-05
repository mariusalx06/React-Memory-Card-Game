import { useState } from "react";
import styles from "./Player.module.css";

export default function Player(props) {
  const [newName, setNewName] = useState(props.name);
  const [isEdit, setIsEdit] = useState(false);

  function handleEdit() {
    if (isEdit) {
      props.onChangeName(newName);
    }
    setIsEdit((prevValue) => !prevValue);
  }

  function handleInputChange(e) {
    setNewName(e.target.value);
  }

  return (
    <div className={styles.playerContainer}>
      <div className={styles.player}>
        {isEdit ? (
          <input
            required
            name="newName"
            value={newName}
            onChange={handleInputChange}
            autoFocus
          />
        ) : (
          <p className={styles.playerName}>{newName}</p>
        )}

        <button className={styles.playerButton} onClick={handleEdit}>
          {isEdit ? "SAVE" : "EDIT"}
        </button>
        <p className={styles.score}>
          Best Score: {props.bestScore ? props.bestScore + "s" : "N/A"}
        </p>
      </div>
    </div>
  );
}
