import dotenv from 'dotenv';
import https from 'https';
import axios from 'axios';

dotenv.config();

/**
 * 🔐 Certificado EFI vem do ENV em Base64
 * (Render NÃO permite arquivos secretos no filesystem)
 */
if (!process.env.EFI_CERT_BASE64) {
  throw new Error('EFI_CERT_BASE64 não definido');
}

const cert = Buffer.from(process.env.EFI_CERT_BASE64, 'base64');

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
