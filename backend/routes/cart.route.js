import express from 'express';
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity
} from '../controllers/cart.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get all cart products
router.get("/", protectRoute, getCartProducts);   // ✅ GET /api/cart

// Add product to cart
router.post("/", protectRoute, addToCart);        // ✅ POST /api/cart

// Remove all or one product
router.delete("/", protectRoute, removeAllFromCart);  // ✅ DELETE /api/cart

// Update quantity
router.put("/:id", protectRoute, updateQuantity);     // ✅ PUT /api/cart/:id

export default router;
