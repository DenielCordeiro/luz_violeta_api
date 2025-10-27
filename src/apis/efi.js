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

// Criando credenciais
const credentials = Buffer.from(`${process.env.EFI_CLIENT_ID}:${process.env.EFI_CLIENT_SECRET}`).toString('base64');

// Enviar requisição por AXIOS
function authAPIEFI() {
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

const authenticate = authAPIEFI();

// Criando instância do AXIOS para requisições autenticadas
async function EFIRequest() {
  const authResponse = await authenticate;
  const accessToken = authResponse.data.access_token;

  // padronizando requisições com axios
  return axios.create({
    baseURL: process.env.EFI_ENDPOINT,
    httpsAgent: agent,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
}

export default EFIRequest;
