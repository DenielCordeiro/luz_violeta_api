import * as Yup from 'yup';
import Products, { Category, Type } from '../models/Products.js';
import { deleteImageFirebase } from '../services/firebase.js';

class ProductsController {
	async getProducts(req, res) {
		const schema = Yup.object().shape({
			page: Yup.number().min(1).default(1),
			limit: Yup.number().min(1).max(10).default(5),
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

	async createProduct(req, res) {
        if (req.body.packaging && typeof req.body.packaging === 'string') {
            try {
                req.body.packaging = JSON.parse(req.body.packaging);
            } catch (e) {
                return res.status(400).json({ fail: 'Formato de packaging inválido!' });
            }
        }

        const schema = Yup.object().shape({
            name: Yup.string().required('Nome é obrigatório'),
            description: Yup.string(),
            included_items: Yup.string(),
            warranty: Yup.string(),
            price: Yup.number().transform((value, originalValue) => originalValue === '' ? null : value).nullable(),
            stock: Yup.number().transform((value, originalValue) => originalValue === '' ? null : value).nullable(),
            type: Yup.string().required('Tipo é obrigatório'),
            category: Yup.string().required('Categoria é obrigatória'),
            characteristics: Yup.string(),
            deadline: Yup.date().nullable(),
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

        const {
            originalname: nameImage,
            size: sizeImage,
            filename: keyImage,
            firebaseUrl: urlImage,
        } = req.file ? req.file : {};                                                   

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
                file: nameImage ? {
                    name: nameImage,
                    size: sizeImage,
                    key: keyImage,
                    url: urlImage,
                } : undefined,
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
        // const updatedProduct = await Products.findByIdAndUpdate();
	}

	async deleteProduct(req, res) {
		const { product_id } = req.params;

		try {
			const result = await Products.findByIdAndDelete({ _id: product_id });

			return res.status(200).json(result)
		} catch (error) {

			return res.status(500).json({
				fail: 'Erro ao excluir produto',
				messageError: error
			});
		}
	}
}

export default new ProductsController();
