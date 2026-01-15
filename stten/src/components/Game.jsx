import "./Game.css"
import { useState } from "react"
import { Player } from "./Game/Player/Attributes/Attributes.js"

// UI
import TurnStats from "./Game/UI/TurnStats"
import Options from "./Game/UI/Options.jsx"
// Luta
import BattleSystem from "./Game/BattleSystem.jsx"
// Ações e Cartas
import Attack from "./Game/UI/Actions/Attack.jsx"
import Defend from "./Game/UI/Actions/Defend.jsx"
import Items from "./Game/UI/Actions/Items.jsx"
import Cards from "./Game/UI/Cards/Cards.jsx"
// Estatísticas
import Attributes from "./Game/Player/Attributes/Attributes.jsx"
import BottomBar from "./Game/UI/BottomBar.jsx"

function Game({ changeScene }) {

  /*
  =================================
  --- >>> Váriaveis Globais <<< ---
  =================================
  */

  // Jogador
  const [player, setPlayer] = useState(null);

  // Turno
  const [turn, setTurn] = useState("player");

  // Intenção declarada
  const [intention, setIntention] = useState(null);
  /*
  A intenção é definida pelo jogador ou inimigo, ela aparecerá da seguinte forma

  {
  actor: "player" || "enemy"
  actor_id: "player" || "x"
  type: "attack" || "defend" || "item"

  // O null é para caso não seja atacar
  target: "enemy" || "player" || null
  target_id: "x" || null
  
  item: "item" || null
  }
  */

  // Estado que define se o jogador deve escolher alguma carta (Provisório)
  let choose_cards = false

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

      {/* Char's / Luta */}
      <div className="battle"><BattleSystem onPlayerUpdate={setPlayer} turn={turn} setTurn={setTurn} intention={intention} setIntention={setIntention} /></div>

      {player && <div className="player">

        {/* UI Top */}
        <div className="bar-top"><TurnStats turn={turn} player={player} /><Options /></div>

        {/* 
        
        Ações || Cartas 
        Foi criado o BottomBar para ter pelo menos a estilização da barra e não ficar sem nada durante turnos do inimigo

        */}
        <div className="bar-bottom"><BottomBar turn={turn} choose_cards={choose_cards}/></div>

        {/* Estátisticas */}
        <div className="estatistics"><Attributes player={player} /></div>

        {/* Lista de Cartas */}
        <div className="card-list">Lista de Cartas (Nada por enquanto)</div>

      </div>}

    </>
  )
}

export default Game