import { getEfiRequest } from '../apis/efi.js';

class EFIWebhook {
    async registerWebhook() {
        const efiInstance = await getEfiRequest();

        await efiInstance.put(`/v2/webhook/${process.env.EFI_PIX_KEY}`, {
            webhookUrl: 'https://localhost:3333/webhook/pix'
        });

        console.log('✅ Webhook registrado com sucesso');
    }
}


export default new EFIWebhook();
