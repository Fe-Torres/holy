const fs = require('fs');
const path = require('path');

const sourceDir = './input-files';
const destinationDir = './output-files';

if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
}

function formatAndMoveJsonFiles(sourceDir, destinationDir) {
    fs.readdir(sourceDir, (err, files) => {
        if (err) {
            console.error('Erro ao ler diretório:', err);
            return;
        }

        files.forEach(file => {
            if (file.endsWith('.json')) {
                const sourceFile = path.join(sourceDir, file);
                const destinationFile = path.join(destinationDir, file);

                fs.readFile(sourceFile, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Erro ao ler arquivo:', err);
                        return;
                    }

                    try {
                        const jsonData = JSON.parse(data);
                        const bookArray = [];
                        const verses = jsonData.text.split('\n');
                        let chapterNumber = 0
                        verses.forEach((verse) => {
                            verse = verse.trim();
                            if (verse !== '') {

                                //Lógica para os capítulos
                                const chapterNumReg = /^\d{1,3}$/
                                chapterNumFound = verse.match(chapterNumReg)
                                if (chapterNumFound) {
                                    chapterNumber += 1
                                    verse = "auau"
                                }
                                //Lógica para o texto limpo

                                bookArray.push({
                                    capítulo: chapterNumber,
                                    subtítulo: '',
                                    versículo: 0,
                                    texto: verse,
                                    livro: "Êxodo", // Nome do arquivo sem a extensão
                                    sigla: "Êx", // Valor padrão para a sigla
                                    anotações: []
                                });
                            }
                        });
                        
                        const formattedJson = JSON.stringify(bookArray, null, 2);
                        fs.writeFile(destinationFile, formattedJson, err => {
                            if (err) {
                                console.error('Erro ao escrever arquivo:', err);
                                return;
                            }

                            console.log(`Arquivo ${file} formatado e movido com sucesso!`);
                        });
                    } catch (err) {
                        console.error('Erro ao analisar JSON:', err);
                    }
                });
            }
        });
    });
}

formatAndMoveJsonFiles(sourceDir, destinationDir);
