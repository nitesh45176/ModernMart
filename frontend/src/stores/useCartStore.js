import axios from "axios";
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

    	getMyCoupon: async () => {
		try {
			const response = await axiosInstance.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},
	applyCoupon: async (code) => {
		try {
			const response = await axiosInstance.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},


    getCartItems: async () => {
		try {
			const res = await axiosInstance.get("/cart");
			set({ cart: res.data });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });
			toast.error(error.response.data.message || "An error occurred");
		}
	},
    clearCart:async()=> {
      set({cart:[], coupon:null, total:0, subtotal:0, isCouponApplied:false});
    },
addToCart: async (product) => {
    console.log("🛒 addToCart() store called", product);
    try {
        await axiosInstance.post("/cart", { productId: product._id });
        toast.success("Product added to cart");

        set((prevState) => {
            const existingItem = prevState.cart.find((item) => item._id === product._id);
            const newCart = existingItem
                ? prevState.cart.map((item) =>
                        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                  )
                : [...prevState.cart, { ...product, quantity: 1 }];
            return { cart: newCart };
        });
        
        get().calculateTotals();
        
        // Check if user should get a coupon (after cart update)
        const { subtotal } = get();
        if (subtotal >= 200) { // $200 threshold
            // Fetch updated coupon from server
            setTimeout(() => {
                get().getMyCoupon();
                toast.success("🎉 Congratulations! You earned a discount coupon!", {
                    duration: 4000,
                    style: {
                        background: '#10B981',
                        color: '#fff',
                    },
                });
            }, 1000);
        }
        
    } catch (error) {
        console.log("❌ Error in useCartStore addToCart", error.response?.data);
        toast.error(error.response?.data?.message || "An error occurred");
    }
},

removeFromCart:async (productId)=> {
   await axiosInstance.delete(`/cart`, {data:{productId}});
   set((prevState) => ({ cart: prevState.cart.filter((item)=> item._id !== productId )}))
   get().calculateTotals()
},

updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}

		await axiosInstance.put(`/cart/${productId}`, { quantity });
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
		}));
		get().calculateTotals();
	},

    calculateTotals: () => {
        const {cart, coupon} = get()
        const subtotal = cart.reduce((sum,item) => sum +item.price * item.quantity, 0)
        let total = subtotal;
        
        if (coupon){
            const discount = subtotal * (coupon.discountPercentage / 100)
            total = subtotal - discount;

        }
        set({subtotal, total})
    }
}))