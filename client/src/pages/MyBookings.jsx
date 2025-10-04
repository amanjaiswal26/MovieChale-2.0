import React, { useEffect, useState } from 'react'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const { axios, getToken, image_base_url } = useAppContext()
  const { user } = useUser()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getMyBookings = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get('/api/user/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (data.success) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to fetch bookings')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      getMyBookings()
    } else {
      navigate('/')
    }
  }, [user, navigate])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>

      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>

      {bookings.length > 0 ? (
        bookings.map((item, index) => (
          <div
            key={item._id || index}
            className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'
          >
            {/* Left Section */}
            <div className='flex flex-col md:flex-row'>
              <img
                src={image_base_url + item.show.movie.poster_path}
                alt={item.show.movie.title}
                className='md:max-w-[180px] aspect-video h-auto object-cover object-bottom rounded'
              />
              <div className='flex flex-col p-4'>
                <p className='text-lg font-semibold'>{item.show.movie.title}</p>
                <p className='text-gray-400 text-sm'>
                  {timeFormat(item.show.movie.runtime)}
                </p>
                <p className='text-gray-400 text-sm mt-auto'>
                  {dateFormat(item.show.showDateTime)}
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
              <div className='flex items-center gap-4'>
                <p className='text-2xl font-semibold mb-3'>
                  {currency} {item.amount}
                </p>
                {!item.isPaid && (
                  <button className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'>
                    Pay Now
                  </button>
                )}
                {item.isPaid && (
                  <span className='bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm'>
                    Paid
                  </span>
                )}
              </div>

              {/* Booking Details */}
              <div className='text-sm'>
                <p>
                  <span className='text-gray-400'>Total Tickets: </span>
                  {item.bookedSeats.length}
                </p>
                <p>
                  <span className='text-gray-400'>Seat Number: </span>
                  {item.bookedSeats.join(', ')}
                </p>
                <p className='text-gray-400 text-xs mt-2'>
                  Booking ID: {item._id}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className='flex flex-col items-center justify-center py-20'>
          <h2 className='text-2xl font-bold mb-4'>No bookings found</h2>
          <p className='text-gray-400 mb-6'>You haven't made any bookings yet</p>
          <button 
            onClick={() => navigate('/movies')}
            className='px-6 py-2 bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'
          >
            Browse Movies
          </button>
        </div>
      )}
    </div>
  )
}

export default MyBookings