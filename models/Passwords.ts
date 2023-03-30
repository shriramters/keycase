export interface Password {
  name: string
  username: string
  password: string
  url: string
  notes: string
  createdAt: Date
  updatedAt: Date
}

// array of passwords referenced by id
export interface PasswordsFirebaseDocument {
  passwords: Array<string>
}


