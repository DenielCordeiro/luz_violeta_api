import { Router } from 'express';
import multer from 'multer';

import authMiddleware from './middlewares/auth.js';

import uploadImage from './services/firebase.js';

import SessionController from './controllers/SessionController.js';
import ProfileController from './controllers/ProfileController.js';
import ImagesOfNewsletterController from './controllers/ImagesOfNewsletterController.js';
import ReviewController from './controllers/ReviewController.js';
import ProductsController from './controllers/ProductsController.js';
import CartController from './controllers/CartController.js';
import AboutController from './controllers/AboutController.js';
import MelhorEnvioController from './controllers/MelhorEnvioController.js';
import PixController from './controllers/PixController.js';

const routes = new Router();

const configMulter = multer({
  storage: multer.memoryStorage(),
  limits: 6 * 1024 * 1024,
});

routes.post('/session', SessionController.login);

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

routes.get('/about', AboutController.getAbout);
routes.put('/about', AboutController.updateAbout);

routes.post('/melhor-envio/:postal_code', MelhorEnvioController.searchPostalCode);

routes.get('/payments/charges', PixController.getCharges);
routes.post('/payments/pix', PixController.getPIX);
routes.post('/webhook(/pix)?', PixController.webhook);

export default routes;
