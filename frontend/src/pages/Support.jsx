import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  supportFaqs,
  supportCategories,
  supportQuickActions,
  supportContactInfo,
  supportSubjects,
  supportImages,
  saveSupportEnquiry,
} from "../data/supportData";

const initialFormData = {
  name: "",
  email: "",
  orderNumber: "",
  subject: "",
  message: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#245d24] focus:ring-2 focus:ring-green-100";

const Support = () => {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return supportFaqs;

    return supportFaqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [search]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSubmitted(false);
    setSubmitError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitError("");

    try {
      saveSupportEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        orderNumber: formData.orderNumber.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
      });

      setSubmitted(true);
      setFormData(initialFormData);
      setOpenFaq(null);
    } catch {
      setSubmitError(
        "Your request could not be saved in this browser. Please try again."
      );
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq((current) => (current === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main>
       
        <section className="relative min-h-100 overflow-hidden sm:min-h-115">
          <img
            src={supportImages.hero}
            alt="Halla Bol customer support"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <div className="absolute inset-0 bg-[#073b25]/80" />

          <div className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
            <div className="max-w-3xl text-white">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#f4df91]">
                Halla Bol Customer Care
              </p>

              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                How Can We Help?
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-100 sm:text-lg">
                Find answers, track your order, learn about returns and
                shipping, or contact our support team.
              </p>

              <div className="relative mt-8 max-w-2xl">
                <label htmlFor="support-search" className="sr-only">
                  Search support questions
                </label>

                <input
                  id="support-search"
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setOpenFaq(null);
                  }}
                  placeholder="Search for help..."
                  className="w-full rounded-xl bg-white px-5 py-4 pr-14 text-sm text-gray-900 shadow-lg outline-none sm:text-base"
                />

                <span
                  aria-hidden="true"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-gray-400"
                >
                  ⌕
                </span>
              </div>
            </div>
          </div>
        </section>

       
        <section className="bg-[#f5f7f2]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#245d24]">
                Support Center
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                What Do You Need Help With?
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                Choose a support category to quickly find the information
                you need.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {supportCategories.map((category) => (
                <Link
                  key={category.title}
                  to={category.link}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff7e9] text-2xl">
                    {category.icon}
                  </div>

                  <h3 className="mt-5 font-serif text-xl font-bold transition group-hover:text-[#245d24]">
                    {category.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {category.description}
                  </p>

                  <span className="mt-5 inline-block text-sm font-semibold text-[#245d24]">
                    {category.linkText}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {supportQuickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.link}
                  className="flex items-center gap-5 rounded-2xl border border-gray-200 p-6 transition hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#073b25] text-xl text-[#f4df91]">
                    {action.icon}
                  </div>

                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

       
        <section className="bg-[#f5f7f2]">
          <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#245d24]">
                Frequently Asked Questions
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                Find Your Answer
              </h2>

              <p className="mt-3 text-sm text-gray-600">
                Search above or browse our most common questions.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => {
                  const isOpen = openFaq === index;

                  return (
                    <article
                      key={faq.question}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      >
                        <span className="text-sm font-semibold sm:text-base">
                          {faq.question}
                        </span>

                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eff7e9] text-lg text-[#245d24]">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5">
                          <p className="border-t border-gray-100 pt-4 text-sm leading-6 text-gray-500">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })
              ) : (
                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                  <div className="text-3xl" aria-hidden="true">
                    🔎
                  </div>

                  <h3 className="mt-3 font-serif text-xl font-bold">
                    No results found
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Try searching for another question or contact our
                    support team.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="mt-4 font-semibold text-[#245d24] underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

       
        <section id="contact-support" className="bg-white scroll-mt-24">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
             
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#245d24]">
                  Contact Support
                </p>

                <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                  We're Here to Help
                </h2>

                <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                  Can't find the answer you're looking for? Send us your
                  question and our team can review your request.
                </p>

                <div className="mt-8 space-y-5">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eff7e9]">
                      ✉️
                    </div>

                    <div>
                      <h3 className="font-semibold">Email Support</h3>
                      <a
                        href={`mailto:${supportContactInfo.email}`}
                        className="mt-1 inline-block text-sm text-gray-500 hover:text-[#245d24]"
                      >
                        {supportContactInfo.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eff7e9]">
                      🕐
                    </div>

                    <div>
                      <h3 className="font-semibold">Support Hours</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {supportContactInfo.days}
                      </p>
                      <p className="text-sm text-gray-500">
                        {supportContactInfo.hours}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eff7e9]">
                      💬
                    </div>

                    <div>
                      <h3 className="font-semibold">Response Time</h3>
                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        {supportContactInfo.responseTime}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">
                  Confirm the support email and operating hours with halla Bol
                  before publishing these details.
                </p>
              </div>

            
              <div className="rounded-2xl bg-[#f5f7f2] p-6 sm:p-8">
                <h3 className="font-serif text-2xl font-bold">
                  Send Us a Message
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Please provide as much detail as possible.
                </p>

                {submitted && (
                  <div
                    role="status"
                    className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4"
                  >
                    <p className="text-sm font-medium text-green-800">
                      Your support request has been saved in this browser.
                    </p>
                    <p className="mt-1 text-xs text-green-700">
                      This demo does not send your message to Halla BOl.
                    </p>
                  </div>
                )}

                {submitError && (
                  <div
                    role="alert"
                    className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                  >
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="support-name"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>

                      <input
                        id="support-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        autoComplete="name"
                        maxLength={100}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="support-email"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>

                      <input
                        id="support-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        maxLength={254}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="support-order"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Order Number{" "}
                      <span className="font-normal text-gray-400">
                        (Optional)
                      </span>
                    </label>

                    <input
                      id="support-order"
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      placeholder="e.g. Halla Bol-1001"
                      maxLength={100}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="support-subject"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>

                    <select
                      id="support-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">Select a topic</option>

                      {supportSubjects.map((subject) => (
                        <option key={subject.value} value={subject.value}>
                          {subject.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="support-message"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>

                    <textarea
                      id="support-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      rows={5}
                      minLength={10}
                      maxLength={5000}
                      required
                      className={`${inputClass} resize-y`}
                    />
                    <p className="mt-1 text-right text-xs text-gray-400">
                      {formData.message.length}/5000
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#073b25] py-3.5 font-semibold text-white transition hover:bg-[#064524] focus:outline-none focus:ring-2 focus:ring-[#245d24] focus:ring-offset-2"
                  >
                    Submit Support Request
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>


        <section className="bg-[#073b25]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
            <div className="text-center text-white">
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">
                Need more assistance?
              </h2>

              <p className="mt-2 text-sm text-gray-200">
                Explore our help pages or contact the Halla Bol team.
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/contact"
                  className="w-full rounded-lg bg-[#f4df91] px-6 py-3 text-center text-sm font-semibold text-[#073b25] transition hover:bg-[#e8cf72] sm:w-auto"
                >
                  Contact Us
                </Link>

                <Link
                  to="/faq"
                  className="w-full rounded-lg border border-white/40 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
                >
                  Visit FAQ
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
