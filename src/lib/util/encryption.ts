import { MlKem1024 } from 'mlkem';
import _sodium from 'libsodium-wrappers';

export interface EncryptedData {
    content: string;        // The actual encrypted message
    ciphertext1?: string;   // Quantum encryption data (only in quantum mode)
    ciphertext2: string;    // Encrypted shared secret
    nonce1?: string;        // Random nonce for quantum layer
    nonce2: string;         // Random nonce for classical layer
    version: '1';          
}

export interface PasteContent {
    content: string;
    burnToken?: string;
}

export async function encrypt(
    content: string,
    burnToken?: string,
    useQuantum: boolean = false
): Promise<{
    encrypted: EncryptedData;
    decryptionKey: string;
}> {
    await _sodium.ready;
    const sodium = _sodium;

    if (useQuantum) {
        // Quantum-resistant + Classical encryption mode
        
        // Layer 1: Quantum-resistant encryption using MLKEM-1024 (Kyber)
        // - Generates a quantum-resistant keypair
        // - Encapsulates a shared secret that will be used for symmetric encryption
        const kyber = new MlKem1024();
        const [publicKey1, secretKey1] = await kyber.generateKeyPair();
        const [ciphertext1, sharedSecret1] = await kyber.encap(publicKey1);

        // Layer 2: Classical asymmetric encryption using X25519
        // - Generates a classical keypair
        // - Creates a random shared secret for symmetric encryption
        const keypair2 = sodium.crypto_box_keypair();
        const publicKey2 = keypair2.publicKey;
        const secretKey2 = keypair2.privateKey;
        const sharedSecret2 = sodium.randombytes_buf(32); // 256-bit random key
        
        // Generate unique nonces (numbers used once) for each encryption layer
        // - Nonces ensure that the same key can be safely used multiple times
        // - Each encryption needs its own unique nonce
        const nonce1 = sodium.randombytes_buf(sodium.crypto_aead_chacha20poly1305_NPUBBYTES);
        const nonce2 = sodium.randombytes_buf(sodium.crypto_aead_chacha20poly1305_NPUBBYTES);

        // Prepare the content for encryption
        const pasteContent: PasteContent = {
            content,
            burnToken: burnToken
        };

        // First encryption layer using Kyber's shared secret
        // - Uses ChaCha20-Poly1305 symmetric encryption
        // - Encrypts with the quantum-resistant shared secret
        const encrypted1 = sodium.crypto_aead_chacha20poly1305_encrypt(
            sodium.from_string(JSON.stringify(pasteContent)), 
            null, null, nonce1, sharedSecret1
        );

        // Second encryption layer using X25519's shared secret
        // - Adds classical encryption layer for defense in depth
        const encrypted2 = sodium.crypto_aead_chacha20poly1305_encrypt(
            encrypted1, 
            null, null, nonce2, sharedSecret2
        );

        return {
            encrypted: {
                content: sodium.to_base64(encrypted2),                    // Double-encrypted content
                ciphertext1: sodium.to_base64(ciphertext1),              // Quantum encapsulated key
                ciphertext2: sodium.to_base64(sodium.crypto_box_seal(    // Classical encrypted shared secret
                    sharedSecret2, publicKey2
                )),
                nonce1: sodium.to_base64(nonce1),
                nonce2: sodium.to_base64(nonce2),
                version: '1',
            },
            // Combine all keys needed for decryption into one string
            decryptionKey: sodium.to_base64(
                new Uint8Array([
                    ...Array.from(secretKey1),    // Quantum secret key
                    ...Array.from(secretKey2),    // Classical secret key
                    ...Array.from(publicKey2)     // Classical public key (needed for unsealing)
                ])
            )
        };
    } else {
        // Classical-only encryption mode using X25519
        
        // Generate keypair for asymmetric encryption
        const keypair = sodium.crypto_box_keypair();
        const publicKey = keypair.publicKey;
        const secretKey = keypair.privateKey;
        
        // Generate random shared secret and nonce for symmetric encryption
        const sharedSecret = sodium.randombytes_buf(32);  // 256-bit random key
        const nonce = sodium.randombytes_buf(sodium.crypto_aead_chacha20poly1305_NPUBBYTES);

        // Prepare the content
        const pasteContent: PasteContent = { 
            content,
            burnToken: burnToken
        };

        // Encrypt the content using ChaCha20-Poly1305 symmetric encryption
        // - Fast and efficient for large amounts of data
        // - Uses the random shared secret as the key
        const encrypted = sodium.crypto_aead_chacha20poly1305_encrypt(
            sodium.from_string(JSON.stringify(pasteContent)), 
            null, null, nonce, sharedSecret
        );

        return {
            encrypted: {
                content: sodium.to_base64(encrypted),                  // Encrypted content
                ciphertext2: sodium.to_base64(sodium.crypto_box_seal( // Encrypted shared secret
                    sharedSecret, publicKey
                )),
                nonce2: sodium.to_base64(nonce),
                version: '1',
            },
            // Combine both keys needed for decryption into one string
            decryptionKey: sodium.to_base64(
                new Uint8Array([
                    ...Array.from(secretKey),     // Secret key for unsealing
                    ...Array.from(publicKey)      // Public key for unsealing
                ])
            )
        };
    }
}