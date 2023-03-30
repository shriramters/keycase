import { createContext, useEffect, useState } from "react"

import Onboard from "~components/Onboard"
import PasswordStore from "~components/PasswordStore"
import Preferences from "~components/Preferences"
import { useFirebase } from "~firebase/hook"
import { useFirestoreDoc } from "~firebase/use-firestore-doc"
import type { AuthFirebaseDocument } from "~models/AuthData"

import "./style.css"

export const ThemeContext = createContext<{
  theme: "sakura" | "sakura-night"
  setTheme: React.Dispatch<React.SetStateAction<"sakura" | "sakura-night">>
}>(null)

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

  // theme localstorage
  const [theme, setTheme] = useState<"sakura" | "sakura-night">(null)

  const addClassToBody = (className: string) => {
    document.body.classList.add(className)
  }
  const removeClassFromBody = (className: string) => {
    document.body.classList.remove(className)
  }
  useEffect(() => {
    const saved_theme = localStorage.getItem("theme")
    if (saved_theme) {
      setTheme(saved_theme as "sakura" | "sakura-night")
    }
  }, [])

  useEffect(() => {
    if (theme) {
      setTheme(theme as "sakura" | "sakura-night")
      localStorage.setItem("theme", theme)
      if (theme === "sakura") {
        addClassToBody("sakura")
        removeClassFromBody("sakura-night")
      }
      if (theme === "sakura-night") {
        addClassToBody("sakura-night")
        removeClassFromBody("sakura")
      }
    }
  }, [theme])

  const [preferencesPage, setPreferencesPage] = useState<boolean>(false)

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div id="popup-body">
        <div id="toolbar">
          <div onClick={() => setPreferencesPage((prev) => !prev)}>
            <svg
              id="preferences-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-sliders"
              viewBox="0 0 16 16">
              <path
                fill-rule="evenodd"
                d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z"
              />
            </svg>
          </div>
        </div>
        {preferencesPage ? (
          <Preferences openPreferencesPage={setPreferencesPage} />
        ) : (
          <>
            {" "}
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
                This web extension is licensed under the GPLv3. Find the source
                code{" "}
                <a
                  target="_blank"
                  href="https://github.com/shriramters/keycase.git">
                  here
                </a>{" "}
              </small>
            </footer>
          </>
        )}
      </div>
    </ThemeContext.Provider>
  )
}
