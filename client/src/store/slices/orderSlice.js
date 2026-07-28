import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { axiosInstance } from "../../lib/axios";

import { toast } from "react-toastify";

import { clearCart, clearCheckOutItem } from "./cartSlice";

export const fetchMyOrders = createAsyncThunk(
  "order/orders/me",

  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/orders/me");

      return res.data.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const placeOrder = createAsyncThunk(
  "order/new",

  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/orders/new", data);

      toast.success(res.data.message);

      return res.data;
    } catch (error) {
      toast.error(
        error.response.data.message || "Failed to place order. Try again.",
      );

      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to place order. Try again.",
      );
    }
  },
);

export const startPayment = createAsyncThunk(
  "order/startPayment",

  async ({ shippingDetails, onSuccess }, thunkAPI) => {
    try {
      const { getState, dispatch } = thunkAPI;

      const state = getState();

      const authUser = state.auth.authUser;
      const currentOrderId = state.order.currentOrderId;

      const res = await axiosInstance.post("/payment/order", {
        orderId: currentOrderId,
      });

      const razorpayOrder = res.data.razorpayOrder;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "FLINT",

        description: "Secure Order Payment",

        image: "/flint.png",

        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            const verifyRes = await axiosInstance.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,

              orderId: currentOrderId,
            });

            if (verifyRes.data.success) {
              toast.success("Payment Successful");

              dispatch(clearCart());
              dispatch(clearCheckOutItem());
              dispatch(resetCurrentOrder());

              if (onSuccess) {
                onSuccess();
              }
            }
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: authUser.name,

          email: authUser.email,

          contact: shippingDetails.phone,
        },

        notes: {
          address: shippingDetails.address,
        },

        theme: {
          color: "#000000",
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();

      razorpay.on("payment.failed", function (response) {
        toast.error("Payment Failed");

        console.log(response.error);
      });

      return true;
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to initialize payment",
      );

      return thunkAPI.rejectWithValue(
        error.response?.data?.message,
      );
    }
  },
);

const orderSlice = createSlice({
  name: "order",

  initialState: {
    myOrders: [],

    fetchingOrders: false,

    placingOrder: false,

    paymentLoading: false,

    finalPrice: null,

    currentOrderId: null,

    orderStep: 1,
  },

  reducers: {
    resetOrderStep(state) {
      state.orderStep = 1;
    },

    resetCurrentOrder(state) {
      state.currentOrderId = null;

      state.finalPrice = null;

      state.orderStep = 1;
    },
  },

  extraReducers: (builder) => {
    builder

      // fetch orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.fetchingOrders = true;
      })

      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.fetchingOrders = false;

        state.myOrders = action.payload;
      })

      .addCase(fetchMyOrders.rejected, (state) => {
        state.fetchingOrders = false;
      })

      // place order
      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
      })

      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false;

        state.currentOrderId = action.payload.order_id;

        state.finalPrice = action.payload.total_price || null;

        state.orderStep = 2;
      })

      .addCase(placeOrder.rejected, (state) => {
        state.placingOrder = false;
      })

      // payment
      .addCase(startPayment.pending, (state) => {
        state.paymentLoading = true;
      })

      .addCase(startPayment.fulfilled, (state) => {
        state.paymentLoading = false;
      })

      .addCase(startPayment.rejected, (state) => {
        state.paymentLoading = false;
      });
  },
});

export const { resetOrderStep, resetCurrentOrder } = orderSlice.actions;

export default orderSlice.reducer;
