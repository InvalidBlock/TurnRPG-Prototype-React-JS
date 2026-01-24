// Importa a função MD5 da biblioteca crypto-js
// A Game Jolt exige uma assinatura MD5 da URL + Private Key
import md5 from "crypto-js/md5";

// Importa as credenciais do usuário (Dev)
import { getDevCredentials, setDevCredentials, DEV_MODE } from "../../components/DEV/Auth/Credentials.js";

// ID do jogo fornecido pelo painel da Game Jolt
const GAME_ID = "1040406";

// Chave privada do jogo (NÃO deve ir para o front-end em produção)
/*

A chave da API está exposta intencionalmente para fins acadêmicos e de avaliação.
Em caso de continuidade do projeto ou cenário de produção, uma nova chave seria gerada e armazenada em um arquivo .env, 
ignorado pelo Git via .gitignore e acessado por meio de variáveis de ambiente.

*/
const PRIVATE_KEY = "be40e9583dbadc8f935fdf9035b078ad";

// URL base da API da Game Jolt (versão 1.2)
const BASE_URL = "https://api.gamejolt.com/api/game/v1_2";


/*
  Gera a assinatura da requisição.
  A Game Jolt exige um hash MD5 da URL completa + Private Key.
*/
function generateSignature(url) {
  return md5(url + PRIVATE_KEY).toString();
}

/*
  Função genérica para chamadas à API da Game Jolt.

  endpoint → rota da API (ex: /users/authenticate/)
  params   → parâmetros específicos da requisição
*/
function callApi(endpoint, params) {

  // Monta os parâmetros obrigatórios da API
  const query = new URLSearchParams({
    game_id: GAME_ID,
    format: "json",
    ...params
  });

  // URL sem a assinatura (necessária para gerar o hash)
  const urlWithoutSig = BASE_URL + endpoint + "?" + query.toString();

  // Gera a assinatura MD5
  const signature = generateSignature(urlWithoutSig);

  // URL final já assinada
  const finalUrl = urlWithoutSig + "&signature=" + signature;

  /*
    fetch realiza a requisição HTTP.
    Ele retorna uma Promise.
  */
  return fetch(finalUrl)
    .then(function (response) {
      // Converte a resposta HTTP para JSON
      return response.json();
    })
    .then(function (data) {
      // Retorna os dados já convertidos
      return data;
    })
    .catch(function (error) {
      // In case of network error or request failure
      console.error("Error in Game Jolt API:", error);
    });
}

/*
  Autentica um usuário da Game Jolt.
  Verifica se username e token são válidos.
*/
export function authenticateUser(username, userToken) {

  // Atualiza as credenciais dos dev no Credentials.js
  if (DEV_MODE) {
    setDevCredentials(username, userToken, true);
  }

  return callApi("/users/authenticate/", {
    username: username,
    user_token: userToken
  });
}

/*
  Desbloqueia uma conquista (trophy) para o usuário.
*/
export function unlockTrophy(trophyId) {

  let username, token = "";

  // Importa as credenciais do usuário (Dev)
  if (DEV_MODE) {
    username = getDevCredentials().username;
    token = getDevCredentials().token;
  }

  return callApi("/trophies/add-achieved/", {
    username: username,
    user_token: token,
    trophy_id: trophyId
  });
}