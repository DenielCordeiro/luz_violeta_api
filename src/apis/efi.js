import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';
import axios from 'axios';

dotenv.config();

// Carregando certificado em formato de Buffer
const cert = fs.readFileSync(
  path.resolve(__dirname, `../../certs/${process.env.EFI_CERT}`),
);

// Carregando pacote https com o certificado
const agent = new https.Agent({
  pfx: cert,
  passphrase: '',
});

const credentials = Buffer.from(`${process.env.EFI_CLIENT_ID}:${process.env.EFI_CLIENT_SECRET}`).toString('base64'); // Credenciais em Base64

// Enviar requisição por AXIOS
function authenticate() {
  return axios({
    method: 'POST',
    url: `${process.env.EFI_ENDPOINT}/oauth/token`,
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    httpsAgent: agent,
    data: { grant_type: 'client_credentials' },
  });
}

let efiInstance = null;

export async function getEfiRequest() {
  if (efiInstance) {
    return efiInstance;
  } else {
    const authResponse = await authenticate(); // Autenticando e obtendo token
    const accessToken = authResponse.data.access_token; // Obtendo token de acesso

    // padronizando requisições com axios
    efiInstance = axios.create({
      baseURL: process.env.EFI_ENDPOINT,
      httpsAgent: agent,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return efiInstance;
  }
}
