import "./Statistics.css"

function Statistics({ player }) {
  return (
    <div className="player-stats">

      <div className="geral">
        <h2 style={{color: "cornflowerblue"}}>{player.name}</h2>
        <p className="health"> Health: <span style={{fontSize:"1.1rem"}}>{player.health.current} / {player.health.max}</span></p>
        <p className="posture">Posture: <span style={player.posture === "offensive" ? {color: "red"} : {color: "cornflowerblue"}}>{player.posture === "offensive" ? "Offensive" : "Defensive"}</span></p>
      </div>

      <div className="res">
        <h2>Resistance:</h2>
        <p>Armor: <span style={{fontSize:"1.1rem"}}>{player.stats.res.armor}</span></p>
        <p>Defense: <span style={{fontSize:"1.1rem"}}>{player.stats.res.defense}</span></p>
      </div>

      <div className="dmg">
        <h2>Damage:</h2>
        <p>Physical: <span style={{fontSize:"1.1rem"}}>{player.stats.dmg.physical}</span></p>
        <p>Critical: <span style={{fontSize:"1.1rem"}}>{player.stats.dmg.critical_chance * 10}%</span></p>
      </div>

    </div>
  )
}

export default Statistics