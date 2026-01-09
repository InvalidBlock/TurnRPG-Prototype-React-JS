export const player = {

    // Estado de Morto
    dead: false,
    // Postura do jogador
    posture: "offensive", // "offensive" | "defensive"

    // Status de Vida Bruta
    health: {
        current: 10,
        max: 10
    },

    // Status
    stats: {
        res: {
            defense: 1,
            armor: 0
        },
        dmg: {
            damage: 1,
        }
    },
};

// Função para o jogador levar dano
export function takeDamage(enemy_damage) {
    // Se ele já estiver morto
    if (player.dead) return;

    // Cálculo da redução de dano
    let reduction = player.posture === "defensive"
        ? player.stats.res.defense + player.stats.res.armor
        : player.stats.res.armor

    // O dano do inimigo é reduzido pela defesa se o jogador estiver em postura defensva, se não é só a resistência da armadura
    let dmg_taken = Math.max(0, enemy_damage - reduction);

    // Diminuir vida do jogador
    player.health.current -= dmg_taken;

    // Verificar se o jogador morreu, ativar o estado e dar "Game Over".
    if (player.health.current <= 0) {
        player.health.current = 0;
        player.dead = true;
    }
};

// Função para dar dano
export function attack(target) {
    // Ativa a função de dar dano no inimigo passando os valores atuais do atributos do jogador
    target.takeDamage(player.stats.dmg.damage);
}

// Função para resetar o jogador
export function resetPlayer() {
    player.dead = false
    player.posture = "offensive"

    player.health.max = 10
    player.health.current = 10

    player.stats.dmg.damage = 1

    player.stats.res.armor = 0
    player.stats.res.defense = 1
}
