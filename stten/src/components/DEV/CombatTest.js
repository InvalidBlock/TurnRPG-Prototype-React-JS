// Este é um teste de combate realizado no console do navegador

// É importado o jogador e um inimigo, 1v1
import { Player } from "../Game/Player/Attributes.js";
import { Enemy } from "../Game/Enemies/Enemy.js";

console.clear();
console.log("=== TESTE DE DANO DIRETO ===");

// Instanciar
const player = new Player();
const enemy = new Enemy("skeleton");

// Estado inicial
// Teste com postura ofensiva
console.log("\n--- TESTE COM POSTURA OFENSIVA ---");
console.log("\n--- ESTADO INICIAL ---");
console.log("Player HP:", player.health.current);
console.log("Player Posture:", player.posture);
console.log("Enemy HP:", enemy.current_hp);
console.log("Enemy Posture:", enemy.posture);

// Player ataca Enemy
console.log("\n>>> Player ataca Enemy");
player.attack(enemy);

// Enemy ataca Player
console.log("\n>>> Enemy ataca Player");
enemy.attack(player);

// Estado final
console.log("\n--- ESTADO FINAL ---");
console.log("Player HP:", player.health.current);
console.log("Enemy HP:", enemy.current_hp);

// Teste com postura defensiva
console.log("\n--- TESTE COM POSTURA DEFENSIVA ---");

player.posture = "offensive";
enemy.posture = "defensive";

console.log("\n--- ESTADO INICIAL ---");
console.log("Player HP:", player.health.current);
console.log("Player Posture:", player.posture);
console.log("Enemy HP:", enemy.current_hp);
console.log("Enemy Posture:", enemy.posture);

// Player ataca Enemy
console.log("\n>>> Player ataca Enemy");
player.attack(enemy);

// Enemy ataca Player
console.log("\n>>> Enemy ataca Player");
enemy.attack(player);

// Estado final
console.log("\n--- ESTADO FINAL ---");
console.log("Player HP:", player.health.current);
console.log("Enemy HP:", enemy.current_hp);

// Trocam posturas
console.log("\n>>> Player troca postura");
console.log("\n>>> Enemy troca postura");

player.posture = "defensive";
enemy.posture = "offensive";

console.log("\n--- ESTADO INICIAL ---");
console.log("Player HP:", player.health.current);
console.log("Player Posture:", player.posture);
console.log("Enemy HP:", enemy.current_hp);
console.log("Enemy Posture:", enemy.posture);

// Player ataca Enemy
console.log("\n>>> Player ataca Enemy");
player.attack(enemy);

// Enemy ataca Player
console.log("\n>>> Enemy ataca Player");
enemy.attack(player);

// Estado final
console.log("\n--- ESTADO FINAL ---");
console.log("Player HP:", player.health.current);
console.log("Enemy HP:", enemy.current_hp);

console.log("\n=== FIM DO TESTE ===");
