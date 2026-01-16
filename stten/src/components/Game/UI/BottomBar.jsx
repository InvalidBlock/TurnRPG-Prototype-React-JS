import "./BottomBar.css"
// Ações
import Attack from "./Actions/Attack"
import Defend from "./Actions/Defend"
import Items from "./Actions/Items"
// Cartas
import Cards from "./Cards/Cards"

function BottomBar({ choose_cards, turnActor }) {

    return (
        <>
            {turnActor === "player" && !choose_cards
                ? <div className="actions"><Attack /><Defend /><Items /></div>
                : turnActor === "player"
                    ? <div className="cards"><Cards /></div>
                    : <div />
            }
        </>
    )
}

export default BottomBar