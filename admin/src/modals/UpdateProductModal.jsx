import React, { useEffect, useState } from "react";

import {
  X,
  Save,
  LoaderCircle,
  BadgeIndianRupee,
  Boxes,
  Package,
  FileText,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { updateProduct } from "../store/slices/productsSlice";

import { toggleUpdateProductModal } from "../store/slices/extraSlice";

const UpdateProductModal = ({ selectedProduct }) => {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.product);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const categoryOptions = [
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Sports",
    "Books",
    "Beauty",
    "Automotive",
    "Kids & Baby",
  ];

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || "",
        category: selectedProduct.category || "",
        stock: selectedProduct.stock || "",
      });
    }
  }, [selectedProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      stock: formData.stock,
    };

    dispatch(updateProduct(data, selectedProduct.id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[92vh] bg-white rounded-xl border border-zinc-200 shadow-2xl overflow-hidden flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Update Product
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Modify inventory and marketplace product details.
            </p>
          </div>

          <button
            onClick={() => dispatch(toggleUpdateProductModal())}
            className="w-10 h-10 rounded-lg border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-zinc-600" />
          </button>
        </div>

        {/* body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* preview */}
          <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 bg-zinc-50">
            <img
              src={selectedProduct?.images?.[0]?.url}
              alt={selectedProduct?.name}
              className="w-20 h-20 rounded-xl object-cover border border-zinc-200"
            />

            <div>
              <h3 className="text-lg font-semibold text-zinc-900">
                {selectedProduct?.name}
              </h3>

              <p className="text-sm text-zinc-500 mt-1">
                Product ID: {selectedProduct?.id?.slice(0, 12)}
              </p>

              <div className="flex items-center gap-2 mt-3">
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
            </div>
          </div>

          {/* form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-2">
                <Package className="w-4 h-4 text-orange-500" />
                Product Name
              </label>

              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                placeholder="Enter product name"
                className="w-full h-11 px-4 rounded-lg border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all text-sm"
                required
              />
            </div>

            {/* category */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Category
              </label>

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className="w-full h-11 px-4 rounded-lg border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all text-sm"
              >
                {categoryOptions.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* price */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-2">
                <BadgeIndianRupee className="w-4 h-4 text-emerald-500" />
                Price
              </label>

              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value,
                  })
                }
                placeholder="Enter price"
                className="w-full h-11 px-4 rounded-lg border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all text-sm"
                required
              />
            </div>

            {/* stock */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-2">
                <Boxes className="w-4 h-4 text-blue-500" />
                Stock Quantity
              </label>

              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: e.target.value,
                  })
                }
                placeholder="Available stock"
                className="w-full h-11 px-4 rounded-lg border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-2">
              <FileText className="w-4 h-4 text-purple-500" />
              Description
            </label>

            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              placeholder="Write product description..."
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all text-sm resize-none"
              required
            />
          </div>

          {/* actions */}
          <div className="sticky bottom-0 bg-white border-t border-zinc-100 flex items-center justify-end gap-3 pt-4 pb-1">
            <button
              type="button"
              onClick={() => dispatch(toggleUpdateProductModal())}
              className="h-11 px-5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-sm font-medium transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="h-11 px-5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;
