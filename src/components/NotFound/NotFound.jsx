import React from 'react'
import Header from '../Header/Header'

const NotFound = () => {
  return (
    <div className="container mx-auto">
      <Header header={"404"}/>
      <p>Oups! Page Not Found</p>
    </div>
  )
}

export default NotFound