import { useState, useEffect } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toggleAuthPopup, openAuthPopup } from "../../store/slices/popupSlice";

import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from "../../store/slices/authSlice";

const MODES = {
  SIGNIN: "signin",
  SIGNUP: "signup",
  FORGOT: "forgot",
  RESET: "reset",
};

const LoginModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { authUser, isSigningUp, isLoggingIn, isRequestingForToken } =
    useSelector((state) => state.auth);
  const { isAuthPopupOpen } = useSelector((state) => state.popup);
  const [mode, setMode] = useState(MODES.SIGNIN);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isLoading = isSigningUp || isLoggingIn || isRequestingForToken;
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetFields = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  useEffect(() => {
    if (location.pathname.startsWith("/password/reset/")) {
      setMode(MODES.RESET);
      dispatch(openAuthPopup());
    }
  }, [location.pathname, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === MODES.FORGOT) {
        await dispatch(
          forgotPassword({
            email: formData.email,
          }),
        ).unwrap();

        dispatch(toggleAuthPopup());
        setMode(MODES.SIGNIN);
        resetFields();
        return;
      }

      if (mode === MODES.RESET) {
        const token = location.pathname.split("/").pop();
        await dispatch(
          resetPassword({
            token,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        ).unwrap();

        dispatch(toggleAuthPopup());
        setMode(MODES.SIGNIN);
        resetFields();
        return;
      }

      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);
      try {
        if (mode === MODES.SIGNUP) {
          data.append("name", formData.name);
          data.append("confirmPassword", formData.confirmPassword);
          await dispatch(register(data)).unwrap();
        } else {
          await dispatch(login(data)).unwrap();
        }

        resetFields();
        dispatch(toggleAuthPopup());
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!isAuthPopupOpen || authUser) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
      "
    >
      {/* overlay */}
      <div
        onClick={() => dispatch(toggleAuthPopup())}
        className="
          absolute
          inset-0
          bg-black/40
          backdrop-blur-md
        "
      />

      {/* modal */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          mx-4
          p-6
          rounded-3xl
          border border-border
          bg-background
          shadow-xl
        "
      >
        {/* header */}
        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >
          <h2
            className="
              text-2xl
              font-bold
              text-primary
            "
          >
            {mode === MODES.RESET
              ? "Reset Password"
              : mode === MODES.SIGNUP
                ? "Create Account"
                : mode === MODES.FORGOT
                  ? "Forgot Password"
                  : "Welcome Back"}
          </h2>

          <button
            onClick={() => dispatch(toggleAuthPopup())}
            className="
              p-2
              rounded-xl
              hover:bg-secondary
              transition-all
            "
          >
            <X
              className="
                w-5
                h-5
                text-foreground
              "
            />
          </button>
        </div>

        {/* form */}
        <form
          onSubmit={handleSubmit}
          className="
            space-y-4
          "
        >
          {/* name */}
          {mode === MODES.SIGNUP && (
            <div
              className="
                relative
              "
            >
              <User
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  w-5
                  h-5
                  text-muted-foreground
                "
              />

              <input
                autoFocus
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  rounded-xl
                  border border-border
                  bg-secondary
                  text-foreground
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary
                "
                required
              />
            </div>
          )}

          {/* email */}
          {mode !== MODES.RESET && (
            <div
              className="
                relative
              "
            >
              <Mail
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  w-5
                  h-5
                  text-muted-foreground
                "
              />

              <input
                autoFocus
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  rounded-xl
                  border border-border
                  bg-secondary
                  text-foreground
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary
                "
                required
              />
            </div>
          )}

          {/* password */}
          {mode !== MODES.FORGOT && (
            <div
              className="
                relative
              "
            >
              <Lock
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  w-5
                  h-5
                  text-muted-foreground
                "
              />

              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  rounded-xl
                  border border-border
                  bg-secondary
                  text-foreground
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary
                "
                required
              />
            </div>
          )}

          {/* confirm password */}
          {(mode === MODES.RESET || mode === MODES.SIGNUP) && (
            <div
              className="
                relative
              "
            >
              <Lock
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  w-5
                  h-5
                  text-muted-foreground
                "
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  rounded-xl
                  border border-border
                  bg-secondary
                  text-foreground
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary
                "
                required
              />
            </div>
          )}

          {/* forgot */}
          {mode === MODES.SIGNIN && (
            <div
              className="
                text-right
                text-sm
              "
            >
              <button
                type="button"
                onClick={() => setMode(MODES.FORGOT)}
                className="
                  text-primary
                  hover:opacity-80
                "
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full
              py-3
              rounded-xl
              bg-primary
              text-primary-foreground
              font-medium
              flex
              justify-center
              items-center
              gap-2
              disabled:opacity-70
            "
          >
            {isLoading ? (
              <>
                <div
                  className="
                    w-5
                    h-5
                    border-2
                    border-white
                    border-t-transparent
                    rounded-full
                    animate-spin
                  "
                />
                Processing...
              </>
            ) : mode === MODES.RESET ? (
              "Reset Password"
            ) : mode === MODES.SIGNUP ? (
              "Create Account"
            ) : mode === MODES.FORGOT ? (
              "Send Reset Email"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* switch */}
        {[MODES.SIGNIN, MODES.SIGNUP].includes(mode) && (
          <div
            className="
              mt-6
              text-center
            "
          >
            <button
              type="button"
              onClick={() =>
                setMode((prev) =>
                  prev === MODES.SIGNUP ? MODES.SIGNIN : MODES.SIGNUP,
                )
              }
              className="
                text-primary
                hover:opacity-80
              "
            >
              {mode === MODES.SIGNUP
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
