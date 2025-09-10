

import React, { useState, useEffect } from 'react'
import { assets, roomsDummyData, facilityIcons } from '../assets/assets'
import { useNavigate, useLocation } from 'react-router-dom'
import StarRating from '../components/StarRating'

const CheckBox = ({label, selected = false, onChange = () => { }})=>{
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input type="checkbox" checked={selected} onChange={(e)=>onChange (e.target.checked, label)}/>
      <span className='font-light select-none'>{label}</span>
    </label>
  )
}

const RadioButton = ({label, selected = false, onChange = () => { }})=>{
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input type="radio" name='sortOption' checked={selected} onChange={(e)=>onChange (label)}/>
      <span className='font-light select-none'>{label}</span>
    </label>
  )
}


const AllRooms = () => {
  const navigate = useNavigate()
  const [openFilter, setOpenFilter] = useState(false)
  const [filteredRooms, setFilteredRooms] = useState(roomsDummyData)

  // Filter states
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([])
  const [selectedSortOption, setSelectedSortOption] = useState('')

  const roomTypes = [
    "Single Bed",
    "Double Bed",
    "Luxary Room",
  ];
  const priceRanges = [
    '0 to 500',
    '500 to 1000',
    '1000 to 2000',
    '2000 to 3000',
  ];

  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First"
  ];

  // Function to apply filters and sorting
  const applyFiltersAndSort = () => {
    let filtered = [...roomsDummyData];

    // Filter by room types
    if (selectedRoomTypes.length > 0) {
      filtered = filtered.filter(room => selectedRoomTypes.includes(room.roomType || room.type));
    }

    // Filter by price ranges
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(room => {
        const price = room.pricePerNight || 0;
        return selectedPriceRanges.some(range => {
          const [min, max] = range.replace('$ ', '').split(' to ').map(Number);
          return price >= min && price <= max;
        });
      });
    }

    // Sort
    if (selectedSortOption) {
      switch (selectedSortOption) {
        case "Price Low to High":
          filtered.sort((a, b) => (a.pricePerNight || 0) - (b.pricePerNight || 0));
          break;
        case "Price High to Low":
          filtered.sort((a, b) => (b.pricePerNight || 0) - (a.pricePerNight || 0));
          break;
        case "Newest First":
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }
    }

    setFilteredRooms(filtered);
  };

  // Handlers for filters
  const handleRoomTypeChange = (checked, label) => {
    if (checked) {
      setSelectedRoomTypes(prev => [...prev, label]);
    } else {
      setSelectedRoomTypes(prev => prev.filter(type => type !== label));
    }
  };

  const handlePriceRangeChange = (checked, label) => {
    if (checked) {
      setSelectedPriceRanges(prev => [...prev, label]);
    } else {
      setSelectedPriceRanges(prev => prev.filter(range => range !== label));
    }
  };

  const handleSortChange = (label) => {
    setSelectedSortOption(label);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedRoomTypes([]);
    setSelectedPriceRanges([]);
    setSelectedSortOption('');
  };

  // Apply filters when filter states change
  useEffect(() => {
    applyFiltersAndSort();
  }, [selectedRoomTypes, selectedPriceRanges, selectedSortOption]);

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      <div className='flex flex-col items-start text-left'>
        <div className='flex flex-col items-start text-left'>
          <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
          <p>Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
        </div>

        {filteredRooms.length === 0 ? (
          <div className='flex justify-center items-center py-20'>
            <div className='text-gray-500'>No rooms match the selected filters.</div>
          </div>
        ) : (
          filteredRooms.map((room) => (
          <div key={room._id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0'>
            <img
              onClick={() => {
                navigate(`/rooms/${room._id}`)
                window.scrollTo(0, 0)
              }}
              src={room.images[0]}
              alt='hotel-img'
              title='View Room Details'
              className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'
            />
            <div className='md:w-1/2 flex flex-col gap-2'>
              <p className='text-gray-500'>{room.hotel.city}</p>
              <p
                onClick={() => {
                  navigate(`/rooms/${room._id}`)
                  window.scrollTo(0, 0)
                }}
                className='text-gray-800 text-3xl font-playfair cursor-pointer'
              >
                {room.hotel.name}
                <span className='font-inter text-sm text-gray-600'>({room.roomType || room.type})</span>
              </p>
              <div className='flex items-center gap-0.5'>
                <StarRating />
                <p className='ml-2'>200+ reviews</p>
              </div>
              <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                <img src={assets.locationIcon} alt='location-icon' />
                <span>{room.hotel.address}</span>
              </div>

              {/* Types of room single, Double or Luxary Room */}
              <div>
                <p className='text-gray-600 text-sm'>Type of Room: <span className='font-medium text-gray-800'>{room.roomType || room.type}</span></p>
                {/* <span className='font-inter text-sm'>({room.roomType}) </span> */}
              </div>

              {/* Room Facilities */}
              <div className='flex flex-wrap items-center mt-0 mb-0 gap-2'>
                {room.amenities.map((item, index)=>(
                  <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
                    <img src={facilityIcons [item]} alt={item} className='w-5 h-5' />
                    <p className='text-xs'>{item}</p>
                  </div>
                ))}
              </div>

              {/*Room price per night  */}
              <p className='text-xl font-medium text-gray-700'>${room.pricePerNight} /night</p>


            </div>
          </div>
          ))
        )}
      </div>

      {/*  -------------------- filter------------------------ */}
      {/* w-full lg:w-1/4 mb-10 lg:mb-0 lg:ml-10 p-6 bg-white rounded-xl shadow-md sticky top-2 */}
      <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-18 min-lg:mt-16'>
        <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilter && "border-b"}`}>
          <p className='text-base font-medium text-gray-800'  >Filters</p>
          <div  className='text-xs cursor-pointer'>
            <span  onClick={()=> setOpenFilter (!openFilter)} className='lg:hidden'> {openFilter ? 'HIDE':"SHOW"}  </span>
            <span className='hidden lg:block' onClick={clearAllFilters}> CLEAR </span>
          </div>
        </div>

        <div className={`${openFilter ? 'h-auto' : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Room Types</p>
            {roomTypes.map((room, index)=>(
              <CheckBox
                key={index}
                label={room}
                selected={selectedRoomTypes.includes(room)}
                onChange={handleRoomTypeChange}
              />
            ))}
          </div>

          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Price Ranges</p>
            {priceRanges.map((range, index)=>(
              <CheckBox
                key={index}
                label={`$ ${range}`}
                selected={selectedPriceRanges.includes(`$ ${range}`)}
                onChange={handlePriceRangeChange}
              />
            ))}
          </div>

          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Sort By</p>
            {sortOptions.map((option, index)=>(
              <RadioButton
                key={index}
                label={option}
                selected={selectedSortOption === option}
                onChange={handleSortChange}
              />
            ))}
          </div>

        </div>
        
      </div>
    </div>
  )
}

export default AllRooms
