import React from 'react'
import { dashboardDummyData, assets } from '../../assets/assets'

const Dashboard = () => {
  const { totalBookings, totalRevenue, bookings } = dashboardDummyData

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-3">Hotel Owner Dashboard</h1>
          <p className="text-indigo-700 text-xl">Welcome back! Here's an overview of your hotel performance.</p>
        </div>

        {/* ----------------------------------------------------- */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-500 border-l-8 border-blue-700 text-white">
            <div className="flex items-center">
              <div className="bg-blue-700 p-4 rounded-lg mr-5 shadow-lg">
                <img src={assets.totalBookingIcon} alt="Total Bookings" className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Total Bookings</h3>
                <p className="text-4xl font-extrabold">{totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-500 border-l-8 border-green-700 text-white">
            <div className="flex items-center">
              <div className="bg-green-700 p-4 rounded-lg mr-5 shadow-lg">
                <img src={assets.totalRevenueIcon} alt="Total Revenue" className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Total Revenue</h3>
                <p className="text-4xl font-extrabold">${totalRevenue}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Recent Bookings</h2>
            <span className="text-sm text-gray-600 bg-gray-200 px-4 py-2 rounded-full font-semibold">
              Last 30 days
            </span>
          </div>

          

          <table className='w-full border-collapse'>
            <thead className='bg-indigo-100'>
              <tr>
              <th className='py-4 px-6 text-indigo-900 font-semibold text-left'>User Name</th>
              <th className='py-4 px-6 text-indigo-900 font-semibold text-left max-sm:hidden' >Room Name</th>
              <th className='py-4 px-6 text-indigo-900 font-semibold text-center'>Total Amount</th>
              <th className='py-4 px-6 text-indigo-900 font-semibold text-center' >Payment Status</th>
              </tr>
            </thead>

            <tbody className='text-base'>
              {bookings.map((item, index)=>(
                <tr key={index} className='border-b border-indigo-200 hover:bg-indigo-50 transition-colors duration-300'>
                  <td className='py-4 px-6 text-indigo-800'> {item.user.username} </td>
                  <td className='py-4 px-6 text-indigo-800 max-sm:hidden'> {item.room.roomType} </td>
                  <td className='py-4 px-6 text-indigo-800 text-center'> $ {item.totalPrice}</td>
                  <td className='py-4 px-6 text-center'>
                    <button className={`py-2 px-4 text-sm rounded-full font-semibold ${item.isPaid ? 'bg-green-300 text-green-800': 'bg-yellow-300 text-yellow-800'}`}>
                      {item.isPaid ? 'Completed': 'Pending'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          
          
        </div>
      </div>
    </div>
  )
}

export default Dashboard

