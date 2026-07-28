import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// ======================
// THUNKS
// ======================

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return res.data.user;
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong.";
      // 401 is expected when user isn't logged in
      if (error?.response?.status !== 401) {
        toast.error(message);
      }
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/register", formData);
      toast.success("Account created.");
      return res.data.user;
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      toast.success("Welcome back.");
      return res.data.user;
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await axiosInstance.get("/auth/logout");
    toast.success("Logged out.");
    return null;
  } catch (error) {
    const message = error?.response?.data?.message || "Something went wrong.";
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/auth/profile/update", formData);
      toast.success("Profile updated.");
      return res.data.user;
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (formData, thunkAPI) => {
    try {
      await axiosInstance.put("/auth/password/update", formData);
      toast.success("Password updated.");
      return true;
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/password/forgot", formData);
      toast.success(res.data.message);
      return true;
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password, confirmPassword }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/auth/password/reset/${token}`, {
        password,
        confirmPassword,
      });
      toast.success(res.data.message);
      return true;
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// ======================
// SLICE
// ======================

const authSlice = createSlice({
  name: "auth",

  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.authUser = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        state.authUser = null;
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isSigningUp = false;
        state.authUser = action.payload;
      })
      .addCase(register.rejected, (state) => {
        state.isSigningUp = false;
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.authUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.authUser = action.payload;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      })

      // UPDATE PASSWORD
      .addCase(updatePassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isUpdatingPassword = false;
      })
      .addCase(updatePassword.rejected, (state) => {
        state.isUpdatingPassword = false;
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.isRequestingForToken = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isRequestingForToken = false;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.isRequestingForToken = false;
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isUpdatingPassword = false;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isUpdatingPassword = false;
      });
  },
});

export default authSlice.reducer;
