import React from "react"

import type { Password } from "../models/Passwords"
import { KeyContext } from "./PasswordStore"

interface NewPasswordProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  addPasswordToList: (_data: Password) => void
}

const NewPassword = ({ setOpen, addPasswordToList }: NewPasswordProps) => {
  const rsaPair = React.useContext(KeyContext)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    // create Password Document
    const newPasswordDoc: Password = {
      name: data.name.toString(),
      username: data.username.toString(),
      password: data.password.toString(),
      url: data.url.toString(),
      notes: data.notes.toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    addPasswordToList(newPasswordDoc)
    setOpen(false)
  }

  return (
    <div>
      <div className="title-bar">
        <h3>New Password</h3>
        <button onClick={() => setOpen(false)}>Back</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" name="name" required />
        <input type="text" placeholder="Username" name="username" required />
        <input type="password" placeholder="Password" name="password" required />
        <input type="url" placeholder="URL" name="url" required />
        <input type="text" placeholder="Notes" name="notes" />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default NewPassword
