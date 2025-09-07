import fs from 'fs';
import path from 'path';
import https from 'https';
import axios from 'axios';

class PixController {
  // eslint-disable-next-line consistent-return
  async getPIX(req, res) {
    const { valor } = req.body;
    let accessToken = '';
    let reqEFI = null;

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
    try {
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

      const token = authResponse.data.access_token;
      accessToken = token;
    } catch (error) {
      return res.status(400).json(error, { error: 'Não foi possível gerar o token de acesso' });
    }

    // padronizando requisições com axios
    try {
      const efiAPI = axios.create({
        baseURL: process.env.GN_ENDPOINT,
        httpsAgent: agent,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      reqEFI = efiAPI;
    } catch (error) {
      return res.status(400).json(error, { error: 'Não foi possível conectar com a API do Gerencianet' });
    }

    // cobrança com dados reais
    const dataCob = {
      calendario: {
        expiracao: 3600,
      },
      valor: {
        original: valor,
      },
      chave: '43.488.029/0001-77',
      solicitacaoPagador: 'Cobrança dos serviços prestados.',
    };

    console.log('Dados para combrança: ', dataCob);

    // enviando dados da cobrança para o front-end com axios
    try {
      const cobResponse = await reqEFI.post('/v2/cob', dataCob);
    } catch (error) {
      return res.status(400).json(error, { error: 'Não foi possível gerar a cobrança' });
    }

    // Gerar o QR Code
    // const qrcodeRespose = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);

    // res.json({ data: qrcodeRespose.data.imagemQrcode });
  }
}

export default new PixController();
