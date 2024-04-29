import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Função para converter um objeto para JSON e escrevê-lo em um arquivo
function writeObjectToJsonFile(obj: any, filePath: string): void {
    try {
        // Convertendo o objeto para uma string JSON formatada
        const jsonString = JSON.stringify(obj, null, 2);
        const uuid = uuidv4();
        const outputFile = `${filePath}-${uuid}.json`;

        // Escrevendo a string JSON em um arquivo
        fs.writeFileSync(outputFile, jsonString, 'utf8');
        
        console.log(`Arquivo JSON ${outputFile} criado com sucesso.`);
    } catch (err) {
        console.error(`Erro ao escrever o arquivo JSON ${filePath}:`, err);
    }
}

export { writeObjectToJsonFile };
