import { useState, useEffect } from "react";
import { Player } from "./Player/Attributes/Attributes.js";

function BattleSystem({ onPlayerUpdate, turn, setTurn, intention, setIntention }) {

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

  // Criação do jogador na inicialização
  useEffect(() => {

    // Criar jogador
    const instance = new Player();
    // Guardar a Instância
    setPlayer(instance);
    // Informa ao componente pai que o jogador existe e pode ser repassado para UI
    onPlayerUpdate(instance);

  }, []);

  // Executa sempre quando a intenção for declarada
  useEffect(() => {
    // Se não houver intenção declarada, retorne
    if (!intention) return;

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
    // Muda o turno baseado no valor anterior
    setTurn(prev => (prev === "player" ? "enemy" : "player"));

  }, [intention]);

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
  function updateEnemy(enemyId, mutator){

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

  // Função de Atacar
  function attack(attacker, attackerId, defender, defenderId) {

    // Faz verificação de quem é o autor
    if (attacker === player){
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

    if (defender === player){
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

  // Como o BattleSystem não renderiza nada diretamente
  return null;
}

export default BattleSystem;
