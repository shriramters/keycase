// component to set master password

import type { User } from "firebase/auth"
import React from "react"

import type { AuthFirebaseDocument } from "~models/AuthData"

import Button from "./Button"
import { ab2str, aes_encrypt, deriveKey, sha256hash } from "./cryptography"

interface OnboardProps {
  setOnboarding: React.Dispatch<React.SetStateAction<boolean>>
  setAuthData: React.Dispatch<React.SetStateAction<AuthFirebaseDocument>>
  user: User
}

const Onboard = ({ setOnboarding, user, setAuthData }: OnboardProps) => {
  const [masterPassword, setMasterPassword] = React.useState("")
  const [masterPasswordConfirm, setMasterPasswordConfirm] = React.useState("")

  const onMasterPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMasterPassword(e.target.value)
  }

  const onMasterPasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMasterPasswordConfirm(e.target.value)
  }

  const onMasterPasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    const authData = await makeAuthDocument(masterPassword)

    setAuthData(authData)
    setOnboarding(false)
  }

  return (
    <div id="onboarding">
      <form onSubmit={onMasterPasswordSubmit}>
        <h3>Choose a master password</h3>
        <input
          type="password"
          placeholder="Master Password"
          value={masterPassword}
          onChange={onMasterPasswordChange}
        />
        <input
          type="password"
          placeholder="Confirm Master Password"
          value={masterPasswordConfirm}
          onChange={onMasterPasswordConfirmChange}
        />
        <div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  )
}

export default Onboard

async function makeAuthDocument(masterPassword: string) {
  // derive the key from the master password
  const salt = window.crypto.getRandomValues(new Uint8Array(16))
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(masterPassword, salt)
  const rsaPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },
    true,
    ["encrypt", "decrypt"]
  )
  const rsaPublicKey = await window.crypto.subtle.exportKey(
    "spki",
    rsaPair.publicKey
  )

  const rsaPrivateKey = await window.crypto.subtle.exportKey(
    "pkcs8",
    rsaPair.privateKey
  )

  const encryptedPrivateKey = await aes_encrypt(
    window.btoa(ab2str(rsaPrivateKey)),
    iv,
    key
  )

  const hashedPassword = await sha256hash(
    masterPassword,
    window.btoa(ab2str(salt))
  )

  const authData: AuthFirebaseDocument = {
    RSAPublicKey: window.btoa(ab2str(rsaPublicKey)),
    encryptedRSAPrivateKey: window.btoa(ab2str(encryptedPrivateKey)),
    masterPasswordSalt: window.btoa(ab2str(salt)),
    masterPasswordHash: window.btoa(ab2str(hashedPassword))
  }

  return authData
}
