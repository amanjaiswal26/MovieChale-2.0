import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/IsotimeFormat'
import BlurCircle from '../components/BlurCircle'
import { toast } from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'
import { useUser } from '@clerk/clerk-react'

const SeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]
  const { id, date } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  const navigate = useNavigate()
  const { axios, getToken, image_base_url } = useAppContext()
  const { user } = useUser()

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if (data.success) {
        setShow({
          movie: data.movie,
          dateTime: data.dateTime
        })
      } else {
        toast.error(data.message)
        navigate('/movies')
      }
    } catch (error) {
      console.error('Error fetching show:', error)
      toast.error('Failed to fetch show details')
      navigate('/movies')
    } finally {
      setLoading(false)
    }
  }

  const handleSeatClick = (seatId) => {
    if (!user) {
      toast.error('Please login to book tickets')
      return
    }
    if (!selectedTime) {
      return toast("Please select time first")
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast("You can only select 5 seats")
    }
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(seat => seat !== seatId)
        : [...prev, seatId]
    )
  }

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book tickets')
      return
    }
    if (!selectedTime) {
      return toast.error('Please select a time')
    }
    if (selectedSeats.length === 0) {
      return toast.error('Please select at least one seat')
    }

    setBooking(true)
    try {
      const token = await getToken()
      const { data } = await axios.post('/api/booking/create', {
        showId: selectedTime.showId,
        bookedSeats: selectedSeats,
        amount: selectedSeats.length * selectedTime.price
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        toast.success('Booking created successfully!')
        navigate('/my-bookings')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Failed to create booking')
    } finally {
      setBooking(false)
    }
  }

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isOccupied = selectedTime?.occupiedSeats?.includes(seatId)
          const isSelected = selectedSeats.includes(seatId)
          
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              disabled={isOccupied}
              className={`h-8 w-8 rounded border border-primary/60 cursor-pointer transition ${
                isOccupied 
                  ? 'bg-red-500 text-white cursor-not-allowed' 
                  : isSelected 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-primary/20'
              }`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  )

  useEffect(() => {
    getShow()
  }, [id])

  if (loading) {
    return <Loading />
  }

  return show ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-8 md:pt-12'>
      {/* Movie Info Sidebar */}
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <div className='px-6 mb-4'>
          <img 
            src={image_base_url + show.movie.poster_path} 
            alt={show.movie.title}
            className='w-full h-64 object-cover rounded-lg mb-4'
          />
          <h2 className='text-lg font-semibold mb-2'>{show.movie.title}</h2>
          <p className='text-sm text-gray-400 mb-2'>{show.movie.genres?.map(g => g.name).join(', ')}</p>
          <p className='text-sm text-gray-400'>{show.movie.runtime} minutes</p>
        </div>
        
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div className='mt-5 space-y-1'>
          {show.dateTime?.[date]?.map((item) => (
            <div
              key={item.time}
              onClick={() => setSelectedTime(item)}
              className={`flex items-center gap-2 px-6 py-2
                w-max rounded-r-md cursor-pointer transition ${selectedTime?.time === item.time
                  ? "bg-primary text-white"
                  : "hover:bg-primary/20"}`}
            >
              <ClockIcon className="w-4 h-4" />
              <p className='text-sm'>{isoTimeFormat(item.time)}</p>
              <p className='text-xs ml-auto'>${item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Selection */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />
        <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>
        
        {/* Seat Legend */}
        <div className='flex gap-6 mb-6 text-sm'>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 bg-primary rounded'></div>
            <span>Selected</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 bg-gray-600 border border-primary/60 rounded'></div>
            <span>Available</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 bg-red-500 rounded'></div>
            <span>Occupied</span>
          </div>
        </div>

        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
            {groupRows[0].map(row => renderSeats(row))}
          </div>
        </div>
        <div className='grid grid-cols-2 gap-11'>
          {groupRows.slice(1).map((group,idx)=>(
            <div key={idx}>
              {group.map(row=> renderSeats(row))}
            </div>          
          ))}
        </div>

        {/* Booking Summary */}
        {selectedSeats.length > 0 && selectedTime && (
          <div className='mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg'>
            <h3 className='text-lg font-semibold mb-2'>Booking Summary</h3>
            <p>Seats: {selectedSeats.join(', ')}</p>
            <p>Total: ${selectedSeats.length * selectedTime.price}</p>
          </div>
        )}

        <button 
          onClick={handleBooking}
          disabled={booking || selectedSeats.length === 0 || !selectedTime}
          className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {booking ? 'Processing...' : 'Proceed to Checkout'}
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4"/>
        </button>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold mb-4'>Show not found</h1>
      <button 
        onClick={() => navigate('/movies')}
        className='px-6 py-2 bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'
      >
        Back to Movies
      </button>
    </div>
  )
}

export default SeatLayout