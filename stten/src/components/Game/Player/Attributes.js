export class Player {

    constructor() {
        this.id = "player";
        this.name = "Player";

        this.dead = false;
        this.posture = "offensive"; // "offensive" | "defensive"

        this.health = {
            current: 10,
            max: 10
        };

        this.stats = {
            res: {
                defense: 1,
                armor: 0
            },
            dmg: {
                damage: 2,
            }
        };

        // Para visualização via console
        console.log(this.name + " foi criado!");
        console.log(this);
    }

    takeDamage(enemy_damage) {
        // Se ele já morreu é só retornar
        if (this.dead) return;

        // Se o jogador estiver em uma postura defensiva a redução não fica apenas na armadura e soma com a defesa
        const reduction = this.posture === "defensive"
            ? this.stats.res.defense + this.stats.res.armor
            : this.stats.res.armor;

        // Cálculo do dano verdadeiro
        const damage_taken = Math.max(0, enemy_damage - reduction);

        // Diminuir a vida do jogador pelo dano verdadeiro
        this.health.current -= damage_taken;

        // Para visualização via console
        console.log(this.name + ": Posture = " + this.posture);
        console.log(this.name + ": Reduction = " + reduction + " ( armor: " + this.stats.res.armor + ", defense: " + this.stats.res.defense + " )");
        console.log(this.name + ": Damage taken = " + damage_taken + " ( enemy damage: " + enemy_damage + " )");

        // Verifica se o dano foi fatal
        if (this.health.current <= 0) {
            this.health.current = 0;
            this.dead = true;

            // Para visualização via console
            console.log(this.name + ": Morreu");
        }
    }

    attack(target) {
        target.takeDamage(this.stats.dmg.damage);

        // Para visualização via console
        console.log(this.name + ": Atacou " + target.name + " causando " + this.stats.dmg.damage + " de dano.");
    }

    resetPlayer() {
        this.dead = false;
        this.posture = "offensive";

        this.health.max = 10;
        this.health.current = 10;

        this.stats.dmg.damage = 1;
        this.stats.res.armor = 0;
        this.stats.res.defense = 1;

        // Para visualização via console
        console.log(this.name + ": Resetado para início de uma nova run");
        console.log(this);
    }
}
