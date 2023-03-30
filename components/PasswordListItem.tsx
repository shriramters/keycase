import React from "react"

import { useFirestoreDoc } from "~firebase/use-firestore-doc"
import type { Password } from "~models/Passwords"

import { PasswordsContext } from "./PasswordList"

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
  const { data: password, isReady: isPasswordReady } =
    useFirestoreDoc<Password>(`passwords/${refId}`)
  // use password context to append the password to the list
  const { passwords, setPasswords } = React.useContext(PasswordsContext)

  React.useEffect(() => {
    if (password) {
      const passwordData = { password, refId }
      if (!passwords) setPasswords([passwordData])
      else setPasswords([...passwords, passwordData])
    }
  }, [isPasswordReady])

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
