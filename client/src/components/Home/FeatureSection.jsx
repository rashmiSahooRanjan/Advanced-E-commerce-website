import {
  Truck,
  Shield,
  Headphones,
  CreditCard,
} from "lucide-react";

const FeatureSection = () => {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description:
        "Free shipping on orders over $50 worldwide.",
    },

    {
      icon: Shield,
      title: "Secure Payment",
      description:
        "Protected checkout with SSL encryption.",
    },

    {
      icon: Headphones,
      title: "24/7 Support",
      description:
        "Dedicated support whenever you need help.",
    },

    {
      icon: CreditCard,
      title: "Easy Returns",
      description:
        "30-day return policy with no hassle.",
    },
  ];

  return (
    <section className="py-20 px-4">

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
        {features.map((feature) => (
          <div
            key={feature.title}
            className="
              rounded-2xl
              border border-border
              bg-background
              p-6
              text-center
              hover:bg-secondary
              hover:-translate-y-1
              hover:shadow-md
              transition-all
              duration-300
            "
          >

            {/* icon */}
            <div
              className="
                w-12
                h-12
                mx-auto
                mb-4
                rounded-xl
                bg-primary
                flex
                items-center
                justify-center
              "
            >
              <feature.icon
                className="
                  w-5
                  h-5
                  text-primary-foreground
                "
              />
            </div>


            {/* title */}
            <h3
              className="
                text-lg
                font-semibold
                text-foreground
                mb-2
              "
            >
              {feature.title}
            </h3>


            {/* description */}
            <p
              className="
                text-sm
                text-muted-foreground
                leading-relaxed
                max-w-[220px]
                mx-auto
              "
            >
              {feature.description}
            </p>

          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;