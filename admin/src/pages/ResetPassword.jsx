import { useState } from "react";

import { Navigate, useParams, Link } from "react-router-dom";

import { LockKeyhole, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { resetPassword } from "../store/slices/authSlice";

const ResetPassword = () => {
  const { token } = useParams();

  const dispatch = useDispatch();

  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      resetPassword(
        {
          password: formData.password,

          confirmPassword: formData.confirmPassword,
        },
        token,
      ),
    );
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
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          {/* icon */}

          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
            <LockKeyhole className="w-8 h-8 text-primary" />
          </div>

          {/* heading */}

          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
              Reset Password
            </h1>

            <p className="text-muted-foreground text-base leading-relaxed">
              Create a new secure password for your Flint Admin account.
            </p>
          </div>

          {/* form */}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* password */}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
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

            {/* confirm password */}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="input-primary h-12 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* security note */}

            <div className="rounded-2xl border border-border bg-secondary/40 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    Security Tip
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Use at least 8 characters with a mix of uppercase,
                    lowercase, numbers, and symbols.
                  </p>
                </div>
              </div>
            </div>

            {/* submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-orange-400 hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <LockKeyhole className="w-5 h-5" />
                  Reset Password
                </>
              )}
            </button>
          </form>

          {/* footer */}

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Flint Admin Security System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
