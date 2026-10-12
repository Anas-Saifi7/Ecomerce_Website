import React, { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  storyHero,
  storyPurpose,
  storyJourney,
  farmerStory,
  sustainability,
  impactStats,
  impactStatsAreDemo,
  globalPresence,
  certifications,
  certificationSection,
  newsletterContent,
  saveNewsletterSubscription,
} from "../data/ourStoryData";

const SectionLabel = ({ children }) => (
  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#075631]">
    {children}
  </p>
);

const SectionHeading = ({ eyebrow, title, description, light = false }) => (
  <div>
    {eyebrow && <SectionLabel>{eyebrow}</SectionLabel>}

    <h2
      className={`mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ${
        light ? "text-white" : "text-gray-900"
      }`}
    >
      {title}
    </h2>

    {description && (
      <p
        className={`mt-4 max-w-2xl text-sm leading-7 sm:text-base ${
          light ? "text-white/85" : "text-gray-600"
        }`}
      >
        {description}
      </p>
    )}
  </div>
);

const OurStory = () => {
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState({
    type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    setNewsletterStatus({ type: "", message: "" });

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      saveNewsletterSubscription(email);
      setEmail("");
      setNewsletterStatus({
        type: "success",
        message: newsletterContent.successMessage,
      });
    } catch (error) {
      setNewsletterStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save your subscription. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-gray-900">
      <Navbar />

      <main>
        <section className="relative flex min-h-130 items-center overflow-hidden sm:min-h-145 lg:min-h-155">
          <img
            src={storyHero.image}
            alt="Indian farming landscape"
            className="absolute inset-0 h-full w-full object-fitcover"
            fetchPriority="high"
          />

          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/45 to-black/15" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-6">
            <div className="max-w-3xl text-white">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-200 sm:text-sm">
                {storyHero.eyebrow}
              </p>

              <h1 className="mt-4 font-serif text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                Our Story
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-xl sm:leading-8">
                {storyHero.description}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-7">
                {storyHero.highlights.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-xl text-green-200" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="text-xs sm:text-sm">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/product"
                  className="inline-flex items-center rounded-md bg-[#e4e8b8] px-5 py-3 text-sm font-semibold text-[#073b25] transition hover:bg-white"
                >
                  Explore Products <span className="ml-2">→</span>
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center rounded-md border border-white/70 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute right-[8%] top-24 hidden rotate-[-5deg] font-serif text-3xl italic leading-10 text-white/90 lg:block">
            Good
            <br />
            People
            <br />
            Brighter
            <br />
            Futures
          </div>
        </section>

        {/* Purpose */}
        <section className="bg-[#fafaf7]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-6 lg:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <SectionHeading
                  eyebrow={storyPurpose.eyebrow}
                  title={storyPurpose.title}
                  description={storyPurpose.description}
                />

                <Link
                  to="/contact"
                  className="mt-7 inline-flex items-center rounded-md bg-[#075631] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#064524]"
                >
                  Learn More About Halla Bol <span className="ml-2">→</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {storyPurpose.cards.map((card) => (
                  <article key={card.title} className="group text-center">
                    <div className="aspect-4/3 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={card.image}
                        alt={`${card.title} ${card.subtitle}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <h3 className="mt-3 text-sm font-semibold">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {card.subtitle}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Journey */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-6 lg:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <SectionLabel>OUR JOURNEY</SectionLabel>

              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                From a Local Idea to a Global Vision
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                Every meaningful journey is shaped by ideas, relationships
                and the people who make it possible.
              </p>
            </div>

            <div className="relative mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {storyJourney.map((item, index) => (
                <article
                  key={item.year}
                  className="relative text-center"
                >
                  {index !== storyJourney.length - 1 && (
                    <div className="absolute left-[60%] top-11 hidden w-[80%] border-t border-dashed border-gray-300 xl:block" />
                  )}

                  <p className="text-sm font-bold text-[#075631]">
                    {item.year}
                  </p>

                  <div className="relative z-10 mx-auto mt-3 flex h-12 w-12 items-center justify-center rounded-full border border-green-200 bg-white text-2xl text-[#075631] shadow-sm">
                    {item.icon}
                  </div>

                  <h3 className="mt-4 text-sm font-bold">{item.title}</h3>

                  <p className="mx-auto mt-2 max-w-60 text-xs leading-6 text-gray-500">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="grid lg:min-h-130 lg:grid-cols-2">
            <div className="relative min-h-85 sm:min-h-108">
              <img
                src={farmerStory.image}
                alt="Farmer working in an agricultural field"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/10" />

              <blockquote className="absolute bottom-6 right-5 max-w-68 rotate-1 bg-[#f4efdc] p-5 shadow-lg sm:bottom-10 sm:right-10 sm:max-w-xs sm:p-6">
                <p className="font-serif text-base italic leading-7 sm:text-lg">
                  “{farmerStory.quote}”
                </p>

                <footer className="mt-4">
                  <p className="text-xs font-bold">
                    — {farmerStory.attribution}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {farmerStory.location}
                  </p>
                </footer>
              </blockquote>
            </div>

            <div className="flex items-center px-5 py-12 sm:px-10 lg:px-12 lg:py-16">
              <div className="mx-auto max-w-xl">
                <SectionHeading
                  eyebrow={farmerStory.eyebrow}
                  title={farmerStory.title}
                  description={farmerStory.description}
                />

                <div className="mt-8 grid grid-cols-3 gap-4">
                  {farmerStory.practices.map((practice, index) => (
                    <div
                      key={practice.title}
                      className={`pr-2 ${
                        index !== farmerStory.practices.length - 1
                          ? "border-r border-gray-200"
                          : ""
                      }`}
                    >
                      <span
                        className="text-2xl text-[#075631]"
                        aria-hidden="true"
                      >
                        {practice.icon}
                      </span>

                      <p className="mt-2 text-xs font-semibold sm:text-sm">
                        {practice.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {practice.subtitle}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  to="/contact"
                  className="mt-8 inline-flex items-center text-sm font-bold text-[#075631] hover:underline"
                >
                  Connect With Our Team →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#eff7e9]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-6 lg:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <SectionHeading
                  eyebrow={sustainability.eyebrow}
                  title={sustainability.title}
                  description={sustainability.description}
                />

                <Link
                  to="/contact"
                  className="mt-7 inline-flex items-center rounded-md bg-[#075631] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#064524]"
                >
                  Ask About Our Practices →
                </Link>
              </div>

              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={sustainability.image}
                  alt="Natural products and sustainable living"
                  loading="lazy"
                  className="aspect-5/3 w-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {sustainability.features.map((feature) => (
                    <div
                      key={feature.title}
                      className="rounded-lg bg-white/95 p-3 text-center shadow-sm"
                    >
                      <span
                        className="text-2xl text-[#075631]"
                        aria-hidden="true"
                      >
                        {feature.icon}
                      </span>

                      <p className="mt-1 text-xs font-semibold">
                        {feature.title}
                      </p>
                      <p className="mt-1 text-[10px] text-gray-500">
                        {feature.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact numbers */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-6">
            <div className="text-center">
              <SectionLabel>OUR IMPACT IN NUMBERS</SectionLabel>

              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                A Vision for Meaningful Impact
              </h2>

              {impactStatsAreDemo && (
                <p className="mx-auto mt-3 max-w-2xl text-xs leading-5 text-amber-700">
                  Demo statistics from the supplied design. Verify the
                  figures before publishing them as actual company results.
                </p>
              )}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-y-6 lg:grid-cols-4">
              {impactStats.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-center gap-3 p-5 ${
                    index % 2 === 0 ? "border-r border-gray-200 lg:border-r" : ""
                  } ${index < 2 ? "border-b border-gray-200 lg:border-b-0" : ""} ${
                    index === 1 ? "lg:border-r" : ""
                  } ${index === 3 ? "lg:border-r-0" : ""}`}
                >
                  <span
                    className="text-3xl text-[#075631] sm:text-4xl"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>

                  <div>
                    <h3 className="font-serif text-2xl font-bold sm:text-3xl">
                      {item.value}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global presence */}
        <section className="bg-[#fafaf7]">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:px-6">
            <div className="relative">
              <img
                src={globalPresence.image}
                alt="Illustration of Halla Bol's global presence"
                loading="lazy"
                className="mx-auto w-full max-w-xl"
              />

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-xs font-semibold shadow-md">
                🇮🇳 {globalPresence.label}
              </div>
            </div>

            <div>
              <SectionHeading
                eyebrow={globalPresence.eyebrow}
                title={globalPresence.title}
                description={globalPresence.description}
              />

              <Link
                to={globalPresence.buttonLink}
                className="mt-7 inline-flex items-center rounded-md bg-[#075631] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#064524]"
              >
                {globalPresence.buttonText} <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-6">
            <div className="grid gap-7 lg:grid-cols-[1fr_2fr] lg:items-center">
              <div>
                <SectionLabel>{certificationSection.eyebrow}</SectionLabel>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {certificationSection.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                {certifications.map((item) => (
                  <div
                    key={item}
                    className="flex flex-col items-center justify-center text-center"
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-[#075631] text-xl font-bold text-[#075631]"
                      aria-hidden="true"
                    >
                      ✓
                    </div>

                    <p className="mt-2 text-xs font-semibold">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-5 text-xs leading-5 text-gray-500">
              Certification names are displayed as demo content from the
              supplied design. Remove any certification that cannot be
              verified for your company or product.
            </p>
          </div>
        </section>

        {/* Newsletter */}
        <section className="relative overflow-hidden">
          <img
            src="/images/newsletter-bg.jpg"
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/65" />

          <div className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-6">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl text-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-200">
                  STAY CONNECTED
                </p>

                <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                  {newsletterContent.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/85 sm:text-base">
                  {newsletterContent.description}
                </p>
              </div>

              <div className="w-full lg:max-w-lg">
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <label htmlFor="story-newsletter-email" className="sr-only">
                    Email address
                  </label>

                  <input
                    id="story-newsletter-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={newsletterContent.placeholder}
                    autoComplete="email"
                    required
                    maxLength={254}
                    className="min-w-0 flex-1 rounded-md border border-white/30 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-green-300"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-[#e4e8b8] px-6 py-3 text-sm font-bold text-[#073b25] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Submitting..." : `${newsletterContent.buttonText} →`}
                  </button>
                </form>

                {newsletterStatus.message && (
                  <p
                    role="status"
                    aria-live="polite"
                    className={`mt-3 rounded-md px-3 py-2 text-sm ${
                      newsletterStatus.type === "success"
                        ? "bg-green-100 text-green-900"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {newsletterStatus.message}
                  </p>
                )}

                <p className="mt-3 text-xs leading-5 text-white/75">
                  Demo mode: this form saves the email in this browser only.
                  It does not send emails or subscribe anyone to a mailing
                  service.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OurStory;