import { createContext, useContext } from 'react'

export const AccountContext = createContext(null)

// { customer, token, signedIn, register, login, logout, call, setCustomer, setSession, serverWishlist }
export function useAccount() {
  const ctx = useContext(AccountContext)
  if (!ctx) throw new Error('useAccount must be used inside AccountProvider')
  return ctx
}
