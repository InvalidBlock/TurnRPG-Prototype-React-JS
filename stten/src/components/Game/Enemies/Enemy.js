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

        // Análise de Campo
        // Faz uma análise de quem está com pouca vida e quem esta ofensivo

        

    }

};