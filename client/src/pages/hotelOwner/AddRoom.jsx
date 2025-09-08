import React , {useState} from 'react'
import { assets } from '../../assets/assets'

const AddRoom = () => {

  const [images , setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null
  })

  const [inputs, setInputs] = useState({
    roomType: '',
    pricePerNight: 0,
    amenities: {
      'Free WiFi': false,
      'Free Breakfast': false,
      'Room Service': false,
      'Mountain View': false,
      'Pool Access': false
    }
  })


  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-2xl rounded-xl mt-8 border border-gray-200">
      <form>
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-6 pt-4 text-center">Add New Room</h1>
        <p className="text-gray-700 mb-10 text-center text-lg">Fill in the details to add a new room to your hotel.</p>

      {/* -----------------------upload image------------------------- */}
      <p className='text-indigo-900 mt-12 font-semibold text-xl'>Upload Images</p>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:flex gap-6 my-4 flex-wrap justify-center'>
        {Object.keys(images).map((key)=>(
          <label htmlFor={`roomImage${key}`} key={key}>
            <img className='w-32 h-32 object-cover cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-300 rounded-lg shadow-md hover:shadow-lg' src={images[key] ? URL.createObjectURL (images [key]): assets.uploadArea} alt="" />
            <input type="file" accept='image/*' id={`roomImage${key}`} hidden onChange={e=> setImages({...images, [key]: e.target.files[0] })} />
          </label>
        ))}
      </div>

      <div className='w-full flex flex-col md:flex-row gap-6 mt-8'>
        <div className='flex-1'>
          <label className='block text-indigo-900 font-semibold mb-3'>Room Type</label>
          <select value={inputs.roomType} onChange={e=> setInputs({...inputs,roomType: e.target.value})} className='border border-indigo-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm'>
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        <div className='flex-1 md:max-w-xs'>
          <label className='block text-indigo-900 font-semibold mb-3'>Price <span className='text-sm text-indigo-600'>($/night)</span></label>
          <input type="number" placeholder='0' className='border border-indigo-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm' value={inputs.pricePerNight} onChange={e=> setInputs({...inputs, pricePerNight: e.target.value})}/>
        </div>

      </div>

      <p className='text-indigo-900 mt-6 font-semibold text-xl'>Amenities</p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-gray-700 max-w-lg'>
        {Object.keys(inputs.amenities).map((amenity, index)=>(
          <div key={index} className='flex items-center space-x-3'>
            <input type="checkbox" id={`amenities${index+1}`} className='w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500' checked={inputs.amenities [amenity]} onChange={()=>setInputs({...inputs,amenities: {...inputs.amenities, [amenity]: ! inputs.amenities [amenity]}})}/>
            <label htmlFor={`amenities${index+1}`} className='text-gray-800 font-medium cursor-pointer'>{amenity}</label>
          </div>
        ))}
      </div>
      <button className='mt-10 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105'>Add Room</button>

    </form>
    </div>
  )
}

export default AddRoom
