import { useState } from "react";

// Importa as funções do serviço da Game Jolt
import { unlockTrophy } from "../../services/Gamejolt/Gamejolt.js";

// ID da conquista criada no painel da Game Jolt
const TROPHY_ID = "287723";

function App() {

  const [status, setStatus] = useState("");

  /*
    Função chamada ao clicar em "Desbloquear Conquista".
    Simula um evento do jogo.
  */
  function handleUnlock() {
    setStatus("Desbloqueando conquista...");

    unlockTrophy(TROPHY_ID)
      .then(function (result) {

        if (result && result.response.success === "true") {
          setStatus("Conquista desbloqueada com sucesso!");
        } else {
          setStatus("Erro ao desbloquear conquista");
        }

      });
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Teste de Conquista</h3>
      <br />
      {/* Botão para simular evento de jogo */}<button onClick={handleUnlock} style={{ marginLeft: 10 }}>Desbloquear Conquista</button>
      <br />
      {/* Status da operação */}<p>{status}</p>
    </div>
  );
}

export default App;
