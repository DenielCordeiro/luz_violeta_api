import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';

import authMiddleware from './middlewares/auth';

import SessionController from './controllers/SessionController';
import ProfileController from './controllers/ProfileController';
import ProductsController from './controllers/ProductsController';

const routes = new Router();
const upload = multer(uploadConfig);

routes.get('/sessions', SessionController.store);

routes.get('/profile', authMiddleware, ProfileController.index);
routes.post('/profile', ProfileController.store);
routes.put('/profile/:user_id', authMiddleware, ProfileController.update);
routes.delete('/profile', authMiddleware, ProfileController.destroy);

routes.get('/products', ProductsController.index);
routes.post('/products', upload.single('image'), authMiddleware, ProductsController.store);
routes.put('/products/:product_id', upload.single('fileName'), authMiddleware, ProductsController.update);
routes.delete('/products', authMiddleware, ProductsController.destroy);

export default routes;
