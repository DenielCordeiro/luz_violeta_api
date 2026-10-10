import Products, { Category, Type } from '../models/Products.js';

class FilterProductsController {
    async getFilteredProducts(req, res) {
        try {
            // 1. NORMALIZAÇÃO DE CATEGORIAS: Garante que 'categories' seja sempre um array,
            // independentemente de vir apenas uma string ou múltiplos valores.
            let rawCategories = [];
            if (req.query.categories) {
                rawCategories = Array.isArray(req.query.categories)
                    ? req.query.categories
                    : [req.query.categories];
            }

            // 2. NORMALIZAÇÃO DE TIPOS: Faz o mesmo tratamento para o parâmetro 'types'.
            let rawTypes = [];
            if (req.query.types) {
                rawTypes = Array.isArray(req.query.types)
                    ? req.query.types
                    : [req.query.types];
            }

            // 3. SANITIZAÇÃO: Remove espaços em branco extras (.trim()) e descarta valores vazios (Boolean).
            const categoriesClean = rawCategories.map(c => String(c).trim()).filter(Boolean);
            const typesClean = rawTypes.map(t => String(t).trim()).filter(Boolean);

            // 4. TRADUÇÃO DE NOMES PARA OBJECTIDS (CATEGORIAS)
            // Como o produto armazena _id e o front envia o nome em texto, buscamos os IDs correspondentes.
            const categoryIds = [];
            if (categoriesClean.length > 0) {
                // Regex exata (^name$), ignorando maiúsculas/minúsculas ('i')
                const categoryRegexes = categoriesClean.map(name => new RegExp(`^${name}$`, 'i'));
                const foundCategories = await Category.find({ name: { $in: categoryRegexes } }).select('_id');
                categoryIds.push(...foundCategories.map(c => c._id));
            }

            // 5. TRADUÇÃO DE NOMES PARA OBJECTIDS (TIPOS)
            const typeIds = [];
            if (typesClean.length > 0) {
                const typeRegexes = typesClean.map(name => new RegExp(`^${name}$`, 'i'));
                const foundTypes = await Type.find({ name: { $in: typeRegexes } }).select('_id');
                typeIds.push(...foundTypes.map(t => t._id));
            }

            // 6. MONTAGEM DA QUERY DINÂMICA ($or)
            // Agrupamos os IDs encontrados usando o operador $or para trazer produtos que correspondam 
            // a qualquer um dos filtros selecionados.
            const finalQuery = {};
            const orConditions = [];

            if (categoryIds.length > 0) {
                orConditions.push({ category: { $in: categoryIds } });
            }
            if (typeIds.length > 0) {
                orConditions.push({ type: { $in: typeIds } });
            }

            if (orConditions.length > 0) {
                finalQuery.$or = orConditions;
            }

            // 7. TRATAMENTO DE PAGINAÇÃO
            // Define valores seguros caso o front envie páginas ou limites inválidos/negativos.
            const page = Math.max(1, parseInt(req.query.page, 10) || 1);
            const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

            // 8. EXECUÇÃO DA BUSCA PAGINADA
            // Utiliza o mongoose-paginate-v2 junto com o 'populate' para trazer os nomes 
            // completos das coleções de categoria e tipo no JSON de resposta.
            const products = await Products.paginate(finalQuery, {
                page,
                limit,
                populate: [
                    { path: 'category', select: 'name' },
                    { path: 'type', select: 'name' }
                ],
                sort: { createdAt: -1 } // Ordena do mais recente para o mais antigo
            });

            return res.json({ products });

        } catch (error) {
            console.error("Erro no Controller de Filtro:", error);
            return res.status(500).json({ error: 'Erro interno do servidor ao filtrar produtos.' });
        }
    }
}

export default new FilterProductsController();