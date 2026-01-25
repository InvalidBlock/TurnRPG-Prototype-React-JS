export function setPosture(posture, entity){
    // Retorna a entidade com a nova váriavel
    return {
        ...entity,
        posture: posture
    }
}