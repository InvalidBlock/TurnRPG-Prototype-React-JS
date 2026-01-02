// Importa a função MD5 da biblioteca crypto-js
// A Game Jolt exige uma assinatura MD5 da URL + Private Key
import md5 from "crypto-js/md5";

// ID do jogo fornecido pelo painel da Game Jolt
const GAME_ID = "1040406";

// Chave privada do jogo (NÃO deve ir para o front-end em produção)
const PRIVATE_KEY = "be40e9583dbadc8f935fdf9035b078ad";

// URL base da API da Game Jolt (versão 1.2)
const BASE_URL = "https://api.gamejolt.com/api/game/v1_2";

/*
  Função responsável por gerar a assinatura da requisição.
  A assinatura é:
  MD5( URL_COMPLETA + PRIVATE_KEY )
*/
function generateSignature(url) {
  return md5(url + PRIVATE_KEY).toString();
}

/*
  Função genérica para chamadas à API.

  - endpoint: rota da API (ex: /users/authenticate/)
  - params: parâmetros específicos da chamada
*/
async function callApi(endpoint, params) {

  // Cria os parâmetros obrigatórios da Game Jolt
  const query = new URLSearchParams({
    game_id: GAME_ID, // identifica o jogo
    format: "json",   // define o retorno como JSON
    ...params,        // adiciona parâmetros específicos
  });

  // URL SEM a assinatura (necessária para gerar o hash)
  const urlWithoutSig = `${BASE_URL}${endpoint}?${query.toString()}`;

  // Gera a assinatura MD5
  const signature = generateSignature(urlWithoutSig);

  // URL FINAL com assinatura
  const finalUrl = `${urlWithoutSig}&signature=${signature}`;

  // Realiza a requisição HTTP GET
  const response = await fetch(finalUrl);

  // Retorna o JSON da resposta
  return response.json();
}

/*
  Autentica um usuário da Game Jolt.

  A API verifica se:
  - username existe
  - user_token corresponde ao usuário
*/
export async function authenticateUser(username, userToken) {
  return callApi("/users/authenticate/", {
    username: username,
    user_token: userToken,
  });
}

/*
  Desbloqueia uma conquista (trophy).

  Requisitos:
  - Usuário autenticado
  - Trophy previamente criado no painel da Game Jolt
*/
export async function unlockTrophy(username, userToken, trophyId) {
  return callApi("/trophies/add-achieved/", {
    username: username,
    user_token: userToken,
    trophy_id: trophyId,
  });
}