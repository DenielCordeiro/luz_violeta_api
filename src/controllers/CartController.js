import Products from '../models/Products';
import User from '../models/User';

class CartController {
  async addCartProduct(req, res) {
    const { products } = req.body;
    const { user_id } = req.params;

    const userUpdated = await User.findByIdAndUpdate(user_id, {
      productsCart: products,
    });

    return res.json(userUpdated);
  }

  async clearCart(req, res) {
    const { user_id } = req.params;
    const product = {};

    const userUpdated = await User.findByIdAndUpdate(user_id, {
      productsCart: product,
    });

    return res.json({ data: userUpdated });
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

    const productUpdated = await Products.findByIdAndUpdate(product_id, {
      userId,
      shipping: {
        price,
        name,
        postalCode,
      },
    });

    return res.json(productUpdated);
  }
}

export default new CartController();
