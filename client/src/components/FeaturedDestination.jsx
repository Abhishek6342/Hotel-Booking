import React from 'react'
import { roomsDummyData } from '../assets/assets'
import HotelCard from './HotelCard'
import { useNavigate } from 'react-router-dom'
import { cities } from '../assets/assets'   // Extra

const FeaturedDestination = () => {
          const navigate = useNavigate()
          const featuredCities = cities.slice(0, 8) // Extra
  return (
    <div className='flex flex-col items-center px-6 md:px-16 1g:px-24 bg-slate-200 py-10 '>

          <div className='text-center mb-12'>
                    <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>Featured Destinations</h2>
                    <p className='text-gray-600 max-w-2xl mx-auto'>Discover the most popular destinations for your next adventure. From bustling cities to serene retreats, find your perfect getaway.</p>
          </div>


          <div className='flex flex-wrap items-center justify-center gap-10 mt-20'>
                    {roomsDummyData.slice(0, 4).map((room, index)=>(
                              <HotelCard key={room._id} room={room} index={index} />
                    ))}
          </div>

{/* Button style */}

          <style>{`
                .button-wrapper::before {
                    animation: spin-gradient 4s linear infinite;
                }
            
                @keyframes spin-gradient {
                    from {
                        transform: rotate(0deg);
                    }
            
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
            <div className="mt-5 relative inline-block p-0.5 rounded-full overflow-hidden hover:scale-105 transition duration-300 active:scale-100 before:content-[''] before:absolute before:inset-0 before:bg-[conic-gradient(from_0deg,_#00F5FF,_#00F5FF30,_#00F5FF)] button-wrapper">
                <button onClick={()=>{navigate('/rooms'); scrollTo(0,0)}} className="relative z-10 bg-gray-800 text-white rounded-full px-8 py-3 font-medium text-sm">
                    View All Destinations
                    </button>
            </div>

          {/* Extra whole div below */}

          <div className='text-center mb-12'>
                    <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4 mt-10'>Famous Cities</h2>
                    <p className='text-gray-600 max-w-2xl mx-auto'>Discover the most popular destinations for your next adventure. From bustling cities to serene retreats, find your perfect getaway.</p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-15 p-5'>  
                    {featuredCities.map((city, index) => (
                    <div key={index} className=' bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'>
                              <div className='h-48  bg-gradient-to-r from-blue-500  to-purple-400 flex items-center justify-center'>
                                        <h3 className='text-white text-xl font-semibold'>{city}</h3>
                              </div>
                              <div className='p-4'>
                                        <p className='text-gray-600 text-sm mb-2'>Explore the beauty of {city}</p>
                                        <button className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300'>
                                        View Hotels
                                        </button>
                              </div>
                    </div>
          ))}
          </div>
      
    </div>
  )
}

export default FeaturedDestination

