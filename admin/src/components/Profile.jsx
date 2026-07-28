import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Camera, User, Mail, Shield, Lock } from "lucide-react";

import avatarImage from "../assets/avatar.jpg";

import {
  updateAdminPassword,
  updateAdminProfile,
} from "../store/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);

  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [avatar, setAvatar] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setAvatar(file);
    }
  };

  const handleProfileChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = () => {
    const formData = new FormData();

    formData.append("name", editData.name);
    formData.append("email", editData.email);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    dispatch(updateAdminProfile(formData));
  };

  const updatePassword = () => {
    const formData = new FormData();

    formData.append("currentPassword", passwordData.currentPassword);

    formData.append("newPassword", passwordData.newPassword);

    formData.append("confirmNewPassword", passwordData.confirmNewPassword);

    dispatch(updateAdminPassword(formData));
  };

  return (
    <main className="space-y-6">
      {/* heading */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Profile Settings</h1>

        <p className="text-sm text-zinc-500 mt-1">
          Manage your administrator account information and security.
        </p>
      </div>

      {/* layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* left */}
        <div className="space-y-4">
          {/* profile card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={
                    avatar
                      ? URL.createObjectURL(avatar)
                      : user?.avatar?.url || avatarImage
                  }
                  alt={user?.name || "Admin"}
                  className="w-24 h-24 rounded-2xl object-cover border border-zinc-200"
                />

                <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center cursor-pointer transition-all">
                  <Camera className="w-4 h-4" />

                  <input
                    type="file"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              <h2 className="text-lg font-semibold text-zinc-900 mt-4">
                {user?.name}
              </h2>

              <p className="text-sm text-zinc-500 mt-1">{user?.email}</p>

              <span className="mt-3 px-3 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 text-xs font-medium">
                {user?.role}
              </span>
            </div>
          </div>

          {/* status cards */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <p className="text-xs text-blue-500 font-medium">Access Level</p>

              <p className="text-sm font-semibold text-zinc-900">
                Administrator
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs text-emerald-500 font-medium">Security</p>

              <p className="text-sm font-semibold text-zinc-900">
                Protected Account
              </p>
            </div>
          </div>
        </div>

        {/* right */}
        <div className="space-y-6">
          {/* profile form */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-orange-500" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-zinc-900">
                  Personal Information
                </h3>

                <p className="text-sm text-zinc-500">
                  Update your profile details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleProfileChange}
                  placeholder="Enter full name"
                  className="w-full h-11 mt-2 px-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleProfileChange}
                  placeholder="Enter email"
                  className="w-full h-11 mt-2 px-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={updateProfile}
              className="mt-5 h-11 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-all disabled:opacity-60"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>

          {/* password form */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-zinc-900">
                  Password & Security
                </h3>

                <p className="text-sm text-zinc-500">
                  Update your account password
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Current password"
                className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all"
              />

              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="New password"
                className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all"
              />

              <input
                type="password"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all"
              />
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={updatePassword}
              className="mt-5 h-11 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
