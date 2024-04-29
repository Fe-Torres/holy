const fs = require('fs');
const path = require('path');

function readJsonFile(arquivo: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(arquivo, "utf8", (err, data) => {
      if (err) {
        reject(`Erro ao ler o arquivo ${arquivo}: ${err}`);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
}

async function formatJson(
  arquivo: string,
  arquivoSaida: string
): Promise<void> {
  try {
    const jsonData = await readJsonFile(arquivo);

    jsonData.forEach((item: any) => {
      item.sigla = "Felipe";
      item.anotações = [];
    });

    await writeJsonFile(arquivoSaida, jsonData);
  } catch (error) {
    console.error(error);
  }
}

function writeJsonFile(arquivo: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(arquivo, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        reject(`Erro ao escrever no arquivo ${arquivo}: ${err}`);
        return;
      }
      resolve();
    });
  });
}

const diretorio: string = "./src/json_files";
const diretorioSaida: string = "./src/json_files_final";

if (!fs.existsSync(diretorioSaida)) {
  fs.mkdirSync(diretorioSaida);
}

fs.readdir(diretorio, (err, arquivos) => {
  if (err) {
    console.error("Erro ao ler o diretório:", err);
    return;
  }

  arquivos.forEach((arquivo: any) => {
    if (path.extname(arquivo) === ".json") {
      const caminhoEntrada: string = path.join(diretorio, arquivo);
      const caminhoSaida: string = path.join(diretorioSaida, arquivo);
      formatJson(caminhoEntrada, caminhoSaida);
      fs.copyFileSync(caminhoEntrada, caminhoSaida);
    }
  });
});
