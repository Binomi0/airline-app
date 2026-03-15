/**
 * WebAuthn PRF (Pseudo-Random Function) Extension types.
 * Based on the WebAuthn Level 3 specification.
 */

export interface WeiflyPRFExtensionInputs {
  eval?: {
    first: BufferSource
    second?: BufferSource
  }
  evalByCredential?: {
    [credentialId: string]: {
      first: BufferSource
      second?: BufferSource
    }
  }
}

export interface WeiflyPRFExtensionOutputs {
  enabled?: boolean
  results?: {
    first: ArrayBuffer
    second?: ArrayBuffer
  }
}
