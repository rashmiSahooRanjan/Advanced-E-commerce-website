import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  Trash2,
  Users as UsersIcon,
  ShieldCheck,
  User,
  CalendarDays,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import Header from "./Header";

import { deleteUser, fetchAllUsers } from "../store/slices/adminSlice";

const Users = () => {
  const dispatch = useDispatch();

  const { users, loading, totalUsers } = useSelector((state) => state.admin);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const USERS_PER_PAGE = 10;

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE) || 1;

  useEffect(() => {
    dispatch(fetchAllUsers(page));
  }, [dispatch, page]);

  const handleDeleteUser = (id) => {
    const confirmDelete = window.confirm("Delete this user?");

    if (!confirmDelete) return;

    dispatch(deleteUser(id, page));
  };

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  return (
    <main className="flex-1 min-h-screen bg-zinc-50">
      <div className="p-4 md:p-5 space-y-5">
        {/* top */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Users
            </h1>

            <p className="text-sm text-zinc-500 mt-1">
              Manage customer accounts and platform access.
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl px-5 py-4 shadow-sm min-w-[180px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Total Users</p>

                <h2 className="text-2xl font-semibold text-zinc-900 mt-1">
                  {totalUsers}
                </h2>
              </div>

              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* toolbar */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 text-sm transition-all"
            />
          </div>
        </div>

        {/* empty */}
        {!loading && filteredUsers.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto">
              <UsersIcon className="w-7 h-7 text-zinc-500" />
            </div>

            <h2 className="text-xl font-semibold text-zinc-900 mt-5">
              No Users Found
            </h2>

            <p className="text-sm text-zinc-500 mt-2">
              No users match the current search criteria.
            </p>
          </div>
        ) : (
          <>
            {/* users list */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead className="border-b border-zinc-200 bg-zinc-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        User
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        Role
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        Email
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        Joined
                      </th>

                      <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers?.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-zinc-100 hover:bg-zinc-50 transition-all"
                      >
                        {/* user */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {user.avatar?.url ? (
                              <img
                                src={user.avatar.url}
                                alt={user.name}
                                className="w-12 h-12 rounded-xl object-cover border border-zinc-200"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-semibold uppercase">
                                {user.name?.charAt(0)}
                              </div>
                            )}

                            <div>
                              <p className="font-medium text-zinc-900">
                                {user.name}
                              </p>

                              <p className="text-sm text-zinc-500 mt-1">
                                ID: {user.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* role */}
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                              user.role === "Admin"
                                ? "bg-orange-50 text-orange-700 border-orange-200"
                                : "bg-zinc-100 text-zinc-700 border-zinc-200"
                            }`}
                          >
                            {user.role === "Admin" ? (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            ) : (
                              <User className="w-3.5 h-3.5" />
                            )}

                            {user.role}
                          </div>
                        </td>

                        {/* email */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-zinc-700">
                            <Mail className="w-4 h-4 text-zinc-400" />

                            {user.email}
                          </div>
                        </td>

                        {/* joined */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-zinc-700">
                            <CalendarDays className="w-4 h-4 text-zinc-400" />

                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </td>

                        {/* actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="h-10 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium transition-all flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-zinc-500">
                Page {page} of {totalPages}
              </p>

              <div className="flex items-center gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className={`h-12 px-5 rounded-2xl border flex items-center gap-2 text-sm font-medium transition-all ${
                    page === 1
                      ? "bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed"
                      : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className={`h-12 px-5 rounded-2xl border flex items-center gap-2 text-sm font-medium transition-all ${
                    page === totalPages
                      ? "bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed"
                      : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Users;
