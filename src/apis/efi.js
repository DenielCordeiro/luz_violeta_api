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

const certBuffer = Buffer.from(process.env.EFI_CERT_BASE64, 'base64');

// HTTPS Agent com certificado
const agent = new https.Agent({
  pfx: certBuffer,
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
let tokenExpiresAt = 0;

export async function getEfiRequest() {
  if (efiInstance && Date.now() < tokenExpiresAt) {
    return efiInstance;
  }

  const { data } = await authenticate();

  tokenExpiresAt = Date.now + (data.expires_in -60) * 1000;

  efiInstance = axios.create({
    baseURL: process.env.EFI_ENDPOINT,
    httpsAgent: agent,
    headers: {
      Authorization: `Bearer ${data.access_token}`,
      'Content-Type': 'application/json',
    },
  });

  return efiInstance;
}
