import { Timestamp } from "firebase/firestore"
import React from "react"

import { useFirestoreDoc } from "~firebase/use-firestore-doc"
import type { Password, PasswordsFirebaseDocument } from "~models/Passwords"

interface NewPasswordProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  addPasswordToList: (_data: string) => void
}

const NewPassword = ({ setOpen, addPasswordToList }: NewPasswordProps) => {
  const randomid =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)

  const { setData: setPassword } = useFirestoreDoc<Password>(
    `passwords/${randomid}`
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    // create Password Document
    const newPasswordDoc = {
      name: data.name.toString(),
      username: data.username.toString(),
      password: data.password.toString(),
      url: data.url.toString(),
      notes: data.notes.toString(),
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date())
    }
    setPassword(newPasswordDoc)

    // add password id to password list for user
    addPasswordToList(randomid)

    setOpen(false)
  }

  return (
    <div>
      <h3>New Password</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" name="name" />
        <input type="text" placeholder="Username" name="username" />
        <input type="password" placeholder="Password" name="password" />
        <input type="url" placeholder="URL" name="url" />
        <input type="text" placeholder="Notes" name="notes" />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default NewPassword
