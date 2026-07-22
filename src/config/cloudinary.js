import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'luz-violeta-macrame',
    api_key: '744896425224325',
    api_secret: 'H8FowQWdG2ZSdODKD3IzSnQEt1U',
});

export const uploadToCloudinary = async (file) => {
    if (!file) return null;

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'luz_violeta_produtos',
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({
                    name: file.originalname,
                    size: file.size,
                    key: result.public_id,
                    url: result.secure_url,
                });
            }
        );

        uploadStream.end(file.buffer);
    });
};