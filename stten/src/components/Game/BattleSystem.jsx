import { useEffect, useRef } from "react";

////////////////////////
// >>> Instâncias <<< //
////////////////////////
import { Player } from "./Player/Attributes.js";
import { Enemy } from "./Enemies/Enemy.js";

//////////////////////
// >>> Sistemas <<< //
//////////////////////
import { applyDamage } from "./Systems/sys_ApplyDamage.js"
import { enemyAI } from "./Systems/sys_EnemyAI.js"
import { setPosture } from "./Systems/sys_SetPosture.js"
import { heal } from "./Systems/sys_Heal.js"
import { addStats } from "./Systems/sys_addStats.js";

function BattleSystem({ onPlayerUpdate, onEnemiesUpdate, turnActor, setTurnActor, intention, setIntention, phase, setPhase, changeScene, enemies, player, battle, setBattle }) {

  /* 
  ==============================
  --- >>> Pré Definições <<< ---
  ==============================
  */

  // Nome dos status para serem melhorados por meio de addStats
  const STAT_TYPE = {
    // Vida
    HEALTH: "health",
    DAMAGE: "damage",
    RESISTANCE: "resistance"
  }

  const STAT = {
    // Vida
    MAX: "max",

    // Dano
    PHYSICAL: "physical",
    CRITICAL_CHANCE: "critical_chance",

    // Defesa
    ARMOR: "armor",
    DEFENSE: "defense"
  }

  // Nomes das posturas predefinidos para não ocorrer problemas
  const POSTURE = {
    OFFENSIVE: "offensive",
    DEFENSIVE: "defensive"
  }

  /* 
  ======================
  --- >>> Turnos <<< ---
  ======================
  */
  // QUEUE
  const turnQueueRef = useRef([]);

  // ID das instâncias
  const actorsCounter = useRef(0)

  // Criação do jogador na inicialização
  useEffect(() => {

    // Contador
    actorsCounter.current = 0

    // Criar jogador
    const instance = new Player({ id: actorsCounter.current++ });
    // Informa ao componente pai que o jogador existe e pode ser repassado para UI
    onPlayerUpdate(instance);

    console.log("Player was created: " + instance)

    // Crie uma batalha nova, no caso a inicial
    NewBattle();

  }, []);

  // Para caso o jogador morra ou escolha resetar a run
  function resetRun() {
    console.warn("THE PLAYER DIED, the logic for this function will be implemented later")
    changeScene("menu");
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

  // Por mais que seja feio ele é um separador de render
  console.log("/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/\n\n\n")

  ////////////////////
  //>>> Creating <<<//
  ////////////////////
  function NewBattle() {

    // Mude a phase para create, ele não é um useEffect, mas algo chamado pelo analysing e se causar um render enquanto gera ele não chamará o analysing novamente.
    setPhase("creating")

    // Diga que é uma nova batalha
    setBattle(prev => prev + 1)

    // O sistema de criação é baseada em batalha, quase semelhante a nível, mas para deixar mais simples foi usado esse termo e além disos seria muito estranho
    // aumentar um nível após cada batalha.

    /*
    Lembrar que antes das batalhas divisiveis por 3 sempre tem como escolher uma carta, como eu não fiz elas, vai apenas ser recuperado a vida, mas
    podem ser adicionadas no futuro.

    Batalha inicial = 1 Skeleton
    Batalhas 2~3 = 1~2 Skeletons
    Batalhas >4 = 2~3 Skeletons
    */

    console.warn("Battle", battle)

    const enemiesInstances = []

    // Se for a batalha inicial
    if (battle === 1) {

      // Criar os inimigos
      enemiesInstances.push(new Enemy({ type: "skeleton", id: actorsCounter.current++ }))

    } else {

      if (battle >= 2 && battle <= 3) {

        // Se o RNG maior que 0.4
        if (Math.random() > 0.4) {

          // Criar os inimigos
          enemiesInstances.push(
            new Enemy({ type: "skeleton", id: actorsCounter.current++ }),
            new Enemy({ type: "skeleton", id: actorsCounter.current++ })
          )

        } else {

          // Criar os inimigos
          enemiesInstances.push(new Enemy({ type: "skeleton", id: actorsCounter.current++ }))

        }

      } else {

        // Se o RNG maior que 0.4
        if (Math.random() > 0.4) {

          // Criar os inimigos
          enemiesInstances.push(
            new Enemy({ type: "skeleton", id: actorsCounter.current++ }),
            new Enemy({ type: "skeleton", id: actorsCounter.current++ }),
            new Enemy({ type: "skeleton", id: actorsCounter.current++ })
          )

        } else {

          // Criar os inimigos
          enemiesInstances.push(
            new Enemy({ type: "skeleton", id: actorsCounter.current++ }),
            new Enemy({ type: "skeleton", id: actorsCounter.current++ })
          )

        }

      }
    }

    // Informa ao componente pai que os inimigos existem e pode ser repassado para UI
    onEnemiesUpdate(enemiesInstances);
    console.log("Enemies were created: " + enemiesInstances)

    // Muda a phase para a queue mantendo o flow da batalha
    setPhase("queue")

  }

  //////////////////
  //>>> QUEUE <<< //
  //////////////////
  useEffect(() => {

    // Se não for a phase de queue e não houver instâncias como jogador e inimigo, retorne
    if (phase !== "queue") return console.log("Isn't 'queue' phase");
    console.log("Is 'queue' phase!");
    if (!player) return console.error("Don't have a player", player);
    if (enemies.length === 0) return console.error("Don't have enemies", enemies);

    // Para visualizar os inimigos no turno
    console.log(`The intention useEffect was called with the phase in state ${phase}!!! \n And the following actors in the battle.`)
    console.log("Player", player)
    console.log("Enemies", enemies)

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
    console.log(`BattleSystem: The queue turned out as follows!`, turnQueueRef.current);

    // Mostra para UI e Lógica quem é o autor do turno atual
    setTurnActor(turnQueueRef.current[0]);

    // Muda a phase para esperar alguma ação, seja do jogador ou inimigo
    setPhase("awaiting_input");

  }, [phase, player, enemies])

  ///////////////////////////
  //>>> AWAITING INPUT <<< //
  ///////////////////////////

  const enemyThinking = useRef(false);

  // Esse useEffect é para caso o inimigo tenha que definir uma intenção
  useEffect(() => {

    console.log("AWAITING INPUT CHECK", {
      phase,
      turnActor,
      enemyThinking: enemyThinking.current,
      queue: turnQueueRef.current
    });

    // Se a phase não for de esperar a intenção, retorne
    if (phase !== "awaiting_input") return console.log("Isn't 'awaiting_input phase!'");
    console.log("Is 'awaiting_input' phase!")
    if (!turnActor) return console.error("Don't have turnActor to 'awaiting_input' phase!");

    if (turnActor.type === "enemy" && !enemyThinking.current) {
      enemyTurn();
    }

  }, [phase, turnActor])

  function enemyTurn() {
    if (enemyThinking.current) return console.warn("The enemy is already thinking!");

    // Verificar se o inimigo existe
    const enemy = enemies.find(e => e.id === turnActor.id);
    // Se não existe
    if (!enemy) {
      console.log("BattleSystem: Enemy not found or does not exist", enemy);
      return;
    }

    // Função assíncrona para criar delay e não acontecer tudo muito rápido visualmente para o jogador
    const processEnemyTurn = async () => {

      // Inimigo está pensando?
      console.log("Enemy is thinking...");
      enemyThinking.current = true;

      const delay = 200 + Math.random() * 1300;
      // Aguarda o delay antes de executar a IA (simula tempo de decisão)
      await new Promise(resolve => setTimeout(resolve, delay));

      const enemyIntention = enemyAI(player, enemy);

      // Mostrar a intenção no console
      console.log("Enemy intention defined:", enemyIntention);

      // Guardar intenção e avançar fase
      setIntention(enemyIntention);

      // Espera um pouco antes de passar para a ação
      await new Promise(resolve => setTimeout(resolve, 250));

      // Inimigo está pensando?
      enemyThinking.current = false

      setPhase("action");
    };

    // Chama a função assíncrona
    processEnemyTurn();
  }

  ///////////////////
  //>>> ACTION <<< //
  ///////////////////
  useEffect(() => {

    // Se não houver intenção declarada ou não ser a phase de ação, retorne
    if (phase !== "action") return console.log("Isn't 'action' phase");
    console.log("Is action phase")
    if (!intention) return console.error("Don't have a intention!", intention);

    // Para visualizar os inimigos no turno
    console.log(`The intention useEffect was called with the phase in state ${phase}!!!`)
    console.log("Intention", intention)

    // Verificar se não houve falta de informações que podem comprometer a ação
    if (!intention.actor) {
      console.warn("Missing crucial information in the intention", intention);
      setIntention(null);
      return;
    }

    console.log("The received intention was:", intention)
    console.log("Defining actor and target")

    // Ele resolve as strings para defini-las como instâncias
    const actor = intention.actor === "player"
      ? player
      : enemies.find(e => e.id === intention.actorId);
    console.log("Actor:", actor)

    const actorId = intention.actorId;
    console.log("Actor ID:", actorId)

    const target = intention.target === "player"
      ? player
      : enemies.find(e => e.id === intention.targetId);
    console.log("Target:", target)

    const targetId = intention.targetId;
    console.log("Target ID:", targetId)

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
        defend(actorId);
        break;
    };

    // Ao finalizar verificação, retorne intenção como vazia
    setIntention({});

    // Mudar a fase
    setPhase("end_turn")

  }, [phase, intention]);

  /////////////////////
  //>>> END TURN <<< //
  /////////////////////

  // BattleEnd existe para não passar as coisas sem verificar o array com o inimigo excluido de fato
  const battleEnd = useRef(false);

  useEffect(() => {

    // Se não for a fase de final do turno
    if (phase !== "end_turn") return console.log("Isn't 'end_turn' phase");
    console.log("Is 'end_turn' phase!")

    // Posteriormente vai ter aplicação de danos de estado como fogo, veneno
    // Eles serão aplicados aqui, antes da verificação, pois o jogador pode morrer por eles depois de ter matado os inimigos

    // Se o jogador morreu, chamar função para resetar run
    if (player.dead) {
      resetRun()
      return;
    }

    // Pega uma quantidade de inimigos vivos
    const aliveEnemys = enemies.filter(e => e.dead === false)

    // Conta a quantidade de inimigos e pegue seus id's
    // Ele filtra retorna um array com inimigos mortos e mapea pegando os id's dos mortos
    const deadEnemies = enemies.filter(e => e.dead).map(e => e.id);

    // Se houver mortos
    if (deadEnemies.length > 0) {

      // É removido eles como instância
      // Primeiro é filtrado os inimigos que contém a id do morto
      onEnemiesUpdate(prev => prev.filter(e => !deadEnemies.includes(e.id)));

      // Remove da queue o inimigo com a id filtrando que inimigos contém ela
      turnQueueRef.current = turnQueueRef.current.filter(entry => !deadEnemies.includes(entry.id));

      // Se o inimigo morreu no turno atual por conta de algum estado (veneno, fogo, ...)
      if (deadEnemies.includes(turnActor.id)) nextTurn();

    }

    // Se não há inimigos vivos
    if (aliveEnemys.length === 0) {
      battleEnd.current = true;
    }

    // Após ser verificado que a luta acabou, se espera um re-render com o array de inimigos vazios para assim prosseguir a batalha
    if (battleEnd.current) {
      setPhase("analysing");
      // Então a batalha acabou, prosseguiremos com a análise e retornaremos com a váriavel false para a próxima batalha
      battleEnd.current = false
      console.warn("A batalha acabou")
      console.log("Enemies", enemies)
      console.log("Queue", turnQueueRef.current)
      return;
    }

    nextTurn()

  }, [phase, enemies])

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

  //////////////////////
  //>>> ANALYSING <<< //
  //////////////////////

  const isAnalysing = useRef(false)

  useEffect(() => {
    // Se não for a fase de final do turno
    if (phase !== "analysing") return console.log("Isn't 'analysing' phase");
    if (isAnalysing.current) return console.log("Is already analysing!!!")
    console.log("Is 'analysing' phase!")

    // Fale que já está analisando
    isAnalysing.current = true

    // Se o número for divisível por 3 o jogador recupera a vida
    if (battle % 3 === 0) {

      // Cria uma váriavel que contém o jogador para que seja atualizado
      // As atualização são feitas em playerUpdated e não re-executando o onPlayerUpdate, pois atualizações anteriores no mesmo render seriam descartados
      // Assim ele junta as atualizações e manda tudo um só para o jogador original
      let playerUpdated = player

      // Cura é realizada na váriavel contém o jogador, sendo 80% da vida máxima
      playerUpdated = heal(playerUpdated, 0.8)

      // Define que status vai ser aumentado
      let whatStat = Math.floor(Math.random() * 4) + 1;

      switch (whatStat) {
        // Aumento de vida
        case 1:
          playerUpdated = addStats(playerUpdated, STAT_TYPE.HEALTH, STAT.MAX, 5)
          break;
        // Aumento de dano físico
        case 2:
          playerUpdated = addStats(playerUpdated, STAT_TYPE.DAMAGE, STAT.PHYSICAL, 1)
          break;
        // Aumento de Chance de Crítico
        case 3:
          playerUpdated = addStats(playerUpdated, STAT_TYPE.DAMAGE, STAT.CRITICAL_CHANCE, 0.1)
          break;
        // Aumento de Defesa
        case 4:
          playerUpdated = addStats(playerUpdated, STAT_TYPE.RESISTANCE, STAT.DEFENSE, 1)
          break;
      }

      // Atualizar o jogador
      onPlayerUpdate(playerUpdated)

    }

    // Após a verificação de recompensas, é uma nova batalha
    NewBattle();

    // Terminou de analisar
    isAnalysing.current = false

  }, [phase])

  /*
  /~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/
  Função para atualizar jogador e inimigos
  
  updatePlayer(update)
  updateEnemy(enemyId, update)
  /~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/
  */
  //#region atualizacao-instancias

  // Função para atualizar o jogador, o update seria a atualização, no caso o jogador com os novos dados
  function updatePlayer(update) {

    /*
      setPlayer recebe uma função.
      Essa função recebe o estado anterior (prev).
      E update retorna o "novo" player
    */
    onPlayerUpdate(prev => update(prev));
  }

  // Função para atualizar o inimigo, enemyId é para encontrar o inimigo especifico no array e o update seria a atualização, no caso o inimigo com os novos dados
  function updateEnemy(enemyId, update) {

    /*
      onEnemiesUpdate recebe uma função.
      Essa função recebe o estado anterior do inimigo (enemy).
      E update retorna o "novo" jogador
    */
    onEnemiesUpdate(prevEnemies =>
      prevEnemies.map(enemy =>
        // Se não for o inimigo especificado, pode retornar como estava, pois ele não vai atualizar
        // Caso ao contrário, o update vai mostrar o inimigo com os novos dados
        enemy.id === enemyId
          ? update(enemy)
          : enemy
      )
    );
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
    if (attackerId === player.id) {
      // Chama a função que faz a atualização na instância
      updatePlayer(p => setPosture(POSTURE.OFFENSIVE, p));
    } else {
      updateEnemy(attackerId, enemy => setPosture(POSTURE.OFFENSIVE, enemy));
    };

    // Verificar se o ataque vai ser normal ou critico
    const critical = Math.random() < attacker.stats.dmg.critical_chance;
    critical && console.log(">>>>>> CRITICAL HIT!!!!!")

    // O multiplicador é fixo, ou seja, o critico sempre será 180% do dano
    // Essa variável é o dano que vai ser passado para o defensor
    const final_damage = critical
      ? Math.floor(attacker.stats.dmg.physical * 1.8)
      : attacker.stats.dmg.physical;

    if (defenderId === player.id) {
      updatePlayer(p => applyDamage(final_damage, p));
    } else {
      updateEnemy(defenderId, enemy => applyDamage(final_damage, enemy));
    };
    console.log(`${attacker.name}: Attacked ${defender.name} and ${critical ? "critically hit dealing " : "dealt "}${final_damage}`)

  }

  // Função de Defender
  function defend(actorId) {
    // Faz verificação de quem é o autor
    if (actorId === player.id) {
      // Chama a função que faz a atualização na instância
      updatePlayer(p => setPosture(POSTURE.DEFENSIVE, p));
      // Caso não seja, ele faz a atualização no inimigo
    } else {
      updateEnemy(actorId, enemy => setPosture(POSTURE.DEFENSIVE, enemy));
    };
  };
  //#endregion acoes

  // BattleSystem não renderiza nada diretamente, quem faz isso é BattleUI
  return null;
}

export default BattleSystem;
