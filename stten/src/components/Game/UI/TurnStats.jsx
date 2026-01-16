function TurnStats({ turnActor, player }) {

  // Foi definido antes para ficar de forma mais clara
  const who_turn = turnActor === "player" ? "player": "enemy"
  console.log("who_turn: " + who_turn)

  return (
    <div>
      <p>Turn: <span style={turnActor === "player" ? {color: "cornflowerblue"}:{color: "red"}}>{turnActor === "player" ? player.name : "Enemy"}</span></p>
    </div>
  )
}

export default TurnStats