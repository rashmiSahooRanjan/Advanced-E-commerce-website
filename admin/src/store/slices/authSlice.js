import { createSlice } from "@reduxjs/toolkit";
import { data } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    loginRequest(state) {
      state.loading = true;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    loginFail(state) {
      state.loading = false;
    },
    getUserRequest(state) {
      state.loading = true;
    },
    getUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    getUserFail(state) {
      state.loading = false;
    },
    logoutRequest(state) {
      state.loading = true;
    },
    logoutSuccess(state, action) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    logoutFail(state) {
      state.loading = false;
    },
    forgotPasswordRequest(state) {
      state.loading = true;
    },
    forgotPasswordSuccess(state) {
      state.loading = false;
    },
    forgotPasswordFail(state) {
      state.loading = false;
    },
    resetPasswordRequest(state) {
      state.loading = true;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    resetPasswordFail(state) {
      state.loading = false;
    },
    updateProfileRequest(state) {
      state.loading = true;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateProfileFail(state) {
      state.loading = false;
    },
    updatePasswordRequest(state) {
      state.loading = true;
    },
    updatePasswordSuccess(state) {
      state.loading = false;
    },
    updatePasswordFail(state) {
      state.loading = false;
    },
    resetAuthSlice(state) {
      state.loading = false;
      state.user = state.user;
      state.isAuthenticated = state.isAuthenticated;
    },
  },
});

export const login = (data) => async (dispatch) => {
  dispatch(authSlice.actions.loginRequest());
  try {
    await axiosInstance.post("/auth/login", data).then((res) => {
      if (res.data.user.role === "Admin") {
        dispatch(authSlice.actions.loginSuccess(res.data.user));
        toast.success(res.data.message);
      } else {
        dispatch(authSlice.actions.loginFail());
        toast.error("You are not an admin.");
        window.location.href = "http://localhost:5173";
      }
    });
  } catch (error) {
    dispatch(authSlice.actions.loginFail());
    toast.error(error.response.data.message || "Login Failed");
  }
};
export const getUser = () => async (dispatch) => {
  dispatch(authSlice.actions.getUserRequest());
  try {
    await axiosInstance.get("/auth/me").then((res) => {
      dispatch(authSlice.actions.getUserSuccess(res.data.user));
    });
  } catch (error) {
    dispatch(authSlice.actions.getUserFail());
  }
};
export const logout = () => async (dispatch) => {
  dispatch(authSlice.actions.logoutRequest());
  try {
    await axiosInstance.get("/auth/logout", data).then((res) => {
      dispatch(authSlice.actions.logoutSuccess());
      toast.success(res.data.message);
      dispatch(authSlice.actions.resetAuthSlice());
    });
  } catch (error) {
    dispatch(authSlice.actions.logoutFail());
    toast.error(error.response.data.message);
    dispatch(authSlice.actions.resetAuthSlice());
  }
};
export const forgotPassword = (email) => async (dispatch) => {
  dispatch(authSlice.actions.forgotPasswordRequest());
  try {
    await axiosInstance.post("/auth/password/forgot", email).then((res) => {
      dispatch(authSlice.actions.forgotPasswordSuccess());
      toast.success(res.data.message);
    });
  } catch (error) {
    dispatch(authSlice.actions.forgotPasswordFail());
    toast.error(
      error.response.data.message || "Cannot request for reset password.",
    );
  }
};
export const resetPassword = (newData, token) => async (dispatch) => {
  dispatch(authSlice.actions.resetPasswordRequest());
  try {
    await axiosInstance
      .put(`/auth/password/reset/${token}`, newData)
      .then((res) => {
        dispatch(authSlice.actions.resetPasswordSuccess());
        toast.success(res.data.message);
      });
  } catch (error) {
    dispatch(authSlice.actions.resetPasswordFail());
    toast.error(error.response.data.message || "Failed to reset password.");
  }
};
export const updateAdminProfile = (data) => async (dispatch) => {
  dispatch(authSlice.actions.updateProfileRequest());
  try {
    await axiosInstance.put("/auth/profile/update", data).then((res) => {
      dispatch(authSlice.actions.updateProfileSuccess());
      toast.success(res.data.message);
    });
  } catch (error) {
    dispatch(authSlice.actions.resetPasswordFail());
    toast.error(error.response.data.message || "Failed to update profile.");
  }
};
export const updateAdminPassword = (data) => async (dispatch) => {
  dispatch(authSlice.actions.updatePasswordRequest());
  try {
    await axiosInstance.put("/auth/password/update", data).then((res) => {
      dispatch(authSlice.actions.updatePasswordSuccess());
      toast.success(res.data.message);
    });
  } catch (error) {
    dispatch(authSlice.actions.resetPasswordFail());
    toast.error(error.response.data.message || "Failed to update password.");
  }
};
export const resetAuthSlice = () => (dispatch) => {
  dispatch(authSlice.actions.resetAuthSlice());
};

export default authSlice.reducer;