import fs from 'fs';
import path from 'path';
import https from 'https';
import axios from 'axios';

class PixController {
  // eslint-disable-next-line consistent-return
  async getPIX(req, res) {
    try {
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
      axios({
        method: 'POST',
        url: `${process.env.GN_ENDPOINT}/oauth/token`,
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        httpsAgent: agent,
        data: { grant_type: 'client_credentials' },
      }).then((response) => {
        const accessToken = response.data.access_token;

        const reqGN = axios.create({
          baseURL: process.env.GN_ENDPOINT,
          httpsAgent: agent,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const dataCob = {
          calendario: {
            expiracao: 3600,
          },
          valor: {
            original: '44.00',
          },
          chave: '43.488.029/0001-77',
          solicitacaoPagador: 'Cobrança dos serviços prestados.',
        };

        reqGN.post('/v2/cob', dataCob).then((result) => {
          res.send(result.data);
        });

        return true;
      });
    } catch (error) {
      console.error('Erro ao obter o token:', error.response ? error.response.data : error.message);
      return res.status(500).json({ error: 'Erro ao obter o token' });
    }
  }
}

export default new PixController();
