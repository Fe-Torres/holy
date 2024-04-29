const fs = require('fs');
const path = require('path');

// Função para adicionar o campo "subtítulo" em um arquivo JSON
function formatJson(arquivo) {
    // Lê o conteúdo do arquivo JSON
    fs.readFile(arquivo, 'utf8', (err, data) => {
        if (err) {
            console.error(`Erro ao ler o arquivo ${arquivo}: ${err}`);
            return;
        }
        
        // Converte o conteúdo para um objeto JavaScript
        let jsonData = JSON.parse(data);
        
        // Modifica o JSON de acordo com as condições
        jsonData.forEach(item => {

            // Cortar texto: ''



            jsonData.push({
                capítulo: item.capítulo,
                subtítulo: item.subtítulo,
                versículo: item.versículo,
                texto: item.texto,
                livro: item.livro,
                sigla: 'Gn',
                anotações: []
            })


        });
        
        // Escreve o conteúdo modificado de volta para o arquivo
        fs.writeFile(arquivo, JSON.stringify(jsonData, null, 2), err => {
            if (err) {
                console.error(`Erro ao escrever no arquivo ${arquivo}: ${err}`);
                return;
            }
            console.log(`O campo "subtítulo" foi adicionado em ${arquivo}`);
        });
    });
}

// Diretório onde estão os arquivos JSON
const diretorio = './json_files';

// Verifica se o diretório de saída existe, se não, cria
const diretorioSaida = './json_files_final';
if (!fs.existsSync(diretorioSaida)) {
    fs.mkdirSync(diretorioSaida);
}

// Lê todos os arquivos do diretório
fs.readdir(diretorio, (err, arquivos) => {
    if (err) {
        console.error('Erro ao ler o diretório:', err);
        return;
    }
    
    // Para cada arquivo no diretório
    arquivos.forEach(arquivo => {
        // Verifica se é um arquivo JSON
        if (path.extname(arquivo) === '.json') {
            // Caminho completo do arquivo de entrada
            const caminhoEntrada = path.join(diretorio, arquivo);
            // Caminho completo do arquivo de saída
            const caminhoSaida = path.join(diretorioSaida, arquivo);
            
            // Adiciona o campo "subtítulo" no arquivo JSON e copia para o diretório de saída
            formatJson(caminhoEntrada);
            fs.copyFileSync(caminhoEntrada, caminhoSaida);
        }
    });
});
