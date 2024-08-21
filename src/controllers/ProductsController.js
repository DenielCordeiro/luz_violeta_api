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

    const {
      type,
      valor,
      name,
      description,
      groups,
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

    const product = await Products.create({
      type,
      valor,
      name,
      description,
      groups,
      file: {
        name: nameImage,
        size: sizeImage,
        key: keyImage,
        url: urlImage,
      },
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

    const {
      type,
      valor,
      name,
      description,
      groups,
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

    const { product_id } = req.params;

    const product = await Products.updateOne({ _id: product_id }, {
      type,
      valor,
      name,
      description,
      groups,
      file: {
        name: nameImage,
        size: sizeImage,
        key: keyImage,
        url: urlImage,
      },
    });

    return res.json(product);
  }

  async destroy(req, res) {
    const { product_id } = req.body;
    await Products.findByIdAndDelete({ _id: product_id });

    return res.send();
  }
}

export default new ProductsController();
