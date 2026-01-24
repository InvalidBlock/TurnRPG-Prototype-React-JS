import "./BattleUI.css"

import { SpritesID } from "./SpriteIDS.js"

function BattleUI({ turnActor, selectedTarget,setSelectedTarget, player, enemies }) {

  return (
    <div className="battleUI">

      <div className="battleUI-player" style={turnActor.id === player.id ? {transform: "scale(1.25)", transition: "all 0.3s ease", paddingBottom:"20px"} : {transform: "scale(1)", transition: "all 0.3s ease"}}>
        {/* Com o progress a barra de vida ficou horrivel e imutável, então prossegui utilizando div's */}
        <div className="healthBar">
          <div style={{width: `${(player.health.current / player.health.max) * 100}%`, height: "100%", backgroundColor: "red", transition: "width 0.3s"}} />
        </div>
        <img src={SpritesID[player.sprite]} alt={player.name} style={turnActor.id === player.id ? {boxShadow: "1px 1px 25px cornflowerblue", backgroundColor: "rgba(111, 144, 244, 0.3)"} : {}} width={"64px"} height={"64px"} />
      </div>

      <div className="battleUI-enemies">
        {/* Mapear o array de inimigos */}
        {enemies.map((enemy) => {
          // Pegar o sprite do inimigo
          const sprite = SpritesID[enemy.sprite]

          return (
            // Um botão com uma chave para futuras alterações, a função do click é mudar o alvo selecionado
            <button 
            key={enemy.id} 
            onClick={() => setSelectedTarget(enemy)} 
            disabled={enemy.health.current <= 0 || turnActor.type !== "player"}
            style={selectedTarget === enemy ? {transform: "scale(1.25)", transition: "all 0.3s ease", paddingBottom:"20px"} : {transform: "scale(1)", transition: "all 0.3s ease"}}
            >
              <div className="healthBar">
              <div style={{width: `${(enemy.health.current / enemy.health.max) * 100}%`, height: "100%", backgroundColor: "red", transition: "width 0.3s"}} />
              </div>
              <img src={sprite} alt={enemy.name} style={turnActor.id === enemy.id ? {boxShadow: "1px 1px 25px cornflowerblue", backgroundColor: "rgba(111, 144, 244, 0.3)"} : selectedTarget === enemy ? {boxShadow: "1px 1px 25px red", backgroundColor: "rgba(255, 0, 0, 0.3)"} : {}} width={"64px"} height={"64px"} />
            </button>
          )
        })}
      </div>

    </div>
  )
}

export default BattleUI