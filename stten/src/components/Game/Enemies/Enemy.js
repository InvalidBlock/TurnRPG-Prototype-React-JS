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

        this.stats = { ...data.stats };
        this.current_hp = data.stats.max_health;

        // Para visualização via console
        console.log("O inimigo " + this + " foi criado!")
        console.log(this, [this.type, this.name, this.stats, this.current_hp])
    }

    // Função de receber dano
    takeDamage(amount) {

        // Se ja estiver morto, apenas retorne
        if (this.dead) return;

        // Se o inimigo estiver defendendo, a redução é a armadura junto da defesa
        const reduction =
            this.posture === "defensive"
                ? this.stats.armor + this.stats.defense
                : this.stats.armor;

        // Calcula o dano verdadeiro
        const damage_taken = Math.max(0, amount - reduction);

        // Diminua a vida pelo dano recebido
        this.current_hp -= damage_taken

        // Para visualização via console
        console.log(this.name + " ( " + this.type + "," + this.id + " ): ID = " + this.id)
        console.log(this.name + " ( " + this.type + "," + this.id + " ): Posture = " + this.posture)
        console.log(this.name + " ( " + this.type + "," + this.id + " ): Reduction = " + reduction + " ( armor: " + this.stats.armor + " defense: " + this.stats.defense + " )")
        console.log(this.name + " ( " + this.type + "," + this.id + " ): Damage taken = " + damage_taken + "( amount: " + amount + " )")

        // Caso o dano seja fatal, defina como morto
        if (this.current_hp <= 0) {

            // Para visualização via console
            console.log(this.name + " ( " + this.type + "," + this.id + " ): Morreu")

            this.current_hp = 0;
            this.dead = true;
        }

    }

};