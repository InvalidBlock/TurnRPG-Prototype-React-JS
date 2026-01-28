import { useEffect, useRef, useState } from 'react';

import './App.css'

import Game from './components/Game.jsx';
import MainMenu from './components/MainMenu.jsx';

import { initAuth } from './services/Gamejolt/Gamejolt.js';

function App() {

  // Gerenciamento de cenas
  const [scene, setScene] = useState("menu");

  // Para avisar que ainda está sendo feito a autenticação
  const isAuthenticating = useRef(false);

  // Se o usuário estiver autenticado
  const userAuthenticated = useRef(false);

  // Uma função para mudar de cena, ela é passada como props e também é usada para o debug
  const changeScene = (newScene) => {
    console.log("Mudando cena para:", newScene);
    setScene(newScene);
  };

  // Na inicialização ele tenta fazer a autenticação
  useEffect(() => {
    isAuthenticating.current = true;
    // Chama o initAuth do serviço
    initAuth()
      // Se for retornado que deu certo a autenticação
      .then(response => {
        // console.log("Resposta bruta da API:", response);
        if (response?.response?.success === "true") {
          userAuthenticated.current = true
          console.warn("O Usuário foi autenticado com sucesso!")
        } else {
          userAuthenticated.current = false
          console.warn("O Usuário não foi autenticado!")
        }
      
      isAuthenticating.current = false;
      });
  }, [])

  return (
    <>
      {isAuthenticating.current && <h1>Authenticating...</h1>}
      {!isAuthenticating.current && scene === "menu" && <MainMenu changeScene={changeScene}/>}
      {!isAuthenticating.current && scene === "game" && <Game changeScene={changeScene} authenticated={userAuthenticated.current} />}
    </>
  );

}

export default App
