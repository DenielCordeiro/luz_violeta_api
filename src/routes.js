import { Router } from 'express';
import multer from 'multer';

import authMiddleware from './middlewares/auth';

import uploadImage from './services/firebase';

import SessionController from './controllers/SessionController';
import ProfileController from './controllers/ProfileController';
import ImagesOfNewsletterController from './controllers/ImagesOfNewsletterController';
import ReviewController from './controllers/ReviewController';
import ProductsController from './controllers/ProductsController';
import CartController from './controllers/CartController';
import MelhorEnvioController from './controllers/MelhorEnvioController';
import PixController from './controllers/PixController';

const routes = new Router();

const configMulter = multer({
  storage: multer.memoryStorage(),
  limits: 6 * 1024 * 1024,
});

routes.get('/session/:email/:password', SessionController.login);

routes.get('/profile', authMiddleware, ProfileController.getUsers);
routes.get('/profile/:user_id', ProfileController.getUser);
routes.post('/profile', ProfileController.createUser);
routes.put('/profile/:user_id', authMiddleware, ProfileController.updateUser);
routes.delete('/profile', authMiddleware, ProfileController.deleteUser);

routes.get('/newsletter', ImagesOfNewsletterController.getImages);
routes.post('/newsletter', configMulter.single('file'), uploadImage, ImagesOfNewsletterController.createImage);
routes.put('/newsletter/:news_id', configMulter.single('file'), uploadImage, ImagesOfNewsletterController.updateImage);
routes.delete('/newsletter/:news_id', ImagesOfNewsletterController.deleteImage);

routes.get('/newsletter/review', ReviewController.getReviews);
routes.post('/newsletter/review', ReviewController.createReview);
routes.put('/newsletter/review/:review_id', ReviewController.updateReview);
routes.delete('/newsletter/review/:review_id', ReviewController.deleteReview);

routes.get('/products', ProductsController.getProducts);
routes.get('/products/:product_id', ProductsController.getProduct);
routes.post('/products', configMulter.single('file'), uploadImage, ProductsController.createProduct);
routes.put('/products/:product_id', configMulter.single('file'), uploadImage, ProductsController.updateProduct);
routes.delete('/products/:product_id', ProductsController.deleteProduct);

routes.put('/save_cart/:user_id', CartController.addCartProduct);
routes.put('/clear_cart/:user_id', CartController.clearCart);
routes.put('/buy_product', CartController.buyProduct);

routes.post('/melhor-envio/:postal_code', MelhorEnvioController.searchPostalCode);
routes.post('/payments/pix', PixController.getPIX);

export default routes;
