function TurnStats({ turnActor, player }) {

  // Foi definido antes para ficar de forma mais clara
  const player_turn = turnActor.type === "player"

  return (
    <div>
      <p>Turn: <span style={player_turn ? {color: "cornflowerblue"} : {color: "red"}}> {player_turn ? player.name : "Enemy"} </span></p>
    </div>
  )
}

export default TurnStats