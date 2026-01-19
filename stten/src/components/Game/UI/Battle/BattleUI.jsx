import "./BattleUI.css"

import { SpritesID } from "./SpriteIDS.js"

function BattleUI({ phase, setPhase, setSelectedTarget, player, enemies }) {

  return (
    <div>
      <div className="battleUI-player">
        <div className="healthBar">
          <div style={{width: `${(player.health.current / player.health.max) * 100}%`, height: "100%", backgroundColor: "red", transition: "width 0.3s"}} />
        </div>
        <img src={SpritesID[player.sprite]} alt="player" style={{ width: "64px", height: "64px", imageRendering: "crisp-edges" }} />
      </div>
      
    </div>
  )
}

export default BattleUI