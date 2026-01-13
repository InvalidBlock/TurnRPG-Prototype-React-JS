import { useState, useEffect } from "react";
import { Player } from "./Player/Attributes/Attributes.js";

// Sistema de turno (Provisório)
export let turn = "player"

function BattleSystem({ onPlayerUpdate }) {

  // Instância do jogador
  const [player, setPlayer] = useState(null);

  // Criação do jogador na inicialização
  useEffect(() => {

    // Criar jogador
    const instance = new Player();
    // Guardar a Instância
    setPlayer(instance);
    // Informa ao componente pai que o jogador existe e pode ser repassado para UI
    onPlayerUpdate(instance);

  }, []);

  // Função para aplicar alguma lógina no jogador
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

      // Aqui que se aplica a lógica no jogador

      // Aplicar a mudança
      mutator(copy);

      // Pede para que a UI atualize as informações acerca do jogador
      onPlayerUpdate(copy);

      // Retorna a cópia do jogador que é usada na UI
      return copy;
    });
  }

  // Como o BattleSystem não renderiza nada diretamente
  return null;
}

export default BattleSystem;
