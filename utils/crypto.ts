/**
 * Utility for client-side encryption using WebAuthn PRF extension.
 * Derives a key from the PRF output to encrypt/decrypt sensitive data.
 */

const SALT = new TextEncoder().encode('weifly-self-sovereign-vault-v1')

/**
 * Converts an ArrayBuffer to a Base64 string.
 */
function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

/**
 * Converts a Base64 string to a Uint8Array.
 */
function base64ToUint8Array(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
}

/**
 * Derives a CryptoKey from the PRF result (Hmac-Secret).
 * @param prfResult The raw buffer returned by the authenticator PRF extension.
 */
export async function deriveKeyFromPRF(prfResult: ArrayBuffer): Promise<CryptoKey> {
  const baseKey = await window.crypto.subtle.importKey('raw', prfResult, { name: 'HKDF' }, false, [
    'deriveKey',
    'deriveBits'
  ])

  return window.crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      salt: SALT as unknown as BufferSource,
      info: new TextEncoder().encode('vault-encryption') as unknown as BufferSource,
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

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as unknown as BufferSource },
    key,
    encoded as unknown as BufferSource
  )

  return {
    ciphertext: bufferToBase64(ciphertextBuffer),
    iv: bufferToBase64(iv.buffer)
  }
}

/**
 * Decrypts data using AES-GCM.
 * @param ciphertext Base64 encoded ciphertext.
 * @param key The Derived CryptoKey.
 * @param iv Base64 encoded initialization vector.
 */
export async function decryptVault(ciphertext: string, key: CryptoKey, iv: string): Promise<string> {
  const ivBuffer = base64ToUint8Array(iv)
  const ciphertextBuffer = base64ToUint8Array(ciphertext)

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBuffer as unknown as BufferSource },
    key,
    ciphertextBuffer as unknown as BufferSource
  )

  return new TextDecoder().decode(decryptedBuffer)
}
