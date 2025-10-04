import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Theater name is required"],
        trim: true,
        maxlength: [100, "Theater name cannot exceed 100 characters"]
    },
    location: {
        type: String,
        required: [true, "Theater location is required"],
        trim: true,
        maxlength: [100, "Location cannot exceed 100 characters"]
    },
    address: {
        type: String,
        trim: true,
        maxlength: [200, "Address cannot exceed 200 characters"]
    },
    city: {
        type: String,
        trim: true,
        maxlength: [50, "City cannot exceed 50 characters"]
    },
    state: {
        type: String,
        trim: true,
        maxlength: [50, "State cannot exceed 50 characters"]
    },
    zipCode: {
        type: String,
        trim: true,
        maxlength: [10, "ZIP code cannot exceed 10 characters"]
    },
    phone: {
        type: String,
        trim: true,
        maxlength: [20, "Phone number cannot exceed 20 characters"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [100, "Email cannot exceed 100 characters"],
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },
    capacity: {
        type: Number,
        required: [true, "Theater capacity is required"],
        min: [1, "Capacity must be at least 1"],
        max: [10000, "Capacity cannot exceed 10,000"]
    },
    amenities: [{
        type: String,
        trim: true,
        maxlength: [50, "Amenity name cannot exceed 50 characters"]
    }],
    description: {
        type: String,
        trim: true,
        maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for better query performance
theaterSchema.index({ name: 1, location: 1 });
theaterSchema.index({ isActive: 1 });

// Virtual for full address
theaterSchema.virtual('fullAddress').get(function() {
    const parts = [this.address, this.city, this.state, this.zipCode].filter(Boolean);
    return parts.join(', ');
});

// Ensure virtual fields are serialized
theaterSchema.set('toJSON', { virtuals: true });

const Theater = mongoose.model("Theater", theaterSchema);

export default Theater;

