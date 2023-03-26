import Button from "~components/Button"
import { useFirebase } from "~firebase/hook"
import { useFirestoreDoc } from "~firebase/use-firestore-doc"

import "./style.css"

interface AuthFirebaseDocument {
  masterPasswordSalt: string
  encryptedRSAPrivateKey: string
  RSAPublicKey: string
  masterPasswordHash: string
}

export default function IndexPopup() {
  const { user, isLoading, onLogin, onLogout } = useFirebase()

  const { data: authData } = useFirestoreDoc<AuthFirebaseDocument>(
    user?.uid && `auth/${user.uid}`
  )

  return (
    <div id="popup-body">
      <header>
        <h1 style={{ fontFamily: "Space Grotesk", fontWeight: 400 }}>
          Keycase
        </h1>
        {!user ? (
          <Button onClick={() => onLogin()}>Log&nbsp;in</Button>
        ) : (
          <Button onClick={() => onLogout()}>Log&nbsp;out</Button>
        )}
      </header>
      <hr />
      <div>
        {isLoading ? "Loading..." : authData?.masterPasswordSalt ?? "No"}
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
