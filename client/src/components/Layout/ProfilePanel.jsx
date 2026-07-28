import { useEffect, useState } from "react";
import { X, LogOut, Upload, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  logout,
  updatePassword,
  updateProfile,
} from "../../store/slices/authSlice";

import { toggleAuthPopup } from "../../store/slices/popupSlice";

const ProfilePanel = () => {
  const dispatch = useDispatch();
  const { isAuthPopupOpen } = useSelector((state) => state.popup);
  const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector(
    (state) => state.auth,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authUser) {
      setName(authUser.name || "");
      setAvatarPreview(authUser?.avatar?.url || "");
      setEmail(authUser.email || "");
    }
  }, [authUser]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(toggleAuthPopup());
  };

  const handleUpdateProfile = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    dispatch(updateProfile(formData));
  };

  const handleUpdatePassword = () => {
    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);
    dispatch(updatePassword(formData));
  };

  if (!isAuthPopupOpen || !authUser) {
    return null;
  }

  return (
    <>
      {/* backdrop */}
      <div
        onClick={() => dispatch(toggleAuthPopup())}
        className="
          fixed
          inset-0
          z-40
         bg-black/40
          backdrop-blur-md

          animate-in
          fade-in
          duration-300
        "
      />

      {/* panel */}
      <aside
        className="
          fixed
          right-0
          top-0
          z-50
          h-screen
          w-96
          bg-background
          border-l border-border
          shadow-xl
          overflow-y-auto

          animate-in
          slide-in-from-right
          fade-in
          duration-300
        "
      >
        {/* header */}
        <div
          className="
            flex
            items-center
            justify-between
            h-16
            px-5
            border-b border-border
          "
        >
          <h2
            className="
              text-xl
              font-bold
              text-primary
            "
          >
            Profile
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
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* avatar */}
          <div
            className="
              text-center
              mb-8
            "
          >
            <img
              src={avatarPreview || "/avatar-holder.avif"}
              alt={authUser?.name}
              className="
                w-20
                h-20
                rounded-full
                object-cover
                border-2
                border-primary
                mx-auto
                mb-4
              "
            />

            <h3
              className="
                font-semibold
                text-lg
              "
            >
              {authUser.name}
            </h3>

            <p
              className="
                text-muted-foreground
              "
            >
              {authUser.email}
            </p>
          </div>

          {/* profile */}
          <div
            className="
              space-y-4
              mb-10
            "
          >
            <h3
              className="
                font-semibold
                text-primary
              "
            >
              Update Profile
            </h3>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border border-border
                bg-secondary
              "
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border border-border
                bg-secondary
              "
            />

            <label
              className="
                flex
                items-center
                gap-2
                cursor-pointer
                text-sm
              "
            >
              <Upload className="w-4 h-4" />
              Upload Avatar
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (!file) return;

                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }}
              />
            </label>

            <button
              disabled={isUpdatingProfile}
              onClick={handleUpdateProfile}
              className="
                w-full
                py-3
                rounded-xl
                bg-primary
                text-primary-foreground
              "
            >
              {isUpdatingProfile ? "Updating..." : "Save Changes"}
            </button>
          </div>

          {/* password */}
          <div
            className="
              space-y-4
            "
          >
            <h3
              className="
                font-semibold
                text-primary
              "
            >
              Update Password
            </h3>

            {[
              [currentPassword, setCurrentPassword, "Current Password"],
              [newPassword, setNewPassword, "New Password"],
              [confirmPassword, setConfirmPassword, "Confirm Password"],
            ].map(([value, setter, placeholder]) => (
              <input
                key={placeholder}
                type={showPassword ? "text" : "password"}
                value={value}
                placeholder={placeholder}
                onChange={(e) => setter(e.target.value)}
                className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border border-border
                    bg-secondary
                  "
              />
            ))}

            <button
              onClick={() => setShowPassword((prev) => !prev)}
              className="
                flex
                items-center
                gap-2
                text-sm
                text-primary
              "
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}

              {showPassword ? "Hide Password" : "Show Password"}
            </button>

            <button
              disabled={isUpdatingPassword}
              onClick={handleUpdatePassword}
              className="
                w-full
                py-3
                rounded-xl
                bg-primary
                text-primary-foreground
              "
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>

          {/* logout */}
          <button
            onClick={handleLogout}
            className="
              mt-10
              flex
              items-center
              gap-3
              text-red-500
            "
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default ProfilePanel;
