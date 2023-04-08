import type { User } from "firebase/auth"
import React, { useContext, useEffect } from "react"

import { useFirestoreDoc } from "~firebase/use-firestore-doc"
import type { Password, PasswordsFirebaseDocument } from "~models/Passwords"

import NewPassword from "./NewPassword"
import PasswordListItem from "./PasswordListItem"
import { KeyContext } from "./PasswordStore"
import PasswordView from "./PasswordView"
import { ab2str, rsa_decrypt, rsa_encrypt, str2ab } from "./cryptography"

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

  async function addPasswordToList(passwordDoc: Password) {
    if (passwordList) {
      // encrypt password
      const encryptedPassword = await rsa_encrypt(
        JSON.stringify(passwordDoc),
        rsaPair.publicKey
      )
      const passwordsArray = passwordList.passwords
      passwordsArray.push(window.btoa(ab2str(encryptedPassword)))
      setPasswordList({
        passwords: passwordsArray
      })
      setPasswords((prev) => [...prev, passwordDoc])
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
  }, [isListReady])

  const [openPassword, setOpenPassword] = React.useState<Password | null>(null)

  const deletePassword = async (passwordDoc: Password) => {
    const passwordIdx = passwords.findIndex((pass) => pass === passwordDoc)
    const filteredPasswords = passwordList.passwords.filter(
      (_, idx) => idx !== passwordIdx
    ) // remove from array based on index

    setPasswordList({
      passwords: filteredPasswords
    }) // remove from firestore

    setPasswords((prev) => prev.filter((password) => password !== passwordDoc)) // remove from state
    setOpenPassword(null)
  }

  return (
    <div id="password-list">
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
              deletePassword={deletePassword}
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
