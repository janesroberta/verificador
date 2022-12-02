
const compararResultado = function (jogador, nJogo, array, resultado) {
    let dezenas = document.querySelectorAll(`[data-jogo="${jogador}-${nJogo}"] span`)

    let n = []
    array.forEach(function (item, idx) {
        dezenas[idx].classList.remove('error', 'success')
        if (resultado.indexOf(item) == -1) {
            dezenas[idx].classList.add('error')
        } else {
            dezenas[idx].classList.add('success')
        }
    })
}

const confereJogo = function (jogos, resultado) {
    jogos.forEach(function (jogo) {
        jogo.jogos.forEach(function (item, idx) {
            compararResultado(jogo.jogador, idx, item, resultado)
        })
    })
}

const imprimeJogos = function (jogos) {
    let divJogos = document.getElementById('jogos')

    let divJogador = document.createElement('div')
    divJogador.classList = 'jogador'
    divJogador.setAttribute('data-jogador', jogos.jogador)
    let jogador = document.createElement('div')
    let jogadorNome = jogos.jogador
    jogador.innerHTML = jogadorNome
    divJogador.appendChild(jogador)

    let divJogadorJogos = document.createElement('div')
    divJogadorJogos.classList = 'jogos'

    jogos.jogos.forEach(function (jogos, idx) {
        let divJogo1 = document.createElement('div')
        divJogo1.setAttribute('data-jogo', jogadorNome + '-' + idx)
        jogos.forEach(function (item, idx) {
            let divJogo = document.createElement('span')
            divJogo.classList = 'jogo'
            divJogo.innerHTML = item
            divJogo1.appendChild(divJogo)
        })
        divJogadorJogos.appendChild(divJogo1)
    })
    divJogador.appendChild(divJogadorJogos)
    divJogos.appendChild(divJogador)
}

jogos.forEach(function (item) {
    imprimeJogos(item)
})

const pegaResultado = async function () {
    let url = "https://loterias.caixa.gov.br/Paginas/Mega-Sena.aspx"
    try {
        const response = await fetch(url, { mode: 'no-cors' });

        if (!response.ok) {
            console.log(response);
            const message = `Ocorreu um erro: ${response.status}\nUtilize a verificação offline`;
            alert(message)
            throw new Error(message)
        }

        const result = await response.json()
        return result

    } catch (error) {
        const message = `Falha ao acessar o endereço:
				\r${url}
				\rErro: ${error.message}
				\rUtilize a verificação offline`;
        alert(message)
        throw new Error(message)
    }
}

const imprimeDetalhes = function (elemento, texto) {
    document.querySelector(elemento).innerHTML = texto
}

const addClass = function (elemento, classe) {
    try {
        let element = document.querySelector(elemento).classList.add(classe)
    } catch (error) {
        console.log(error);
    }
}

const removeClass = function (elemento, classe) {
    try {
        let element = document.querySelector(elemento).classList.remove(classe)
    } catch (error) {
        console.log(error);
    }
}

document.getElementById('verificar-online').addEventListener("click", function () {
    pegaResultado().then(result => {
        let resultado = []

        removeClass('.resultado-online', 'hide')
        imprimeDetalhes('.resultado-online .numero-concurso', `Concurso nº: ${result.concurso}`)
        imprimeDetalhes('.resultado-online .data-concurso', `Data do consurso: ${result.data}`)
        imprimeDetalhes('.resultado-online .dezenas-concurso', `Dezenas sorteadas: ${result.dezenas}`)

        if (result.dezenas.length > 0) {
            result.dezenas.forEach((value, idx) => {
                resultado.push(parseInt(value))
            })
            confereJogo(jogos, resultado)
        }
    })
})

document.getElementById('verificar-offline').addEventListener("click", function () {
    addClass('.resultado-online', 'hide')

    let dezenas = document.getElementsByClassName('dezenas')
    let resultado = []

    for (n = 0; n < dezenas.length; n++) {
        resultado.push(parseInt(dezenas[n].value))
    }

    confereJogo(jogos, resultado)
})

