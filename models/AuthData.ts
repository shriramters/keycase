export interface IAuthData {
    encryptedRSAPrivateKey: ArrayBuffer;
    masterPasswordSalt: ArrayBuffer;
    masterPasswordHash: string;
    RSAPublicKey: CryptoKey;
}

export interface AuthFirebaseDocument {
    masterPasswordSalt: string
    encryptedRSAPrivateKey: string
    RSAPublicKey: string
    masterPasswordHash: string
  }