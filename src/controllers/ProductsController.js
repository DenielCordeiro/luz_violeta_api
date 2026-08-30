import * as Yup from 'yup';
import Products, { Category, Type } from '../models/Products.js';
import cloudinary from 'cloudinary';
import { uploadToCloudinary } from '../config/cloudinary.js';

class ProductsController {
	async getProducts(req, res) {
		const schema = Yup.object().shape({
			page: Yup.number().min(1).default(1),
			limit: Yup.number().min(1).max(6).default(6),
		});

		try {
			const validated = await schema.validate(req.query, { stripUnknown: true });

			const { page, limit } = validated;

			const products = await Products.paginate({}, {
				page,
				limit,
				populate: ['category', 'type'],
				sort: { createdAt: -1 } // ordena por data de criação
			});

			return res.status(200).json({ products });
		} catch (error) {

			return res.status(500).json({
				fail: 'Erro ao buscar produtos',
				messageError: error
			});
		}
	}

    async getProductById(req, res) {
        const { product_id } = req.params;

        try {
            const product = await Products.findById(product_id).populate(['category', 'type']);

            if (!product) {
                return res.status(404).json({ fail: 'Produto não encontrado!' });
            }

            return res.status(200).json({ product });
        } catch (error) {
            return res.status(500).json({
                fail: 'Erro ao buscar produto',
                messageError: error
            });
        } 
    }

	async createProduct(req, res) {
        if (req.body.packaging && typeof req.body.packaging === 'string') {
            try {
                req.body.packaging = JSON.parse(req.body.packaging);
            } catch (e) {
                return res.status(400).json({ fail: 'Formato de packaging inválido!' });
            }
        }

        const schema = Yup.object().shape({
            name: Yup.string(),
            description: Yup.string(),
            included_items: Yup.string(),
            warranty: Yup.string(),
            price: Yup.number().transform((value, originalValue) => originalValue === '' ? null : value).nullable(),
            stock: Yup.number().transform((value, originalValue) => originalValue === '' ? null : value).nullable(),
            type: Yup.string(),
            category: Yup.string(),
            characteristics: Yup.string(),
            deadline: Yup.string(),
            packaging: Yup.object().shape({
                weight: Yup.number().nullable(),
                height: Yup.number().nullable(),
                width: Yup.number().nullable(),
                length: Yup.number().nullable(),
            }),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ fail: 'Falha na validação dos campos!' });
        }

        const {
            name,
            description,
            included_items,
            warranty,
            price,
            stock,
            type: typeName,
            category: categoryName,
            characteristics,
            deadline,
            packaging,
        } = req.body;

        let fileData = undefined;
        if (req.file) {
            fileData = await uploadToCloudinary(req.file);
        }                                                  

        try {
            let categoryId = null;
            let typeId = null;

            if (categoryName) {
                let categoryDoc = await Category.findOne({ name: new RegExp(`^${categoryName}$`, 'i') });
                if (!categoryDoc) {
                    categoryDoc = await Category.create({ name: categoryName });
                }
                categoryId = categoryDoc._id;
            }

            if (typeName) {
                let typeDoc = await Type.findOne({ name: new RegExp(`^${typeName}$`, 'i') });
                if (!typeDoc) {
                    typeDoc = await Type.create({ name: typeName });
                }
                typeId = typeDoc._id;
            }

            const product = await Products.create({
                name,
                description,
                included_items,
                warranty,
                price,
                stock,
                type: typeId,
                category: categoryId,
                characteristics,
                deadline,
                packaging,
                file: fileData,
            });

            return res.status(201).json({ product });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                fail: 'Erro ao criar produto',
                messageError: error.message || error
            });
        }
    }

	async updateProduct(req, res) {
        const { product_id } = req.params;

        // Validação do campo packaging, caso seja enviado como string
        if (req.body.packaging && typeof req.body.packaging === 'string') {
            try {
                req.body.packaging = JSON.parse(req.body.packaging); // Converte a string JSON em objeto
            } catch (e) {
                return res.status(400).json({ fail: 'Formato de packaging inválido!' });
            }
        }

        const schema = Yup.object().shape({
            name: Yup.string(),
            description: Yup.string(),
            included_items: Yup.string(),
            warranty: Yup.string(),
            price: Yup.number().transform((value, originalValue) => originalValue === '' ? null : value).nullable(),
            stock: Yup.number().transform((value, originalValue) => originalValue === '' ? null : value).nullable(),
            type: Yup.string(),
            category: Yup.string(),
            characteristics: Yup.string(),
            deadline: Yup.string(),
            packaging: Yup.object().shape({
                weight: Yup.number().nullable(),
                height: Yup.number().nullable(),
                width: Yup.number().nullable(),
                length: Yup.number().nullable(),
            }),
        });

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (err) {
            return res.status(400).json({ 
                fail: 'Falha na validação dos campos!', 
                errors: err.errors 
            });
        }

        try {
            const productExists = await Products.findById(product_id);

            if (!productExists) {
                return res.status(404).json({ fail: 'Produto não encontrado!' });
            }

            const {
                name,
                description,
                included_items,
                warranty,
                price,
                stock,
                type: typeName,
                category: categoryName,
                characteristics,
                deadline,
                packaging,
            } = req.body;

            let categoryId = productExists.category;

            if (categoryName) {
                // Procura a categoria pelo nome, ignorando maiúsculas e minúsculas
                let categoryDoc = await Category.findOne({ name: new RegExp(`^${categoryName}$`, 'i') });

                if (!categoryDoc) {
                    categoryDoc = await Category.create({ name: categoryName });
                }

                categoryId = categoryDoc._id;
            }

            let typeId = productExists.type;

            if (typeName) {
                // Procura o tipo pelo nome, ignorando maiúsculas e minúsculas
                let typeDoc = await Type.findOne({ name: new RegExp(`^${typeName}$`, 'i') });

                if (!typeDoc) {
                    typeDoc = await Type.create({ name: typeName });
                }

                typeId = typeDoc._id;
            }

            let fileData = productExists.file;

            if (req.file) {
                // Se já existia imagem anterior, remove no Cloudinary
                if (productExists.file && productExists.file.key) {
                    try {
                        await cloudinary.uploader.destroy(productExists.file.key);
                    } catch (destroyError) {
                        console.error('Aviso: Falha ao deletar imagem antiga no Cloudinary:', destroyError.message);
                    }
                }
                
                fileData = await uploadToCloudinary(req.file);
            }

            const updatedProduct = await Products.findByIdAndUpdate(
                product_id,
                {
                    name,
                    description,
                    included_items,
                    warranty,
                    price,
                    stock,
                    type: typeId,
                    category: categoryId,
                    characteristics,
                    deadline,
                    packaging,
                    file: fileData,
                },
                { new: true }
            );

            return res.status(200).json({ product: updatedProduct });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                fail: 'Erro ao atualizar produto',
                messageError: error.message || error
            });
        }
    }

	async deleteProduct(req, res) {
        const { product_id } = req.params;

        try {
            const product = await Products.findById(product_id);

            if (!product) {
                return res.status(404).json({ fail: 'Produto não encontrado!' });
            }

            if (product.file && product.file.key) {
                try {
                    await cloudinary.uploader.destroy(product.file.key);
                } catch (err) {
                    console.error('Erro ao deletar imagem no Cloudinary:', err);
                }
            }

            await Products.findByIdAndDelete(product_id);

            return res.status(200).json({ message: 'Produto excluído com sucesso!' });
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            return res.status(500).json({ fail: 'Erro interno ao deletar produto' });
        }
    }
}

export default new ProductsController();
