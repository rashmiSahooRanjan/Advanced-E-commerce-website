import React from "react";

import {
  X,
  Star,
  Package,
  CalendarDays,
  BadgeIndianRupee,
  Boxes,
} from "lucide-react";

import { useDispatch } from "react-redux";

import { toggleViewProductModal } from "../store/slices/extraSlice";

const ViewProductModal = ({ selectedProduct }) => {
  const dispatch = useDispatch();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-5xl max-h-[92vh] bg-white rounded-xl border border-zinc-200 shadow-2xl overflow-hidden flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Product Details
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Complete overview of selected product.
            </p>
          </div>

          <button
            onClick={() => dispatch(toggleViewProductModal())}
            className="w-10 h-10 rounded-lg border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-zinc-600" />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
            {/* images */}
            <div>
              {/* main image */}
              <div className="rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100">
                <img
                  src={selectedProduct?.images?.[0]?.url}
                  alt={selectedProduct?.name}
                  className="w-full h-[350px] object-cover"
                />
              </div>

              {/* thumbnails */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                {selectedProduct?.images?.map((img, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100"
                  >
                    <img
                      src={img?.url}
                      alt={`product-${idx}`}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* info */}
            <div className="space-y-5">
              {/* title */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 text-xs font-semibold">
                    {selectedProduct?.category}
                  </span>

                  <span
                    className={`
                      px-3 py-1 rounded-lg text-xs font-semibold
                      ${
                        selectedProduct?.stock > 10
                          ? "bg-emerald-50 border border-emerald-100 text-emerald-600"
                          : selectedProduct?.stock > 0
                            ? "bg-amber-50 border border-amber-100 text-amber-600"
                            : "bg-red-50 border border-red-100 text-red-600"
                      }
                    `}
                  >
                    {selectedProduct?.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-zinc-900 leading-tight">
                  {selectedProduct?.name}
                </h1>

                <p className="text-zinc-500 mt-3 leading-relaxed">
                  {selectedProduct?.description}
                </p>
              </div>

              {/* stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-zinc-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-500">Price</p>

                      <h3 className="text-2xl font-bold text-zinc-900 mt-1">
                        ₹{selectedProduct?.price?.toLocaleString()}
                      </h3>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <BadgeIndianRupee className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                </div>

                <div className="border border-zinc-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-500">Rating</p>

                      <h3 className="text-2xl font-bold text-zinc-900 mt-1 flex items-center gap-2">
                        {selectedProduct?.ratings || 0}

                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      </h3>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Star className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                </div>

                <div className="border border-zinc-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-500">Stock</p>

                      <h3 className="text-2xl font-bold text-zinc-900 mt-1">
                        {selectedProduct?.stock}
                      </h3>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Boxes className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="border border-zinc-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-500">Product ID</p>

                      <h3 className="text-sm font-semibold text-zinc-900 mt-2">
                        {selectedProduct?.id?.slice(0, 12)}
                      </h3>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* meta */}
              <div className="border border-zinc-200 rounded-xl p-5">
                <h3 className="text-base font-semibold text-zinc-900 mb-4">
                  Product Metadata
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <CalendarDays className="w-4 h-4" />
                      Created At
                    </div>

                    <p className="text-sm font-medium text-zinc-900">
                      {new Date(
                        selectedProduct?.created_at,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-500">Category</p>

                    <p className="text-sm font-medium text-zinc-900">
                      {selectedProduct?.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-500">Ratings</p>

                    <p className="text-sm font-medium text-zinc-900">
                      {selectedProduct?.ratings || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
