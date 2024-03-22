const fs = require('fs');
const path = require('path');

// Função para formatar um único arquivo
function formatarArquivo(inputFile) {
    try {
        const data = require(`./books-json/${inputFile}`);
        const livroParte = data.fileName.match(/(\d+)-(\d+)/); // Extrair número da parte do livro
        const sigla = inputFile.substring(0, 2).toLowerCase(); // Extrair sigla do nome do arquivo
        const capitulos = data.content.slice(2);

        const versiculosFormatados = [];
        let parteAtual = livroParte ? parseInt(livroParte[2]) : 1;
        let capituloAtual = 0; // Inicializar o capítulo atual
        let nomeLivro = ''; // Inicializar o nome do livro

        for (const item of capitulos) {
            for (const linha of item) {
                const capituloMatch = linha.match(/^\d+\s+/);
                if (capituloMatch) {
                    capituloAtual = parseInt(capituloMatch[0]); // Atualizar o capítulo atual
                    // Extrair o nome do livro a partir do texto do capítulo
                    const livroMatch = linha.match(/(\w+)\s+\d+/);
                    if (livroMatch) {
                        nomeLivro = livroMatch[1];
                    }
                }
                const versiculoMatch = linha.match(/^\d+\s+(.*)/);
                if (versiculoMatch) {
                    const texto = versiculoMatch[1];
                    versiculosFormatados.push({
                        parte: parteAtual,
                        capítulo: capituloAtual,
                        texto: texto.trim(),
                        livro: nomeLivro, // Corrigir o campo livro
                        sigla: sigla // Corrigir a sigla
                    });
                }
            }
        }

        return versiculosFormatados;
    } catch (error) {
        console.error(`Erro ao formatar o arquivo ${inputFile}: ${error}`);
        return [];
    }
}

// Função para criar uma pasta se ela não existir
function criarPastaSeNaoExistir(pasta) {
    if (!fs.existsSync(pasta)) {
        fs.mkdirSync(pasta);
    }
}

// Função para formatar todos os arquivos e escrever arquivos formatados
function formatarTodosArquivos() {
    try {
        const arquivos = fs.readdirSync('./books-json');
        const arquivosJson = arquivos.filter(arquivo => arquivo.endsWith('.json'));
        const pastaSaida = './books-json-formatted/';

        criarPastaSeNaoExistir(pastaSaida);

        for (const arquivo of arquivosJson) {
            const versiculosFormatados = formatarArquivo(arquivo);
            escreverArquivoFormatado(versiculosFormatados, pastaSaida, arquivo);
        }

    } catch (error) {
        console.error(`Erro ao ler o diretório: ${error}`);
    }
}

// Escrever os versículos formatados em um novo arquivo JSON
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

// Executar a formatação de todos os arquivos
formatarTodosArquivos();
