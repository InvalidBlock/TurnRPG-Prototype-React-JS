import enemyData from "./EnemyList.json"

// Por que foi usado uma classe desta vez?
export class Enemy {



    constructor(enemyID) {
        const data = enemyData[enemyID]

        this.dead = false;
        this.posture = "offensive"; // "offensive" || "defensive"

        this.id = data.id;
        this.name = data.name;

        this.stats = { ...data.stats };
        this.current_hp = data.stats.max_health;

        // Para visualização via console
        console.log("O inimigo " + this + " foi criado!")
        console.log(this, [this.id, this.name, this.stats, this.current_hp])
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
        console.log(this.name + " ( " + this.id + " ): Posture = " + this.posture)
        console.log(this.name + " ( " + this.id + " ): Reduction = " + reduction + " ( armor: " + this.stats.armor + " defense: " + this.stats.defense + " )")
        console.log(this.name + " ( " + this.id + " ): Damage taken = " + damage_taken + "( amount: " + amount + " )")

        // Caso o dano seja fatal, defina como morto
        if (this.current_hp <= 0) {

            // Para visualização via console
            console.log(this.name + " ( " + this.id + " ): Morreu")

            this.current_hp = 0;
            this.dead = true;
        }

    }

    // Função de atacar
    attack(target) {
        target.takeDamage(this.stats.damage)

        // Para visualização via console
        console.log(this.name + " ( " + this.id + " ): Atacou o " + target.name + " com " + this.stats.damage + " de dano.")

        console.log(
            this.name + " ( " + this.id + " ): Atacou o " + target.name + " com " + this.stats.damage + " de dano."
        );
    }

};