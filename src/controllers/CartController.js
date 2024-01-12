import Products from '../models/Products';
import User from '../models/User';

class CartController {
  async addCartProduct(req, res) {
    const { user_id, product_id } = req.body;

    const productUpdated = await Products.create({
      user: user_id,
    });

    const userUpdated = await User.create({
      allProducts: {
        product: product_id,
      },
    });

    return res.json({ userUpdated, productUpdated });
  }
}

export default new CartController();
