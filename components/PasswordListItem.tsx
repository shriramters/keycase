import type React from "react"

import type { Password } from "~models/Passwords"

interface PasswordListItemProps {
  index: number
  password: Password
  setOpenPassword: React.Dispatch<React.SetStateAction<Password>>
}

const PasswordListItem = ({
  index,
  password,
  setOpenPassword
}: PasswordListItemProps) => {
  const website = password?.url.split("://")[1].split("/")[0]
  return (
    <div
      onClick={() => setOpenPassword(password)}
      className="password-list-item"
      key={index}>
      <div>{index + 1}.</div>
      <div>
        <b>{`${website}(${password?.username})`}</b>
      </div>
      <div>{password?.name}</div>
    </div>
  )
}

export default PasswordListItem
