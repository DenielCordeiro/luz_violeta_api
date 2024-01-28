import * as Yup from 'yup';
import Products from '../models/Products';

class ProductsController {
  async index(req, res) {
    const { allProducts } = req.params;
    const data = await Products.find({ allProducts });
    const products = { data };

    return res.json(products);
  }

  async indexProduct(req, res) {
    const { product_id } = req.params;
    const data = await Products.findById(product_id);

    return res.json({ data });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      type: Yup.string().required(),
      valor: Yup.number().required(),
      name: Yup.string(),
      description: Yup.string(),
      groups: Yup.string(),
    });

    const filename = req.file;

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
      image: filename,
    });

    return res.json(product);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      type: Yup.string(),
      valor: Yup.number(),
      name: Yup.string(),
      description: Yup.string(),
      groups: Yup.string(),
    });

    const { filename } = req.file;

    const {
      type,
      valor,
      name,
      description,
      groups,
      product_id,
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
      image: filename,
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
