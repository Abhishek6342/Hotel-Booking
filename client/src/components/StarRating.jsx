import React from 'react'
import { assets } from '../assets/assets'

const StarRating = ({ rating = 5 }) => {
  return (
    <div className='flex items-center'>
      {Array.from({ length: 5 }, (_, index) => (
        <img
          key={index}
          src={index < rating ? assets.starIconFilled : assets.starIconOutlined}
          alt='star'
          className='w-4 h-4'
        />
      ))}
    </div>
  )
}

export default StarRating
