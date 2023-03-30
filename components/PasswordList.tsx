import type { User } from "firebase/auth"
import React, { useContext, useEffect } from "react"

import { useFirestoreDoc } from "~firebase/use-firestore-doc"
import type { Password, PasswordsFirebaseDocument } from "~models/Passwords"

import NewPassword from "./NewPassword"
import PasswordListItem from "./PasswordListItem"
import { KeyContext } from "./PasswordStore"
import PasswordView from "./PasswordView"
import { rsa_decrypt, str2ab } from "./cryptography"

interface PasswordListProps {
  user: User
}

const PasswordList = ({ user }: PasswordListProps) => {
  const {
    data: passwordList,
    setData: setPasswordList,
    isReady: isListReady
  } = useFirestoreDoc<PasswordsFirebaseDocument>(
    user?.uid && `passwords/${user.uid}`
  )

  function addPasswordToList(_data: string) {
    if (passwordList) {
      const passwordsArray = passwordList.passwords
      passwordsArray.push(_data)
      setPasswordList({
        passwords: passwordsArray
      })
    }
  }

  const [addNew, setAddNew] = React.useState<boolean>(false)
  const [searchQuery, setSearchQuery] = React.useState<string>("")

  const [passwords, setPasswords] = React.useState<Password[]>([])

  const rsaPair = useContext(KeyContext)

  useEffect(() => {
    if (user && !passwordList) {
      setPasswordList({
        passwords: []
      })
    } else if (passwordList) {
      const passwordsArray = passwordList.passwords
      passwordsArray
        .map(async (encryptedPassword) => {
          const password = await rsa_decrypt(
            str2ab(window.atob(encryptedPassword)),
            rsaPair.privateKey
          )
          return password
        })
        .forEach((password) => {
          password.then((decypted) =>
            setPasswords((prev) => [...prev, JSON.parse(decypted)])
          )
        })
    }
  }, [isListReady, addNew])

  const [openPassword, setOpenPassword] = React.useState<Password | null>(null)

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
              password={openPassword}
              setOpenPassword={setOpenPassword}
            />
          ) : (
            <>
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
              {passwords
                .filter((password) => {
                  if (searchQuery === "") return true
                  alert(password.url)
                  const website = password.url.split("://")[1].split("/")[0]
                  return (
                    website.includes(searchQuery) ||
                    password.username.includes(searchQuery) ||
                    password.name.includes(searchQuery) ||
                    password.notes.includes(searchQuery)
                  )
                })
                .map((password, index) => (
                  <PasswordListItem
                    key={index}
                    index={index}
                    password={password}
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
