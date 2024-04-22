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

                                const verseInText = verse.charAt(0)
                                const verseIntText2 = verse.charAt(1)
                                const combinedVerse = verseInText + verseIntText2
                                const verseInt = parseInt(combinedVerse)

                                if (verseInt === 1) {
                                    chapterNumber++
                                }
                                
                                const bookName1 = file.replace('.json', '')
                                const bookName2 = bookName1.slice(3)

                                const sigla = bookName2.charAt(0)
                                const sigla2 = bookName2.charAt(2)
                                const siglaCombined = sigla + sigla2

                                const regex = /^\d+\s/
                                const cleanText = verse.replace(regex, '')

                                const regexNotas = /\d{1,3}:\d{1,3}\s+[a-z][A-Z][a-z]/g
                                const notas = verse.match(regexNotas)
                                if (notas && notas.length > 0) {
                                    const chapterNum = notas[0].split(':')[0]
                                    const verseNum = notas[0].match(/\d{1,3}:(\d{1,3})/)[1]


                                    let chapterFound = null
                                    for (let i = 0; i < bookArray.length; i++) {
                                        if (bookArray[i].capítulo === parseInt(chapterNum)) {
                                            chapterFound = bookArray[i].chapterNum
                                            break
                                            
                                        }      
                                    }
                                    
                                }


                                bookArray.push({
                                    capítulo: chapterNumber,
                                    versículo: verseInt,
                                    texto: cleanText,
                                    livro: bookName2, // Nome do arquivo sem a extensão
                                    sigla: siglaCombined, // Valor padrão para a sigla
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
