import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/util/db';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { encrypted, expiration, burnToken, id } = await request.json();

        if (!id) {
            throw new Error('Paste ID is required');
        }

        // Calculate expiration date
        const expiresAt = calculateExpirationDate(expiration);

        // Check if paste exists and has no content
        const paste = await prisma.paste.findUnique({
            where: { id }
        });

        if (!paste || paste.encrypted) {
            throw new Error(`Init request failed or paste already has content: ${paste}`);
        }

        // Refuse content if it's more than 2MB
        if (encrypted.content.length > 2000000) {
            throw new Error('Paste content exceeds 2MB limit');
        }

        // Create paste in database
        await prisma.paste.update ({
            where: { id },
            data: {
                encrypted,
                burnToken,
                expiresAt
            }
        });

        return json({ url: `/paste/${paste.id}` });
    } catch (error) {
        console.error('Failed to create paste:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};

function calculateExpirationDate(expiration: string): Date | null {
    if (expiration === 'never') return null;

    const now = new Date();
    const match = expiration.match(/(\d+)([hd])/);
    
    if (!match) {
        throw new Error('Invalid expiration format');
    }

    const [, value, unit] = match;
    const hours = unit === 'h' ? parseInt(value) : parseInt(value) * 24;
    
    return new Date(now.getTime() + hours * 60 * 60 * 1000);
}