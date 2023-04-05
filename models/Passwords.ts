export interface Password {
  name: string
  username: string
  password: string
  url: string
  notes: string
  createdAt: Date
  updatedAt: Date
}

// array of encrypted password strings
export interface PasswordsFirebaseDocument {
  passwords: Array<string>
}


