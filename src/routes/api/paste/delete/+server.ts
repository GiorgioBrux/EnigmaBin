import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/util/db';

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const paste = await prisma.paste.findUnique({
        where: { id: data.id }
    });

    if (!paste || !paste.burnToken) {
        throw error(404, 'Paste not found');
    }

    // Simple token comparison
    if (data.burnToken !== paste.burnToken) {
        throw error(403, 'Invalid burn token');
    }

    await prisma.paste.delete({
        where: { id: data.id }
    });
    return json({ success: true });
};