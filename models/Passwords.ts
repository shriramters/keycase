import type { Timestamp } from 'firebase/firestore'

export interface Password {
  name: string
  username: string
  password: string
  url: string
  notes: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// array of passwords referenced by id
export interface PasswordsFirebaseDocument {
  passwords: Array<string>
}


