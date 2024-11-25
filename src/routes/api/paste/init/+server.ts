import { json } from '@sveltejs/kit';
import _sodium from 'libsodium-wrappers';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/util/db';

export const POST: RequestHandler = async () => {
    await _sodium.ready;
    const sodium = _sodium;
    
    const pasteId = crypto.randomUUID();
    const burnToken = sodium.to_base64(sodium.randombytes_buf(32));

    await prisma.paste.create({
        data: {
            id: pasteId,
            burnToken
        }
    });

    return json({ 
        pasteId,
        burnToken
    });
};