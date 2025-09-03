
import express from 'express';
const router = express.Router();
import supabase from '../config/supabase.js';

// GET /listing/car/<listing_id>
router.get('/car/:listing_id', async (req, res) => {
    const listingId = req.params.listing_id;
    try {
        const { data, error } = await supabase
            .from('cars')
            .select("*")
            .eq("id", listingId);
        if (!data) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        console.log(data)
        res.json(data);
    } catch (err){
        res.status(500).json({ error: 'Server error' });
    }
})

// GET /listing/all
router.get('/all', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 30;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1; // Supabase uses inclusive range

        const { make, model, year, price, kilometers, sort} = req.query;

                const getSortConfig = (sortParam) => {
            switch (sortParam) {
                case 'price_asc':
                    return { column: 'price', ascending: true };
                case 'price_desc':
                    return { column: 'price', ascending: false };
                case 'year_asc':
                    return { column: 'year', ascending: true };
                case 'year_desc':
                    return { column: 'year', ascending: false };
                case 'kilometers_asc':
                    return { column: 'kilometers', ascending: true };
                case 'kilometers_desc':
                    return { column: 'kilometers', ascending: false };
                case 'created_at_asc':
                    return { column: 'created_at', ascending: true };
                case 'created_at_desc':
                default:
                    return { column: 'created_at', ascending: false };
            }
        };
        
        const sortConfig = getSortConfig(sort);

        // Fetch paginated data
        var query =  supabase
            .from('cars')
            .select('*', { count: 'exact' }) // get total count
            .order(sortConfig.column, { ascending: sortConfig.ascending });

        if (make) {
            query = query.eq('brand', make);
        }
        if (model) {
            query = query.eq('model', model);
        }

        if (year) {
            const [minYear, maxYear] = year.split(',').map(y => y ? parseInt(y) : null);
            if (minYear) query = query.gte('year', minYear);
            if (maxYear) query = query.lte('year', maxYear);
        }

        if (price) {
            const [minPrice, maxPrice] = price.split(',').map(y => y ? parseInt(y) : null);
            if (minPrice) query = query.gte('price', minPrice);
            if (maxPrice) query = query.lte('price', maxPrice);
        }

        if (kilometers) {
            const [minKilos, maxKilos] = kilometers.split(',').map(y => y ? parseInt(y) : null);
            if (minKilos) query = query.gte('kilometers', minKilos);
            if (maxKilos) query = query.lte('kilometers', maxKilos);
        }

        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) {
            throw error;
        }

        res.json({
            page,
            pageSize,
            totalItems: count,
            totalPages: Math.ceil(count / pageSize),
            data
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

  export { router as listingRoutes };

