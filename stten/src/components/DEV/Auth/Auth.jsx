import { useState } from "react";

// Importar função de autenticação da Game Jolt
import { authenticateUser } from "../../../services/Gamejolt/Gamejolt"

function Auth({ onSuccess }) {

    // Armazena os valores dos inputs
    const [usernameInput, setUsernameInput] = useState("");
    const [tokenInput, setTokenInput] = useState("");

    const [status, setStatus] = useState("");

    /*
        Função chamada ao clicar no botão "Autenticar".
        Ela chama a API e trata a resposta com then().
    */
    function handleAuth() {

        // Atualiza o status para o usuário
        setStatus("Autenticando...");

        // Chama a função de autenticação do serviço da Game Jolt
        // Usado os valores dos inputs por que ele estão atualizados com o onChange, diferente das credenciais do js, que não foram exportadas, por que viriam vazias
        authenticateUser(usernameInput, tokenInput)
            .then(function (result) {

                // Verifica result (É usado esse nome, pois ele se refere ao resultado da chamada da API) se ele não é nulo e se a autenticação foi bem sucedida
                if (result && result.response.success === "true") {
                    setStatus("Usuário autenticado com sucesso");
                    onSuccess();
                } else {
                    setStatus("Falha na autenticação");
                }

            });
    }

    return (
        <div>
            <h3>Authenticação (MODO DEV)</h3>
            {/* Nome do usuário */} <input placeholder="Username Game Jolt" value={usernameInput} onChange={function (e) { setUsernameInput(e.target.value); }} />
            {/*O <br /> é usado para quebrar a linha */}<br />
            {/* Token*/} <input placeholder="User Token (Dev)" value={tokenInput} onChange={function (e) { setTokenInput(e.target.value); }} />
            <br /> <br />
            {/* Botão de autenticação */} <button onClick={handleAuth}> Autenticar </button>
            <br />
            {/* Mensagem de status */} <p> {status} </p>
        </div>
    )
}

export default Auth