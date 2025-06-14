import React from 'react'
import {LoaderPinwheel} from "lucide-react"
const Loader = () => {
  return (
    <button className='btn btn-primary w-full flex justify-center items-center gap-3'>
      <p className='text-sm font-mono text-center'>Analyzing Resume...</p>
      <LoaderPinwheel className='animate-spin size-5 text-secondary-content'/>
    </button>
  )
}

export default Loader
