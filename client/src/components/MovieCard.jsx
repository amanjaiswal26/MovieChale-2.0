import { StarIcon, Heart } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../context/AppContext'
import { useUser } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

const MovieCard = ({movie}) => {
    const navigate = useNavigate()
    const { user } = useUser()
    const { axios, getToken, favoriteMovies, fetchFavoriteMovies,image_base_url } = useAppContext()
    const [isFavorite, setIsFavorite] = useState(favoriteMovies.some(fav => fav._id === movie._id))
    const [isToggling, setIsToggling] = useState(false)

    const handleFavoriteToggle = async (e) => {
        e.stopPropagation()
        if (!user) {
            toast.error('Please login to add favorites')
            return
        }

        setIsToggling(true)
        try {
            const token = await getToken()
            await axios.post('/api/user/update-favorite', 
                { movieId: movie._id },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            
            setIsFavorite(!isFavorite)
            await fetchFavoriteMovies() // Refresh favorites list
            toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
        } catch (error) {
            console.error('Error toggling favorite:', error)
            toast.error('Failed to update favorites')
        }
        setIsToggling(false)
    }

    return (
        <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66 relative'>
            <div className='relative'>
                <img onClick={() => { navigate(`/movies/${movie._id}`); scrollTo(0, 0) }} src={image_base_url+movie.backdrop_path} alt="" className='rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer' />
                <button
                    onClick={handleFavoriteToggle}
                    disabled={isToggling}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
                        isFavorite 
                            ? 'bg-red-500 text-white' 
                            : 'bg-black/50 text-white hover:bg-red-500'
                    }`}
                >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
            </div>
            <p className='font-semibold mt-2 truncate'>{movie.title}</p>
            <p className='text-sm text-gray-400 mt-2'> {new Date(movie.release_date).getFullYear()} • {movie.genres?.slice(0, 2).map(genre => genre.name).join(" | ") || "Unknown"} • {timeFormat(movie.runtime)}</p>

            <div className='flex items-center justify-between mt-4 pb-3'>
                <button onClick={() => { navigate(`/movies/${movie._id}`); scrollTo(0, 0) }} className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Buy Tickets</button>
                <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                </p>
            </div>
        </div>
    )
}

export default MovieCard