import React from "react"

import { useFirestoreDoc } from "~firebase/use-firestore-doc"
import type { Password } from "~models/Passwords"

interface PasswordViewProps {
  refId: string
  setOpenPassword: React.Dispatch<React.SetStateAction<string>>
}

const PasswordView = ({ refId, setOpenPassword }: PasswordViewProps) => {
  const { data: password } = useFirestoreDoc<Password>(`passwords/${refId}`)
  return (
    <div>
      <dl>
        <dt>Name</dt>
        <dd>{password?.name}</dd>
        <dt>Username</dt>
        <dd>
          {" "}
          <input type="text" value={password?.username} readOnly />
          <button
            onClick={() => navigator.clipboard.writeText(password?.username)}>
            Copy
          </button>
        </dd>
        <dt>Password</dt>
        <dd>
          <>
            <input type="password" value={password?.password} readOnly />
            <button
              onClick={() => navigator.clipboard.writeText(password?.password)}>
              Copy
            </button>
          </>
        </dd>
        <dt>Notes</dt>
        <dd>{password?.notes}</dd>
        <dt>URL</dt>
        <dd>{password?.url} </dd>
        <dt>Created At</dt>
        <dd>{password?.createdAt.toDate().toLocaleString()}</dd>
        <dt>Updated At</dt>
        <dd>{password?.updatedAt.toDate().toLocaleString()}</dd>
      </dl>
      <button onClick={() => setOpenPassword(null)}>Back</button>
    </div>
  )
}

export default PasswordView
