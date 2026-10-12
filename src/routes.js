import { Router } from 'express';
import multer from 'multer';

import authMiddleware from './middlewares/auth.js';

import SessionController from './controllers/Session.Controller.js';
import ProfileController from './controllers/Profile.Controller.js';

import ImagesOfNewsletterController from './controllers/Images.Newsletter.Controller.js';
import ReviewController from './controllers/Review.Controller.js';

import ProductsController from './controllers/Products.Controller.js';
import FilterProductsController from './controllers/Filter.Products.Controller.js';
import FreightController from './controllers/Freight.Controller.js';

import CartController from './controllers/Cart.Controller.js';

import AboutController from './controllers/About.Controller.js';


const routes = new Router();

const configMulter = multer({
  storage: multer.memoryStorage(),
  limits: 6 * 1024 * 1024,
});

routes.post('/session', SessionController.login);
routes.post('/session/refresh', SessionController.refresh);
routes.post('/session/logout', SessionController.logout);

routes.get('/profile', authMiddleware, ProfileController.getUsers);
routes.post('/profile', ProfileController.createUser);
routes.put('/profile/update', ProfileController.updateUser);
routes.delete('/profile/:user_id', ProfileController.deleteUser);

routes.get('/newsletter', ImagesOfNewsletterController.getImages);
routes.post('/newsletter', configMulter.single('file'), ImagesOfNewsletterController.createImage);
routes.put('/newsletter/:news_id', configMulter.single('file'), ImagesOfNewsletterController.updateImage);
routes.delete('/newsletter/:news_id', ImagesOfNewsletterController.deleteImage);

routes.get('/newsletter/review', ReviewController.getReviews);
routes.post('/newsletter/review', ReviewController.createReview);
routes.put('/newsletter/review/:review_id', ReviewController.updateReview);
routes.delete('/newsletter/review/:review_id', ReviewController.deleteReview);

routes.get('/products', ProductsController.getProducts);
routes.get('/products/filter', FilterProductsController.getFilteredProducts);
routes.get('/products/characteristics', ProductsController.getCharacteristics);
routes.get('/products/:product_id', ProductsController.getProductById);
routes.post('/products', configMulter.single('file'), ProductsController.createProduct);
routes.put('/products/:product_id', configMulter.single('file'), ProductsController.updateProduct);
routes.delete('/products/:product_id', ProductsController.deleteProduct);

routes.put('/save_cart/:user_id', CartController.addCartProduct);
routes.put('/clear_cart/:user_id', CartController.clearCart);
routes.put('/buy_product', CartController.buyProduct);

routes.get('/about', AboutController.getAbout);
routes.put('/about', AboutController.updateAbout);

routes.post('/melhor-envio/:zipCode', FreightController.calculateFreight);

export default routes;
