import "./BottomBar.css"
// Ações
import Attack from "./Actions/Attack"
import Defend from "./Actions/Defend"
import Items from "./Actions/Items"
// Cartas
import Cards from "./Cards/Cards"

function BottomBar({ choose_cards, turn }) {

    return (
        <>
            {turn === "player" && !choose_cards
                ? <div className="actions"><Attack /><Defend /><Items /></div>
                : turn === "player"
                    ? <div className="cards"><Cards /></div>
                    : <div />
            }
        </>
    )
}

export default BottomBar