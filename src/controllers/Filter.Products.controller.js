import Products, { Category, Type } from '../models/Products.js';

class FilterProductsController {
    async getFilteredProducts(req, res) {
        try {
            // 1. Normalização dos parâmetros
            let rawCategories = [];
            if (req.query.categories) {
                rawCategories = Array.isArray(req.query.categories)
                    ? req.query.categories
                    : [req.query.categories];
            }

            let rawTypes = [];
            if (req.query.types) {
                rawTypes = Array.isArray(req.query.types)
                    ? req.query.types
                    : [req.query.types];
            }

            // 2. Limpeza das strings enviadas na query
            const categoriesClean = rawCategories.map(c => String(c).trim()).filter(Boolean);
            const typesClean = rawTypes.map(t => String(t).trim()).filter(Boolean);

            const query = {};

            // 3. Busca os _ids das categorias pelos nomes informados
            if (categoriesClean.length > 0) {
                const foundCategories = await Category.find({
                    name: { $in: categoriesClean }
                }).select('_id');

                const categoryIds = foundCategories.map(c => c._id);
                query.category = { $in: categoryIds };
            }

            // 4. Busca os _ids dos tipos pelos nomes informados
            if (typesClean.length > 0) {
                const foundTypes = await Type.find({
                    name: { $in: typesClean }
                }).select('_id');

                const typeIds = foundTypes.map(t => t._id);
                query.type = { $in: typeIds };
            }

            // 5. Tratamento seguro de paginação
            const page = Math.max(1, parseInt(req.query.page, 10) || 1);
            const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

            // 6. Busca paginada preenchendo os dados completos de categoria e tipo no retorno
            const products = await Products.paginate(query, {
                page,
                limit,
                populate: [
                    { path: 'category', select: 'name' },
                    { path: 'type', select: 'name' }
                ],
                sort: { createdAt: -1 }
            });

            return res.json({ products });

        } catch (error) {
            console.error("Erro no Controller de Filtro:", error);
            return res.status(500).json({ error: 'Erro interno do servidor ao filtrar produtos.' });
        }
    }
}

export default new FilterProductsController();