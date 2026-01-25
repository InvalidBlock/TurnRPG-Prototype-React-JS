export class Player {

    constructor({id}) {
        this.id = id;
        this.type = "player";
        this.name = "Josias";

        this.sprite = "Hero";

        this.dead = false;
        this.posture = "offensive"; // "offensive" | "defensive"

        this.health = {
            current: 40,
            max: 40
        };

        this.stats = {
            res: {
                defense: 1,
                armor: 0
            },
            dmg: {
                physical: 1
            },
            initiative: 2
        };

        this.ai = null

        // Para visualização via console
        console.log(this.name + " was created!");
        console.log(this);
    }
}
