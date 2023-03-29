import type { User } from "firebase/auth"
import React from "react"

import type { AuthFirebaseDocument } from "~models/AuthData"

import PasswordList from "./PasswordList"
import {
  ab2str,
  deriveKey,
  sha256hash,
  str2ab,
  unwrapKey
} from "./cryptography"

interface PasswordStoreProps {
  authData: AuthFirebaseDocument
  user: User
}

const KeyContext = React.createContext<CryptoKeyPair | null>(null)

// Used to retrieve all the stored passwords
// from firebase and display them in a list once the master password is entered
const PasswordStore = ({ authData, user }: PasswordStoreProps) => {
  const [masterPassword, setMasterPassword] = React.useState("")
  const [keyPair, setKeyPair] = React.useState<CryptoKeyPair | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const [authenticated, setAuthenticated] = React.useState(false)

  const onMasterPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMasterPassword(e.target.value)
  }

  const onMasterPasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    const hash = await sha256hash(masterPassword, authData.masterPasswordSalt)

    //verify hash of master password

    const masterPasswordHash = authData.masterPasswordHash

    if (masterPasswordHash == window.btoa(ab2str(hash))) {
      const aes_key = await deriveKey(
        masterPassword,
        str2ab(window.atob(authData.masterPasswordSalt))
      )
      const rsaPrivateKey = await unwrapKey(
        str2ab(window.atob(authData.encryptedRSAPrivateKey)),
        aes_key,
        str2ab(window.atob(authData.iv))
      )

      const rsaPublicKey = await window.crypto.subtle.importKey(
        "spki",
        str2ab(window.atob(authData.RSAPublicKey)),
        {
          name: "RSA-OAEP",
          hash: "SHA-256"
        },
        true,
        ["encrypt"]
      )

      const rsaPair: CryptoKeyPair = {
        privateKey: rsaPrivateKey,
        publicKey: rsaPublicKey
      }

      setKeyPair(rsaPair)
      setAuthenticated(true)
    } else {
      setError("Incorrect password")
    }
  }

  return (
    <div id="password-store">
      {authenticated && keyPair ? (
        <KeyContext.Provider value={keyPair}>
          <PasswordList user={user} />
        </KeyContext.Provider>
      ) : (
        <form onSubmit={onMasterPasswordSubmit}>
          {error && <div className="error">{error}</div>}
          <h3>Enter your master password</h3>
          <input
            type="password"
            placeholder="Master Password"
            value={masterPassword}
            onChange={onMasterPasswordChange}
          />
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default PasswordStore
