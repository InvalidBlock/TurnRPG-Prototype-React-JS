import "./BottomBar.css"

function BottomBar({ turnActor, phase, setPhase, setIntention, selectedTarget, setSelectedTarget}) {

    const awaiting_input = phase === "awaiting_input"
    const player_turn = turnActor.type === "player"

    // Ao clicar no botão de atacar
    function handleAttack() {
        if (!selectedTarget) return;
        // Mudar intenção
        setIntention({
            actor: "player",
            actorId: turnActor.id,
            type: "attack",

            target: selectedTarget,
            targetId: selectedTarget.id,
        })

        // Mudar phase
        setPhase("action")
        setSelectedTarget(null)
    }

    // Ao clicar no botão de defender
    function handleDefense() {
        // Mudar intenção
        setIntention({
            actor: "player",
            actorId: turnActor.id,
            type: "defend",

            target: null,
            targetId: null,
        })

        // Mudar phase
        setPhase("action")
    }

    return (
        <>
            {awaiting_input && player_turn
                ? <div className="actions">
                    <button className={"action-attack"} onClick={handleAttack}>Attack</button>
                    <button className={"action-defend"} onClick={handleDefense}>Defend</button>
                </div>
                : <div/>
            }
        </>
    )
}

export default BottomBar