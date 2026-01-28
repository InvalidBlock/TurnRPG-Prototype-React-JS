import "./Game.css"
import "./Game/UI/Actions/Actions.css"
import { useEffect, useState } from "react"

// UI
import TurnStats from "./Game/UI/TurnStats"
// Luta
import BattleSystem from "./Game/BattleSystem.jsx"
import BattleUI from "./Game/UI/Battle/BattleUI.jsx"
// Estatísticas
import Statistics from "./Game/UI/Statistics.jsx"
// Actions & Cards
import BottomBar from "./Game/UI/BottomBar.jsx"

function Game({ changeScene, authenticated}) {

  /*
  =================================
  --- >>> Váriaveis Globais <<< ---
  =================================
  */

  // Jogador
  const [player, setPlayer] = useState(null);

  // Inimigos
  const [enemies, setEnemies] = useState([]);

  // Autor do Turno
  const [turnActor, setTurnActor] = useState(null);
  // Fase
  const [phase, setPhase] = useState("");

  // Batalhas
  const [battle, setBattle] = useState(1);

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

  useEffect(() => {
    console.log("turnActor was changed!", turnActor)
  }, [turnActor])

  useEffect(() => {
    console.log("Os inimigos mudaram.", enemies)
  }, [enemies])

  // Intenção declarada
  const [intention, setIntention] = useState(null);

  // Alvo
  const [selectedTarget, setSelectedTarget] = useState(null)

  /*
  A intenção é definida pelo jogador ou inimigo, ela aparecerá da seguinte forma

  {
  actor: "player" || "enemy"
  actorId: "player" || "x"
  type: "attack" || "defend"

  // O null é para caso não seja atacar
  target: "enemy" || "player" || null
  targetId: "x" || null
  }
  */

  return (
    <>
      {/*
      
      Estrutura:

      Informações da luta (Turno) > Botões de Opções
      Char's (Jogador > Inimigo)
      Ações do Jogador > Cartas para escolha
      Estatisticas (Jogador)

      */}

      {/* Char's / Luta */}
      <BattleSystem 
      onPlayerUpdate={setPlayer} 
      onEnemiesUpdate={setEnemies} 
      turnActor={turnActor} 
      setTurnActor={setTurnActor} 
      intention={intention} 
      setIntention={setIntention} 
      phase={phase} 
      setPhase={setPhase} 
      changeScene={changeScene} 
      enemies={enemies} 
      player={player}
      battle={battle}
      setBattle={setBattle}
      authenticated={authenticated}
      />

      {player && turnActor !== null && <div className="player">

        {/* UI Top */}
        <div className="bar-top"><TurnStats turnActor={turnActor} player={player} /></div>

        {/* Batalha */}
        <div className="battle"><BattleUI turnActor={turnActor} selectedTarget={selectedTarget} setSelectedTarget={setSelectedTarget} player={player} enemies={enemies} /></div>

        {/* 
        
        Ações || Cartas 
        Foi criado o BottomBar para ter pelo menos a estilização da barra e não ficar sem nada durante turnos do inimigo

        */}
        <div className="bar-bottom"><BottomBar turnActor={turnActor} phase={phase} setPhase={setPhase} setIntention={setIntention} selectedTarget={selectedTarget} setSelectedTarget={setSelectedTarget} /></div>

        {/* Estátisticas */}
        <div className="statistics"><Statistics player={player} /></div>

      </div>}

    </>
  )
}

export default Game