function MainMenu({ changeScene }) {
  return (
    <div className='menu-container'>
        <div className="title"><h1> Sovereing Tower: The Eternal Night </h1></div>
        <br /><br /><br /><br /><br /><br /><br />
        <div className="options">
            <button className="play-button" onClick={changeScene("game")}> Iniciar Jogo </button>
        </div>
    </div>
  )
}

export default MainMenu