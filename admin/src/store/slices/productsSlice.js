import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import {
  toggleCreateProductModal,
  toggleUpdateProductModal,
} from "./extraSlice";

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    fetchingProducts: false,
    products: [],
    totalProducts: 0,
  },
  reducers: {
    createProductRequest(state) {
      state.loading = true;
    },
    createProductSuccess(state, action) {
      state.loading = false;
      state.products = [action.payload, ...state.products];
      state.totalProducts = state.totalProducts+1;
    },
    createProductFailed(state) {
      state.loading = false;
    },
    fetchAllProductsRequest(state) {
      state.fetchingProducts = true;
    },
    fetchAllProductsSuccess(state, action) {
      state.fetchingProducts = false;
      state.products = action.payload.products;
      state.totalProducts = action.payload.totalProducts;
    },
    fetchAllProductsFailed(state) {
      state.fetchingProducts = false;
    },
    updateProductRequest(state) {
      state.loading = true;
    },
    updateProductSuccess(state, action) {
      state.loading = false;
      state.products = state.products.map((product) =>
        product.id === action.payload.id ? action.payload : product,
      );
    },
    updateProductFailed(state) {
      state.loading = false;
    },
    deleteProductRequest(state) {
      state.loading = true;
    },
    deleteProductSuccess(state, action) {
      state.loading = false;
      state.products = state.products.filter(
        (product) => product.id !== action.payload,
      );
      state.totalProducts = Math.max(0, state.totalProducts - 1);
    },
    deleteProductFailed(state) {
      state.loading = false;
    },
  },
});

export const createNewProduct = (data) => async (dispatch) => {
  dispatch(productSlice.actions.createProductRequest());
  await axiosInstance
    .post("/product/new", data)
    .then((res) => {
      dispatch(productSlice.actions.createProductSuccess(res.data.product));
      toast.success(res.data.message || "Product created successfully.");
      dispatch(toggleCreateProductModal());
    })
    .catch((error) => {
      dispatch(productSlice.actions.createProductFailed());
      toast.error(error?.response?.data?.message || "Failed to crete product.");
    });
};

export const fetchAllProducts =({
    page = 1,
    search = "",
    category = "",
    availability = "",
    ratings = "",
    price = "",
  } = {}) =>
  async (dispatch) => {
    dispatch(productSlice.actions.fetchAllProductsRequest());
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      if (search.trim()) params.append("search", search);
      if (category) params.append("category", category);
      if (availability) params.append("availability", availability);
      if (ratings) params.append("ratings", ratings);
      if (price) params.append("price", price);
      const { data } = await axiosInstance.get(
        `/product/all?${params.toString()}`,
      );
      dispatch(productSlice.actions.fetchAllProductsSuccess(data));
    } catch (error) {
      dispatch(productSlice.actions.fetchAllProductsFailed());
      toast.error(
        error?.response?.data?.message || "Failed to fetch products.",
      );
    }
  };

export const updateProduct = (data, id) => async (dispatch) => {
  dispatch(productSlice.actions.updateProductRequest());
  await axiosInstance
    .put(`/product/${id}`, data)
    .then((res) => {
      dispatch(productSlice.actions.updateProductSuccess(res.data.product));
      toast.success(res.data.message || "Product updated successfully.");
      dispatch(toggleUpdateProductModal());
    })
    .catch((error) => {
      dispatch(productSlice.actions.updateProductFailed());
      toast.error(
        error?.response?.data?.message || "Failed to update product.",
      );
    });
};

export const deleteProduct = (id, page) => async (dispatch, getState) => {
  dispatch(productSlice.actions.deleteProductRequest());
  await axiosInstance
    .delete(`/product/${id}`)
    .then((res) => {
      dispatch(productSlice.actions.deleteProductSuccess(id));
      toast.success(res.data.message || "Product deleted successfully.");
      const state = getState();
      const updatedTotal = state.product.totalProducts;
      const updatedMaxPage = Math.ceil(updatedTotal / 10) || 1;
      const validPage = Math.min(page, updatedMaxPage);
      dispatch(fetchAllProducts(validPage));
    })
    .catch((error) => {
      dispatch(productSlice.actions.deleteProductFailed());
      toast.error(
        error?.response?.data?.message || "Failed to delete product.",
      );
    });
};

export default productSlice.reducer;
