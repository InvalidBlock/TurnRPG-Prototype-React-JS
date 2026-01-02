// Importa o hook useState para controle de estado
import React, { useState } from "react";

// Importa as funções da Game Jolt API
import { authenticateUser, unlockTrophy } from "./../services/Gamejolt.js";

// ID da conquista criada no painel da Game Jolt
const TROPHY_ID = "287458";

function App() {

  // Estado para armazenar o username do usuário
  const [username, setUsername] = useState("");

  // Estado para armazenar o token do usuário
  const [token, setToken] = useState("");

  // Estado para feedback visual (mensagens de status)
  const [status, setStatus] = useState("");

  /*
    Função chamada ao clicar em "Autenticar"
    Verifica se o usuário existe na Game Jolt
  */
  async function handleAuth() {
    setStatus("Autenticando...");

    // Chamada à API
    const result = await authenticateUser(username, token);

    // A API retorna success como string ("true" ou "false")
    if (result.response?.success === "true") {
      setStatus("Usuário autenticado com sucesso");
    } else {
      setStatus("Falha na autenticação");
    }
  }

  /*
    Função chamada ao clicar em "Desbloquear Conquista"
    Marca o trophy como alcançado para o usuário
  */
  async function handleUnlock() {
    setStatus("Desbloqueando conquista...");

    const result = await unlockTrophy(username, token, TROPHY_ID);

    if (result.response?.success === "true") {
      setStatus("Conquista desbloqueada!");
    } else {
      setStatus("Erro ao desbloquear conquista");
    }
  }

  // JSX: interface visual
  return (
    <div style={{ padding: 20 }}>
      <h1>Teste de Integração com Game Jolt API</h1>

      {/* Campo para username */}
      <input
        placeholder="Username Game Jolt"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      {/* Campo para token */}
      <input
        placeholder="User Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      <br /><br />

      {/* Botão de autenticação */}
      <button onClick={handleAuth}>
        Autenticar
      </button>

      {/* Botão de conquista */}
      <button onClick={handleUnlock} style={{ marginLeft: 10 }}>
        Desbloquear Conquista
      </button>

      {/* Feedback ao usuário */}
      <p>{status}</p>
    </div>
  );
}

export default App;