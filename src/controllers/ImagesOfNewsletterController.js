import * as Yup from 'yup';
import News from '../models/News';

class ImagesOfNewsletterController {
  async getImages(req, res) {
    const { allNews } = req.params;

    try {
      const data = await News.find({ allNews });
      return res.json({ data });
    } catch (error) {
      return res.status(500).json({
        fail: 'Não foi possível buscar todas as imagens!',
        messageError: error,
      });
    }
  }

  async createImage(req, res) {
    const schema = Yup.object().shape({
      type: Yup.string().required(),
      linkProduct: Yup.string().required(),
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
      return res.status(400).json({ error: 'Falha na validação dos campos!' });
    }

    try {
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
    } catch (error) {
      return res.status(500).json({
        fail: 'Não foi possivel criar uma nova imagem!',
        messageError: error,
      });
    }
  }

  async updateImage(req, res) {
    const schema = Yup.object().shape({
      type: Yup.string().required(),
      linkProduct: Yup.string(),
    });

    const {
      type,
      linkProduct,
    } = req.body;

    const { news_id } = req.params;

    const {
      originalname: nameImage,
      size: sizeImage,
      filename: keyImage,
      firebaseUrl: urlImage,
    } = req.file ? req.file : '';

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos campos!' });
    }

    try {
      const news = await News.updateOne({ _id: news_id }, {
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
    } catch (error) {
      return res.status(500).json({
        fail: 'Não foi possível atualizar a dados da imagem!',
        messageError: error,
      });
    }
  }

  async deleteImage(req, res) {
    const { news_id } = req.params;

    if (news_id === null || news_id === undefined) {
      return res.status(500).json({ error: 'Não foi possível encontrar o id da imagem!' });
    }

    try {
      const result = await News.findByIdAndDelete({ _id: news_id });

      return res.json({ result });
    } catch (error) {
      return res.status(500).json({
        fail: 'Não foi possível deletar a imagem!',
        messageError: error,
      });
    }
  }
}

export default new ImagesOfNewsletterController();
