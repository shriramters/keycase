import React from "react"

import { ThemeContext } from "~popup"

const Preferences = ({
  openPreferencesPage
}: {
  openPreferencesPage: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { theme, setTheme } = React.useContext(ThemeContext)

  return (
    <div>
      <div className="title-bar">
        <h3>Preferences</h3>
        <button onClick={() => openPreferencesPage(false)}>Back</button>
      </div>
      <dl>
        <dt>Theme</dt>
        <dd>
          <select
            name="theme"
            id="theme"
            value={theme}
            onChange={(e) =>
              setTheme(e.target.value as "sakura" | "sakura-night")
            }>
            <option>sakura</option>
            <option>sakura-night</option>
          </select>
        </dd>
      </dl>
    </div>
  )
}

export default Preferences
