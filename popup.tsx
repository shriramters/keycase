import { useEffect, useState } from "react"

import Onboard from "~components/Onboard"
import PasswordStore from "~components/PasswordStore"
import { useFirebase } from "~firebase/hook"
import { useFirestoreDoc } from "~firebase/use-firestore-doc"
import type { AuthFirebaseDocument } from "~models/AuthData"

import "./style.css"

export default function IndexPopup() {
  const { user, isLoading, onLogin, onLogout } = useFirebase()

  const [onboarding, setOnboarding] = useState<boolean>(false)

  const {
    data: authData,
    setData: setAuthData,
    isReady: isAuthReady
  } = useFirestoreDoc<AuthFirebaseDocument>(user?.uid && `auth/${user.uid}`)

  // if user does not have an auth document, create one
  useEffect(() => {
    if (user && !authData) {
      setOnboarding(true)
      console.log("authData", authData)
    }
  }, [isAuthReady])

  return (
    <div id="popup-body">
      <header>
        <h1 style={{ fontFamily: "Space Grotesk", fontWeight: 400 }}>
          Keycase
        </h1>
        {!user ? (
          <button onClick={() => onLogin()}>Log&nbsp;in</button>
        ) : (
          <button onClick={() => onLogout()}>Log&nbsp;out</button>
        )}
      </header>
      <hr />
      <div>
        {onboarding ? (
          <Onboard
            setOnboarding={setOnboarding}
            setAuthData={setAuthData}
            user={user}
          />
        ) : (
          <div>
            {isLoading ? (
              "Loading..."
            ) : !!user ? (
              <PasswordStore authData={authData} user={user} />
            ) : (
              "Login to continue. "
            )}
          </div>
        )}
      </div>
      <hr />
      <footer>
        <small>
          This web extension is licensed under the GPLv3. Find the source code{" "}
          <a target="_blank" href="https://github.com/shriramters/keycase.git">
            here
          </a>{" "}
        </small>
      </footer>
    </div>
  )
}
