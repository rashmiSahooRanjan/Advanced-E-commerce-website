import HeroSlider from "../components/Home/HeroSlider";

import CategoryGrid from "../components/Home/CategoryGrid";

import ProductSlider from "../components/Home/ProductSlider";

import FeatureSection from "../components/Home/FeatureSection";

import NewsletterSection from "../components/Home/NewsletterSection";

import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../store/slices/productSlice";
import { useEffect } from "react";

const Index = () => {
  const {
    topRatedProducts,
    newProducts,
  } = useSelector(
    (state) => state.product
  );

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchAllProducts({
      category: "",
      price: "0-10000000",
      search: "",
      availability: "",
      ratings: "",
      page: "1",
    }));
  }, [dispatch]);
  const { loading } = useSelector((state) => state.product);
if (loading) {
     return (
      <div className="fixed inset-0 bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-[0.4em] text-primary mb-8 select-none">
            FLINT
          </h1>

          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-border" />
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>

          <p className="text-muted-foreground text-sm tracking-wide">
            Preparing your experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">

      {/* hero */}
      <HeroSlider />


      {/* content */}
      <div
        className="
          max-w-7xl
          mx-auto
          px-4
        "
      >

        {/* categories */}
        <section className="py-20">
          <CategoryGrid />
        </section>


        {/* new arrivals */}
        {newProducts.length > 0 && (
          <section className="pb-20">

            <ProductSlider
              title="New Arrivals"
              products={newProducts}
            />

          </section>
        )}


        {/* top rated */}
        {topRatedProducts.length > 0 && (
          <section className="pb-20">

            <ProductSlider
              title="Top Rated Products"
              products={
                topRatedProducts
              }
            />

          </section>
        )}


        {/* features */}
        <section className="pb-20">
          <FeatureSection />
        </section>


        {/* newsletter */}
        <section className="pb-24">
          <NewsletterSection />
        </section>

      </div>

    </main>
  );
};

export default Index;