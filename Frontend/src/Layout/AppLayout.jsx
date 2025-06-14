import React from 'react'
import TopBar from '../Components/TopBar'

const AppLayout = ({children }) => {
  return (
    <div className='h-full px-6 py-4'>
      <TopBar/>
      {children }
    </div>
  )
}

export default AppLayout
