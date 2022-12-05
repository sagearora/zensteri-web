import React from 'react'
import Div100vh from 'react-div-100vh'
import { Link } from 'react-router-dom'

function NotFoundScreen() {
  return (
    <Div100vh>
      <div className='h-full flex flex-col overflow-hidden'>
        <div className='flex-1 overflow-y-auto'>
          <div className='container'>
            <div className='my-6 mx-auto container flex flex-col items-center justify-center'>
              <p className='text-lg font-bold'>Oops...Not found :(</p>
              <Link to='/'>Go Home</Link>
            </div>
          </div>
        </div>
      </div>
    </Div100vh>
  )
}

export default NotFoundScreen