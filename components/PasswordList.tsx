import type { User } from "firebase/auth"
import React, { useEffect } from "react"

import { useFirestoreDoc } from "~firebase/use-firestore-doc"
import type { PasswordsFirebaseDocument } from "~models/Passwords"

import NewPassword from "./NewPassword"
import PasswordView from "./PasswordView"

interface PasswordListProps {
  user: User
}

const PasswordList = ({ user }: PasswordListProps) => {
  const {
    data: passwordList,
    setData: setPasswordList,
    isReady: isListReady
  } = useFirestoreDoc<PasswordsFirebaseDocument>(
    user?.uid && `userpasswords/${user.uid}`
  )

  function addPasswordToList(_data: string) {
    if (passwordList) {
      const passwords = passwordList.passwords
      passwords.push(_data)
      setPasswordList({
        passwords
      })
    }
  }

  const [addNew, setAddNew] = React.useState<boolean>(false)

  useEffect(() => {
    if (user && !passwordList) {
      setPasswordList({
        passwords: []
      })
    }
  }, [isListReady])

  return (
    <div>
      {addNew ? (
        <NewPassword
          setOpen={setAddNew}
          addPasswordToList={addPasswordToList}
        />
      ) : (
        <>
          <button onClick={() => setAddNew(true)}>Add New</button>
          {passwordList?.passwords.map((refId, index) => (
            <PasswordView refId={refId} />
          ))}
        </>
      )}
    </div>
  )
}

export default PasswordList
