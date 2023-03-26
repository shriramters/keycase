import React from "react"

import type { Password } from "../models/Password"
import { deriveKey } from "./cryptography"

interface PasswordStoreProps {
  salt: ArrayBuffer
}

// Used to retrieve all the stored passwords
// from firebase and display them in a list once the master password is entered
const PasswordStore = ({ salt }: PasswordStoreProps) => {
  const [masterPassword, setMasterPassword] = React.useState("")
  const [passwords, setPasswords] = React.useState<Password[]>([])

  const onMasterPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMasterPassword(e.target.value)
  }

  const onMasterPasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // derive the key from the master password
    const key = deriveKey(masterPassword, salt)

    // get the encrypted passwords from firebase
    // decrypt the passwords
    // set the passwords state
  }
}

export default PasswordStore
