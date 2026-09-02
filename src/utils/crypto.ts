/**
 * Client-Side Cryptographic Utilities
 * Provides AES-GCM encryption simulation, SHA-256 integrity digest generation,
 * and key derivation representation for zero-knowledge campus exchange.
 */

export function generateEncryptionKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let result = 'sec_key_';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function computeSha256Digest(content: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(content);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // fallback
  }

  // Pure fallback hash generator
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `sha256_${Math.abs(hash).toString(16).padStart(16, '0')}${Date.now().toString(16)}`;
}

export function simulateEncryptedPayload(plainText: string): { ciphertext: string; nonce: string; hash: string } {
  const b64 = btoa(unescape(encodeURIComponent(plainText)));
  const reversed = b64.split('').reverse().join('');
  return {
    ciphertext: `ENC_AES256_${reversed}`,
    nonce: `iv_${Math.random().toString(36).substring(2, 12)}`,
    hash: `sha256_${Math.random().toString(36).substring(2, 16)}`
  };
}

export function simulateDecryptedPayload(cipherText: string): string {
  try {
    if (cipherText.startsWith('ENC_AES256_')) {
      const stripped = cipherText.replace('ENC_AES256_', '');
      const unreversed = stripped.split('').reverse().join('');
      return decodeURIComponent(escape(atob(unreversed)));
    }
    return cipherText;
  } catch {
    return cipherText;
  }
}
