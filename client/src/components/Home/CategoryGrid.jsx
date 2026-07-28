import { Link } from "react-router-dom";
import { categories } from "../../data/products";

const CategoryGrid = () => {
  return (
    <section className="py-20 px-4">

      {/* heading */}
      <div className="text-center mb-12 max-w-2xl mx-auto">

        <h2 className="text-4xl font-bold text-foreground mb-4">
          Shop by Category
        </h2>

        <p className="text-lg text-muted-foreground">
          Discover curated collections across every category.
        </p>

      </div>


      {/* grid */}
      <div
        className="
          max-w-7xl
          mx-auto
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6
        "
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${category.name}`}
            className="
              group
              overflow-hidden
              rounded-2xl
              border border-border
              bg-background
              hover:bg-secondary
              hover:shadow-lg
              hover:-translate-y-1
              active:scale-[0.98]
              transition-all
              duration-300
            "
          >

            {/* image */}
            <div className="overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="
                  w-full
                  h-48
                  object-cover
                  group-hover:scale-110
                  transition-transform
                  duration-500
                "
              />
            </div>


            {/* text */}
            <div className="p-5 text-center">

              <h3
                className="
                  text-lg
                  font-semibold
                  text-foreground
                  group-hover:text-primary
                  transition-colors
                "
              >
                {category.name}
              </h3>

            </div>

          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;