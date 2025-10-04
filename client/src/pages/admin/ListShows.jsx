import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import toast from 'react-hot-toast';

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user } = useAppContext();

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all shows from API
  const getAllShows = async () => {
    try {
      const { data } = await axios.get("/api/admin/shows", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success && Array.isArray(data.shows)) {
        setShows(data.shows);
      } else {
        setShows([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch shows. Please try again.");
      toast.error("Failed to fetch shows");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getAllShows();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Show loading state
  if (loading) return <Loading />;

  return (
    <>
      <Title text1="List" text2="Shows" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Total Bookings</th>
              <th className="p-2 font-medium">Earnings</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {error ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-red-400">
                  {error}
                </td>
              </tr>
            ) : shows.length > 0 ? (
              shows.map((show, index) => {
                const totalBookings = Object.keys(show.occupiedSeats || {}).length;
                const earnings = totalBookings * (show.showPrice || 0);

                return (
                  <tr
                    key={show._id || index}
                    className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
                  >
                    <td className="p-2 min-w-45 pl-5">
                      {show?.movie?.title || "N/A"}
                    </td>
                    <td className="p-2">
                      {show.showDateTime
                        ? dateFormat(show.showDateTime)
                        : "Invalid Date"}
                    </td>
                    <td className="p-2">{totalBookings}</td>
                    <td className="p-2">
                      {currency} {earnings}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">
                  No shows available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListShows;
