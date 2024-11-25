import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/util/db';
export const ssr = false;
export const csr = true;

export const load: PageServerLoad = async ({ params }) => {
    try {
        const paste = await prisma.paste.findUnique({
            where: {
                id: params.id
            }
        });

        if (!paste) {
            throw error(404, 'Paste not found');
        }

        // Check if paste has expired
        if (paste.expiresAt && paste.expiresAt < new Date()) {
            // Delete expired paste
            await prisma.paste.delete({
                where: { id: params.id }
            });
            throw error(404, 'Paste not found');
        }

        return {
            id: paste.id,
            encrypted: paste.encrypted,
            createdAt: paste.createdAt,
            expiresAt: paste.expiresAt
        };

    } catch (e: any) {
        if (e?.status === 404) {
            return {};
        }
        
        // Log and throw 500 for unexpected errors
        console.error('Failed to retrieve paste:', e);
        throw error(500, 'Failed to retrieve paste');
    }
};
