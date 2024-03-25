const fs = require('fs');
const path = require('path');

function formatarArquivo(inputFile) {
    try {
        const partes = inputFile.fileName.split('-');
        const numeroParte = parseInt(partes[0]);

        const nomeLivro = partes.slice(1).join('-').split('.')[0].trim();
        const sigla = nomeLivro.substring(0, 2).toLowerCase();

        const versiculosFormatados = [];
        let capituloAtual = null;

        inputFile.content.forEach((item, index) => {
            const linha = item[0].trim();
            if (index === 0) {
                // Se for o primeiro item, é o título do capítulo ou do salmo
                capituloAtual = isNaN(parseInt(linha[0])) ? null : parseInt(linha[0]);
            } else {
                // Se não for o primeiro item, verifica se é um versículo
                const match = linha.match(/^(\d+)\s(.+)$/);
                if (match) {
                    const versiculo = parseInt(match[1]);
                    const texto = match[2];
                    versiculosFormatados.push({
                        parte: numeroParte,
                        capítulo: capituloAtual,
                        versículo: versiculo,
                        texto: texto,
                        livro: nomeLivro,
                        sigla: sigla
                    });
                }
            }
        });

        return versiculosFormatados;
    } catch (error) {
        console.error(`Erro ao formatar o arquivo ${inputFile.fileName}: ${error}`);
        return [];
    }
}

function formatarTodosArquivos() {
    try {
        const arquivos = fs.readdirSync('./books-json');
        const arquivosJson = arquivos.filter(arquivo => arquivo.endsWith('.json'));
        const pastaSaida = './books-json-formatted/';

        if (!fs.existsSync(pastaSaida)) {
            fs.mkdirSync(pastaSaida);
        }

        for (const arquivo of arquivosJson) {
            const data = require(`./books-json/${arquivo}`);
            const versiculosFormatados = formatarArquivo(data);
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
