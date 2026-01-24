import enemyData from "./EnemyList.json"

// Por que foi usado uma classe desta vez?
export class Enemy {

    constructor({ type, id }) {
        const data = enemyData[type]

        this.dead = false;
        this.posture = "offensive"; // "offensive" || "defensive"

        this.id = id;
        this.type = type;

        this.name = data.name;
        this.sprite = data.sprite

        this.health = { ...data.health };
        this.stats = { ...data.stats };

        this.ai = { ...data.ai }

        // Para visualização via console
        console.log("The enemy " + this.name + " ( " + this.id + " ) was created!")
        console.log(this, [this.type, this.name, this.health, this.stats, this.ai])
    }

    // Função de receber dano
    takeDamage(amount) {

        // Se ja estiver morto, apenas retorne
        if (this.dead) return;

        // Se o inimigo estiver defendendo, a redução é a armadura junto da defesa
        const reduction =
            this.posture === "defensive"
                ? this.stats.res.armor + this.stats.res.defense
                : this.stats.res.armor;

        // Calcula o dano verdadeiro
        const damage_taken = Math.max(0, amount - reduction);
        if (this.ai.fear >= 0) {
            if (damage_taken > 0) {
                this.ai.fear += 0.015
            } else {
                this.ai.fear = Math.min(0, this.ai.fear - 0.015)
            }
        }

        // Diminua a vida pelo dano recebido
        this.health.current -= damage_taken

        // Para visualização via console
        console.log(this.name + " ( " + this.type + "," + this.id + " ): ID = " + this.id)
        console.log(this.name + " ( " + this.type + "," + this.id + " ): Posture = " + this.posture)
        console.log(this.name + " ( " + this.type + "," + this.id + " ): Reduction = " + reduction + " ( armor: " + this.stats.res.armor + " defense: " + this.stats.res.defense + " )")
        console.log(this.name + " ( " + this.type + "," + this.id + " ): Damage taken = " + damage_taken + "( amount: " + amount + " )")

        // Caso o dano seja fatal, defina como morto
        if (this.health.current <= 0) {

            // Para visualização via console
            console.log(this.name + " ( " + this.type + "," + this.id + " ): Died")

            this.health.current = 0;
            this.dead = true;
        }

    }

    // Função em que o inimigo declara a intenção
    AI({ player }) {

        // Um DEBUG da AI via console
        let AIDebug = []

        // Puxar informações cruciais para saber que inimigo estamos falando.
        AIDebug.push(`NAME: ${this.name}\nTYPE: ${this.type}\nID: ${this.id}\n`)

        /* AI PROFILE's

        dumb: Maior chance de atacar mesmo estando com pouca vida e foca alvo com menor vida independente da postura
        tatical: Fica defensivo com pouca vida (Maior chance de ataque se o inimigo atacou ele), se aproveita de quem estar em postura ofensiva ou pouca vida

        */
        // Fear: É uma chance adicional do inimigo se defender ao ficar com pouca vida

        // Puxar informações para entender que tipo de IA estamos falando
        AIDebug.push(`------------------------\n           AI            \n------------------------`, "\n")
        AIDebug.push(`PROFILE: ${this.ai.profile}\nFEAR: ${this.ai.fear}\n\n`)

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
        switch (this.ai.profile) {
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
        const isDangerousHealth = this.health.current < this.health.max * dangerousHealthPercentage

        // Análise de Campo
        // Faz uma análise de quem está com pouca vida e quem esta ofensivo
        const enemyInDangerousHealth = player.health.current < player.health.max * enemyDangerousHealthPercentage
        const enemyInOffensive = player.posture === "offensive"
        // Ele não sabe a armadura ou defesa do jogador, mas se ele está muito ferido pela aparência.
        const isFatalDamage = player.health.current < this.stats.dmg.physical

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
            if (this.ai.fear > 0) {
                priorityScore -= Math.min(1, this.ai.fear * 10 * 0.7)
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
        if (Math.random() < defenseInDangerPercentage + this.ai.fear * 0.1 && this.ai.fear > 0.1 && isDangerousHealth) {
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
        AIDebug.push(`${this.name} (${this.id}) intention has declared:`, { actor: "enemy", actor_id: this.id, type: action, target: player, target_id: player.id, })

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
            actorId: this.id,
            type: action,

            target: "player",
            targetId: player.id,
        };

    }

};