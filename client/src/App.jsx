import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'
import Theaters from './pages/Theaters'
import Releases from './pages/Releases'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Layout from './pages/admin/Layout'
import AddShows from './pages/admin/AddShows'
import ListShows from './pages/admin/ListShows'
import AddTheater from './pages/admin/AddTheater'
import ListTheaters from './pages/admin/ListTheaters'
import ListBookings from './pages/admin/ListBookings'
import Dashboard from './pages/admin/Dashboard'
import { useAppContext } from './context/AppContext'
import { SignIn } from '@clerk/clerk-react'
const App = () => {

  const isAdminRoute = useLocation().pathname.startsWith('/admin')
  const { user } = useAppContext()


  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/favorite' element={<Favorite />} />
        <Route path='/theaters' element={<Theaters />} />
        <Route path='/releases' element={<Releases />} />
        <Route path='/admin/*' element={user ? <Layout/> :( 
          <div className='min-h-screen flex justify-center items-center'>
            <SignIn fallbackRedirectUrl={'/admin'}/>
          </div>
        )}>
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="add-theater" element={<AddTheater />} />
          <Route path="list-theaters" element={<ListTheaters />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App
