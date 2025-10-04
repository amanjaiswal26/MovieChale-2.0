import React, { useEffect, useState } from 'react'
import BlurCircle from '../components/BlurCircle'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'

const Movies = () => {
  const { shows } = useAppContext()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Extract unique movies from shows data
    const uniqueMovies = []
    const movieIds = new Set()
    
    shows.forEach(show => {
      if (show.movie && !movieIds.has(show.movie._id)) {
        movieIds.add(show.movie._id)
        uniqueMovies.push(show.movie)
      }
    })
    
    setMovies(uniqueMovies)
    setLoading(false)
  }, [shows])

  if (loading) {
    return <Loading />
  }

  return movies.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />
      <h1 className='text-lg font-medium my-4'>Now Showing</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie._id}/>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center'>No movies available</h1>
      <p className='text-gray-400 mt-2'>Check back later for new releases</p>
    </div>
  )
}

export default Movies