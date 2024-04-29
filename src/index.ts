import fs from 'fs';
import path from 'path';
import markdownIt from 'markdown-it';
import { writeObjectToJsonFile } from '../exportToJson';

// Interface para o formato do objeto JSON
interface JsonFormat {
    capítulo: number;
    subtítulo: string;
    versículo: number;
    texto: string;
    livro: string;
    sigla: string;
    anotações: any[]; // Pode ajustar o tipo conforme necessário
}

// Função para ler o conteúdo de um arquivo Markdown e converter para JSON
function markdownFileToJson(filePath: string): JsonFormat[] {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const md = new markdownIt();
        const tokens = md.parse(data, {});
        writeObjectToJsonFile(tokens,"teste")
      
        const json: JsonFormat[] = tokens.map(item => {

            return {
                capítulo: 0,
                subtítulo: '',
                versículo: 0,
                texto: item.content,
                livro: '',
                sigla: '',
                anotações: []
            };
        });

        return json;
    } catch (err) {
        console.error(`Erro ao ler o arquivo Markdown ${filePath}:`, err);
        return [];
    }
}

// Função para converter o JSON para uma string JSON formatada
function jsonToString(json: JsonFormat[]): string {
    return JSON.stringify(json, null, 2);
}

// Função para ler todos os arquivos de um diretório e executar uma função em cada um deles
function processFilesInDirectory(inputDir: string, outputDir: string): void {
    fs.readdir(inputDir, (err, files) => {
        if (err) {
            console.error('Erro ao ler o diretório:', err);
            return;
        }

        files.forEach(file => {
            const inputFile = path.join(inputDir, file);
            const outputFile = path.join(outputDir, `${path.parse(file).name}.json`);

            // Ignora diretórios
            if (fs.lstatSync(inputFile).isDirectory()) {
                return;
            }

            // Processa apenas arquivos Markdown
            if (path.extname(inputFile).toLowerCase() === '.md') {
                // Convertendo o arquivo Markdown para JSON
                const json = markdownFileToJson(inputFile);

                // Convertendo JSON para uma string formatada
                const jsonString = jsonToString(json);
                if (jsonString == ""){
                    return
                }
                // Escrevendo o JSON em um arquivo no diretório de saída
                fs.writeFile(outputFile, jsonString, 'utf8', err => {
                    if (err) {
                        console.error(`Erro ao escrever o arquivo JSON ${outputFile}:`, err);
                        return;
                    }
                    console.log(`Arquivo JSON ${outputFile} salvo com sucesso.`);
                });
            }
        });
    });
}

// Diretórios de entrada e saída
const inputDir = './src/md_files';
const outputDir = './src/json_files';

// Processa os arquivos no diretório de entrada e salva os arquivos JSON no diretório de saída
processFilesInDirectory(inputDir, outputDir);
