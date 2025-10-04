import Booking from "../models/Booking.js";
import Show from "../models/Show.js"

// Function to check availability of selected seats for a movie
const checkseatsAvailability = async (showId, selectedSeats)=>{
try {
const showData = await Show. findById(showId)
if(!showData) return false;

const occupiedSeats = showData.occupiedSeats;
const isAnySeatTaken = selectedSeats. some(seat => occupiedSeats[seat]) ;
return !isAnySeatTaken;
} catch (error) {
console.log(error.message);
return false;
}
}
export const createBooking = async (req, res)=>{
try {
const userId = req.auth().userId;
const {showId, bookedSeats, amount} = req.body;

if (!showId || !bookedSeats || !amount) {
    return res.status(400).json({success: false, message: "Missing required fields"})
}

const isAvailable = await checkseatsAvailability(showId, bookedSeats)

if(!isAvailable){
return res.json({success: false, message: "Selected Seats are not available."})
}

// Get the show details
const showData = await Show.findById(showId).populate('movie');

const booking = await Booking.create({
user: userId,
show: showId,
amount: amount,
bookedSeats: bookedSeats
})

// Update occupied seats
bookedSeats.forEach((seat)=>{
showData.occupiedSeats[seat] = userId;
})

showData.markModified('occupiedSeats');
await showData.save();

res.json({success: true, message: 'Booked successfully', booking})


} catch (error) {
    console.log(error.message);
    res.json({success: false, message: error.message})
}
}


export const getOccupiedSeats = async (req, res)=>{
try {

const {showId} = req.params;
const showData = await Show.findById(showId)

const occupiedSeats = Object.keys(showData.occupiedSeats)



res. json({success: true, occupiedSeats})

} catch (error) {
console.log(error.message);
res.json({success: false, message: error.message})
}
}


