import React from 'react'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'

const Theaters = () => {
  const { shows } = useAppContext()

  // Extract unique theaters/locations from shows
  const theaters = []
  const theaterNames = new Set()
  
  shows.forEach(show => {
    if (show.theater && !theaterNames.has(show.theater)) {
      theaterNames.add(show.theater)
      theaters.push({
        name: show.theater,
        location: show.location || 'Main Theater',
        movies: shows.filter(s => s.theater === show.theater).map(s => s.movie)
      })
    }
  })

  return (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />
      
      <h1 className='text-lg font-medium my-4'>Our Theaters</h1>
      
      {theaters.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {theaters.map((theater, index) => (
            <div key={index} className='bg-primary/10 border border-primary/20 rounded-lg p-6 hover:-translate-y-1 transition duration-300'>
              <h2 className='text-xl font-semibold mb-2'>{theater.name}</h2>
              <p className='text-gray-400 mb-4'>{theater.location}</p>
              <div className='space-y-2'>
                <h3 className='font-medium text-sm'>Now Showing:</h3>
                {theater.movies.slice(0, 3).map((movie, idx) => (
                  <p key={idx} className='text-sm text-gray-300'>• {movie.title}</p>
                ))}
                {theater.movies.length > 3 && (
                  <p className='text-xs text-gray-400'>+{theater.movies.length - 3} more movies</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-20'>
          <h2 className='text-2xl font-bold mb-4'>No theaters available</h2>
          <p className='text-gray-400'>Check back later for theater information</p>
        </div>
      )}
    </div>
  )
}

export default Theaters
