import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = "http://localhost:5000"
export const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])
    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const { user } = useUser()
    const { getToken } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const createOrUpdateUser = async () => {
        try {
            const token = await getToken();
            await axios.post("/api/user/create-or-update", {
                name: user.fullName,
                email: user.primaryEmailAddress.emailAddress,
                image: user.imageUrl
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error("User creation/update failed:", error);
        }
    };

    const fetchIsAdmin = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get("/api/admin/is-admin", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setIsAdmin(data.isAdmin);

            if (!data.isAdmin && location.pathname.startsWith("/admin")) {
                navigate("/");
                toast.error("You are not authorized to access admin dashboard");
            }
        } catch (error) {
            console.error("Admin check failed:", error);
            toast.error("Unable to verify admin privileges");
        }
    };

    const fetchShows = async () => {
        try {
            const { data } = await axios.get('/api/show/all')
            if (data.success) {
                setShows(data.shows)
            } else {
                toast.error(data.message)

            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchFavoriteMovies = async () => {
        try {
            const { data } = await axios.get('/api/user/favorites', {
                headers:
                    { Authorization: `Bearer ${await getToken()}` }
            })

            if (data.success) {
                setFavoriteMovies(data.movies)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)

        }

    }

    useEffect(() => {
        fetchShows()
    }, [])

    useEffect(() => {
        if (user) {
            createOrUpdateUser().then(() => {
                fetchIsAdmin()
                fetchFavoriteMovies()
            });
        }
    }, [user])



    const value = {
        axios,
        fetchIsAdmin,
        user, getToken, navigate, isAdmin, shows, favoriteMovies, fetchFavoriteMovies, image_base_url

    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)