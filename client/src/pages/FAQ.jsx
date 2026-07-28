import { useState } from "react";

import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const faqs = [
  {
    id: 1,
    question:
      "How do I place an order?",
    answer:
      "Browse products, add items to your cart, and proceed to checkout. Follow the secure payment flow to complete your purchase.",
  },

  {
    id: 2,
    question:
      "What payment methods do you accept?",
    answer:
      "Flint supports major debit cards, credit cards, UPI, net banking, and other secure payment options.",
  },

  {
    id: 3,
    question:
      "How long does shipping take?",
    answer:
      "Standard delivery usually takes 3–5 business days depending on your location. Express delivery is available for selected regions.",
  },

  {
    id: 4,
    question:
      "What is your return policy?",
    answer:
      "Most products are covered by our 30-day return policy. Items must be returned in original condition.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] =
    useState(null);

  const toggleItem = (index) => {
    setOpenIndex((prev) =>
      prev === index
        ? null
        : index
    );
  };

  return (
    <div className="min-h-screen bg-background pt-16">

      {/* hero */}
      <section className="px-4 py-16">

        <div className="max-w-4xl mx-auto text-center">

          <p
            className="
              text-primary
              font-medium
              tracking-[0.2em]
              uppercase
              mb-4
            "
          >
            Flint Support
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
            Frequently Asked
            Questions
          </h1>

          <p
            className="
              text-lg
              text-muted-foreground
            "
          >
            Everything you need to know
            about ordering, payments,
            shipping, and returns.
          </p>

        </div>
      </section>


      {/* faq */}
      <section className="px-4 pb-20">

        <div
          className="
            max-w-4xl
            mx-auto
            space-y-4
          "
        >

          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="
                border border-border
                rounded-2xl
                overflow-hidden
                bg-background
              "
            >

              <button
                onClick={() =>
                  toggleItem(index)
                }
                className="
                  w-full
                  px-6
                  py-5
                  flex
                  items-center
                  justify-between
                  gap-4
                  text-left
                  hover:bg-secondary
                  transition-all
                "
              >

                <h3
                  className="
                    font-semibold
                    text-foreground
                  "
                >
                  {faq.question}
                </h3>

                {openIndex === index ? (
                  <ChevronUp
                    className="
                      w-5
                      h-5
                      text-primary
                      shrink-0
                    "
                  />
                ) : (
                  <ChevronDown
                    className="
                      w-5
                      h-5
                      text-muted-foreground
                      shrink-0
                    "
                  />
                )}

              </button>


              {openIndex === index && (
                <div
                  className="
                    px-6
                    pb-6
                  "
                >

                  <p
                    className="
                      text-muted-foreground
                      leading-relaxed
                    "
                  >
                    {faq.answer}
                  </p>

                </div>
              )}

            </div>
          ))}

        </div>
      </section>

    </div>
  );
};

export default FAQ;