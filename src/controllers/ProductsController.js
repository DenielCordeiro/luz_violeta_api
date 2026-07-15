import * as Yup from 'yup';
import Products from '../models/Products.js';
import { deleteImageFirebase } from '../config/firebase.js';

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

	async getProduct(req, res) {
		const { product_id } = req.params;

		try {
			const product = await Products.findById(product_id);

			return res.status(200).json({ product });
		} catch (error) {

			return res.status(500).json({
				fail: 'Erro ao buscar produto',
				messageError: error
			});
		}
	}

	async createProduct(req, res) {
		const schema = Yup.object().shape({
			name: Yup.string(),
			description: Yup.string(),
			included_items: Yup.string(),
			warranty: Yup.string(),
			price: Yup.number(),
			stock: Yup.number(),
			type: Yup.array().of(Yup.string()),
			category: Yup.array().of(Yup.string()),
			characteristics: Yup.array().of(Yup.string()),
			deadline: Yup.date(),
			packaging: Yup.object().shape({
				weight: Yup.number(),
				height: Yup.number(),
				width: Yup.number(),
				length: Yup.number(),
			}),
		});

		const {
			name,
			description,
			included_items,
			warranty,
			price,
			stock,
			type,
			category,
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

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ fail: 'Falha na validação dos campos!' });
		}

		try {
			const product = await Products.create({
				name,
				description,
				included_items,
				warranty,
				price,
				stock,
				type,
				category,
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

			return res.status(200).json({ product });
		} catch (error) {

			return res.status(500).json({
				fail: 'Erro ao criar produto',
				messageError: error.message || error
			});
		}
	}

	async updateProduct(req, res) {
		const schema = Yup.object().shape({
			name: Yup.string(),
			description: Yup.string(),
			included_items: Yup.string(),
			warranty: Yup.string(),
			price: Yup.number(), 
			stock: Yup.number(),
			type: Yup.array().of(Yup.string()),
			category: Yup.array().of(Yup.string()),
			characteristics: Yup.array().of(Yup.string()),
			deadline: Yup.date(),
			packaging: Yup.object().shape({
				weight: Yup.number(),
				height: Yup.number(),
				width: Yup.number(),
				length: Yup.number(),
			}),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ fail: 'Falha na validação dos campos!' });
		}

		const { product_id } = req.params;

		try {
			const productExists = await Products.findById(product_id);

			if (!productExists) {
				return res.status(404).json({ fail: 'Produto não encontrado!' });
			}

			const updateData = { ...req.body };

			// Se o usuário enviou uma imagem nova, atualiza o campo "file" e deleta a imagem antiga do Firebase
			if (req.file) {
				const {
					originalname: nameImage,
					size: sizeImage,
					filename: keyImage,
					firebaseUrl: urlImage,
				} = req.file;

				// LIMPEZA: Se já existia uma imagem antiga cadastrada, apaga ela do Firebase
				if (productExists.file && productExists.file.key) {
					await deleteImageFirebase(productExists.file.key);
				}

				// Grava os metadados da nova imagem no objeto de update
				updateData.file = {
					name: nameImage,
					size: sizeImage,
					key: keyImage,
					url: urlImage,
				};
			}

			const updatedProduct = await Products.findByIdAndUpdate(
				product_id,
				{ $set: updateData },
				{ new: true } 
			);

			return res.status(200).json({ product: updatedProduct });

		} catch (error) {

			return res.status(500).json({
				fail: 'Erro ao atualizar produto',
				messageError: error.message || error
			});
		}
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
