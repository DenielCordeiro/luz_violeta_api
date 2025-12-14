import * as Yup from 'yup';
import Review from '../models/Review.js';

class ReviewController {
  async getReviews(req, res) {
    const { allReviews } = req.params;

    try {
      const data = await Review.find({ allReviews });

      return res.json(data);
    } catch (error) {
      return res.status(500).json({
        fail: 'Não foi possível buscar as avaliações no Banco de Dados!',
        messageError: error,
      });
    }
  }

  async createReview(req, res) {
    const schema = Yup.object().shape({
      userName: Yup.string().required(),
      review: Yup.string().required(),
      stars: Yup.number().required(),
      filledStars: Yup.number().required(),
    });

    const {
      userName,
      review,
      stars,
      filledStars,
    } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos campos!' });
    }

    try {
      const data = await Review.create({
        userName,
        review,
        stars,
        filledStars,
      });

      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({
        fail: 'Não foi possível salvar nova avaliação no banco de dados!',
        messageError: error,
      });
    }
  }

  async updateReview(req, res) {
    const schema = Yup.object().shape({
      userName: Yup.string().required(),
      review: Yup.string().required(),
      stars: Yup.number().required(),
      filledStars: Yup.number().required(),
    });

    const {
      userName,
      review,
      stars,
      filledStars,
    } = req.body;

    const { review_id } = req.params;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos campos!' });
    }

    if (!(await review_id)) {
      return res.status(400).json({ error: 'ID da Avaliação não encontrado!' });
    }

    try {
      const data = await Review.updateOne({ _id: review_id }, {
        userName,
        review,
        stars,
        filledStars,
      });

      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({
        fail: 'Não foi possível atualizar avaliação no banco de dados!',
        messageError: error,
      });
    }
  }

  async deleteReview(req, res) {
    const { review_id } = req.params;

    if (!(await review_id)) {
      return res.status(400).json({ error: 'ID da avaliação não encontrado!' });
    }

    try {
      const data = await Review.findByIdAndDelete({ _id: review_id });

      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({
        fail: 'Não foi possível excluir avaliação do banco de dados!',
        messageError: error,
      });
    }
  }
}

export default new ReviewController();
