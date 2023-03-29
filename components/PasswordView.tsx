import React from "react"

import { useFirestoreDoc } from "~firebase/use-firestore-doc"
import type { Password } from "~models/Passwords"

const PasswordView = ({ refId }: { refId: string }) => {
  const { data: password } = useFirestoreDoc<Password>(`passwords/${refId}`)
  return <h3>{password?.name}</h3>
}

export default PasswordView
