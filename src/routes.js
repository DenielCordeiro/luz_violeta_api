import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';

import SessionController from './controllers/SessionController';
import ProfileController from './controllers/ProfileController';
import ProductsController from './controllers/ProductsController';

const routes = new Router();
const upload = multer(uploadConfig);

routes.get('/sessions', SessionController.store);

routes.get('/profile', ProfileController.index);
routes.post('/profile', ProfileController.store);
routes.put('/profile/:user_id', ProfileController.update);
routes.delete('/profile', ProfileController.destroy);

routes.get('/products', ProductsController.index);
routes.post('/products', upload.single('image'), ProductsController.store);
routes.put('/products/:product_id', upload.single('image'), ProductsController.update);
routes.delete('/products', ProductsController.destroy);

export default routes;
