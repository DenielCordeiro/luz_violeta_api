import { Router } from 'express';
import multer from 'multer';

// eslint-disable-next-line import/extensions
import authMiddleware from './middlewares/auth';

import uploadImage from './services/firebase';

import SessionController from './controllers/SessionController';
import ProfileController from './controllers/ProfileController';
import ImagesOfNewsletterController from './controllers/ImagesOfNewsletterController';
import ReviewController from './controllers/ReviewController';
import ProductsController from './controllers/ProductsController';
import MelhorEnvioController from './controllers/MelhorEnvioController';
import CartController from './controllers/CartController';

const routes = new Router();

const configMulter = multer({
  storage: multer.memoryStorage(),
  limits: 6 * 1024 * 1024,
});

routes.get('/session/:email/:password', SessionController.store);

routes.get('/profile', authMiddleware, ProfileController.index);
routes.get('/profile/:user_id', ProfileController.indexProfile);
routes.post('/profile', ProfileController.store);
routes.put('/profile/:user_id', authMiddleware, ProfileController.update);
routes.delete('/profile', authMiddleware, ProfileController.destroy);

routes.get('/newsletter', ImagesOfNewsletterController.index);
routes.post('/newsletter', configMulter.single('file'), uploadImage, ImagesOfNewsletterController.store);
routes.put('/newsletter/:news_id', configMulter.single('file'), uploadImage, ImagesOfNewsletterController.update);
routes.delete('/newsletter/:news_id', ImagesOfNewsletterController.destroy);

routes.get('/review', ReviewController.getReviews);
routes.post('/review', ReviewController.createReview);
routes.put('/review', ReviewController.updateReview);
routes.delete('/review', ReviewController.deleteReview);

routes.get('/products', ProductsController.index);
routes.get('/products/:product_id', ProductsController.indexProduct);
routes.post('/products', configMulter.single('file'), uploadImage, ProductsController.store);
routes.put('/products/:product_id', configMulter.single('file'), uploadImage, ProductsController.update);
routes.delete('/products/:product_id', ProductsController.destroy);

routes.put('/save_cart/:user_id', CartController.addCartProduct);
routes.put('/clear_cart/:user_id', CartController.clearCart);
routes.put('/buy_product', CartController.buyProduct);

routes.post('/melhor-envio/:postal_code', MelhorEnvioController.searchPostalCode);

export default routes;
