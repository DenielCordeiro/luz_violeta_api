// eslint-disable-next-line import/no-cycle
import { getEfiRequest } from '../apis/efi.js';

class PixController {

  async webhook(req, res) {
    console.log('Webhook recebido:', req.body);

    res.status(200).json({ message: 'Webhook recebido com sucesso' });
  }

  async getPIX(req, res) {
    const { valor, profileCPF, name } = req.body;
    let copyQRCode = '';

    // Para não acessar o dotend em produção
    if (process.env.NODE_ENV !== 'production') {
      require('dotenv').config();
    }

    // validando parâmetros
    if (!valor || !profileCPF || !name) {
      return res.status(400).json({ error: 'Parâmetros inválidos', message: 'É necessário informar o valor, CPF e nome do pagador para gerar a cobrança' });
    }

    // limpando CPF
    const cleanCPF = String(profileCPF).replace(/\D/g, '');
    if (cleanCPF.length !== 11) {
      return res.status(400).json({ error: 'CPF inválido' });
    }

    // buscando instância do AXIOS para requisições autenticadas
    const reqEFI = await getEfiRequest();

    // cobrança com dados reais
    const dataCob = {
      calendario: {
        expiracao: 3600,
      },
      devedor: {
        cpf: cleanCPF,
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

      copyQRCode = cobResponse.data.pixCopiaECola;

      const qrcodeRespose = await reqEFI.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);

      const data = {
        qrcode: qrcodeRespose.data.qrcode,
        imagemQrcode: `https://api.qrserver.com/v1/create-qr-code/?data=${qrcodeRespose.data.qrcode}&size=300x300&ecc=M`,
        copyQRCode,
      };

      return res.status(200).json({ data });
    } catch (error) {
      return res.status(400).json({ error: error.response?.data || error.message, message: 'Não foi possível gerar a cobrança' });
    }
  }

  async getCharges(req, res) {
    const efiRequest = await getEfiRequest();

    const chargesResponse = await efiRequest.get('/v2/cob', {
      params: {
        inicio: '2025-12-01T16:01:35Z',
        fim: '2025-12-30T20:10:00Z',
      },
    });
      
    res.send(chargesResponse.data);
  }
}

export default new PixController();
