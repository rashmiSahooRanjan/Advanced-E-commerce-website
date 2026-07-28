import {
  Users,
  Target,
  Award,
  Heart,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Every product, feature, and experience starts with the customer.",
  },

  {
    icon: Award,
    title: "Quality Driven",
    description:
      "We curate products that meet high standards of quality and reliability.",
  },

  {
    icon: Users,
    title: "Community Focused",
    description:
      "We believe commerce becomes stronger when trust and relationships come first.",
  },

  {
    icon: Target,
    title: "Built to Innovate",
    description:
      "We continuously improve Flint to deliver smarter shopping experiences.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background pt-16">

      {/* hero */}
      <section className="px-4 py-20">

        <div className="max-w-5xl mx-auto text-center">

          <p
            className="
              mb-4
              text-primary
              font-medium
              tracking-[0.2em]
              uppercase
            "
          >
            About Flint
          </p>

          <h1
            className="
              text-4xl
              md:text-6xl
              font-bold
              text-foreground
              mb-6
            "
          >
            Building the Future of
            Modern Commerce
          </h1>

          <p
            className="
              max-w-3xl
              mx-auto
              text-lg
              md:text-xl
              text-muted-foreground
              leading-relaxed
            "
          >
            Flint is designed to make online shopping
            fast, transparent, and enjoyable—combining
            premium products, secure transactions, and
            customer-first experiences.
          </p>

        </div>
      </section>


      {/* values */}
      <section className="px-4 pb-20">

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
          {values.map((value) => (
            <div
              key={value.title}
              className="
                p-6
                rounded-2xl
                border border-border
                bg-background
                text-center
                hover:bg-secondary
                hover:-translate-y-1
                hover:shadow-md
                transition-all
              "
            >

              <div
                className="
                  w-12
                  h-12
                  mx-auto
                  mb-4
                  rounded-xl
                  bg-primary/10
                  flex
                  items-center
                  justify-center
                "
              >
                <value.icon
                  className="
                    w-5
                    h-5
                    text-primary
                  "
                />
              </div>


              <h3
                className="
                  text-lg
                  font-semibold
                  text-foreground
                  mb-3
                "
              >
                {value.title}
              </h3>


              <p
                className="
                  text-sm
                  leading-relaxed
                  text-muted-foreground
                "
              >
                {value.description}
              </p>

            </div>
          ))}
        </div>
      </section>


      {/* story */}
      <section className="px-4 pb-24">

        <div
          className="
            max-w-5xl
            mx-auto
            border border-border
            rounded-3xl
            p-8 md:p-12
            bg-secondary/50
          "
        >

          <p
            className="
              mb-3
              text-primary
              font-medium
              uppercase
              tracking-[0.2em]
            "
          >
            Our Story
          </p>

          <h2
            className="
              text-3xl
              font-bold
              text-foreground
              mb-6
            "
          >
            From Idea to Experience
          </h2>

          <p
            className="
              text-lg
              text-muted-foreground
              leading-relaxed
            "
          >
            Flint started with a simple belief:
            online shopping should feel effortless,
            trustworthy, and premium. What began as
            an idea to simplify digital commerce has
            evolved into a platform built around
            performance, transparency, and customer
            satisfaction.
          </p>

        </div>
      </section>

    </div>
  );
};

export default About;