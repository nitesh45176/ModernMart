import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import cors from 'cors'
import path from 'path'



dotenv.config();

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,  // allows cookies if you're using them
};
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve()

app.use(cors(corsOptions));
app.use(express.json({limit:"10mb"}));         // Parse JSON body
app.use(cookieParser());        // Parse cookies

app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Connect to DB first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("🟢 Server is running on http://localhost:" + PORT);
  });
}).catch((err) => {
  console.error("❌ DB connection failed:", err);
});
