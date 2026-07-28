import React from "react";
import { Send } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-16 md:py-20 bg-background transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-secondary shadow-xl">
          {/* background blur */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2">
            {/* content */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background/60 text-xs text-muted-foreground w-fit mb-5 backdrop-blur-sm">
                Stay Updated
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-5">
                Stay in the loop.
              </h2>

              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                Join thousands of shoppers receiving curated deals, new
                arrivals, and personalized recommendations directly in their
                inbox.
              </p>

              {/* form */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="
                    flex-1 h-14 px-5 rounded-2xl
                    bg-background
                    border border-border
                    text-foreground
                    placeholder:text-muted-foreground
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary/30
                    transition-all
                  "
                />

                <button
                  type="submit"
                  className="
                    h-14 px-8 rounded-2xl
                    bg-primary
                    text-primary-foreground
                    font-semibold
                    hover:opacity-90
                    transition-all
                    flex items-center justify-center gap-2
                    shadow-lg
                    group
                  "
                >
                  <span>Subscribe</span>

                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <p className="text-xs text-muted-foreground mt-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                No spam. Unsubscribe anytime.
              </p>
            </div>

            {/* image */}
            <div className="relative min-h-[320px] lg:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=2070&auto=format&fit=crop"
                alt="Shopping Lifestyle"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* overlay */}
              <div
                className="
                  absolute inset-0
                  bg-gradient-to-t
                  from-secondary
                  via-secondary/40
                  to-transparent
                  lg:bg-gradient-to-r
                  lg:from-secondary
                  lg:via-secondary/50
                  lg:to-transparent
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
