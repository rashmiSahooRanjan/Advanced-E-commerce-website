import React from "react";
import { Link } from "react-router-dom";

import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* top */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* brand */}

          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/flint.png"
                alt="Flint Logo"
                className="h-9 w-9 object-contain"
              />

              <div className="text-2xl font-bold tracking-tight text-foreground">
                F L I N T <span className="text-primary">.</span>
              </div>
            </Link>

            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              Flint delivers premium shopping experiences across electronics,
              fashion, lifestyle, and modern essentials — curated for quality,
              performance, and style.
            </p>

            {/* socials */}

            <div className="flex items-center gap-3 pt-1">
              <a
                href="#"
                className="
                  w-10 h-10 rounded-xl
                  border border-border
                  bg-secondary
                  flex items-center justify-center
                  text-muted-foreground
                  hover:text-primary
                  hover:border-primary/30
                  transition-all
                "
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href="#"
                className="
                  w-10 h-10 rounded-xl
                  border border-border
                  bg-secondary
                  flex items-center justify-center
                  text-muted-foreground
                  hover:text-primary
                  hover:border-primary/30
                  transition-all
                "
              >
                <Twitter className="w-4 h-4" />
              </a>

              <a
                href="#"
                className="
                  w-10 h-10 rounded-xl
                  border border-border
                  bg-secondary
                  flex items-center justify-center
                  text-muted-foreground
                  hover:text-primary
                  hover:border-primary/30
                  transition-all
                "
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* shop */}

          <div>
            <h3 className="text-foreground font-semibold mb-6">Shop</h3>

            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  to="/products"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  All Products
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  New Arrivals
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Trending
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Brands
                </Link>
              </li>
            </ul>
          </div>

          {/* company */}

          <div>
            <h3 className="text-foreground font-semibold mb-6">Company</h3>

            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  to="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* contact */}

          <div>
            <h3 className="text-foreground font-semibold mb-6">Contact</h3>

            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-xl border border-border bg-secondary flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>

                <span className="leading-relaxed">
                  123 Market Street, Suite 456
                  <br />
                  San Francisco, CA 94105
                </span>
              </li>

              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-xl border border-border bg-secondary flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>

                <span>+1 (555) 123-4567</span>
              </li>

              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-xl border border-border bg-secondary flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>

                <span>support@flint.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* bottom */}

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-5">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © {new Date().getFullYear()} Flint Marketplace. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              to="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>

            <Link
              to="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>

            <Link
              to="/cookies"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
