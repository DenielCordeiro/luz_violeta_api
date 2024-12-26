import * as Yup from 'yup';
import News from '../models/News';

class NewsletterControlle {
  async index(req, res) {
    return res.json({ ok: true });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      type: Yup.string().required(),
      linkProduct: Yup.string(),
    });

    const {
      type,
      linkProduct,
    } = req.body;

    const {
      originalname: nameImage,
      size: sizeImage,
      filename: keyImage,
      firebaseUrl: urlImage,
    } = req.file ? req.file : '';

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Falha na validação dos campos!' });
    }

    const news = await News.create({
      type,
      linkProduct,
      file: {
        name: nameImage,
        size: sizeImage,
        key: keyImage,
        url: urlImage,
      },
    });

    return res.json({ data: news });
  }

  async update(req, res) {
    return res.json({ ok: true });
  }

  async destroy(req, res) {
    return res.json({ ok: true });
  }
}

export default new NewsletterControlle();
