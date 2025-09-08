import React, { useState } from 'react'
import { assets, cities } from '../assets/assets'

const HotelReg = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }
          return (
                    isVisible && (
                    <div className='fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in'>
                              <form className='flex bg-white rounded-2xl shadow-2xl max-w-4xl max-md:mx-4 overflow-hidden transform transition-all duration-500 hover:shadow-3xl'>
                              <img src={assets.regImage} alt="reg-image" className='w-1/2 rounded-l-2xl hidden md:block object-cover'/>
                              <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10 bg-gradient-to-br from-indigo-50 to-blue-50 transition-all duration-300'>
                                        <img src={assets.closeIcon} alt="close-icon" className='absolute top-4 right-4 h-5 w-5 cursor-pointer hover:bg-gray-200 rounded-full p-1 transition-all duration-300 hover:scale-110 hover:rotate-90' onClick={handleClose}/>
                                        <p className='text-3xl font-bold text-indigo-900 mt-6'>Register Your Hotel</p>

                                        {/* Hotel Name */}
                                        <div className='w-full mt-4'>
                                        <label htmlFor="name" className="font-semibold text-indigo-700">
                                        Hotel Name
                                        </label>
                                        <input id='name' type="text" placeholder="Type here" className="border border-indigo-300 rounded-lg w-full px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm hover:shadow-md focus:shadow-lg" required/>
                                        </div>

                                        {/* Contact */}
                                        <div className='w-full mt-4'>
                                        <label htmlFor="contact" className="font-semibold text-indigo-700">
                                        Phone Number
                                        </label>
                                        <input id='contact' type="text" placeholder="Type here" className="border border-indigo-300 rounded-lg w-full px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm hover:shadow-md focus:shadow-lg" required/>
                                        </div>

                                        {/* Address */}
                                        <div className='w-full mt-4'>
                                        <label htmlFor="Address" className="font-semibold text-indigo-700">
                                        Address
                                        </label>
                                        <input id='Address' type="text" placeholder="Type here" className="border border-indigo-300 rounded-lg w-full px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm hover:shadow-md focus:shadow-lg" required/>
                                        </div>

                                        {/* Select City Drop Down */}
                                        <div className='w-full mt-4 max-w-64 mr-auto'>
                                                  <label htmlFor="city" className="font-semibold text-indigo-700">   City   </label>
                                                  <select id="city" className="border border-indigo-300 rounded-lg w-full px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm hover:shadow-md focus:shadow-lg" required>
                                                            <option value="">Select City</option>
                                                            {cities.map((city)=>(
                                                                      <option key={city} value={city}>{city}</option>
                                                            ))}
                                                  </select>
                                        </div>

                                        {/* Register Button */}
                                        <button className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-white mr-auto px-12 py-3 rounded-lg cursor-pointer mt-8 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'>
                                        Register
                                        </button>
                              </div>
                              </form>
                    </div>
                    )
          )
}

export default HotelReg
