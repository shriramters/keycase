import type { User } from "firebase/auth"
import React, { useEffect } from "react"

import { useFirestoreDoc } from "~firebase/use-firestore-doc"
import type { Password, PasswordsFirebaseDocument } from "~models/Passwords"

import NewPassword from "./NewPassword"
import PasswordListItem from "./PasswordListItem"
import PasswordView from "./PasswordView"

export const PasswordsContext = React.createContext<{
  passwords: { password: Password; refId: string }[]
  setPasswords: React.Dispatch<
    React.SetStateAction<{ password: Password; refId: string }[]>
  >
} | null>(null)

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
  const [searchQuery, setSearchQuery] = React.useState<string>("")

  const [passwords, setPasswords] = React.useState<
    { password: Password; refId: string }[] | null
  >(null)

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
            <PasswordsContext.Provider value={{ passwords, setPasswords }}>
              <div className="title-bar">
                <input
                  type="text"
                  placeholder="Search"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                />
                <button onClick={() => setAddNew(true)}>Add New</button>
              </div>
              {passwordList?.passwords
                .filter((refId) => {
                  if (searchQuery === "") return true
                  const password = passwords?.find(
                    (password) => password.refId === refId
                  )?.password
                  if (!password) return false
                  const website = password.url.split("://")[1].split("/")[0]
                  return (
                    website.includes(searchQuery) ||
                    password.username.includes(searchQuery) ||
                    password.name.includes(searchQuery)
                  )
                })
                .map((refId, index) => (
                  <PasswordListItem
                    key={index}
                    index={index}
                    refId={refId}
                    setOpenPassword={setOpenPassword}
                  />
                ))}
            </PasswordsContext.Provider>
          )}
        </>
      )}
    </div>
  )
}

export default PasswordList
