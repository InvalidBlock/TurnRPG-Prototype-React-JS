export function addStats(entity, type, stat, amount) {

    // Pegar todos os stats e transformar em variáveis
    let health = {
        current: entity.health.current,
        max: entity.health.max
    }

    let stats = {
        res: {
            defense: entity.stats.res.defense,
            armor: entity.stats.res.armor
        },
        dmg: {
            physical: entity.stats.dmg.physical,
            critical_chance: entity.stats.dmg.critical_chance
        },
        initiative: entity.stats.initiative
    }

    // De que tipo de stats estamos falando
    switch (type) {
        case "health":
            // Sempre que o tipo for vida, quer dizer que vai ser aumentado a vida máxima
            // Se fosse aumentar apenas o current seria usado o heal
            health.max += amount;
            health.current = health.max;
            break;
        case "damage":
            // Verifica que stat vai ser alterado dentro daquele tipo
            switch (stat) {
                // Se for o dano fisico
                case "physical":
                    stats.dmg.physical += amount;
                    break;
                // Se for a chance de crítico
                case "critical_chance":
                    stats.dmg.critical_chance += amount;
                    break;
            }
            break;
        case "resistance":
            switch (stat) {
                // Se for aumento de defesa
                case "defense":
                    stats.res.defense += amount;
                    break;
                // Se for aumento de armadura
                case "armor":
                    stats.res.armor += amount
                    break;
            }
            break;
    }

    // Retornar os valores
    // Fiz um retorno geral para não ter que ficar fazendo verificações atrás de verificações
    return {
        ...entity,
        health,
        stats
    }
}