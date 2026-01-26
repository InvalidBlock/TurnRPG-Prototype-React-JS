// Indica que o aplicativo está em modo de desenvolvimento
export const DEV_MODE = false;

// Armazena as credenciais do usuário (Dev)
const devCredentials = {
    token: "",
    username: "",
    authenticated: false
}

// Exporta a função para atualizar as credenciais
export function setDevCredentials(newUsername, newToken, newAuthenticated) {
    devCredentials.username = newUsername;
    devCredentials.token = newToken;
    devCredentials.authenticated = newAuthenticated;
}

// Exporta as credenciais para uso em outros componentes
export function getDevCredentials() {
    return devCredentials;
}