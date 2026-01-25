// Função em que o inimigo declara a intenção
export function enemyAI(player, entity) {

        // Um DEBUG da AI via console
        let AIDebug = []

        // Puxar informações cruciais para saber que inimigo estamos falando.
        AIDebug.push(`NAME: ${entity.name}\nTYPE: ${entity.type}\nID: ${entity.id}\n`)

        /* AI PROFILE's

        dumb: Maior chance de atacar mesmo estando com pouca vida e foca alvo com menor vida independente da postura
        tatical: Fica defensivo com pouca vida (Maior chance de ataque se o inimigo atacou ele), se aproveita de quem estar em postura ofensiva ou pouca vida

        */
        // Fear: É uma chance adicional do inimigo se defender ao ficar com pouca vida

        // Puxar informações para entender que tipo de IA estamos falando
        AIDebug.push(`------------------------\n           AI            \n------------------------`, "\n")
        AIDebug.push(`PROFILE: ${entity.ai.profile}\nFEAR: ${entity.ai.fear}\n\n`)

        // Porcentagem da vida máxima em que é considerada perigosa, caso a atual seja menor
        let dangerousHealthPercentage = 0;
        // Chance de defender se estiver em perigo
        let defenseInDangerPercentage = 0;

        // Considerar postura
        let postureIsRelevant = false;
        // Porcentagem da vida máxima do jogador em que ele considera perigoso para tal.
        let enemyDangerousHealthPercentage = 0;

        // Análise do perfil
        // Verificar que perfil a IA se encontra
        switch (entity.ai.profile) {
            // Se o perfil for "dumb", praticamente um perfil bárbaro
            case "dumb":

                //
                // SITUAÇÃO DE PERIGO
                //
                // Definir a porcentagem de vida em que vai ser considerado perigosa
                dangerousHealthPercentage = 0.2;
                // Definir a porcentagem de chance de defender caso esteja em perigo
                defenseInDangerPercentage = 0.2;

                //
                // EXPOSIÇÃO DO INIMIGO
                //
                // Definir se a postura do inimigo é relevante para decidir se atacar
                postureIsRelevant = false;
                // Porcentagem da vida máxima do jogador em que ele considera perigoso para tal.
                enemyDangerousHealthPercentage = 0.5;

                break;

            // Se o perfil for "tatical", praticamente um perfil inteligente
            case "tatical":

                //
                // SITUAÇÃO DE PERIGO
                //
                // Definir a porcentagem de vida em que vai ser considerado perigosa
                dangerousHealthPercentage = 0.4;
                // Definir a porcentagem de chance de defender caso esteja em perigo
                defenseInDangerPercentage = 0.4;

                //
                // EXPOSIÇÃO DO INIMIGO
                //
                // Definir se a postura do inimigo é relevante para decidir se atacar
                postureIsRelevant = true;
                // Porcentagem da vida máxima do jogador em que ele considera perigoso para tal.
                enemyDangerousHealthPercentage = 0.3;

                break;
        }

        AIDebug.push(`dangerousHealthPercentage: ${dangerousHealthPercentage}\ndefenseInDangerPercentage: ${defenseInDangerPercentage}\n`)
        AIDebug.push(`postureIsRelevant: ${postureIsRelevant}\nenemyDangerousHealthPercentage: ${enemyDangerousHealthPercentage}\n\n`)

        // Análise de si mesmo
        // Faz uma análise de si mesmo, se está em perigo e deve se defender ou se está seguro
        const isDangerousHealth = entity.health.current < entity.health.max * dangerousHealthPercentage

        // Análise de Campo
        // Faz uma análise de quem está com pouca vida e quem esta ofensivo
        const enemyInDangerousHealth = player.health.current < player.health.max * enemyDangerousHealthPercentage
        const enemyInOffensive = player.posture === "offensive"
        // Ele não sabe a armadura ou defesa do jogador, mas se ele está muito ferido pela aparência.
        const isFatalDamage = player.health.current < entity.stats.dmg.physical

        AIDebug.push(`isDangerousHealth: ${isDangerousHealth}\n\nenemyInDangerousHealth: ${enemyInDangerousHealth}\nenemyInOffensive: ${enemyInOffensive}\nisFatalDamage: ${isFatalDamage}\n\n`)

        // Análise dos dados obtidos
        // Pontos de prioriedade
        let priorityScore = 0;

        AIDebug.push(">>> PRIORITY SCORE <<<\n\n")

        //#region Prioridade

        // Ele está em perigo
        if (isDangerousHealth) {
            priorityScore -= 1

            // Este inimigo tem medo?
            if (entity.ai.fear > 0) {
                priorityScore -= Math.min(1, entity.ai.fear * 10 * 0.7)
            }

        } else {
            priorityScore += 1
        }

        AIDebug.push(`\n---\nisDagerousHealth\n>>> ${priorityScore}\n---`)

        // O inimigo dele está em perigo
        if (enemyInDangerousHealth) {
            priorityScore += 1;
        }

        AIDebug.push(`\n---\nenemyInDangerousHealth\n>>> ${priorityScore}\n---`)

        // Ele leva em consideração a postura
        if (postureIsRelevant) {

            // O inimigo dele está ofensiva
            if (enemyInOffensive) {
                priorityScore += 2
            } else {
                priorityScore -= 1
            }

        } else {
            priorityScore += 2
        }

        AIDebug.push(`\n---\npostureIsRelevant & enemyInOffensive\n>>> ${priorityScore}\n---`)

        // O dano parece ser fatal
        if (isFatalDamage) {
            priorityScore += 1
        }

        AIDebug.push(`\n---\nisFatalDamage\n>>> ${priorityScore}\n---`)

        // Chance de defender se estiver em perigo
        if (isDangerousHealth && Math.random() < defenseInDangerPercentage) {
            priorityScore -= 1;
        }

        AIDebug.push(`\n---\ndefenseInDangerPercentage\n>>> ${priorityScore}\n---`)

        //#endregion Prioridade

        // Cálculo da prioriedade baseado nos pontos acumulados
        let priority = 0;

        /*
        
        0 = LOWER
        1 = MEDIUM
        2 = HIGHER

        */

        if (priorityScore < 0) {
            priority = 0;
        } else if (priorityScore <= 2) {
            priority = 1;
        } else {
            priority = 2;
        }

        AIDebug.push(`\n=======\nPRIORITY SCORE = ${priorityScore}\nPRIORITY = ${priority}\n======\n`)

        // Ruído emocional
        if (Math.random() < defenseInDangerPercentage + entity.ai.fear * 0.1 && entity.ai.fear > 0.1 && isDangerousHealth) {
            priority = Math.max(0, priority - 1);
            AIDebug.push(`\n=======\nPRIORITY FEAR REDUCTION (-1) = ${priority}\n======\n`)
        }

        const attackChanceBonus = priority === 1
            ? 1 // MEDIUM
            : priority === 2
                ? 1.7 // HIGHER
                : 0.6 // LOWER

        // Escolha do tipo de ação
        const action = Math.random() <= 0.5 * attackChanceBonus
            ? "attack" // Se menor que a chance
            : "defend" // Se maior que a chance

        AIDebug.push(`\n---\nattackChanceBonus\n>>> ${attackChanceBonus}\n---\n\n=======\nACTION = ${action}\n======\n\n`)
        AIDebug.push(`${entity.name} (${entity.id}) intention has declared:`, { actor: "enemy", actor_id: entity.id, type: action, target: player, target_id: player.id, })

        // Mostrar o debug
        AIDebug.forEach((item) => {
            // Caso ele seja um object tem que transformar o JSON em string
            if (typeof item === "object") {
                console.log(JSON.stringify(item, null, 2));
            } else {
                // Se não ele apenas mostra o item como se fosse uma linha de console.log normalmente
                console.log(item);
            }
        });

        // Está configurado apenas para 1v1
        return {
            actor: "enemy",
            actorId: entity.id,
            type: action,

            target: "player",
            targetId: player.id,
        };

    }