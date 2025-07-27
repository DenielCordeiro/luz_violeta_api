import fs from 'fs';
import path from 'path';
import https from 'https';
import axios from 'axios';

class PixController {
  // eslint-disable-next-line consistent-return
  async getPIX(req, res) {
    try {
      const { valor, key } = req.body;

      // Para não acessar o dotend em produção
      if (process.env.NODE_ENV !== 'production') {
        require('dotenv').config();
      }

      // Carregando certificado em formato de Buffer
      const cert = fs.readFileSync(
        path.resolve(__dirname, `../../certs/${process.env.GN_CERT}`),
      );

      // Carregando pacote https com o certificado
      const agent = new https.Agent({
        pfx: cert,
        passphrase: '',
      });

      // Criando credenciais
      const credentials = Buffer.from(`${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENT_SECRET}`).toString('base64');

      // Enviar requisição por AXIOS
      const authResponse = await axios({
        method: 'POST',
        url: `${process.env.GN_ENDPOINT}/oauth/token`,
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        httpsAgent: agent,
        data: { grant_type: 'client_credentials' },
      });

      const accessToken = authResponse.data.access_token;

      // padronizando requisições com axios
      const reqGN = axios.create({
        baseURL: process.env.GN_ENDPOINT,
        httpsAgent: agent,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      // cobrança com dados fake
      const dataCob = {
        calendario: {
          expiracao: 3600,
        },
        valor: {
          original: valor,
        },
        chave: key,
        solicitacaoPagador: 'Cobrança dos serviços prestados.',
      };

      // enviando dados da cobrança para o front-end com axios
      const cobResponse = await reqGN.post('/v2/cob', dataCob);

      // res.send(cobResponse.data);
      const qrcodeRespose = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);

      res.json({ data: qrcodeRespose.data.imagemQrcode });
    } catch (error) {
      console.error('Erro ao obter o token:', error.response ? error.response.data : error.message);
      return res.status(500).json({ error: 'Erro ao obter o token' });
    }
  }
}

export default new PixController();
