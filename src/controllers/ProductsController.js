import * as Yup from 'yup';
import Products from '../models/Products';

class ProductsController {
  async getProducts(req, res) {
    const { allProducts } = req.params;
    const data = await Products.find({ allProducts });
    const products = { data };

    return res.json(products);
  }

  async getProduct(req, res) {
    const { product_id } = req.params;
    const data = await Products.findById(product_id);

    return res.json({ data });
  }

  async createProduct(req, res) {
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

    return res.json({ data: product });
  }

  async updateProduct(req, res) {
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

    return res.json({ data: product });
  }

  async deleteProduct(req, res) {
    const { product_id } = req.params;
    const result = await Products.findByIdAndDelete({ _id: product_id });

    if (!result) {
      const error = 'Não foi possível excluir Produto';
      return res.json({ data: error });
    }

    const data = { delete: true };

    return res.json(data);
  }
}

export default new ProductsController();
