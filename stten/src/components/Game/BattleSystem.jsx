import { useState, useEffect, useRef } from "react";
import { Player } from "./Player/Attributes.js";
import { Enemy } from "./Enemies/Enemy.js";

function BattleSystem({ onPlayerUpdate, turnActor, setTurnActor, intention, setIntention, phase, setPhase }) {

  // Para não ocorrer erros de escrita
  const POSTURE = {
    OFFENSIVE: "offensive",
    DEFENSIVE: "defensive"
  }

  /* 
  ==========================
  --- >>> Instâncias <<< ---
  ==========================
  */
  // Jogador
  const [player, setPlayer] = useState(null);
  // Inimigo
  const [enemies, setEnemies] = useState([]);

  /* 
  ======================
  --- >>> Turnos <<< ---
  ======================
  */
  // QUEUE
  const turnQueueRef = useRef([]);

  // Criação do jogador na inicialização
  useEffect(() => {

    // Contador
    let actorsCounter = 0;

    // Criar jogador
    const instance = new Player({ id: actorsCounter++ });
    // Guardar a Instância
    setPlayer(instance);
    // Informa ao componente pai que o jogador existe e pode ser repassado para UI
    onPlayerUpdate(instance);

    console.log("Jogador foi criado: " + instance)

    // Criar os inimigos
    const enemiesInstances = [
      new Enemy({ type: "skeleton", id: actorsCounter++ }),
      new Enemy({ type: "skeleton", id: actorsCounter++ })
    ]

    // Guardar as Instâncias
    setEnemies(enemiesInstances);

    console.log("Inimigos foram criados: " + enemiesInstances)

  }, []);

  // Para caso o jogador morra ou escolha resetar a run
  function resetRun() {
    console.log("O JOGADOR MORREU, a lógica desta função vai ser feita posteriormente")
  }

  /*
  /~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/
  useEffects de phase

  creating
  queue
  awaiting_input
  action
  end_turn
  analysing
  /~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/
  */

  //////////////////
  //>>> QUEUE <<< //
  //////////////////
  useEffect(() => {

    // Se não for a phase de queue e não houver instâncias como jogador e inimigo, retorne
    if (phase !== "queue" || !player || enemies.length === 0) return;

    // Para visualizar os inimigos no turno
    console.log(`O useEffect de inteção foi chamado com o phase no estado de ${phase}!!! \n E os seguintes atores na batalha.`)
    console.log("Jogador", player)
    console.log("Inimigos", enemies)

    // Cria um Array com todos os atores
    const actors = [player, ...enemies];

    // Define a fila a partir do mapeamento de todos os atores
    turnQueueRef.current = actors.map(actor => ({

      // Lista o ID, o tipo (Jogador ou Inimigo) e a Iniciativa
      id: actor.id,
      type: actor.type === "player"
        ? "player"
        : "enemy",
      initiative: actor.stats.initiative

      // Com os atores na fila, eles são organizados baseados em quem tem a maior iniciativa
    })).sort((a, b) => b.initiative - a.initiative);

    // Mostra para UI e Lógica quem é o autor do turno atual
    setTurnActor(turnQueueRef.current[0]);

    // Muda a phase para esperar alguma ação, seja do jogador ou inimigo
    setPhase("awaiting_input");

  }, [phase, player, enemies])

  ///////////////////
  //>>> ACTION <<< //
  ///////////////////
  useEffect(() => {

    // Se não houver intenção declarada ou não ser a phase de ação, retorne
    if (phase !== "action" || !intention) return;

    // Para visualizar os inimigos no turno
    console.log(`O useEffect de inteção foi chamado com o phase no estado de ${phase}!!!`)
    console.log("Intenção", intention)

    // Verificar se não houve falta de informações que podem comprometer a ação
    if (!intention.actor || !intention.target) {
      console.warn("Faltam informações cruciais na intenção", intention);
      setIntention(null);
      return;
    }

    // Ele resolve as strings para defini-las como instâncias
    const actor = intention.actor === "player"
      ? player
      : enemies.find(e => e.id === intention.actorId);
    const actorId = intention.actorId;
    const target = intention.target === "player"
      ? player
      : enemies.find(e => e.id === intention.targetId);
    const targetId = intention.targetId;

    // Verifica que tipo de intenção o autor (actor) declarou
    switch (intention.type) {
      // Se ele atacar
      case "attack":
        // Chama a função de atacar
        attack(actor, actorId, target, targetId);
        break;
      // Se ele defender
      case "defend":
        // Chama a função de defender
        defend(actor, actorId);
        break;
    };

    // Ao finalizar verificação, retorne intenção como null
    setIntention(null);
    // Mudar a fase
    setPhase("end_turn")

  }, [phase, intention]);

  /////////////////////
  //>>> END TURN <<< //
  /////////////////////
  useEffect(() => {
    // Se não for a fase de final do turno
    if (phase !== "end_turn") return;

    // Posteriormente vai ter aplicação de danos de estado como fogo, veneno
    // Eles serão aplicados aqui, antes da verificação, pois o jogador pode morrer por eles depois de ter matado os inimigos

    // Se o jogador morreu, chamar função para resetar run
    if (player.dead) {
      resetRun()
      return;
    }

    // Cria uma váriavel que retorna apenas os inimigos mortos
    const deadEnemies = enemies.filter(e => e.dead)
    const aliveEnemies = enemies.length - deadEnemies.length;

    // Se houver mortos
    if (deadEnemies.length > 0) {

      // Tira eles como instância
      setEnemies(prev =>
        prev.filter(enemy => !enemy.dead)
      );

      // Tira eles da queue
      turnQueueRef.current = turnQueueRef.current.filter(
        entry => !deadEnemies.some(e => e.id === entry.id)
      );

    }

    // Se o número de mortos é igual ao número de inimigos que continha a batalha acaba, senão, é o próximo turno
    if (aliveEnemies === 0) { setPhase("analysing") } else { nextTurn() };

  }, [phase])

  // Função de avançar turno
  function nextTurn() {

    // A const finished tira o primeiro elemento de Queue e retorna ele
    const finished = turnQueueRef.current.shift()
    // Queue pega o elemento retornado por finish e o insere por último
    turnQueueRef.current.push(finished);
    // Muda o autor do turno para o novo primeiro elemento
    setTurnActor(turnQueueRef.current[0]);

  }

  /*
  /~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/
  Função para atualizar jogador e inimigos
  
  updatePlayer(mutator)
  updateEnemy(enemyId, mutator)
  /~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/
  */
  //#region atualizacao-instancias
  // Função para atualizar o jogador, mutator seria a atualização
  function updatePlayer(mutator) {

    /*
      setPlayer recebe uma função.
      Essa função recebe o estado anterior (prev).
    */
    setPlayer(prev => {

      // Cria uma cópia do jogador para conseguir mostrar na UI, já que ele não detecta mutações internas
      const copy = Object.assign(

        // Cria um novo objeto com o mesmo prototype (Player)
        Object.create(Object.getPrototypeOf(prev)),

        // Copia todas as propriedades do jogador anterior
        prev

      );

      // Aplicar a mudança
      mutator(copy);

      // Pede para que a UI atualize as informações acerca do jogador
      onPlayerUpdate(copy);

      // Retorna a cópia do jogador que é usada na UI
      return copy;
    });
  }

  // Função para atualizar o inimigo, enemyId é para encontrar o inimigo especifico no array e o mutator seria a atualização
  function updateEnemy(enemyId, mutator) {

    /*
      setEnemies recebe uma função.
      Essa função recebe o estado anterior do inimigo (enemy).
    */
    setEnemies(prevEnemies => prevEnemies.map(enemy => {
      // Se não for o inimigo especificado, pode retornar como estava, pois ele não vai atualizar
      if (enemy.id !== enemyId) return enemy;

      // Cria uma cópia do inimigo para conseguir mostrar na UI, já que ele não detecta mutações internas
      const copy = Object.assign(

        // Cria um novo objeto com o mesmo prototype (Enemy)
        Object.create(Object.getPrototypeOf(enemy)),

        // Copia todas as propriedades anteriores
        enemy
      );

      // Aplicar a mudança
      mutator(copy);

      // Pede para que a UI atualize as informações acerca do jogador
      onPlayerUpdate(copy);

      // Retorna a cópia do jogador que é usada na UI
      return copy;
    }))
  }
  //#endregion atualizacao-instancias

  /*
  /~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/
  Função das ações podem ser tomadas no turno
  
  attack(attacker, attackerId, defender, defenderId)
  defend(actor, actorId)
  /~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/
  */
  //#region acoes
  // Função de Atacar
  function attack(attacker, attackerId, defender, defenderId) {

    // Faz verificação de quem é o autor
    if (attacker === player) {
      // Chama a função que faz a atualização na instância
      updatePlayer(p => {
        p.posture = POSTURE.OFFENSIVE;
      });
    } else {
      updateEnemy(attackerId, enemy => {
        enemy.posture = POSTURE.OFFENSIVE;
      });
    };

    // Verificar se o ataque vai ser normal ou critico
    const critical = Math.random() < attacker.stats.dmg.critical_chance;

    // O multiplicador é fixo, ou seja, o critico sempre será 180% do dano
    // Essa variável é o dano que vai ser passado para o defensor
    const final_damage = critical
      ? Math.floor(attacker.stats.dmg.physical * 1.8)
      : attacker.stats.dmg.physical;

    if (defender === player) {
      updatePlayer(p => {
        p.takeDamage(final_damage);
      });
    } else {
      updateEnemy(defenderId, enemy => {
        enemy.takeDamage(final_damage);
      });
    };
    console.log(`${attacker.name}: Atacou ${defender.name} e ${critical ? "critou dando " : "deu "}${final_damage}`)

  }

  // Função de Defender
  function defend(actor, actorId) {
    // Faz verificação de quem é o autor
    if (actor === player) {
      // Chama a função que faz a atualização na instância
      updatePlayer(p => {
        p.posture = POSTURE.DEFENSIVE;
      });
      // Caso não seja, ele faz a atualização no inimigo
    } else {
      updateEnemy(actorId, enemy => {
        enemy.posture = POSTURE.DEFENSIVE;
      });
    };
  };
  //#endregion acoes

  // Como o BattleSystem não renderiza nada diretamente
  return null;
}

export default BattleSystem;
