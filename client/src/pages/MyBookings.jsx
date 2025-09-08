import React, { useState } from 'react'
import {assets, userBookingsDummyData } from '../assets/assets'

const MyBookings = () => {

  const [bookings, setBookings] = useState(userBookingsDummyData)

  return (
    <div >
          <h2 className='text-3xl mt-30 ml-70 md:text-4xl font-bold text-gray-800 mb-4'>My Bookings</h2>
          <p className='text-gray-600 max-w-2xl ml-70'>Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks .</p>

          <div className='max-w-6xl ml-35 mt-8 w-full text-gray-800'>
                    <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
                              <div className="w-1/4">Hotels</div>
                              <div className="w-1/3">Date & Timings</div>
                              <div className="w-1/3">Payment</div>
                    </div>

                    {bookings.map((booking)=>(
                    <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'>
                      {/*-----------------Hotel Details--------------- */}
                      <div className='flex flex-col md: flex-row'>
                        <img src={booking.room.images[0]} alt="hotel-img" className='min-md:w-44 rounded shadow object-cover'/>
                        <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                          <p className='font-playfair text-2x1'>{booking.hotel.name}
                            <span className='font-inter text-sm'>({booking.room.roomType}) </span>
                          </p>
                          <div className='flex items-center gap-1 text-sm text-gray-500'>
                            <img src={assets.locationIcon} alt="location-icon" />
                            <span> Guests: {booking.guests} </span> 
                          </div>
                          <p className='text-base '> Total: ${booking.totalPrice} </p>
                        </div>
                      </div>

                      {/*-----------------Date & Timeings--------------- */}
                      <div className='flex flex-row md:items-center ml-0 md:gap-12 mt-3 gap-5'>
                      <div>
                        <p>Check-In:</p>
                        <p className='className="text-gray-500 text-sm"'>
                          {new Date(booking.checkInDate).toDateString()}
                        </p>
                      </div>
                      <div>
                        <p>Check-Out:</p>
                        <p className='className="text-gray-500 text-sm"'>
                          {new Date(booking.checkInDate).toDateString()}
                        </p>
                      </div>
                      </div>
                      {/*-----------------Payment Status ---------------- */}
                      <div className='flex flex-col items-start justify-center pt-3'>
                        <div className='flex items-center gap-2'>
                          <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500": "bg-red-500"}`}></div>
                          <p className={ `text-sm ${booking.isPaid ? "text-green-500" :"bg-red-500"}`}> 
                            {booking.isPaid ? "Paid" : "Not Paid"}  </p>
                          </div>

                          {!booking.isPaid && (
                            <button className='mt-3 bg-blue-300 text-white px-4 py-2 rounded hover:bg-blue-600 transition'>
                              Pay Now
                            </button>
                          )}
                        </div>
                    </div>
                    ))}
          </div>

      
    </div>
  )
}

export default MyBookings
