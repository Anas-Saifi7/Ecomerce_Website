import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  supportOptions,
  faqs,
  contactCards,
  contactHighlights,
  contactSubjects,
  countryCodes,
} from "../data/contact";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  countryCode: "+91",
  subject: "",
  message: "",
  agree: false,
};

export default function Contact() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [openFaq, setOpenFaq] = useState(null);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (status.message) {
      setStatus({ type: "", message: "" });
    }
  };

  const selectSupport = (subject) => {
    setFormData((previous) => ({
      ...previous,
      subject,
    }));

    document.getElementById("contact-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!formData.agree) {
      setStatus({
        type: "error",
        message: "Please agree to the Privacy Policy and Terms & Conditions.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const savedMessages = JSON.parse(
        localStorage.getItem("Halla Bol_contact_messages") || "[]"
      );

      if (!Array.isArray(savedMessages)) {
        throw new Error("Invalid saved messages");
      }

      const newMessage = {
        ...formData,
        phone: formData.phone
          ? `${formData.countryCode} ${formData.phone}`
          : "",
        id: `contact-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "new",
      };

      localStorage.setItem(
        "halla bol_contact_messages",
        JSON.stringify([newMessage, ...savedMessages])
      );

      setStatus({
        type: "success",
        message:
          "Thank you! Your message has been saved successfully in this browser demo.",
      });

      setFormData(INITIAL_FORM);
    } catch (error) {
      console.error("Unable to save contact message:", error);

      setStatus({
        type: "error",
        message:
          "Your message could not be saved. Please check browser storage and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-gray-900">
      <Navbar />

      <main>
        
        <section className="relative flex min-h-80 items-center overflow-hidden sm:min-h-95 lg:min-h-110">
          <img
            src="/images/contact-hero.jpg"
            alt="Indian products and spices"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-2xl text-white">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/80 sm:text-sm">
                We'd love to hear from you
              </p>

              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Contact Us
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/90 sm:text-base lg:text-lg">
                Get in touch for enquiries, customer support, partnerships or
                bulk orders. Our team is ready to help.
              </p>

              <button
                type="button"
                onClick={() =>
                  document.getElementById("contact-form")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                className="mt-7 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#075631] transition hover:bg-[#eff7e9]"
              >
                Send us a message →
              </button>
            </div>
          </div>
        </section>

       
        <section className="bg-[#fafaf7]">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
              {supportOptions.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => selectSupport(item.subject)}
                  className="flex h-full items-start gap-4 bg-white p-5 text-left transition hover:bg-[#f5faf1] sm:p-6"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eff7e9] text-2xl">
                    {item.icon}
                  </span>

                  <span>
                    <span className="block text-sm font-bold sm:text-base">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-gray-500 sm:text-sm">
                      {item.text}
                    </span>
                    <span className="mt-2 block text-xs font-semibold text-[#075631]">
                      Contact us →
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
              {/* Form and FAQ */}
              <div className="min-w-0">
                <div
                  id="contact-form"
                  className="scroll-mt-24 rounded-xl border border-gray-200 p-5 sm:p-7"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#075631]">
                    Get assistance
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
                    Send Us a Message
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Fill out the form and tell us how we can help.
                  </p>

                  {status.message && (
                    <div
                      role="status"
                      aria-live="polite"
                      className={`mt-5 rounded-lg border p-4 text-sm leading-6 ${
                        status.type === "success"
                          ? "border-green-200 bg-green-50 text-green-800"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {status.message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-2 block text-sm font-medium"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        minLength={2}
                        maxLength={100}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-[#075631] focus:ring-1 focus:ring-[#075631]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-2 block text-sm font-medium"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        maxLength={254}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-[#075631] focus:ring-1 focus:ring-[#075631]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="mb-2 block text-sm font-medium"
                      >
                        Phone Number
                      </label>

                      <div className="flex gap-2">
                        <select
                          aria-label="Country calling code"
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleChange}
                          className="w-28 shrink-0 rounded-lg border border-gray-300 bg-white px-2 py-3 text-xs outline-none focus:border-[#075631] sm:w-32 sm:text-sm"
                        >
                          {countryCodes.map((country) => (
                            <option
                              key={country.value}
                              value={country.value}
                            >
                              {country.label}
                            </option>
                          ))}
                        </select>

                        <input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel-national"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone number"
                          maxLength={20}
                          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-[#075631] focus:ring-1 focus:ring-[#075631]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="mb-2 block text-sm font-medium"
                      >
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-[#075631] focus:ring-1 focus:ring-[#075631]"
                      >
                        <option value="">Select a subject</option>
                        {contactSubjects.map((subject) => (
                          <option
                            key={subject.value}
                            value={subject.value}
                          >
                            {subject.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-2 block text-sm font-medium"
                      >
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help..."
                        rows={5}
                        minLength={10}
                        maxLength={5000}
                        required
                        className="w-full resize-y rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-[#075631] focus:ring-1 focus:ring-[#075631]"
                      />
                      <p className="mt-1 text-right text-xs text-gray-400">
                        {formData.message.length}/5000
                      </p>
                    </div>

                    <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-gray-600 sm:text-sm">
                      <input
                        type="checkbox"
                        name="agree"
                        checked={formData.agree}
                        onChange={handleChange}
                        required
                        className="mt-1 accent-[#075631]"
                      />
                      <span>
                        I agree to the{" "}
                        <Link
                          to="/privacy-policy"
                          className="font-medium text-[#075631] underline"
                        >
                          Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/terms"
                          className="font-medium text-[#075631] underline"
                        >
                          Terms & Conditions
                        </Link>
                        .
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-[#075631] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#064524] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {isSubmitting ? "Submitting..." : "Send Message →"}
                    </button>

                    <p className="text-xs leading-5 text-gray-400">
                      Demo mode: this form saves submissions in this browser.
                      It does not send an email yet.
                    </p>
                  </form>
                </div>

                {/* FAQ */}
                <div className="mt-6 rounded-xl border border-gray-200 p-5 sm:p-7">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-serif text-xl font-bold sm:text-2xl">
                      Frequently Asked Questions
                    </h2>
                    <Link
                      to="/faq"
                      className="text-sm font-semibold text-[#075631] hover:underline"
                    >
                      View All FAQs →
                    </Link>
                  </div>

                  <div className="mt-4 divide-y divide-gray-200">
                    {faqs.map((faq, index) => {
                      const isOpen = openFaq === index;

                      return (
                        <div key={faq.question}>
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() =>
                              setOpenFaq(isOpen ? null : index)
                            }
                            className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium sm:text-base"
                          >
                            <span className="flex items-start gap-3">
                              <span className="text-[#075631]">›</span>
                              <span>{faq.question}</span>
                            </span>
                            <span className="shrink-0 text-xl text-gray-500">
                              {isOpen ? "−" : "+"}
                            </span>
                          </button>

                          {isOpen && (
                            <p className="pb-4 pl-6 pr-3 text-sm leading-6 text-gray-500">
                              {faq.answer}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

           
              <div className="min-w-0">
                <div className="rounded-xl border border-[#e0ead9] bg-[#eff7e9] p-5 sm:p-7">
                  <span className="text-3xl text-[#075631]">♧</span>
                  <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">
                    Get in Touch
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Choose the most convenient way to reach our team.
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {contactCards.map((card) => (
                      <article
                        key={card.title}
                        className="flex min-w-0 flex-col items-center rounded-xl bg-white p-5 text-center transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <span className="text-3xl" aria-hidden="true">
                          {card.icon}
                        </span>
                        <h3 className="mt-3 font-serif text-base font-bold">
                          {card.title}
                        </h3>
                        <p className="mt-2 wrap-break-word text-sm font-semibold text-[#075631]">
                          {card.value}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          {card.line1}
                        </p>
                        <p className="text-xs text-gray-500">
                          {card.line2}
                        </p>
                        <a
                          href={card.href}
                          target={
                            card.href.startsWith("https://") ? "_blank" : undefined
                          }
                          rel={
                            card.href.startsWith("https://")
                              ? "noreferrer"
                              : undefined
                          }
                          className="mt-4 text-xs font-semibold text-[#075631] underline underline-offset-4 hover:text-[#064524]"
                        >
                          {card.action}
                        </a>
                      </article>
                    ))}
                  </div>

                  <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <iframe
                      title="Office location map"
                      src="https://www.google.com/maps?q=Sector+62,+Noida,+Uttar+Pradesh&output=embed"
                      className="h-64 w-full border-0 sm:h-80"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  <p className="mt-3 text-xs leading-5 text-gray-500">
                    Demo location shown. Replace it with your actual office
                    address in the contact data and map URL.
                  </p>
                </div>


                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {contactHighlights.map((item) => (
                    <article
                      key={item.title}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="h-44 w-full object-fit-cover sm:h-48"
                      />
                      <div className="p-5">
                        <span className="text-xl text-[#075631]">♧</span>
                        <h3 className="mt-2 font-serif text-lg font-bold">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                          {item.text}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
