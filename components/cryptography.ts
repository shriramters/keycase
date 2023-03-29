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
    ["wrapKey", "unwrapKey"]
  )
}

export async function generateRSAPair() {
  return window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },
    true,
    ["encrypt", "decrypt"]
  )
}

export async function wrapKey(keyToWrap: CryptoKey, aes_key: CryptoKey, iv: ArrayBuffer) {
  return await window.crypto.subtle.wrapKey(
    "pkcs8",
    keyToWrap,
    aes_key,
    {
      name: "AES-GCM",
      iv
    }
  )
}

export async function unwrapKey(
  wrappedKey: ArrayBuffer,
  aes_key: CryptoKey,
  iv: ArrayBuffer
) {
  return await window.crypto.subtle.unwrapKey(
    "pkcs8",
    wrappedKey,
    aes_key,
    {
      name: "AES-GCM",
      iv
    },
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    true,
    ["decrypt"]
  )
}


export function sha256hash(data: string, salt: string) {
  return window.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(data + salt)
  )
}

export function rsa_encrypt(data: string, key: CryptoKey) {
  return window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP"
    },
    key,
    new TextEncoder().encode(data)
  )
}

export async function rsa_decrypt(data: ArrayBuffer, key: CryptoKey) {
  const decrypted_ab = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP"
    },
    key,
    data
  )
  return new TextDecoder().decode(decrypted_ab)
}



// util functions

export function ab2str(buf: ArrayBuffer) {
  return String.fromCharCode.apply(null, new Uint8Array(buf))
}

export function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length)
  const bufView = new Uint8Array(buf)
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}
