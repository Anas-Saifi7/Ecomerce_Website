import React, { useState } from "react";
import { Link } from "react-router-dom";
import { subscribe } from "../services/newsletterService.js";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletter = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setNewsletterStatus("");

    try {
      await subscribe(email);
      setEmail("");
      setNewsletterStatus("You are subscribed.");
    } catch (error) {
      setNewsletterStatus(
        error.message ||
          "Subscription could not be saved. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const linkClass =
    "block w-fit text-sm leading-6 text-gray-300 transition-colors duration-200 hover:text-[#e4e8b8]";

  const headingClass =
    "mb-5 font-serif text-base font-bold text-white sm:text-lg";

  return (
    <footer className="bg-[#062d1d] text-white">

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-14 lg:px-5 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-5 lg:gap-8">

          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="group inline-block">
              <h2 className="font-serif text-3xl font-bold tracking-wide transition-colors group-hover:text-[#e4e8b8]">
                Halla Bol
              </h2>

              <p className="mt-2 text-[9px] font-medium tracking-[0.18em] text-[#d8d9b8]">
                ROOTED IN INDIA. FOR A BETTER WORLD.
              </p>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-300">
              Bringing authentic Indian products, traditions, and
              craftsmanship to customers around the world.
            </p>

            <div className="mt-5 h-px w-12 bg-[#a77c32]" />
          </div>

          <div>
            <h3 className={headingClass}>Shop</h3>

            <nav className="space-y-2.5">
              <Link to="/product" className={linkClass}>
                All Products
              </Link>

              <Link to="/categories" className={linkClass}>
                Categories
              </Link>

              <Link to="/regions" className={linkClass}>
                Regions
              </Link>
            </nav>
          </div>

          <div>
            <h3 className={headingClass}>Company</h3>

            <nav className="space-y-2.5">
              <Link to="/" className={linkClass}>
                Home
              </Link>

              <Link to="/about" className={linkClass}>
                About Us
              </Link>

              <Link to="/our-story" className={linkClass}>
                Our Story
              </Link>

              <Link to="/contact" className={linkClass}>
                Contact Us
              </Link>
            </nav>
          </div>

          <div>
            <h3 className={headingClass}>Support</h3>

            <nav className="space-y-2.5">
              <Link to="/faq" className={linkClass}>
                FAQ
              </Link>

              <Link to="/shipping-policy" className={linkClass}>
                Shipping Policy
              </Link>

              <Link to="/return-refund" className={linkClass}>
                Return & Refund
              </Link>

              <Link to="/track-order" className={linkClass}>
                Track Order
              </Link>
            </nav>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className={headingClass}>Stay Connected</h3>

            <p className="mb-5 max-w-sm text-sm leading-6 text-gray-300">
              Subscribe to our newsletter for updates on new products,
              traditions, and stories.
            </p>

            <form
              onSubmit={handleNewsletter}
              className="flex flex-col gap-3"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>

              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="Enter your email"
                className="w-full min-w-0 rounded-md border border-white/25 bg-white/5 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-gray-400 focus:border-[#e4e8b8] focus:ring-1 focus:ring-[#e4e8b8]"
              />

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#e4e8b8] px-4 py-3 text-sm font-bold text-[#073b25] transition duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Subscribe →"}
              </button>
            </form>

            {newsletterStatus && (
              <p
                role="status"
                aria-live="polite"
                className="mt-3 text-xs leading-5 text-[#e4e8b8]"
              >
                {newsletterStatus}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-5">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs leading-5 text-gray-400">
              © 2026 Halla Bol. All rights reserved.
            </p>

            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-3 sm:justify-end">
              <Link
                to="/privacy-policy"
                className="text-xs text-gray-400 transition hover:text-[#e4e8b8]"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms-and-conditions"
                className="text-xs text-gray-400 transition hover:text-[#e4e8b8]"
              >
                Terms & Conditions
              </Link>

              <Link
                to="/sitemap"
                className="text-xs text-gray-400 transition hover:text-[#e4e8b8]"
              >
                Sitemap
              </Link>
            </nav>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
