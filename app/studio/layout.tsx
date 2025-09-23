import React from 'react'


export const metadata = {
    title: "Wineshop - Backend",
    description: "This is the client layout",
}
const Rootlayout = ({children}: {children: React.ReactNode}) => {
  return (
    <html lang="en">
        <body>{children}</body>
    </html>
  )
}

export default Rootlayout