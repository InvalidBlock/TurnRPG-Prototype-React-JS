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
        console.log("O inimigo " + this.name + " ( " + this.id + " ) foi criado!")
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
        this.current_hp -= damage_taken

        // Para visualização via console
        console.log(this.name + " ( " + this.type + "," + this.id + " ): ID = " + this.id)
        console.log(this.name + " ( " + this.type + "," + this.id + " ): Posture = " + this.posture)
        console.log(this.name + " ( " + this.type + "," + this.id + " ): Reduction = " + reduction + " ( armor: " + this.stats.res.armor + " defense: " + this.stats.res.defense + " )")
        console.log(this.name + " ( " + this.type + "," + this.id + " ): Damage taken = " + damage_taken + "( amount: " + amount + " )")

        // Caso o dano seja fatal, defina como morto
        if (this.current_hp <= 0) {

            // Para visualização via console
            console.log(this.name + " ( " + this.type + "," + this.id + " ): Morreu")

            this.current_hp = 0;
            this.dead = true;
        }

    }

    // Função em que o inimigo declara a intenção
    AI(player) {

        /* AI PROFILE's

        dumb: Maior chance de atacar mesmo estando com pouca vida e foca alvo com menor vida independente da postura
        tatical: Fica defensivo com pouca vida (Maior chance de ataque se o inimigo atacou ele), se aproveita de quem estar em postura ofensiva ou pouca vida

        */
        // Fear: É uma chance adicional do inimigo se defender ao ficar com pouca vida

        // Porcentagem da vida máxima em que é considerada perigosa, caso a atual seja menor
        let dangerousHealthPercentage = 0;
        // Chance de defender se estiver em perigo
        let defenseInDangerPercentage = 0;

        // Considerar postura
        let postureIsRelevant = false;
        // Bônus de chance do inimigo atacar se ele estiver exposto (Com postura ofensiva)
        let attackWithOffensiveExposurePercentage = 0;
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
                // Bônus de chance do inimigo atacar se ele estiver exposto (Com postura ofensiva)
                attackWithOffensiveExposurePercentage = 0; // Ele não leva em consideração a postura, então tanto faz para ele (0)
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
                // Bônus de chance do inimigo atacar se ele estiver exposto (Com postura ofensiva)
                attackWithOffensiveExposurePercentage = 0.2;
                // Porcentagem da vida máxima do jogador em que ele considera perigoso para tal.
                enemyDangerousHealthPercentage = 0.3;

                break;
        }

        // Análise de si mesmo
        // Faz uma análise de si mesmo, se está em perigo e deve se defender ou se está seguro
        const isDangerousHealth = this.health.current < this.health.max * dangerousHealthPercentage

        // Análise de Campo
        // Faz uma análise de quem está com pouca vida e quem esta ofensivo
        const enemyInDangerousHealth = player.health.current < player.health.max * enemyDangerousHealthPercentage
        const enemyInOffensive = player.posture === "offensive"
        // Ele não sabe a armadura ou defesa do jogador, mas se ele está muito ferido pela aparência.
        const isFatalDamage = player.health.current < this.stats.dmg.physical

        // Análise dos dados obtidos
        // Pontos de prioriedade
        let priorityScore = 0;

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

        // O inimigo dele está em perigo
        if (enemyInDangerousHealth) {
            priorityScore += 1;
        }

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

        // O dano parece ser fatal
        if (isFatalDamage) {
            priorityScore += 1
        }

        // Chance de defender se estiver em perigo
        if (isDangerousHealth && Math.random() < defenseInDangerPercentage) {
            priorityScore -= 1;
        }

        //#endregion Prioridade

        // Cálculo da prioriedade baseado nos pontos acumulados
        let priority = 0;

        if (priorityScore < 0) {
            priority = 0;
        } else if (priorityScore <= 2) {
            priority = 1;
        } else {
            priority = 2;
        }

        // Ruído emocional
        if (Math.random() < defenseInDangerPercentage + this.ai.fear * 0.1 && this.ai.fear > 0.1 && isDangerousHealth) {
            priority = Math.max(0, priority - 1);
        }

    }

};