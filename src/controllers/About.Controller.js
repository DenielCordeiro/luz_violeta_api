import * as Yup from 'yup';
import About from '../models/About.js';

class AboutController {
    async getAbout(req, res) {
        const { data } = req.params;

        try {
            const dataAbout = await About.find(data);

            return res.status(200).json(dataAbout);
        } catch (error) {

            return res.status(500).json({ 
                fail: 'Erro ao buscar dados da página sobre',
                messageError: error
            });
        }
    }

    async updateAbout(req, res) {
        const updateSchema = Yup.object().shape({
            company: Yup.object().shape({
                title: Yup.string(),
                paragraph: Yup.array().of( Yup.object().shape({
                    _id: Yup.number(),
                    phrases: Yup.string(),
                })),
            }),
            businesswoman: Yup.object().shape({
                title: Yup.string(),
                paragraph: Yup.array().of( Yup.object().shape({
                    _id: Yup.number(),
                    phrases: Yup.string(),
                })),
            }),
        });

        try {
            await updateSchema.validate(req.body, { abortEarly: false }); 

            const { id } = req.params;
            const data = req.body;

            const about = await About.findByIdAndUpdate(id, data, {
                new: true, 
                runValidators: true,
            });

            return res.status(200).json(about);
        } catch (error) {
            if (err instanceof Yup.ValidationError) {
                return res.status(400).json({ 
                    fail: 'Erro ao tentar validar dados',
                    errors: err.errors
                });
            } 
            
            return res.status(500).json({ 
                fail: 'Erro ao atualizar a página sobre',
                messageError: error
            });
        }
    }
}

export default new AboutController();