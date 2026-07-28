import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    title: "Premium Electronics",
    subtitle: "Discover the latest tech innovations",
    description:
      "Up to 50% off on premium headphones, smartwatches, and more.",
    image: "./electronics.jpg",
    cta: "Shop Electronics",
    url: "/products?category=Electronics",
  },

  {
    id: 2,
    title: "Fashion Forward",
    subtitle: "Style meets comfort",
    description:
      "New arrivals in designer clothing and accessories.",
    image: "./fashion.jpg",
    cta: "Explore Fashion",
    url: "/products?category=Fashion",
  },

  {
    id: 3,
    title: "Home & Garden",
    subtitle: "Transform your space",
    description:
      "Beautiful furniture and decor for every home.",
    image: "./furniture.jpg",
    url: "/products?category=Home & Garden",
    cta: "Shop Home",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] =
    useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % slides.length
      );
    }, 8000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % slides.length
    );
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + slides.length) %
        slides.length
    );
  };

  const slide = slides[currentSlide];

  return (
    <section
      className="
        relative
        mt-16
        min-h-[calc(100vh-4rem)]
        overflow-hidden
      "
    >
      
      {/* background */}
      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
          transition-all
          duration-1000
          scale-105
        "
        style={{
          backgroundImage:
            `url(${slide.image})`,
        }}
      />

      {/* overlay */}
      <div
        className="
          absolute
          inset-0
          bg-black/60
        "
      />


      {/* content */}
      <div
        className="
          relative
          z-10
          flex
          min-h-[calc(100vh-4rem)]
          items-center
          justify-center
          text-center
          px-6
        "
      >
        <div className="max-w-4xl">

          <p
            className="
              mb-4
              text-base
              md:text-lg
              font-medium
              tracking-[0.2em]
              uppercase
              text-primary
            "
          >
            {slide.subtitle}
          </p>

          <h1
            className="
              mb-6
              text-4xl
              sm:text-5xl
              md:text-7xl
              font-bold
              leading-tight
              text-white
            "
          >
            {slide.title}
          </h1>

          <p
            className="
              mx-auto
              mb-10
              max-w-2xl
              text-lg
              md:text-xl
              leading-relaxed
              text-white/80
            "
          >
            {slide.description}
          </p>

          <Link
            to={slide.url}
            className="
              inline-flex
              items-center
              px-8
              py-4
              rounded-xl
              bg-primary
              text-primary-foreground
              font-semibold
              hover:scale-105
              active:scale-95
              transition-all
            "
          >
            {slide.cta}
          </Link>

        </div>
      </div>


      {/* arrows */}
      <button
        onClick={prevSlide}
        className="
          hidden
          sm:flex
          absolute
          left-6
          top-1/2
          -translate-y-1/2
          z-20
          p-3
          rounded-full
          bg-black/30
          hover:bg-black/50
          transition-all
        "
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="
          hidden
          sm:flex
          absolute
          right-6
          top-1/2
          -translate-y-1/2
          z-20
          p-3
          rounded-full
          bg-black/30
          hover:bg-black/50
          transition-all
        "
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>


      {/* indicators */}
      <div
        className="
          absolute
          bottom-8
          left-1/2
          -translate-x-1/2
          flex
          gap-3
          z-20
        "
      >
        {slides.map((item, index) => (
          <button
            key={item.id}
            onClick={() =>
              setCurrentSlide(index)
            }
            className={`
              h-2
              rounded-full
              transition-all
              ${
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-white/40"
              }
            `}
          />
        ))}
      </div>

    </section>
  );
};

export default HeroSlider;