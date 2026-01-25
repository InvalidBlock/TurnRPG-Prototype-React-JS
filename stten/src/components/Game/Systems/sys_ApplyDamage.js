
// Função de receber dano
export function applyDamage(amount, entity) {

    // Se ja estiver morto, apenas retorne
    if (entity.dead) return;

    // Se o inimigo estiver defendendo, a redução é a armadura junto da defesa
    const reduction =
        entity.posture === "defensive"
            ? entity.stats.res.armor + entity.stats.res.defense
            : entity.stats.res.armor;

    // Calcula o dano verdadeiro
    const damageTaken = Math.max(0, amount - reduction);

    // Se ela tiver AI, pega a ai do inimigo em nova var para alterar, senão é nula já que é o jogador que reage
    let aiStats = entity.ai ? entity.ai : null;
    if (entity.ai) {
        // Atualização do fear
        const fear =
            damageTaken > 0
                ? entity.ai.fear + 0.015
                : Math.min(0, entity.ai.fear - 0.015);

        // Para ser usado no return, voltamos os valores ai e o fear que foi alterado
        aiStats = {
            ...entity.ai,
            fear
        };
    };

    // Diminua a vida pelo dano recebido
    const newHealthCurrent = Math.max(0, entity.health.current - damageTaken);

    // Váriavel para mudar o att dead
    // Se a vida está como zero, então retorne true, senão false
    const isDead = newHealthCurrent === 0

    // Para visualização via console
    console.log(entity.name + " ( " + entity.type + "," + entity.id + " ): ID = " + entity.id)
    console.log(entity.name + " ( " + entity.type + "," + entity.id + " ): Posture = " + entity.posture)
    console.log(entity.name + " ( " + entity.type + "," + entity.id + " ): Reduction = " + reduction + " ( armor: " + entity.stats.res.armor + " defense: " + entity.stats.res.defense + " )")
    console.log(entity.name + " ( " + entity.type + "," + entity.id + " ): Damage taken = " + damageTaken + "( amount: " + amount + " )")
    // Se ele morrer vai aparecer no console
    if (isDead) console.log(entity.name + " ( " + entity.type + "," + entity.id + " ): Died");

    return {
        // Retorna os valores da entidade não alterados
        ...entity,
        // Retorna os valores alterados como novos
        health: {
            ...entity.health,
            current: newHealthCurrent
        },
        dead: isDead,
        ai: aiStats
    };

};