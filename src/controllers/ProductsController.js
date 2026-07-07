import * as Yup from 'yup';
import Products from '../models/Products.js';

class ProductsController {
  async getProducts(req, res) {
    const schema = Yup.object().shape({ 
      page: Yup.number().min(1).default(1),
      limit: Yup.number().min(1).max(10).default(5), 
    });

    try {
      const validated = await schema.validate(req.query, { stripUnknown: true });

      const { page, limit} = validated;

      const products = await Products.paginate({}, {
        page,
        limit,
        sort: { createdAt: -1 } // ordena por data de criação
      });

      return res.status(200).json({ products });
    } catch (error) {

      return res.status(500).json({ 
        fail: 'Erro ao buscar produtos',
        messageError: error
      });
    }
  }

  async getProduct(req, res) {
    const { product_id } = req.params;

    try {
      const product = await Products.findById(product_id);
      
      return res.status(200).json({ product });
    } catch (error) {

      return res.status(500).json({ 
        fail: 'Erro ao buscar produto',
        messageError: error
      });
    }
  }

  async createProduct(req, res) {
    const schema = Yup.object().shape({
      type: Yup.string().required(),
      valor: Yup.number().required(),
      name: Yup.string(),
      description: Yup.string(),
      category: Yup.string(),
    });

    const {
      type,
      valor,
      name,
      description,
      category,
    } = req.body;

    const {
      originalname: nameImage,
      size: sizeImage,
      filename: keyImage,
      firebaseUrl: urlImage,
    } = req.file ? req.file : '';

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ fail: 'Falha na validação dos campos!' });
    }

    try {
      const product = await Products.create({
        type,
        valor,
        name,
        description,
        category,
        file: {
          name: nameImage,
          size: sizeImage,
          key: keyImage,
          url: urlImage,
        },
      });
  
      return res.status(200).json({ product });
    } catch (error) {

      return res.status(500).json({ 
        fail: 'Erro ao criar produto',
        messageError: error
      });
    }
  }

  async updateProduct(req, res) {
    const schema = Yup.object().shape({
      type: Yup.string().required(),
      valor: Yup.number().required(),
      name: Yup.string(),
      description: Yup.string(),
      category: Yup.string(),
    });

    const {
      type,
      valor,
      name,
      description,
      category,
    } = req.body;

    const {
      originalname: nameImage,
      size: sizeImage,
      filename: keyImage,
      firebaseUrl: urlImage,
    } = req.file ? req.file : '';

    if (!(await schema.isValid(req.body))) {

      return res.status(400).json({ fail: 'Falha na validação dos campos!' });
    }

    const { product_id } = req.params;

    try {
      const product = await Products.updateOne({ _id: product_id }, {
        type,
        valor,
        name,
        description,
        category,
        file: {
          name: nameImage,
          size: sizeImage,
          key: keyImage,
          url: urlImage,
        },
      });
  
      return res.status(200).json({ product });
    } catch (error) {

      return res.status(500).json({ 
        fail: 'Erro ao atualizar produto',
        messageError: error
      });
    }
  }

  async deleteProduct(req, res) {
    const { product_id } = req.params;

    try {
      const result = await Products.findByIdAndDelete({ _id: product_id });

      return res.status(200).json(result)
    } catch (error) {

      return res.status(500).json({
        fail: 'Erro ao excluir produto',
        messageError: error
      });
    }
  }
}

export default new ProductsController();
