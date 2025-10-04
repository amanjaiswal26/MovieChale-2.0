import Booking from "../models/Booking.js";
import { clerkClient } from "@clerk/express";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

// API Controller Function to Get User Bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.auth().userId;

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);

    // Initialize favorites if missing
    if (!user.privateMetadata.favorites) {
      user.privateMetadata.favorites = [];
    }

    // Add movieId if not already in favorites
    if (!user.privateMetadata.favorites.includes(movieId)) {
      user.privateMetadata.favorites.push(movieId);
    } else {
          user.privateMetadata.favorites= user.privateMetadata.favorites.filter(item=> item !=movieId)
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: user.privateMetadata,
    });

    res.json({ success: true, message: "Favorite movies updated." });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
}

export const getFavorites = async (req, res) =>{
try {
const user = await clerkClient.users.getUser(req.auth().userId)
const favorites = user.privateMetadata.favorites;

// Getting movies from database
const movies = await Movie. find({_id: {$in: favorites}})

res.json({success: true, movies})
} catch (error) {
console.error(error.message);
res. json({ success: false, message: error.message });
}
}

// API to create or update user in MongoDB
export const createOrUpdateUser = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const { name, email, image } = req.body;

    if (!userId || !name || !email) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check if user already exists
    let user = await User.findById(userId);
    
    if (user) {
      // Update existing user
      user.name = name;
      user.email = email;
      user.image = image || user.image;
      await user.save();
    } else {
      // Create new user
      user = new User({
        _id: userId,
        name,
        email,
        image: image || "",
        role: "user" // Default role
      });
      await user.save();
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("createOrUpdateUser error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

