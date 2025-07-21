import { create } from "zustand";
import axiosInstance from "../lib/axios";
import axios from "axios";
import toast from "react-hot-toast";

export const useProductStore = create((set) => ({
  allProducts: [],
  featuredProducts: [],
  loading: false,
  error: null,

  // ⬇️ SET FUNCTIONS
  setAllProducts: (products) => set({ allProducts: products }),
  setFeaturedProducts: (products) => set({ featuredProducts: products }),

  // ⬇️ CREATE PRODUCT
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/products", productData);
      set((state) => ({
        allProducts: [...state.allProducts, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to create product");
      set({ loading: false });
    }
  },

  // ⬇️ FETCH ALL PRODUCTS
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/products");
      set({ allProducts: res.data.products, loading: false });
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to fetch products");
      set({ loading: false });
    }
  },

  // ⬇️ FETCH PRODUCTS BY CATEGORY
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/products/category/${category}`);
      set({ allProducts: res.data.products, loading: false });
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to fetch products");
      set({ loading: false });
    }
  },

  // ⬇️ FETCH FEATURED PRODUCTS
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/products/featured"); // use absolute path here if needed
      set({ featuredProducts: res.data.products, loading: false });
    } catch (error) {
      console.error("Failed to fetch featured products", error);
      set({ loading: false });
    }
  },

  // ⬇️ DELETE PRODUCT
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/products/${productId}`);
      set((state) => ({
        allProducts: state.allProducts.filter((p) => p._id !== productId),
        loading: false,
      }));
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to delete product");
      set({ loading: false });
    }
  },

  // ⬇️ TOGGLE FEATURED PRODUCT
 // ⬇️ TOGGLE FEATURED PRODUCT
// ⬇️ TOGGLE FEATURED PRODUCT
// ⬇️ TOGGLE FEATURED PRODUCT
toggleFeaturedProduct: async (productId) => {
  try {
    const res = await axiosInstance.patch(`/products/${productId}`);

    if (res.data) {
      // Update allProducts
      set((state) => ({
        allProducts: state.allProducts.map((p) =>
          p._id === res.data._id ? res.data : p
        ),
      }));

      // Refetch featured products to sync with backend
      const { fetchFeaturedProducts } = useProductStore.getState();
      await fetchFeaturedProducts();
      
      toast.success("Product updated successfully");
    }
  } catch (error) {
    console.error("Failed to update product", error);
    toast.error(error?.response?.data?.error || "Failed to update product");
  }
},
}));
