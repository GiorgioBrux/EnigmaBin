import { MlKem1024 } from 'mlkem';
import _sodium from 'libsodium-wrappers';
import type { EncryptedData, PasteContent } from './encryption';

export async function decrypt(
    pasteId: string,
    encrypted: EncryptedData,
    decryptionKeyBase64: string
): Promise<PasteContent> {
    await _sodium.ready;
    const sodium = _sodium;

    try {
        // Initialize Kyber
        const kyber = new MlKem1024();

        // Convert base64 strings back to Uint8Arrays
        const secretKey = sodium.from_base64(decryptionKeyBase64);
        const ciphertext = sodium.from_base64(encrypted.ciphertext);
        const nonce = sodium.from_base64(encrypted.nonce);
        const encryptedContent = sodium.from_base64(encrypted.content);

        // Verify version
        if (encrypted.version !== '1') {
            throw new Error('Unsupported encryption version');
        }

        // Decapsulate the shared secret using Kyber
        const sharedSecret = await kyber.decap(ciphertext, secretKey);

        // Decrypt the content using ChaCha20-Poly1305
        const decrypted = sodium.crypto_aead_chacha20poly1305_decrypt(
            null,      // nsec - not used
            encryptedContent,
            null,      // additional data
            nonce,
            sharedSecret
        );

        // Parse the decrypted JSON content
        const pasteContent: PasteContent = JSON.parse(
            sodium.to_string(decrypted)
        );

        // If it's burn-on-view and has a burn token, send it with the burn request
        if (pasteContent.burnOnView && pasteContent.burnToken) {
            try {
                const response = await fetch(`/api/paste/delete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: pasteId, burnToken: pasteContent.burnToken })
                });
                
                if (!response.ok) {
                    console.warn('Failed to burn paste after reading');
                }
            } catch (error) {
                console.warn('Failed to burn paste:', error);
            }
        }

        return pasteContent;

    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('Failed to decrypt content');
    }
}