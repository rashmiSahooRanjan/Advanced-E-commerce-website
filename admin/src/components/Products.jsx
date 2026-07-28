import React, { useEffect, useState } from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Package,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import Header from "./Header";

import CreateProductModal from "../modals/CreateProductModal";

import UpdateProductModal from "../modals/UpdateProductModal";

import ViewProductModal from "../modals/ViewProductModal";

import {
  toggleCreateProductModal,
  toggleUpdateProductModal,
  toggleViewProductModal,
} from "../store/slices/extraSlice";
import { deleteProduct, fetchAllProducts } from "../store/slices/productsSlice";

const Products = () => {
  const dispatch = useDispatch();

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [page, setPage] = useState(1);

  const [maxPage, setMaxPage] = useState(1);

  const [search, setSearch] = useState("");

  const {
    isViewProductModalOpened,
    isCreateProductModalOpened,
    isUpdateProductModalOpened,
  } = useSelector((state) => state.extra);

  const { loading, products, totalProducts, fetchingProducts } = useSelector(
    (state) => state.product,
  );

  useEffect(() => {
    if (totalProducts !== undefined) {
      setMaxPage(Math.ceil(totalProducts / 10) || 1);
    }
  }, [totalProducts]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(
        fetchAllProducts({
          page,
          search,
        }),
      );
    }, 400);

    return () => clearTimeout(timeout);
  }, [dispatch, page, search]);

  return (
    <>
      <main className="flex-1 min-h-screen bg-zinc-50">
        <div className="p-4 space-y-5">
          {/* top */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">Products</h1>

              <p className="text-sm text-zinc-500 mt-1">
                Manage product inventory and marketplace listings.
              </p>
            </div>

            <button
              onClick={() => dispatch(toggleCreateProductModal())}
              className="h-11 px-5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all w-fit"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          {/* toolbar */}
          <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* search */}
              <div className="relative w-full lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />

                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all text-sm"
                />
              </div>

              {/* stats */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 h-11 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium">
                  <Package className="w-4 h-4" />
                  {totalProducts || 0} Products
                </div>
              </div>
            </div>
          </div>

          {/* table */}
          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
            {fetchingProducts ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="flex items-center gap-3 text-zinc-500">
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                  Loading products...
                </div>
              </div>
            ) : products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px]">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 px-5 py-4">
                        Product
                      </th>

                      <th className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 px-5 py-4">
                        Category
                      </th>

                      <th className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 px-5 py-4">
                        Price
                      </th>

                      <th className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 px-5 py-4">
                        Stock
                      </th>

                      <th className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 px-5 py-4">
                        Rating
                      </th>

                      <th className="text-right text-xs font-semibold uppercase tracking-wide text-zinc-500 px-5 py-4">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product, index) => (
                      <tr
                        key={index}
                        className="border-b border-zinc-100 hover:bg-zinc-50 transition-all"
                      >
                        {/* product */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product?.images?.[0]?.url}
                              alt={product.name}
                              className="w-14 h-14 rounded-lg object-cover border border-zinc-200"
                            />

                            <div>
                              <p className="font-medium text-zinc-900">
                                {product.name}
                              </p>

                              <p className="text-sm text-zinc-500 mt-1">
                                ID: {product.id?.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* category */}
                        <td className="px-5 py-4">
                          <span className="px-3 py-1 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 text-sm font-medium">
                            {product.category}
                          </span>
                        </td>

                        {/* price */}
                        <td className="px-5 py-4 text-sm font-semibold text-zinc-900">
                          ₹{product.price}
                        </td>

                        {/* stock */}
                        <td className="px-5 py-4">
                          <span
                            className={`
                                px-3 py-1 rounded-lg text-sm font-medium
                                ${
                                  product.stock > 10
                                    ? "bg-emerald-50 border border-emerald-100 text-emerald-600"
                                    : product.stock > 0
                                      ? "bg-amber-50 border border-amber-100 text-amber-600"
                                      : "bg-red-50 border border-red-100 text-red-600"
                                }
                              `}
                          >
                            {product.stock}
                          </span>
                        </td>

                        {/* ratings */}
                        <td className="px-5 py-4 text-sm font-medium text-zinc-700">
                          {product.ratings || 0}
                        </td>

                        {/* actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {/* view */}
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                dispatch(toggleViewProductModal());
                              }}
                              className="w-10 h-10 rounded-lg border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center transition-all"
                            >
                              <Eye className="w-4 h-4 text-zinc-600" />
                            </button>

                            {/* edit */}
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                dispatch(toggleUpdateProductModal());
                              }}
                              className="w-10 h-10 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-all"
                            >
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </button>

                            {/* delete */}
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                dispatch(deleteProduct(product.id));
                              }}
                              className="w-10 h-10 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-center">
                <Package className="w-12 h-12 text-zinc-300" />

                <h3 className="text-lg font-semibold text-zinc-900 mt-4">
                  No products found
                </h3>

                <p className="text-sm text-zinc-500 mt-2">
                  Start by creating your first product listing.
                </p>
              </div>
            )}
          </div>

          {/* pagination */}
          {!fetchingProducts && products.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                Page {page} of {maxPage}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="h-10 px-4 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={page === maxPage}
                  className="h-10 px-4 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* modals */}
      {isCreateProductModalOpened && <CreateProductModal />}

      {isUpdateProductModalOpened && (
        <UpdateProductModal selectedProduct={selectedProduct} />
      )}

      {isViewProductModalOpened && (
        <ViewProductModal selectedProduct={selectedProduct} />
      )}
    </>
  );
};

export default Products;
