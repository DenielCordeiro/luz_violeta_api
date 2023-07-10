import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';

import SessionController from './controllers/SessionController';
import ProductsController from './controllers/ProductsController';

const routes = new Router();
const upload = multer(uploadConfig);

routes.get('/sessions', SessionController.store);

routes.get('/products', ProductsController.index);
routes.post('/products', upload.single('image'), ProductsController.store);
routes.put('/products/:product_id', upload.single('image'), ProductsController.update);
routes.delete('/products', ProductsController.destroy);

export default routes;
