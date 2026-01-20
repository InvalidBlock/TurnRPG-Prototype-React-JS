import { useState, useEffect, useRef, use, useEffectEvent } from "react";
import { Player } from "./Player/Attributes.js";
import { Enemy } from "./Enemies/Enemy.js";

function BattleSystem({ onPlayerUpdate, onEnemiesUpdate, turnActor, setTurnActor, intention, setIntention, phase, setPhase }) {

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
    // Informa ao componente pai que os inimigos existem e pode ser repassado para UI
    onEnemiesUpdate(enemiesInstances);

    console.log("Inimigos foram criados: " + enemiesInstances)

    // Mudar phase para montar a queue
    setPhase("queue")
    console.log(`BattleSystem: Phase changed to ${phase}!`);

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
    console.log(`BattleSystem: A queue ficou da seguinte maneira!`, turnQueueRef.current);

    // Mostra para UI e Lógica quem é o autor do turno atual
    setTurnActor(turnQueueRef.current[0]);

    // Muda a phase para esperar alguma ação, seja do jogador ou inimigo
    setPhase("awaiting_input");

  }, [phase, player, enemies])

  ///////////////////////////
  //>>> AWAITING INPUT <<< //
  ///////////////////////////

  // Esse useEffect é para caso o inimigo tenha que definir uma intenção
  useEffect(() => {
    // Se a phase não for de esperar a intenção, retorne
    if (!turnActor) return;
    if (phase !== "awaiting_input" && turnActor.type !== "enemy") return;

    // Verificar se o inimigo existe
    const enemy = enemies.find(e => e.id === turnActor.id);
    // Se não existe
    if (!enemy) {
      console.log("BattleSystem: Erro 404! Inimigo não encontrado ou não existente", enemy); 
      return;
    }
    
    // Esperar o inimigo definir a intenção
    // É passado o jogador e seus aliados (inimigos)
    const enemyIntention = enemy.AI({ player })

    // Se a intenção do inimigo ficou definida
    if (enemyIntention) {
      setIntention(enemyIntention);
      setPhase("action");
    }

  }, [phase, turnActor, enemies])

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
    if (!intention.actor) {
      console.warn("Faltam informações cruciais na intenção", intention);
      setIntention(null);
      return;
    }

    console.log("A intenção recebida foi:", intention)
    console.log("Definindo autor e alvo")

    // Ele resolve as strings para defini-las como instâncias
    const actor = intention.actor === "player"
      ? player
      : enemies.find(e => e.id === intention.actorId);
    console.log("Autor:", actor)

    const actorId = actor.id;
    console.log("Autor ID:", actorId)

    const target = intention.target === "player"
      ? player
      : enemies.find(e => e === intention.target);
    console.log("Alvo:", target)

    const targetId = target.id;
    console.log("Alvo ID:", targetId)

    // Verifica que tipo de intenção o autor (actor) declarou
    switch (intention.type) {
      // Se ele atacar
      case "attack":
        // Chama a função de atacar
        console.log(`attack(\n Attacker: ${actor}, ${actorId} \n Defender: ${target}, ${targetId}\n)`)
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
    // Como ele tem apenas phase de dependência decidi colocar aqui o console.log que nos mostra a phase atual
    console.log(`BattleSystem: Phase = ${phase}`);

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
    if (aliveEnemies === 0) {
      setPhase("analysing");
    } else { nextTurn() };

  }, [phase])

  // Função de avançar turno
  function nextTurn() {

    // A const finished tira o primeiro elemento de Queue e retorna ele
    const finished = turnQueueRef.current.shift()
    // Queue pega o elemento retornado por finish e o insere por último
    turnQueueRef.current.push(finished);
    // Muda o autor do turno para o novo primeiro elemento
    setTurnActor(turnQueueRef.current[0]);

    // Mudar a phase
    setPhase("awaiting_input")

  }

  /*
  /~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/
  Função para atualizar jogador e inimigos
  
  updatePlayer(mutator)
  updateEnemy(enemyId, mutator)
  /~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/
  */
  //#region atualizacao-instancias

  // Informar componente pai sobre alterações
  useEffect(() => { player && onPlayerUpdate(player) }, [player])
  useEffect(() => { enemies.length > 0 && onEnemiesUpdate(enemies) }, [enemies])

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

  // BattleSystem não renderiza nada diretamente, quem faz isso é BattleUI
  return null;
}

export default BattleSystem;
