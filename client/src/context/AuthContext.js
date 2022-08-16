import {createContext} from 'react'

export const AuthContext = createContext({
  isAuth: false,
  token: null,
  user: null,
  currentUserId: null,
});