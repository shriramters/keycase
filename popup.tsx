import Button from "~components/Button"
import { useFirebase } from "~firebase/hook"

import "./style.css"

export default function IndexPopup() {
  const { user, isLoading, onLogin, onLogout } = useFirebase()

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
        {isLoading ? "Loading..." : ""}
        {!!user ? (
          <div>
            Welcome to keycase, {user.displayName} your email address is{" "}
            {user.email}
          </div>
        ) : (
          ""
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
