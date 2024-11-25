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
        // Split the combined decryption key
        const combinedKey = sodium.from_base64(decryptionKeyBase64);
        
        // Log the total length
        console.log('Combined key length:', combinedKey.length);
        
        // MLKEM-1024 secret key is 3168 bytes
        const secretKey1 = combinedKey.slice(0, 3168);
        // X25519 secret key is 32 bytes
        const secretKey2 = combinedKey.slice(3168, 3168 + 32);
        // X25519 public key is 32 bytes
        const publicKey2 = combinedKey.slice(3168 + 32);
        
        // Log the split lengths
        console.log('Split lengths:', {
            secretKey1: secretKey1.length,
            secretKey2: secretKey2.length,
            publicKey2: publicKey2.length
        });

        // Layer 1: Kyber decryption
        const kyber = new MlKem1024();
        const sharedSecret1 = await kyber.decap(
            sodium.from_base64(encrypted.ciphertext1), 
            secretKey1
        );

        // Layer 2: X25519 decryption
        const sharedSecret2 = sodium.crypto_box_seal_open(
            sodium.from_base64(encrypted.ciphertext2),
            publicKey2,
            secretKey2
        );

        // Decrypt outer layer (X25519)
        const decrypted1 = sodium.crypto_aead_chacha20poly1305_decrypt(
            null,
            sodium.from_base64(encrypted.content),
            null,
            sodium.from_base64(encrypted.nonce2),
            sharedSecret2
        );

        // Decrypt inner layer (Kyber)
        const decrypted2 = sodium.crypto_aead_chacha20poly1305_decrypt(
            null,
            decrypted1,
            null,
            sodium.from_base64(encrypted.nonce1),
            sharedSecret1
        );

        // Parse the final decrypted content
        const pasteContent: PasteContent = JSON.parse(
            sodium.to_string(decrypted2)
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