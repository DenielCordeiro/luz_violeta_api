import Products from '../models/Products.js';
import User from '../models/User.js';

class CartController {
  async addCartProduct(req, res) {
    const { products } = req.body;
    const { user_id } = req.params;

    try {
      const userUpdated = await User.findByIdAndUpdate(user_id, {
        productsCart: products,
      });
  
      return res.status(200).json(userUpdated);
    } catch (error) {

      return res.status(500).json({ 
        fail: 'Erro ao adicionar no carrinho',
        messageError: error
      });
    }
  }

  async clearCart(req, res) {
    const { user_id } = req.params;
    const product = {};

    try {
      const userUpdated = await User.findByIdAndUpdate(user_id, {
        productsCart: product,
      });
  
      return res.status(200).json({ data: userUpdated });
    } catch (error) {

      return res.status(500).json({ 
        fail: 'Erro ao limpar carrinho',
        messageError: error
      });
    }
  }

  async buyProduct(req, res) {
    const {
      userId,
      product_id,
      shipping: {
        price,
        name,
        postalCode,
      },
    } = req.body;

    try {
      const productUpdated = await Products.findByIdAndUpdate(product_id, {
        userId,
        shipping: {
          price,
          name,
          postalCode,
        },
      });
  
      return res.status(200).json(productUpdated);
    } catch (error) {

      return res.status(500).json({ 
        fail: 'Erro ao comprar produto(s)',
        messageError: error
      });
    }
  }
}

export default new CartController();
