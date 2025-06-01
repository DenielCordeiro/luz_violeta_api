import fs from 'fs';
import path from 'path';
import https from 'https';
import axios from 'axios';

class PixController {
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
      }).then((response) => console.log(response.data));

      return res.send();
    } catch (error) {
      console.error('Erro ao obter o token:', error.response ? error.response.data : error.message);
      return res.status(500).json({ error: 'Erro ao obter o token' });
    }
  }
}

export default new PixController();
