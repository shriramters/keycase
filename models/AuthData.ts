export interface IAuthData {
    encryptedRSAPrivateKey: ArrayBuffer;
    masterPasswordSalt: ArrayBuffer;
    masterPasswordHash: string;
    RSAPublicKey: CryptoKey;
}
