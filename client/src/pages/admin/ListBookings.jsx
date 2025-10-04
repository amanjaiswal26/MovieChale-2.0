import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import toast from 'react-hot-toast';

const ListBookings = () => {
  const { axios, getToken, user } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all bookings from API
  const getAllBookings = async () => {
    try {
      const { data } = await axios.get("/api/admin/bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else {
        setBookings([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch bookings. Please try again.");
      toast.error("Failed to fetch bookings");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getAllBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Show loading state
  if (loading) return <Loading />;

  return (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-6xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
              <th className="p-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {error ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-red-400">
                  {error}
                </td>
              </tr>
            ) : bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <tr
                  key={booking._id || index}
                  className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
                >
                  <td className="p-2 pl-5">
                    {booking?.user?.name || "N/A"}
                  </td>
                  <td className="p-2">
                    {booking?.show?.movie?.title || "N/A"}
                  </td>
                  <td className="p-2">
                    {booking?.show?.showDateTime
                      ? dateFormat(booking.show.showDateTime)
                      : "Invalid Date"}
                  </td>
                  <td className="p-2">
                    {booking?.bookedSeats?.join(", ") || "N/A"}
                  </td>
                  <td className="p-2">
                    {currency} {booking?.amount || 0}
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking?.isPaid 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {booking?.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-400">
                  No bookings available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListBookings;
