import React, { useEffect, useState } from 'react'
import BlurCircle from '../components/BlurCircle'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'

const Releases = () => {
  const { axios, getToken, image_base_url } = useAppContext()
  const [upcomingMovies, setUpcomingMovies] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUpcomingMovies = async () => {
    try {
      const { data } = await axios.get('/api/show/upcoming')
      if (data.success) {
        setUpcomingMovies(data.movies)
      }
    } catch (error) {
      console.error('Error fetching upcoming movies:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUpcomingMovies()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />
      
      <h1 className='text-lg font-medium my-4'>Coming Soon</h1>
      
      {upcomingMovies.length > 0 ? (
        <div className='flex flex-wrap max-sm:justify-center gap-8'>
          {upcomingMovies.map((movie) => (
            <MovieCard movie={{ ...movie, poster_path: image_base_url + movie.poster_path }} key={movie._id}/>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-20'>
          <h2 className='text-2xl font-bold mb-4'>No upcoming releases</h2>
          <p className='text-gray-400'>Check back later for new movie releases</p>
        </div>
      )}
    </div>
  )
}

export default Releases

