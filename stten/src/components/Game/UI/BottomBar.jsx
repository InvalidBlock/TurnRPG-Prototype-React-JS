import "./BottomBar.css"

// import Items from "./Actions/Items"
// Cartas
import Cards from "./Cards/Cards"

function BottomBar({ choose_cards, turnActor, phase, setPhase, setIntention }) {

    const awaiting_input = phase === "awaiting_input"
    const player_turn = turnActor.type === "player"

    // Ao clicar no botão de atacar
    function handleAttack() {
        // Mudar intenção
        setIntention({
            actor: "player",
            actor_id: "player",
            type: "attack",

            target: "enemy",
            target_id: "x",
        })

        // Mudar phase
        setPhase("action")
    }

    // Ao clicar no botão de defender
    function handleDefense() {
        // Mudar intenção
        setIntention({
            actor: "player",
            actor_id: "player",
            type: "defend",

            target: null,
            target_id: null,
        })

        // Mudar phase
        setPhase("action")
    }

    return (
        <>
            {awaiting_input && player_turn && !choose_cards
                ? <div className="actions">
                    <button className={"action-attack"} onClick={handleAttack}>Attack</button>
                    <button className={"action-defend"} onClick={handleDefense}>Defend</button>
                </div>
                : player_turn
                    ? <div className="cards"><Cards /></div>
                    : <div />
            }
        </>
    )
}

export default BottomBar