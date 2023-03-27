import React from "react"

import type { AuthFirebaseDocument } from "~models/AuthData"

import type { Password } from "../models/Password"
import Button from "./Button"
import { ab2str, deriveKey, sha256hash } from "./cryptography"

interface PasswordStoreProps {
  authData: AuthFirebaseDocument
}

// Used to retrieve all the stored passwords
// from firebase and display them in a list once the master password is entered
const PasswordStore = ({ authData }: PasswordStoreProps) => {
  const [masterPassword, setMasterPassword] = React.useState("")
  const [passwords, setPasswords] = React.useState<Password[]>([])
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
      setAuthenticated(true)
    } else {
      setError("Incorrect password")
    }

    //if correct, get passwords from firebase

    // derive the key from the master password
    //const key = deriveKey(masterPassword, salt)

    // get the encrypted passwords from firebase
    // decrypt the passwords
    // set the passwords state
  }

  return (
    <div id="password-store">
      {authenticated ? (
        "Authenticated!"
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
            <Button type="submit">Submit</Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default PasswordStore
