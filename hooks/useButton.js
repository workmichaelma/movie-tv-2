import React, { createContext, useContext, useState } from 'react'

const Context = createContext({})

export const ButtonProvider = ({ children }) => {
  const [button, setButton] = useState({})
  console.log(`button focusing: ${button.buttonId}`)
  return (
    <Context.Provider
      value={{
        button,
        setButton,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default function useButton() {
  return useContext(Context)
}
