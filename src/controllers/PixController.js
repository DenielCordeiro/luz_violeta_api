import fs from 'fs';
import path from 'path';
import https from 'https';
import axios from 'axios';

class PixController {
  // eslint-disable-next-line consistent-return
  async getPIX(req, res) {
    const { valor, profileCPF, name } = req.body;
    let accessToken = '';
    let reqEFI = null;
    let copyAndPaste = '';

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
      return res.status(400).json({ error: error.response?.data || error.message, message: 'Não foi possível gerar o token de acesso' });
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
      return res.status(400).json({ error: error.response?.data || error.message, message: 'Não foi possível conectar com a API do Gerencianet' });
    }

    // cobrança com dados reais
    const dataCob = {
      calendario: {
        expiracao: 3600,
      },
      devedor: {
        cpf: profileCPF.replace(/\D/g, ''),
        nome: name,
      },
      valor: {
        original: Number(valor).toFixed(2),
      },
      chave: '43.488.029/0001-77',
      solicitacaoPagador: 'Cobrança de serviço artesanal prestado.',
    };

    // enviando dados da cobrança para o front-end com axios
    try {
      const cobResponse = await reqEFI.post('/v2/cob', dataCob);

      copyAndPaste = cobResponse.data.pixCopiaECola;

      const qrcodeRespose = await reqEFI.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);

      const data = {
        qrcode: qrcodeRespose.data.qrcode,
        imagemQrcode: `https://api.qrserver.com/v1/create-qr-code/?data=${qrcodeRespose.data.qrcode}&size=300x300&ecc=M`,
        copyAndPaste,
      };

      res.json({ data });
    } catch (error) {
      return res.status(400).json({ error: error.response?.data || error.message, message: 'Não foi possível gerar a cobrança' });
    }
  }
}

export default new PixController();
