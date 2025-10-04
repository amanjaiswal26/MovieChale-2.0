import express from 'express';
import connectDB from './configs/db.js';
import cors from 'cors'
import { config } from 'dotenv';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

await connectDB(); 
app.get('/', (req,res)=> res.send('Server is Live!'))
app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/show', showRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)

// Debug: Log all registered routes
console.log('📋 Registered routes:');
console.log('  GET  /');
console.log('  POST /api/inngest');
console.log('  /api/show/*');
console.log('  /api/booking/*');
console.log('  /api/admin/*');
console.log('  /api/user/*'); 

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
