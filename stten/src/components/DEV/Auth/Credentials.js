// Indica que o aplicativo está em modo de desenvolvimento
export const DEV_MODE = true;

// Armazena as credenciais do usuário (Dev)
const devCredentials = {
    token: "",
    username: ""
}

// Exporta a função para atualizar as credenciais
export function setDevCredentials(newUsername, newToken) {
    devCredentials.username = newUsername;
    devCredentials.token = newToken;
}

// Exporta as credenciais para uso em outros componentes
export function getDevCredentials() {
    return devCredentials;
}