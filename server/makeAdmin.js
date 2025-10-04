import mongoose from "mongoose";
import User from "./models/User.js";
import { config } from "dotenv";

// Load environment variables
config();

const makeUserAdmin = async (userId) => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Find the user
        const user = await User.findById(userId);
        
        if (!user) {
            console.log("User not found with ID:", userId);
            return;
        }

        // Update user role to admin
        user.role = "admin";
        await user.save();

        console.log(`User ${user.name} (${user.email}) has been made an admin successfully!`);
        
    } catch (error) {
        console.error("Error making user admin:", error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log("Database connection closed");
    }
};

// Get userId from command line arguments
const userId = process.argv[2];

if (!userId) {
    console.log("Usage: node makeAdmin.js <userId>");
    console.log("Example: node makeAdmin.js user_2abc123def456");
    process.exit(1);
}

makeUserAdmin(userId);
