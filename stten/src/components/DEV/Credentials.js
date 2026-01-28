// Este objeto serve como um substituto para o autoAuth, já que ele necessita o projeto estar rodando em uma página da GameJolt
// Assim ele pode fazer com que a API seja testada localmente simulando o formato de credenciais fornecidas pela API via URL

export const DEV_MODE = false;

// Não deixe suas credenciais na hora de colocar em produção
// Usar apenas em testes locais
export const devCred = {
    username: "",
    game_token: ""
}