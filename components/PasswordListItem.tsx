import React from "react"

import { useFirestoreDoc } from "~firebase/use-firestore-doc"
import type { Password } from "~models/Passwords"

interface PasswordListItemProps {
  index: number
  refId: string
  setOpenPassword: React.Dispatch<React.SetStateAction<string>>
}

const PasswordListItem = ({
  index,
  refId,
  setOpenPassword
}: PasswordListItemProps) => {
  const { data: password } = useFirestoreDoc<Password>(`passwords/${refId}`)
  const website = password?.url.split("://")[1].split("/")[0]
  return (
    <div
      onClick={() => setOpenPassword(refId)}
      className="password-list-item"
      key={index}>
      <div>{index + 1}.</div>
      <div>
        <b>{`${website}(${password?.name})`}</b>
      </div>
      <div>{password?.name}</div>
    </div>
  )
}

export default PasswordListItem
