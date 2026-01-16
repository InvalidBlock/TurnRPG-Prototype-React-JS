import "./Game.css"
import { useState } from "react"

// UI
import TurnStats from "./Game/UI/TurnStats"
import Options from "./Game/UI/Options.jsx"
// Luta
import BattleSystem from "./Game/BattleSystem.jsx"
// Estatísticas
import Statistics from "./Game/UI/Statistics.jsx"
// Actions & Cards
import BottomBar from "./Game/UI/BottomBar.jsx"

function Game({ changeScene }) {

  /*
  =================================
  --- >>> Váriaveis Globais <<< ---
  =================================
  */

  // Jogador
  const [player, setPlayer] = useState(null);

  // Autor do Turno
  const [turnActor, setTurnActor] = useState("player");
  // Fase
  const [phase, setPhase] = useState("");
  /*

  /~/~/ PREPARAÇÃO /~/~/

  Criando Batalha
  setPhase("creating")

  Realizando Fila
  setPhase("queue")

  /~/~/ EM BATALHA /~/~/

  Esperando Input do Autor
  setPhase("awaiting_input");

  Fazendo a Ação
  setPhase("action");

  Aplicando a lógica de final de turno
  setPhase("end_turn");

  /~/~/ PÓS-BATALHA

  Analisar a batalha, tipo se o jogador pode escolher uma carta e como vai prosseguir o jogo
  setPhase("analysing")

  */

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
      <div className="battle"><BattleSystem onPlayerUpdate={setPlayer} turnActor={turnActor} setTurnActor={setTurnActor} intention={intention} setIntention={setIntention} phase={phase} setPhase={setPhase}/></div>

      {player && <div className="player">

        {/* UI Top */}
        <div className="bar-top"><TurnStats turnActor={turnActor} player={player} /><Options /></div>

        {/* 
        
        Ações || Cartas 
        Foi criado o BottomBar para ter pelo menos a estilização da barra e não ficar sem nada durante turnos do inimigo

        */}
        <div className="bar-bottom"><BottomBar turnActor={turnActor} choose_cards={choose_cards}/></div>

        {/* Estátisticas */}
        <div className="statistics"><Statistics player={player} /></div>

        {/* Lista de Cartas */}
        <div className="card-list">Lista de Cartas (Nada por enquanto)</div>

      </div>}

    </>
  )
}

export default Game