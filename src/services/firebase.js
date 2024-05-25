// eslint-disable-next-line import/no-extraneous-dependencies
import admin, { storage } from 'firebase-admin';
import serviceAccount from '../config/firebase-key.json';

const urlArchivesFirebase = 'gs://luz-violeta-186d5.appspot.com';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: urlArchivesFirebase,
});

const bucket = storage().bucket();

// eslint-disable-next-line consistent-return
const uploadImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const image = req.file;
  const nameImageFirebase = `${Date.now()}.${image.originalname.split('.').pop()}`;

  const file = bucket.file(nameImageFirebase);

  const stream = file.createWriteStream({
    metadata: {
      contentType: image.mimetype,
    },
  });

  stream.on('error', (err) => {
    console.log(err);
  });

  stream.on('finish', async () => {
    await file.makePublic();

    req.file.firebaseUrl = `https://storage.googleapis.com/${urlArchivesFirebase}/${nameImageFirebase}`;

    next();
  });

  stream.end(image.buffer);
};

export default uploadImage;
