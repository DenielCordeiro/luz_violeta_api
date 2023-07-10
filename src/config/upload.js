import multer from 'multer';
import path from 'path';

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),

    filename: (res, file, cb) => {
      const extession = path.extname(file.originalname);
      const name = path.basename(file.originalname, extession);

      cb(null, `${name}-${Date.now()}${extession}`);
    },
  }),
};
