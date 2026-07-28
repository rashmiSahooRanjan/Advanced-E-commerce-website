import { useState } from "react";

import {
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

  const updateField = (
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "support@flint.com",
    },

    {
      icon: Phone,
      title: "Phone",
      value: "+91 XXXXX XXXXX",
    },

    {
      icon: MapPin,
      title: "Location",
      value: "Odisha, India",
    },
  ];

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
            Contact Flint
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
            Let’s Build Something Better
          </h1>

          <p
            className="
              text-lg
              text-muted-foreground
            "
          >
            Questions, feedback, or partnership
            opportunities—we’d love to hear
            from you.
          </p>

        </div>
      </section>


      {/* content */}
      <section className="px-4 pb-20">

        <div
          className="
            max-w-7xl
            mx-auto
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-10
          "
        >

          {/* left */}
          <div className="space-y-5">

            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="
                  flex
                  gap-4
                  p-5
                  rounded-2xl
                  border border-border
                  hover:bg-secondary
                  transition-all
                "
              >

                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-primary/10
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <item.icon
                    className="
                      w-5
                      h-5
                      text-primary
                    "
                  />
                </div>

                <div>

                  <h3
                    className="
                      font-semibold
                      text-foreground
                      mb-1
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      text-muted-foreground
                    "
                  >
                    {item.value}
                  </p>

                </div>

              </div>
            ))}

          </div>


          {/* form */}
          <div
            className="
              p-8
              rounded-3xl
              border border-border
              bg-secondary/40
            "
          >

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-4
                "
              >

                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    updateField(
                      "name",
                      e.target.value
                    )
                  }
                  className="
                    px-4
                    py-3
                    rounded-xl
                    border border-border
                    bg-background
                    text-foreground
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary
                  "
                  required
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) =>
                    updateField(
                      "email",
                      e.target.value
                    )
                  }
                  className="
                    px-4
                    py-3
                    rounded-xl
                    border border-border
                    bg-background
                    text-foreground
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary
                  "
                  required
                />

              </div>


              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) =>
                  updateField(
                    "subject",
                    e.target.value
                  )
                }
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border border-border
                  bg-background
                  text-foreground
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary
                "
                required
              />


              <textarea
                rows={6}
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) =>
                  updateField(
                    "message",
                    e.target.value
                  )
                }
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border border-border
                  bg-background
                  text-foreground
                  resize-none
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary
                "
                required
              />


              <button
                type="submit"
                className="
                  w-full
                  py-4
                  rounded-xl
                  bg-primary
                  text-primary-foreground
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-2
                  hover:scale-[1.01]
                  active:scale-[0.99]
                  transition-all
                "
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>

            </form>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Contact;