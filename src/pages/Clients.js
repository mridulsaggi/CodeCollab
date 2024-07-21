import React from 'react'
import Avatar from 'react-avatar'
const Clients = ({username}) => {
  return (
    <div className='flex flex-col items-center'>
      <Avatar name={username} size={50} round={14}/>
      <div className='my-[1rem]'>{username}</div>
    </div>
  )
}

export default Clients
