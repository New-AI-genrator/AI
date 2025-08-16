import { getTools } from '@/lib/tools';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { category, search, limit = '100', offset = '0' } = req.query;

        // Get all tools
        let tools = await getTools();

        // Apply filters
        if (category) {
            tools = tools.filter(tool =>
                tool.category?.toLowerCase() === (category as string).toLowerCase() ||
                tool.subcategory?.toLowerCase() === (category as string).toLowerCase()
            );
        }

        if (search) {
            const searchLower = (search as string).toLowerCase();
            tools = tools.filter(tool =>
                tool.name.toLowerCase().includes(searchLower) ||
                tool.description.toLowerCase().includes(searchLower) ||
                tool.tags?.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        // Apply pagination
        const limitNum = parseInt(limit as string);
        const offsetNum = parseInt(offset as string);
        const total = tools.length;
        const paginatedTools = tools.slice(offsetNum, offsetNum + limitNum);

        return res.status(200).json({
            data: paginatedTools,
            meta: {
                total,
                limit: limitNum,
                offset: offsetNum,
                hasMore: offsetNum + limitNum < total
            }
        });

    } catch (error) {
        console.error('Error fetching tools:', error);
        return res.status(500).json({ error: 'Failed to fetch tools' });
    }
}
