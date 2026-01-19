import "./BottomBar.css"
// Ações
import Attack from "./Actions/Attack"
import Defend from "./Actions/Defend"
// import Items from "./Actions/Items"
// Cartas
import Cards from "./Cards/Cards"

function BottomBar({ choose_cards, turnActor }) {

    const player_turn = turnActor.type = "player"

    return (
        <>
            {player_turn && !choose_cards
                ? <div className="actions"><Attack /><Defend /></div>
                : player_turn
                    ? <div className="cards"><Cards /></div>
                    : <div />
            }
        </>
    )
}

export default BottomBar