import React, { useState } from "react";

import { X, Upload, LoaderCircle, ImagePlus } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { createNewProduct } from "../store/slices/productsSlice";

import { toggleCreateProductModal } from "../store/slices/extraSlice";

const CreateProductModal = () => {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.product);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    stock: "",
    images: [],
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);

    for (let i = 0; i < formData.images.length; i++) {
      data.append("images", formData.images[i]);
    }

    dispatch(createNewProduct(data));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-xl border border-zinc-200 shadow-2xl overflow-hidden flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Create Product
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Add a new product to marketplace inventory.
            </p>
          </div>

          <button
            onClick={() => dispatch(toggleCreateProductModal())}
            className="w-10 h-10 rounded-lg border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-zinc-600" />
          </button>
        </div>

        {/* body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          {/* top grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* name */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Product Name
              </label>

              <input
                type="text"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
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
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Price
              </label>

              <input
                type="number"
                placeholder="Enter price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value,
                  })
                }
                className="w-full h-11 px-4 rounded-lg border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all text-sm"
                required
              />
            </div>

            {/* stock */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Stock Quantity
              </label>

              <input
                type="number"
                placeholder="Available stock"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: e.target.value,
                  })
                }
                className="w-full h-11 px-4 rounded-lg border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* description */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Description
            </label>

            <textarea
              rows={5}
              placeholder="Write product description..."
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all text-sm resize-none"
              required
            />
          </div>

          {/* image upload */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Product Images
            </label>

            <label className="border-2 border-dashed border-zinc-200 hover:border-orange-300 bg-zinc-50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all">
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                <ImagePlus className="w-6 h-6 text-orange-500" />
              </div>

              <p className="text-sm font-medium text-zinc-700">
                Upload product images
              </p>

              <p className="text-xs text-zinc-500 mt-1">
                PNG, JPG, WEBP supported
              </p>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    images: Array.from(e.target.files),
                  })
                }
                className="hidden"
              />
            </label>

            {/* previews */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="preview"
                      className="w-full h-24 object-cover rounded-lg border border-zinc-200"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* actions */}
          <div className="sticky bottom-0 bg-white border-t border-zinc-100 flex items-center justify-end gap-3 pt-4 pb-1">
            <button
              type="button"
              onClick={() => dispatch(toggleCreateProductModal())}
              className="h-11 px-5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-sm font-medium transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="h-11 px-5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
