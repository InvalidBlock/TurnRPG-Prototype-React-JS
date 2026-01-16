import "./Statistics.css"

function Statistics({ player }) {
  return (
    <div className="stats">

      <div className="geral">
        <h2 className="name">{player.name}</h2>
        <p className="health"> Health: {player.health.current} / {player.health.max}</p>
        <p className="posture">Posture: <span style={player.posture === "offensive" ? {color: "red"} : {color: "cornflowerblue"}}>{player.posture === "offensive" ? "Offensive" : "Defensive"}</span></p>
      </div>

      <div className="res">
        <h2>Resistance:</h2>
        <p>Armor: {player.stats.res.armor}</p>
        <p>Defense: {player.stats.res.defense}</p>
      </div>

      <div className="dmg">
        <h2>Damage:</h2>
        <p>Physical: {player.stats.dmg.physical}</p>
      </div>

    </div>
  )
}

export default Statistics