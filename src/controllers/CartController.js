import Products from '../models/Products';

class CartController {
  async addCartProduct(req, res) {
    const { user_id, product_id } = req.body;

    const productUpdated = await Products.findByIdAndUpdate(product_id, {
      user: user_id,
    });

    return res.json(productUpdated);
  }
}

export default new CartController();
