import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class FreightController {
  async calculateFreight(req, res) {
    const { zipCode } = req.params; // Supondo que o parâmetro na rota seja :zipCode

    try {
      // 1. Criamos a requisição
      const response = await axios.post(
        'https://melhorenvio.com.br/api/v2/me/shipment/calculate',
        {
          from: { postal_code: process.env.POSTALCODE_CLIENT },
          to: { postal_code: zipCode }, // Passando apenas o valor, não o objeto stringified
          package: {
            height: 10,
            width: 20,
            length: 15,
            weight: 1,
          },
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
            'User-Agent': `Aplicação ${process.env.EMAIL_CLIENTE}`,
          },
        }
      );

      // 2. O Axios já retorna o JSON em response.data
      return res.status(200).json(response.data);

    } catch (error) {
      // 3. Tratamento de erro robusto
      const status = error.response ? error.response.status : 500;
      const message = error.response ? error.response.data : 'Erro interno no servidor';

      console.error('Erro na cotação:', message);
      return res.status(status).json({ error: message });
    }
  }
}

export default new FreightController();