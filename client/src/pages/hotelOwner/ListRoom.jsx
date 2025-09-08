import React, { useState } from 'react'
import { roomsDummyData } from '../../assets/assets'

const ListRoom = () => {
  const [rooms, setRooms] = useState(roomsDummyData)
  return (

    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-2xl rounded-xl mt-8 border border-gray-200">
      <h1 className="text-4xl font-extrabold text-indigo-900 mb-6 pt-4 text-center">List of Rooms</h1>
      <p className="text-gray-700 mb-10 text-center text-lg">View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users.</p>

      <p className='text-indigo-900 mt-12 font-semibold text-xl'>All Rooms</p>
      <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3 shadow-lg bg-white'>
      <table className='w-full border-collapse'>
        <thead className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white'>
          <tr>
          <th className='py-4 px-6 font-semibold border-b border-gray-300'>Name</th>
          <th className='py-4 px-6 font-semibold border-b border-gray-300 max-sm:hidden'>Facility</th>
          <th className='py-4 px-6 font-semibold border-b border-gray-300 text-center'>Price / Night</th>
          <th className='py-4 px-6 font-semibold border-b border-gray-300 text-center'>Actions</th>
          </tr>
        </thead>

        <tbody className='text-sm'>
          {rooms.map((item, index)=>(
            <tr key={index} className={`transition-all duration-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 hover:shadow-md`}>
              <td className='py-3 px-6 text-gray-700 border-t border-gray-300'> {item.roomType} </td>
              <td className='py-3 px-6 text-gray-700 border-t border-gray-300 max-sm:hidden'> {item.amenities.join(', ')} </td>
              <td className='px-6 text-gray-700 border-t border-gray-300 text-center'> {item.pricePerNight} </td>

              <td className='py-3 px-6 border-t border-gray-300 text-sm text-red-500 text-center'>
                <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                  <input type="checkbox" className='sr-only peer' checked={item.isAvailable} readOnly />
                  <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-600 transition-all duration-300 ease-in-out shadow-sm"></div>
                  <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ease-in-out peer-checked:translate-x-5 peer-focus:ring-2 peer-focus:ring-indigo-400 shadow-sm"></span>
                </label>
              </td>
            </tr>
          ))
          }
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default ListRoom
