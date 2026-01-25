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
};