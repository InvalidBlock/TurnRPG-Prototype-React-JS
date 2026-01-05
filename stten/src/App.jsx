import { useState } from 'react';

import './App.css'

import { getDevCredentials, DEV_MODE } from './components/DEV/Auth/Credentials.js';

import Auth from './components/DEV/Auth/Auth.jsx';
import Game from './components/Game.jsx';
import MainMenu from './components/MainMenu.jsx';

function App() {

  // Gerenciamento de cenas
  const [scene, setScene] = useState("menu");

  // Verifica se está em modo DEV e se o usuário está autenticado
  const devMode = DEV_MODE;
  const [authenticated, setAuthenticaded] = useState(getDevCredentials().authenticated);

  if (devMode && !authenticated) {
    return <Auth onSuccess={() => setAuthenticaded(true)} />;
  }

  return (
    <>
      {scene === "menu" && <MainMenu changeScene={(newScene) => () => setScene(newScene)} />}
      {scene === "game" && <Game changeScene={(newScene) => () => setScene(newScene)}/>}
    </>
  );

}

export default App
