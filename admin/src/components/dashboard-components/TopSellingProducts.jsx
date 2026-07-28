import React from "react";

import { useSelector } from "react-redux";

import { Star, Trophy, Package } from "lucide-react";

const TopSellingProducts = () => {
  const { topSellingProducts } = useSelector((state) => state.admin);

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Top Products</h2>

          <p className="text-sm text-zinc-500 mt-1">
            Products generating the highest sales
          </p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-amber-600" />
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[550px]">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide py-3">
                Product
              </th>

              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide py-3">
                Category
              </th>

              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide py-3">
                Sold
              </th>

              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide py-3">
                Rating
              </th>
            </tr>
          </thead>

          <tbody>
            {topSellingProducts?.length > 0 ? (
              topSellingProducts.map((product, index) => (
                <tr
                  key={index}
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition-all"
                >
                  {/* product */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover border border-zinc-200"
                      />

                      <div>
                        <p className="font-medium text-zinc-900 line-clamp-1">
                          {product.name}
                        </p>

                        <p className="text-sm text-zinc-500 mt-1">
                          Product #{index + 1}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* category */}
                  <td className="py-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium">
                      <Package className="w-4 h-4" />

                      {product.category}
                    </div>
                  </td>

                  {/* sold */}
                  <td className="py-4">
                    <span className="text-sm font-semibold text-emerald-600">
                      {product.total_sold}
                    </span>
                  </td>

                  {/* rating */}
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />

                      <span className="text-sm font-medium text-zinc-700">
                        {product.ratings || 0}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-sm text-zinc-500"
                >
                  No product analytics available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingProducts;
