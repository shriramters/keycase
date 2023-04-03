import type React from "react"

import type { Password } from "~models/Passwords"

interface PasswordViewProps {
  password: Password
  setOpenPassword: React.Dispatch<React.SetStateAction<Password | null>>
}

const PasswordView = ({ password, setOpenPassword }: PasswordViewProps) => {
  const showPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    const input = document.querySelector(
      "input[type=password]"
    ) as HTMLInputElement
    input.type = "text"
  }

  const hidePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    const input = document.querySelector("#password-field") as HTMLInputElement
    input.type = "password"
  }

  // parameter can be either password or username
  const copyToClipboard = (target: "password" | "username") => {
    if (target === "password") {
      const input = document.querySelector(
        "#password-field"
      ) as HTMLInputElement
      navigator.clipboard.writeText(input.value)
      //set copied to true
      const copyButton = document.querySelector(
        "#copy-password"
      ) as HTMLButtonElement
      copyButton.innerText = "Copied!"
      setTimeout(() => {
        copyButton.innerText = "Copy"
      }, 2000)
    } else {
      const input = document.querySelector(
        "#username-field"
      ) as HTMLInputElement
      navigator.clipboard.writeText(input.value)
      //set copied to true
      const copyButton = document.querySelector(
        "#copy-username"
      ) as HTMLButtonElement
      copyButton.innerText = "Copied!"
      setTimeout(() => {
        copyButton.innerText = "Copy"
      }, 2000)
    }
  }

  return (
    <div>
      <dl>
        <dt>Name</dt>
        <dd>{password?.name}</dd>
        <dt>Username</dt>
        <dd>
          <input
            type="text"
            value={password?.username}
            id="username-field"
            readOnly
          />
          <button
            id="copy-username"
            onClick={() => copyToClipboard("username")}>
            Copy
          </button>
        </dd>
        <dt>Password</dt>
        <dd>
          <>
            <input
              type="password"
              id="password-field"
              value={password?.password}
              readOnly
            />
            <button
              onMouseLeave={hidePassword}
              onMouseUp={hidePassword}
              onMouseDown={showPassword}>
              Show
            </button>
            <button
              id="copy-password"
              onClick={() => copyToClipboard("password")}>
              Copy
            </button>
          </>
        </dd>
        <dt>Notes</dt>
        <dd>{password?.notes == "" ? "No Notes" : password?.notes}</dd>
        <dt>URL</dt>
        <dd>{password?.url} </dd>
        <dt>Created At</dt>
        <dd>{password?.createdAt.toLocaleString()}</dd>
        <dt>Updated At</dt>
        <dd>{password?.updatedAt.toLocaleString()}</dd>
      </dl>
      <button onClick={() => setOpenPassword(null)}>Back</button>
    </div>
  )
}

export default PasswordView
