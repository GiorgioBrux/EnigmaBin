import { MlKem1024 } from 'mlkem';
import _sodium from 'libsodium-wrappers';

export interface EncryptedData {
    content: string;
    ciphertext1: string;
    ciphertext2: string;
    nonce1: string;
    nonce2: string;
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
    const { pasteId, burnToken } = await (await fetch('/api/paste/init', { method: 'POST' })).json();
    
    // Layer 1: Quantum-resistant KEM (Kyber)
    const kyber = new MlKem1024();
    const [publicKey1, secretKey1] = await kyber.generateKeyPair();
    const [ciphertext1, sharedSecret1] = await kyber.encap(publicKey1);

    // Layer 2: Classical asymmetric encryption (X25519)
    const keypair2 = sodium.crypto_box_keypair();
    const publicKey2 = keypair2.publicKey;
    const secretKey2 = keypair2.privateKey;
    const sharedSecret2 = sodium.randombytes_buf(32); // 256-bit key
    
    // Generate nonces
    const nonce1 = sodium.randombytes_buf(sodium.crypto_aead_chacha20poly1305_NPUBBYTES);
    const nonce2 = sodium.randombytes_buf(sodium.crypto_aead_chacha20poly1305_NPUBBYTES);

    // Package content
    const pasteContent: PasteContent = {
        content,
        burnOnView,
        burnToken
    };

    // First encryption layer using Kyber's shared secret
    const encrypted1 = sodium.crypto_aead_chacha20poly1305_encrypt(
        sodium.from_string(JSON.stringify(pasteContent)), 
        null, null, nonce1, sharedSecret1
    );

    // Second encryption layer using X25519's shared secret
    const encrypted2 = sodium.crypto_aead_chacha20poly1305_encrypt(
        encrypted1, 
        null, null, nonce2, sharedSecret2
    );

    return {
        pasteId,
        encrypted: {
            content: sodium.to_base64(encrypted2),
            ciphertext1: sodium.to_base64(ciphertext1),
            ciphertext2: sodium.to_base64(sodium.crypto_box_seal(sharedSecret2, publicKey2)),
            nonce1: sodium.to_base64(nonce1),
            nonce2: sodium.to_base64(nonce2),
            version: '1'
        },
        // Combine keys using a simpler approach
        decryptionKey: sodium.to_base64(
            new Uint8Array([
                ...Array.from(secretKey1),
                ...Array.from(secretKey2),
                ...Array.from(publicKey2)
            ])
        )
    };
}