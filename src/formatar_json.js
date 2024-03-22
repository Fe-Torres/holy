// Função para formatar um único arquivo
function formatarArquivo(inputFile) {
    try {
        const data = require(`./${inputFile}`);
        const livroCapitulo = data.content[0][0].match(/(\d+)/g); // Extrair número do capítulo
        const livro = data.content[0][0].replace(/\d+$/, '');
        const capitulos = data.content.slice(1);
        const sigla = livro.substring(0, 2).toLowerCase();
        const capituloInicial = parseInt(livroCapitulo[0]); // Converter para número inteiro

        const versiculosFormatados = [];
        let capituloAtual = capituloInicial; // Definir o capítulo inicial
        let ultimoVersiculo = 0;

        for (const item of capitulos) {
            if (item.length === 1 && item[0].match(/^[A-Za-z]+\s+\d+$/)) {
                const capituloMatch = item[0].match(/\d+/); // Extrair número do capítulo
                capituloAtual = parseInt(capituloMatch[0]); // Convertendo para número inteiro
                ultimoVersiculo = 0; // Reiniciar a contagem dos versículos
            } else {
                for (const linha of item) {
                    const versiculoMatch = linha.match(/^\d+\s+/);
                    if (versiculoMatch) {
                        const numeroVersiculo = parseInt(versiculoMatch[0]);
                        if (numeroVersiculo <= ultimoVersiculo) {
                            capituloAtual++; // Incrementar o número do capítulo
                        }
                        ultimoVersiculo = numeroVersiculo; // Atualizar o último versículo processado
                        const texto = linha.replace(/^\d+\s*/, '');
                        versiculosFormatados.push({
                            capítulo: capituloAtual,
                            versículo: numeroVersiculo,
                            texto: texto,
                            livro: livro,
                            sigla: sigla
                        });
                    }
                }
            }
        }

        return versiculosFormatados;
    } catch (error) {
        console.error(`Erro ao formatar o arquivo ${inputFile}: ${error}`);
        return [];
    }
}


// Função para formatar todos os arquivos
function formatarTodosArquivos() {
    try {
        const arquivos = fs.readdirSync('./');
        const arquivosJson = arquivos.filter(arquivo => arquivo.endsWith('.json'));

        let versiculosFormatados = [];

        for (const arquivo of arquivosJson) {
            versiculosFormatados = versiculosFormatados.concat(formatarArquivo(arquivo));
        }

        return versiculosFormatados;
    } catch (error) {
        console.error(`Erro ao ler o diretório: ${error}`);
        return [];
    }
}

// Escrever os versículos formatados em um novo arquivo JSON
function escreverArquivoFormatado(versiculos) {
    const arquivoSaida = 'versiculos_formatados.json';
    try {
        fs.writeFileSync(arquivoSaida, JSON.stringify(versiculos, null, 2));
        console.log(`Os versículos foram formatados e escritos em ${arquivoSaida}`);
    } catch (error) {
        console.error(`Erro ao escrever o arquivo formatado: ${error}`);
    }
}

// Executar o script
const versiculosFormatados = formatarTodosArquivos();
escreverArquivoFormatado(versiculosFormatados);