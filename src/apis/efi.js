import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';
import axios from 'axios';
import { fileURLToPath } from 'url';

dotenv.config();

// Criando __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregando certificado em formato de Buffer
const certPath = path.resolve(
  __dirname,
  '../../certs',
  process.env.EFI_CERT
);

const cert = fs.readFileSync(certPath);

// HTTPS Agent com certificado
const agent = new https.Agent({
  pfx: cert,
  passphrase: '',
});

// Credenciais em Base64
const credentials = Buffer
  .from(`${process.env.EFI_CLIENT_ID}:${process.env.EFI_CLIENT_SECRET}`)
  .toString('base64');

// Autenticação
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
  if (efiInstance) return efiInstance;

  const authResponse = await authenticate();
  const accessToken = authResponse.data.access_token;

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
