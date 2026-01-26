export function heal(entity, percentage) {
    // Faz a cura baseada na porcentagem da vida máxima
    const newHealthCurrent = Math.min(entity.health.max, entity.health.current + (entity.health.max * percentage))
    return {
        // Retorna os valores da entidade não alterados
        ...entity,
        // Retorna os novos valores da entidade
        health: {
            ...entity.health,
            current: newHealthCurrent
        }
    };
}