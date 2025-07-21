import { Product } from "../models/product.model.js";
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const existingItem = user.cart.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();
    res.json(user.cart);
  } catch (error) {
    console.log("❌ Error in addToCart:", error.message);
    res.status(500).json({ message: "Error in addToCart", error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      // Clear the entire cart
      user.cart = [];
    } else {
      // Remove one item by matching `product` field
      user.cart = user.cart.filter(
        (item) => item.product.toString() !== productId
      );
    }

    await user.save();
    res.json(user.cart);
  } catch (error) {
    console.log("❌ Error in removeAllFromCart:", error.message);
    res.status(500).json({ message: "Error in removeFromCart", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      if (quantity === 0) {
        user.cart = user.cart.filter(
          (item) => item.product.toString() !== productId
        );
        await user.save();
        return res.json(user.cart);
      }

      existingItem.quantity = quantity;
      await user.save();
      return res.json(user.cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.log("❌ Error in updateQuantity controller", error.message);
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};




export const getCartProducts = async (req, res) => {
  try {
    const cartItems = req.user.cart; // [{ product, quantity }, ...]

    const productIds = cartItems.map(item => item.product);

    const products = await Product.find({ _id: { $in: productIds } });

    const cartWithDetails = products.map(product => {
      const matched = cartItems.find(item => item.product.toString() === product._id.toString());
      return {
        ...product.toObject(),
        quantity: matched?.quantity || 1,
      };
    });

    res.json(cartWithDetails);
  } catch (error) {
    console.log("❌ Error in getCartProducts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
