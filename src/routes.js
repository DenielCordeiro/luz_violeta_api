import { Router } from 'express';
import multer from 'multer';
// eslint-disable-next-line import/extensions
import uploadConfig from './config/upload.js';

import authMiddleware from './middlewares/auth';

import SessionController from './controllers/SessionController';
import ProfileController from './controllers/ProfileController';
import ProductsController from './controllers/ProductsController';
import CartController from './controllers/CartController';
import MelhorEnvioController from './controllers/MelhorEnvioController';

const routes = new Router();
const upload = multer(uploadConfig);

routes.get('/session/:email/:password', SessionController.store);

routes.get('/profile', authMiddleware, ProfileController.index);
routes.get('/profile/:user_id', authMiddleware, ProfileController.indexProfile);
routes.post('/profile', ProfileController.store);
routes.put('/profile/:user_id', authMiddleware, ProfileController.update);
routes.delete('/profile', authMiddleware, ProfileController.destroy);

routes.get('/products', ProductsController.index);
routes.get('/products/:product_id', ProductsController.indexProduct);
// routes.post('/products', upload.single('file'), authMiddleware, ProductsController.store);
routes.post('/products', upload.single('file'), ProductsController.store);
routes.put('/products/:product_id', upload.single('file'), authMiddleware, ProductsController.update);
routes.delete('/products', authMiddleware, ProductsController.destroy);
routes.post('/cart', authMiddleware, CartController.addCartProduct);

routes.post('/melhor-envio/:postal_code', MelhorEnvioController.searchPostalCode);

export default routes;
