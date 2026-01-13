import "./Game.css"
import { useState } from "react"
import { Player } from "./Game/Player/Attributes/Attributes.js"

// UI
import TurnStats from "./Game/UI/TurnStats"
import Options from "./Game/UI/Options.jsx"
// Luta
import BattleSystem from "./Game/BattleSystem.jsx"
import { turn } from "./Game/BattleSystem.jsx"
// Ações e Cartas
import Attack from "./Game/UI/Actions/Attack.jsx"
import Defend from "./Game/UI/Actions/Defend.jsx"
import Items from "./Game/UI/Actions/Items.jsx"
import Cards from "./Game/UI/Cards/Cards.jsx"
// Estatísticas
import Attributes from "./Game/Player/Attributes/Attributes.jsx"

function Game({ changeScene }) {
  const [player, setPlayer] = useState(null)

  // Estado que define se o jogador deve escolher alguma carta
  let choose_cards = true
  return (
    <>
      {/*
      
      Estrutura:

      Informações da luta (Turno) > Botões de Opções
      Char's (Jogador > Inimigo)
      Ações do Jogador > Cartas para escolha
      Estatisticas (Jogador)

      Se possível futuramente uma lista com informações resumidas das cartas escolhidas. 

      */}

      {/* UI Top */}
      <div className="bar-top"><TurnStats /><Options /></div>

      {/* Char's / Luta */}
      <div className="battle"><BattleSystem onPlayerUpdate={setPlayer} /></div>

      {player && <div className="player">

        {/* Ações || Cartas */}
        {choose_cards === false && turn === "player" && <div className="actions"><Attack /><Defend /><Items /></div>}
        {choose_cards === true && turn === "player" && <div className="cards"><Cards /></div>}

        {/* Estátisticas */}
        <div className="estatistics"><Attributes player={player} /></div>

        {/* Lista de Cartas */}
        <div className="card-list">Lista de Cartas (Nada por enquanto)</div>

      </div>}

    </>
  )
}

export default Game