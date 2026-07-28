import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { login } from "../store/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();

  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("email", formData.email);

    data.append("password", formData.password);

    dispatch(login(data));
  };

  if (isAuthenticated && user?.role === "Admin") {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-background relative overflow-hidden">
      {/* background glow */}

      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />

      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-blue-500/10 blur-3xl rounded-full translate-x-1/3 translate-y-1/3" />

      {/* card */}

      <div className="relative z-10 w-full max-w-md">
        <div className="admin-card p-8 md:p-10">
          {/* top */}

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* icon */}

          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>

          {/* heading */}

          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
              Admin Login
            </h1>

            <p className="text-muted-foreground text-base leading-relaxed">
              Access the Flint admin dashboard and manage products, orders,
              analytics, and platform operations.
            </p>
          </div>

          {/* form */}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* email */}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@flint.com"
                className="input-primary h-12"
              />
            </div>

            {/* password */}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  Password
                </label>

                <Link
                  to="/password/forgot"
                  className="text-sm text-primary hover:opacity-80 transition-opacity"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-primary h-12 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* remember */}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-3 text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                Remember me
              </label>

              <span className="text-xs text-muted-foreground">
                Secure Admin Access
              </span>
            </div>

            {/* button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-orange-400 hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          {/* footer */}

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Flint Admin Panel • Secure Access Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
