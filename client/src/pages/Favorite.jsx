import React, { useEffect, useState } from 'react'
import BlurCircle from '../components/BlurCircle'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

const Favorite = () => {
  const { favoriteMovies, fetchFavoriteMovies } = useAppContext()
  const { user } = useUser()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchFavoriteMovies()
      setLoading(false)
    } else {
      navigate('/')
    }
  }, [user, fetchFavoriteMovies, navigate])

  if (loading) {
    return <Loading />
  }

  return favoriteMovies.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />
      <h1 className='text-lg font-medium my-4'>Your favorite movies</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {favoriteMovies.map((movie) => (
          <MovieCard movie={movie} key={movie._id}/>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center'>No favorite movies yet</h1>
      <p className='text-gray-400 mt-2'>Add movies to your favorites to see them here</p>
      <button 
        onClick={() => navigate('/movies')}
        className='mt-4 px-6 py-2 bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'
      >
        Browse Movies
      </button>
    </div>
  )
}

export default Favorite