import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAIModal } from "./popupSlice";

export const fetchAllProducts = createAsyncThunk(
  "product/all",
  async (
    {
      availability = "",
      price = "0-10000000",
      category = "",
      ratings = "",
      search = "",
      page = "1",
    },
    thunkAPI,
  ) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (price) params.append("price", price);
      if (ratings) params.append("ratings", ratings);
      if (availability) params.append("availability", availability);
      if (page) params.append("page", page);
      if (search) params.append("search", search);

      const res = await axiosInstance.get(`/product/all?${params.toString()}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to fetch products.",
      );
    }
  },
);

export const fetchProductDetails = createAsyncThunk(
  "product/singleProduct",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/product/${id}`);
      return res.data.product;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to fetch the product details.",
      );
    }
  },
);

export const postReview = createAsyncThunk(
  "product/postReview",
  async ({productId, review}, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/product/${productId}/review`, review);
      toast.success(res.data.message);
      return res.data.review;
    } catch (error) {
      const message = error.response.data.message || "Failed to post Review";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteReview = createAsyncThunk(
  "product/deleteReview",
  async ({productId, reviewId}, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/product/${productId}/review`);
      toast.success(res.data.message);
      return reviewId;
    } catch (error) {
      const message = error.response.data.message || "Failed to delete Review";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchProductWithAI = createAsyncThunk(
  "product/fetchProductWithAI",
  async (userPrompt, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/product/ai/recommendation", userPrompt);
      thunkAPI.dispatch(toggleAIModal());
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to fetch AI filtered Products.",
      );
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    productDetails: null,
    totalProducts: 0,
    topRatedProducts: [],
    newProducts: [],
    aiSearching: false,
    isReviewDeleting: false,
    isPostingReview: false,
    productReviews: [],
  },
  extraReducers: (builder) => {
    builder
      
    // Fetch all the Products.
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.newProducts = action.payload.newProducts;
        state.topRatedProducts = action.payload.topRatedProducts;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.loading = false;
      })

    // Fetch a single Product.
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
        state.productReviews = action.payload.reviews;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.loading = false;
      })

    // Post Review
      .addCase(postReview.pending, (state) => {
        state.isPostingReview = true;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.isPostingReview = false;
        state.productReviews = [action.payload, ...state.productReviews];
      })
      .addCase(postReview.rejected, (state) => {
        state.isPostingReview = false;
      })

    // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.isReviewDeleting = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isReviewDeleting = false;
        state.productReviews = state.productReviews.filter(review => review.id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state) => {
        state.isReviewDeleting = false;
      })

    // Fetch Products with AI.
      .addCase(fetchProductWithAI.pending, (state) => {
        state.aiSearching = true;
      })
      .addCase(fetchProductWithAI.fulfilled, (state, action) => {
        state.aiSearching = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.products.length;
      })
      .addCase(fetchProductWithAI.rejected, (state) => {
        state.aiSearching = false;
      })

    
  },
});

export default productSlice.reducer;
