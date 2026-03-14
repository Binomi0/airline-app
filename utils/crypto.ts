/**
 * Utility for client-side encryption using WebAuthn PRF extension.
 * Derives a key from the PRF output to encrypt/decrypt sensitive data.
 */

const SALT = new TextEncoder().encode('weifly-self-sovereign-vault-v1')

/**
 * Derives a CryptoKey from the PRF result (Hmac-Secret).
 * @param prfResult The raw buffer returned by the authenticator PRF extension.
 */
export async function deriveKeyFromPRF(prfResult: ArrayBuffer): Promise<CryptoKey> {
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    prfResult as unknown as BufferSource, // Cast to unknown as BufferSource
    { name: 'HKDF' },
    false,
    ['deriveKey', 'deriveBits']
  )

  return window.crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      salt: SALT as BufferSource,
      info: new TextEncoder().encode('vault-encryption') as BufferSource,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * Encrypts data using AES-GCM.
 * @param plaintext The string to encrypt.
 * @param key The Derived CryptoKey.
 */
export async function encryptVault(plaintext: string, key: CryptoKey): Promise<{ ciphertext: string; iv: string }> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(plaintext)

  // SubtleCrypto expects BufferSource
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as unknown as BufferSource },
    key,
    encoded as unknown as BufferSource
  )

  return {
    ciphertext: Buffer.from(ciphertextBuffer).toString('base64'),
    iv: Buffer.from(iv).toString('base64')
  }
}

/**
 * Decrypts data using AES-GCM.
 * @param ciphertext Base64 encoded ciphertext.
 * @param key The Derived CryptoKey.
 * @param iv Base64 encoded initialization vector.
 */
export async function decryptVault(ciphertext: string, key: CryptoKey, iv: string): Promise<string> {
  const ivBuffer = Uint8Array.from(Buffer.from(iv, 'base64'))
  const ciphertextBuffer = Uint8Array.from(Buffer.from(ciphertext, 'base64'))

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBuffer as BufferSource },
    key,
    ciphertextBuffer as BufferSource
  )

  return new TextDecoder().decode(decryptedBuffer)
}
