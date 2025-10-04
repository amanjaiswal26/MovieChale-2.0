import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import Theater from "../models/Theater.js";

// ✅ API to check if user is admin
export const isAdmin = async (req, res) => {
    try {
        const userId = req.auth().userId; // Get userId from Clerk auth

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // ✅ Fetch the user from MongoDB
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // ✅ Check if the user has admin role
        if (user.role === "admin") {
            return res.json({ success: true, isAdmin: true });
        } else {
            return res.json({ success: true, isAdmin: false });
        }
    } catch (error) {
        console.error("isAdmin error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ API to get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({ isPaid: true });
        const activeShows = await Show.find({
            showDateTime: { $gte: new Date() }
        }).populate("movie");

        const totalUser = await User.countDocuments();
        const theaters = await Theater.find({ isActive: true }).limit(6);
        const totalTheaters = await Theater.countDocuments({ isActive: true });

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUser,
            totalTheaters,
            theaters,
        };

        res.json({ success: true, dashboardData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// ✅ API to get all shows
export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({
            showDateTime: { $gte: new Date() },
        })
            .populate("movie")
            .sort({ showDateTime: 1 });

        res.json({ success: true, shows });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// ✅ API to get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate("user")
            .populate({ path: "show", populate: { path: "movie" } })
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// ✅ API to make a user admin (for development/testing purposes)
export const makeUserAdmin = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.role = "admin";
        await user.save();

        res.json({ success: true, message: "User role updated to admin", user });
    } catch (error) {
        console.error("makeUserAdmin error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ API to get all users (for development/testing purposes)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('_id name email role');
        res.json({ success: true, users });
    } catch (error) {
        console.error("getAllUsers error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ API to create a new theater
export const createTheater = async (req, res) => {
    try {
        const theaterData = req.body;
        
        // Validate required fields
        if (!theaterData.name || !theaterData.location || !theaterData.capacity) {
            return res.status(400).json({ 
                success: false, 
                message: "Name, location, and capacity are required" 
            });
        }

        // Check if theater with same name and location already exists
        const existingTheater = await Theater.findOne({
            name: theaterData.name,
            location: theaterData.location
        });

        if (existingTheater) {
            return res.status(400).json({
                success: false,
                message: "A theater with this name and location already exists"
            });
        }

        const theater = new Theater(theaterData);
        await theater.save();

        res.status(201).json({ 
            success: true, 
            message: "Theater created successfully", 
            theater 
        });
    } catch (error) {
        console.error("createTheater error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Server error" 
        });
    }
};

// ✅ API to get all theaters
export const getAllTheaters = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', isActive = true } = req.query;
        
        const query = {};
        
        // Add search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Add active filter
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const theaters = await Theater.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Theater.countDocuments(query);

        res.json({ 
            success: true, 
            theaters,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("getAllTheaters error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};

// ✅ API to get a single theater by ID
export const getTheaterById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const theater = await Theater.findById(id);
        
        if (!theater) {
            return res.status(404).json({ 
                success: false, 
                message: "Theater not found" 
            });
        }

        res.json({ success: true, theater });
    } catch (error) {
        console.error("getTheaterById error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};

// ✅ API to update a theater
export const updateTheater = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if theater exists
        const existingTheater = await Theater.findById(id);
        if (!existingTheater) {
            return res.status(404).json({ 
                success: false, 
                message: "Theater not found" 
            });
        }

        // Check if name and location combination already exists (excluding current theater)
        if (updateData.name && updateData.location) {
            const duplicateTheater = await Theater.findOne({
                name: updateData.name,
                location: updateData.location,
                _id: { $ne: id }
            });

            if (duplicateTheater) {
                return res.status(400).json({
                    success: false,
                    message: "A theater with this name and location already exists"
                });
            }
        }

        const theater = await Theater.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );

        res.json({ 
            success: true, 
            message: "Theater updated successfully", 
            theater 
        });
    } catch (error) {
        console.error("updateTheater error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Server error" 
        });
    }
};

// ✅ API to delete a theater
export const deleteTheater = async (req, res) => {
    try {
        const { id } = req.params;
        
        const theater = await Theater.findById(id);
        if (!theater) {
            return res.status(404).json({ 
                success: false, 
                message: "Theater not found" 
            });
        }

        // Check if theater has any active shows
        const activeShows = await Show.find({ 
            theater: theater.name,
            showDateTime: { $gte: new Date() }
        });

        if (activeShows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete theater with active shows. Please cancel or move the shows first."
            });
        }

        await Theater.findByIdAndDelete(id);

        res.json({ 
            success: true, 
            message: "Theater deleted successfully" 
        });
    } catch (error) {
        console.error("deleteTheater error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};

// ✅ API to toggle theater active status
export const toggleTheaterStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        const theater = await Theater.findById(id);
        if (!theater) {
            return res.status(404).json({ 
                success: false, 
                message: "Theater not found" 
            });
        }

        theater.isActive = !theater.isActive;
        await theater.save();

        res.json({ 
            success: true, 
            message: `Theater ${theater.isActive ? 'activated' : 'deactivated'} successfully`, 
            theater 
        });
    } catch (error) {
        console.error("toggleTheaterStatus error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};
