const fs = require('fs');
const path = require('path');

function formatarArquivo(inputFile) {
    try {
        const texto = JSON.parse(inputFile.text).text;
        const versiculosFormatados = [];
        let capituloAtual = 0;
        let numeroVersiculo = 0;
        let livro = '';
        let sigla = '';
        let anotações = [];

        const linhas = texto.split('\n');

        linhas.forEach(linha => {
            let linhaTrimmed = linha.trim();
            let parte = null;

            // Verificar se a linha contém um número seguido de uma letra minúscula opcional
            const parteMatch = /^\d+([a-z]) /.exec(linhaTrimmed);
            if (parteMatch) {
                parte = parteMatch[1];
                linhaTrimmed = linhaTrimmed.replace(parteMatch[0], '');
            }

            if (/^\d+[a-z]? /.test(linhaTrimmed)) {
                const versiculoMatch = /^\d+[a-z]?/.exec(linhaTrimmed);
                if (versiculoMatch) {
                    const numeroVersiculoStr = versiculoMatch[0];
                    // Extrair apenas o número do versículo
                    const numeroVersiculoInt = parseInt(numeroVersiculoStr.match(/\d+/)[0]);
                    if (!isNaN(numeroVersiculoInt)) {
                        numeroVersiculo = numeroVersiculoInt;
                        const textoVersiculo = linhaTrimmed.replace(numeroVersiculoStr, '');
                        // Verificar se o texto contém mais de um versículo
                        const versiculosSeparados = textoVersiculo.split(/\d+[a-z]?/).filter(Boolean);
                        versiculosSeparados.forEach((versiculo, index) => {
                            versiculosFormatados.push({
                                capítulo: capituloAtual,
                                versículo: numeroVersiculo + index,
                                parte: parte, // Adicionar a parte ao objeto do versículo
                                texto: versiculo.trim(),
                                livro: livro,
                                sigla: sigla,
                                anotações: anotações
                            });
                        });
                        // Incrementar o número do versículo
                        numeroVersiculo += versiculosSeparados.length - 1;
                    }
                }
            } else if (/^\d+$/.test(linhaTrimmed)) {
                capituloAtual = parseInt(linhaTrimmed);
                numeroVersiculo = 0; // Reiniciar a contagem de versículos ao iniciar um novo capítulo
            } else if (linhaTrimmed !== '') {
                if (/^[A-ZÀ-Ú]+$/.test(linhaTrimmed)) {
                    livro = linhaTrimmed;
                    sigla = linhaTrimmed.substring(0, 3).toUpperCase();
                    numeroVersiculo = 0; // Reiniciar a contagem de versículos ao encontrar um novo título de livro
                }
                // Dividir o texto em versículos separados
                const versiculosSeparados = linhaTrimmed.split(/\d+[a-z]?/).filter(Boolean);
                versiculosSeparados.forEach((versiculo, index) => {
                    versiculosFormatados.push({
                        capítulo: capituloAtual,
                        versículo: numeroVersiculo + index + 1, // Incrementar o número do versículo
                        parte: parte, // Adicionar a parte ao objeto do versículo
                        texto: versiculo.trim(),
                        livro: livro,
                        sigla: sigla,
                        anotações: anotações
                    });
                });
                // Incrementar o número do versículo
                numeroVersiculo += versiculosSeparados.length - 1;
            }
        });

        return versiculosFormatados;
    } catch (error) {
        console.error(`Erro ao formatar o arquivo: ${error}`);
        return [];
    }
}

function verificarDiretorio(diretorio) {
    return fs.existsSync(diretorio);
}

function criarPastaSeNaoExistir(pasta) {
    if (!verificarDiretorio(pasta)) {
        fs.mkdirSync(pasta);
    }
}

function formatarTodosArquivos() {
    try {
        const arquivos = fs.readdirSync('./output-files');
        const arquivosJson = arquivos.filter(arquivo => arquivo.endsWith('.json')); // Filtro para arquivos .json
        const pastaSaida = './books-json-formatted/';

        criarPastaSeNaoExistir(pastaSaida);

        for (const arquivo of arquivosJson) {
            const data = fs.readFileSync(`./output-files/${arquivo}`, 'utf8');
            console.log('Arquivo:', arquivo);
            const versiculosFormatados = formatarArquivo({ text: data });
            escreverArquivoFormatado(versiculosFormatados, pastaSaida, arquivo);
        }

    } catch (error) {
        console.error(`Erro ao ler o diretório: ${error}`);
    }
}

function escreverArquivoFormatado(versiculos, pastaSaida, inputFile) {
    const nomeArquivoSaida = inputFile.replace('.json', '_formatado.json');
    const caminhoCompleto = path.join(pastaSaida, nomeArquivoSaida);
    try {
        fs.writeFileSync(caminhoCompleto, JSON.stringify(versiculos, null, 2));
        console.log(`Os versículos foram formatados e escritos em ${caminhoCompleto}`);
    } catch (error) {
        console.error(`Erro ao escrever o arquivo formatado: ${error}`);
    }
}

formatarTodosArquivos();
