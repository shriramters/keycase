const pbkdf2_iterations = 100000; // TODO: replace with appsettings value

function getKeyMaterial(password: string) {
  const encoder = new TextEncoder()
  return window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  )
}

export async function deriveKey(masterPassword: string, salt: ArrayBuffer) {
  const keyMaterial = await getKeyMaterial(masterPassword)
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: pbkdf2_iterations,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  )
}

export function aes_encrypt(plaintext: string, iv: ArrayBuffer, key: CryptoKey) {
  const encoder = new TextEncoder()
  const encoded = encoder.encode(plaintext)
  return window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded)
}

export async function aes_decrypt(
  ciphertext: ArrayBuffer,
  iv: ArrayBuffer,
  key: CryptoKey
) {
  try {
    let decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      ciphertext
    )
    let decoder = new TextDecoder()
    return decoder.decode(decrypted)
  } catch (e) {
    return null
  }
}

export function sha256hash(data: string, salt: string) {
  return window.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(data + salt)
  )
}

// util functions

export function ab2str(buf: ArrayBuffer) {
  return String.fromCharCode.apply(null, new Uint8Array(buf))
}
