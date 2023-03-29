import type { User } from "firebase/auth"
import React, { useEffect } from "react"

import { useFirestoreDoc } from "~firebase/use-firestore-doc"
import type { Password, PasswordsFirebaseDocument } from "~models/Passwords"

import NewPassword from "./NewPassword"
import PasswordListItem from "./PasswordListItem"
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

  const [openPassword, setOpenPassword] = React.useState<string | null>(null)

  return (
    <div>
      {addNew ? (
        <NewPassword
          setOpen={setAddNew}
          addPasswordToList={addPasswordToList}
        />
      ) : (
        <>
          {!!openPassword ? (
            <PasswordView
              refId={openPassword}
              setOpenPassword={setOpenPassword}
            />
          ) : (
            <>
              <button onClick={() => setAddNew(true)}>Add New</button>
              {passwordList?.passwords.map((refId, index) => (
                <PasswordListItem
                  index={index}
                  refId={refId}
                  setOpenPassword={setOpenPassword}
                />
              ))}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default PasswordList
