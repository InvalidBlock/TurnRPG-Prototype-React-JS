import './App.css'

import { DEV_MODE } from './components/DEV/Auth/Credentials.js';

import Auth from './components/DEV/Auth/Auth.jsx';
import TestTrophy from './components/DEV/TestTrophy.jsx'

function App() {

  return (
    <>
      {DEV_MODE && <Auth />}
      <TestTrophy />
    </>
  )
}

export default App
