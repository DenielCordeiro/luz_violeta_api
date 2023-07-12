import * as Yup from 'yup';
import Products from '../models/Products';

class ProductsController {
  async index(req, res) {
    const { allProducts } = req.params;
    const products = await Products.find({ allProducts });

    return res.json(products);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      type: Yup.string().required(),
      valor: Yup.number().required(),
      name: Yup.string(),
      description: Yup.string(),
      groups: Yup.string(),
    });

    const { fileName } = req.file;

    const {
      type,
      valor,
      name,
      description,
      groups,
    } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Falha na validação dos campos!' });
    }

    const product = await Products.create({
      type,
      valor,
      name,
      description,
      groups,
      image: fileName,
    });

    return res.json(product);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      type: Yup.string().required(),
      valor: Yup.number().required(),
      name: Yup.string(),
      description: Yup.string(),
      groups: Yup.string(),
    });

    const { fileName } = req.file;
    const { product_id } = req.params;

    const {
      type,
      valor,
      name,
      description,
      groups,
    } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos campos!' });
    }

    await Products.updateOne({ _id: product_id }, {
      type,
      valor,
      name,
      description,
      groups,
      image: fileName,
    });

    return res.send();
  }

  async destroy(req, res) {
    const { product_id } = req.body;

    await Products.findByIdAndDelete({ _id: product_id });

    return res.send();
  }
}

export default new ProductsController();
