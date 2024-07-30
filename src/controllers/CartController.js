import Products from '../models/Products';

class CartController {
  async addCartProduct(req, res) {
    const { user_id, product_id } = req.body;

    const productUpdated = await Products.findByIdAndUpdate(product_id, {
      user: user_id,
    });

    return res.json(productUpdated);
  }

  async buyProduct(req, res) {
    const {
      user,
      product_id,
      shipping: {
        price,
        name,
      },
    } = req.body;

    const productUpdated = await Products.findByIdAndUpdate(product_id, {
      user,
      shipping: {
        price,
        name,
      },
    });

    return res.json(productUpdated);
  }
}

export default new CartController();
