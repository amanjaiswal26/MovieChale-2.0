import User from "../models/User.js";

export const protectAdmin = async (req, res, next) => {
    try {
        const userId = req.auth().userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "not authorized" });
        }

        const user = await User.findById(userId);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "not authorized" });
        }
        
        next();
    } catch (error) {
        console.error("protectAdmin error:", error);
        return res.status(500).json({ success: false, message: "not authorized" });
    }
}