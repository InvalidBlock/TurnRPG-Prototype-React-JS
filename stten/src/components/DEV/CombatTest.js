// Este é um teste de combate realizado no console do navegador

// É importado o jogador e um inimigo, 1v1
import { Player } from "../Game/Player/Attributes.js";
import { Enemy } from "../Game/Enemies/Enemy.js";

console.clear();
console.log("=== DIRECT DAMAGE TEST ===");

// Instanciar
const player = new Player();
const enemy = new Enemy("skeleton");

// Estado inicial
// Teste com postura ofensiva
console.log("\n--- TEST WITH OFFENSIVE POSTURE ---");
console.log("\n--- INITIAL STATE ---");
console.log("Player HP:", player.health.current);
console.log("Player Posture:", player.posture);
console.log("Enemy HP:", enemy.current_hp);
console.log("Enemy Posture:", enemy.posture);

// Player attacks Enemy
console.log("\n>>> Player attacks Enemy");
player.attack(enemy);

// Enemy attacks Player
console.log("\n>>> Enemy attacks Player");
enemy.attack(player);

// Estado final
console.log("\n--- FINAL STATE ---");
console.log("Player HP:", player.health.current);
console.log("Enemy HP:", enemy.current_hp);

// Teste com postura defensiva
console.log("\n--- TEST WITH DEFENSIVE POSTURE ---");

player.posture = "offensive";
enemy.posture = "defensive";

console.log("\n--- INITIAL STATE ---");
console.log("Player HP:", player.health.current);
console.log("Player Posture:", player.posture);
console.log("Enemy HP:", enemy.current_hp);
console.log("Enemy Posture:", enemy.posture);

// Player attacks Enemy
console.log("\n>>> Player attacks Enemy");
player.attack(enemy);

// Enemy attacks Player
console.log("\n>>> Enemy attacks Player");
enemy.attack(player);

// Estado final
console.log("\n--- FINAL STATE ---");
console.log("Player HP:", player.health.current);
console.log("Enemy HP:", enemy.current_hp);

// Trocam posturas
console.log("\n>>> Player changes posture");
console.log("\n>>> Enemy changes posture");

player.posture = "defensive";
enemy.posture = "offensive";

console.log("\n--- INITIAL STATE ---");
console.log("Player HP:", player.health.current);
console.log("Player Posture:", player.posture);
console.log("Enemy HP:", enemy.current_hp);
console.log("Enemy Posture:", enemy.posture);

// Player attacks Enemy
console.log("\n>>> Player attacks Enemy");
player.attack(enemy);

// Enemy attacks Player
console.log("\n>>> Enemy attacks Player");
enemy.attack(player);

// Estado final
console.log("\n--- FINAL STATE ---");
console.log("Player HP:", player.health.current);
console.log("Enemy HP:", enemy.current_hp);

console.log("\n=== END OF TEST ===");
