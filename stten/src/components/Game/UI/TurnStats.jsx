function TurnStats({ turn, player }) {

  // Foi definido antes para ficar de forma mais clara
  const who_turn = turn === "player" ? "player": "enemy"
  console.log("who_turn: " + who_turn)

  return (
    <div>
      <p>Turn: <span style={turn === "player" ? {color: "cornflowerblue"}:{color: "red"}}>{turn === "player" ? player.name : "Enemy"}</span></p>
    </div>
  )
}

export default TurnStats