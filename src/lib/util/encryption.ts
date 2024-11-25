import { MlKem1024 } from 'mlkem';
import _sodium from 'libsodium-wrappers';

export interface EncryptedData {
    content: string;
    ciphertext: string;
    nonce: string;
    version: '1';
    burnToken?: string;
}

export interface PasteContent {
    content: string;
    burnOnView: boolean;
    burnToken?: string;
}

export async function encrypt(
    content: string, 
    burnOnView: boolean
): Promise<{
    pasteId: string;
    encrypted: EncryptedData;
    decryptionKey: string;
}> {
    await _sodium.ready;
    const sodium = _sodium;
    
    // Get paste ID and burn token first
    const response = await fetch('/api/paste/init', { method: 'POST' });
    if (!response.ok) {
        throw new Error('Failed to initialize paste');
    }
    const { pasteId, burnToken } = await response.json();
    
    // Initialize Kyber
    const kyber = new MlKem1024();

    // First layer: Quantum-resistant KEM
    const [publicKey, secretKey] = await kyber.generateKeyPair();
    const [ciphertext, sharedSecret] = await kyber.encap(publicKey);

    // Second layer: ChaCha20-Poly1305
    const nonce = sodium.randombytes_buf(sodium.crypto_aead_chacha20poly1305_NPUBBYTES);

    // Package content with burnToken
    const pasteContent: PasteContent = {
        content,
        burnOnView,
        burnToken
    };

    const encrypted = sodium.crypto_aead_chacha20poly1305_encrypt(
        sodium.from_string(JSON.stringify(pasteContent)), 
        null, null, nonce, sharedSecret
    );

    return {
        pasteId,
        encrypted: {
            content: sodium.to_base64(encrypted),
            ciphertext: sodium.to_base64(ciphertext),
            nonce: sodium.to_base64(nonce),
            version: '1'
        },
        decryptionKey: sodium.to_base64(secretKey)
    };
}