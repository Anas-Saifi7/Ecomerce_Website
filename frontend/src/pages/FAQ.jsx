import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  faqCategories,
  faqList,
  faqSupport,
  faqFeatures,
} from "../data/faqData";

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("All FAQs");
  const [search, setSearch] = useState("");
  const [openFaqs, setOpenFaqs] = useState([]);
  const [orderNumber, setOrderNumber] = useState("");

  const navigate = useNavigate();

  const filteredFaqs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return faqList.filter((faq) => {
      const matchesCategory =
        activeCategory === "All FAQs" ||
        faq.category === activeCategory;

      const matchesSearch =
        !normalizedSearch ||
        faq.question.toLowerCase().includes(normalizedSearch) ||
        faq.answer.toLowerCase().includes(normalizedSearch) ||
        faq.category.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const isAllExpanded =
    filteredFaqs.length > 0 &&
    filteredFaqs.every((faq) => openFaqs.includes(faq.id));

  const toggleFaq = (id) => {
    setOpenFaqs((current) =>
      current.includes(id)
        ? current.filter((faqId) => faqId !== id)
        : [...current, id]
    );
  };

  const toggleAllFaqs = () => {
    if (isAllExpanded) {
      setOpenFaqs((current) =>
        current.filter(
          (id) => !filteredFaqs.some((faq) => faq.id === id)
        )
      );
    } else {
      setOpenFaqs((current) => [
        ...new Set([...current, ...filteredFaqs.map((faq) => faq.id)]),
      ]);
    }
  };

  const selectCategory = (category) => {
    setActiveCategory(category);
    setOpenFaqs([]);
  };

  const handleTrackOrder = (event) => {
    event.preventDefault();

    const trimmedOrderNumber = orderNumber.trim();

    if (!trimmedOrderNumber) return;

    navigate(
      `/track-order?order=${encodeURIComponent(trimmedOrderNumber)}`
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <section className="relative flex min-h-90 items-center overflow-hidden sm:min-h-100 lg:min-h-108">
        <img
          src="/images/faq-hero.jpg"
          alt="XYZ customer support"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-6">
          <div className="max-w-3xl text-white">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-green-200 sm:text-sm">
              Halla Bol Help Centre
            </p>

            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Frequently Asked Questions
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/90 sm:text-base lg:text-lg">
              Find answers about our products, orders, shipping,
              payments, returns and business enquiries.
            </p>

            <form
              onSubmit={(event) => event.preventDefault()}
              className="mt-7 flex h-12 max-w-xl overflow-hidden rounded-md bg-white shadow-lg sm:h-14"
            >
              <label htmlFor="faq-search" className="sr-only">
                Search frequently asked questions
              </label>

              <span className="flex items-center pl-4 text-xl text-gray-500">
                ⌕
              </span>

              <input
                id="faq-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search FAQs..."
                className="min-w-0 flex-1 px-3 text-sm text-gray-800 outline-none"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="px-3 text-sm text-gray-500 hover:text-gray-900"
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}

              <button
                type="submit"
                aria-label="Search FAQs"
                className="bg-[#073b25] px-5 text-white transition hover:bg-[#052d1c]"
              >
                Search
              </button>
            </form>
          </div>

          <div className="absolute right-8 top-12 hidden rotate-[-5deg] font-serif text-3xl italic leading-tight text-white/90 lg:block xl:right-16 xl:text-4xl">
            We're
            <br />
            Here to
            <br />
            Help
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-10">
          {faqCategories.map((category) => {
            const active = activeCategory === category.name;

            return (
              <button
                key={category.name}
                type="button"
                onClick={() => selectCategory(category.name)}
                aria-pressed={active}
                className={`flex min-h-28 flex-col items-center justify-center rounded-lg border p-3 text-center transition ${
                  active
                    ? "border-[#073b25] bg-[#073b25] text-white shadow-sm"
                    : "border-gray-200 bg-white hover:border-[#073b25] hover:bg-green-50"
                }`}
              >
                <span className="mb-2 text-2xl" aria-hidden="true">
                  {category.icon}
                </span>

                <span className="text-xs font-bold leading-4">
                  {category.name}
                </span>

                <span
                  className={`mt-1 text-[10px] leading-4 ${
                    active ? "text-green-100" : "text-gray-500"
                  }`}
                >
                  {category.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      
      <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-6">
        <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_270px]">
     
          <aside className="rounded-lg border border-gray-200 p-3">
            <h2 className="px-3 py-3 font-serif text-xl font-bold">
              FAQ Categories
            </h2>

            <div className="space-y-1">
              {faqCategories.map((category) => {
                const active = activeCategory === category.name;

                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => selectCategory(category.name)}
                    aria-pressed={active}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-left transition ${
                      active
                        ? "bg-[#e8f4e9] text-[#073b25]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="w-7 shrink-0 text-center text-xl">
                      {category.icon}
                    </span>

                    <span className="min-w-0">
                      <span className="block text-xs font-semibold sm:text-sm">
                        {category.name}
                      </span>

                      <span className="mt-0.5 block text-[10px] text-gray-500">
                        {category.subtitle}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

      
          <section className="min-w-0">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#39744f]">
                  Help & Information
                </p>

                <h2 className="font-serif text-2xl font-bold sm:text-3xl">
                  {activeCategory === "All FAQs"
                    ? "Popular Questions"
                    : activeCategory}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {filteredFaqs.length}{" "}
                  {filteredFaqs.length === 1 ? "question" : "questions"} found
                </p>
              </div>

              <button
                type="button"
                onClick={toggleAllFaqs}
                disabled={filteredFaqs.length === 0}
                className="self-start text-sm font-semibold text-[#073b25] hover:underline disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"
              >
                {isAllExpanded ? "Collapse All −" : "Expand All +"}
              </button>
            </div>

            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqs.includes(faq.id);
                const answerId = `faq-answer-${faq.id}`;

                return (
                  <article
                    key={faq.id}
                    className={`overflow-hidden rounded-lg border transition ${
                      isOpen
                        ? "border-green-200 shadow-sm"
                        : "border-gray-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-gray-50 sm:px-5"
                    >
                      <span className="min-w-0">
                        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#39744f]">
                          {faq.category}
                        </span>

                        <span className="text-sm font-semibold leading-6 text-gray-900 sm:text-base">
                          {faq.question}
                        </span>
                      </span>

                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl transition ${
                          isOpen
                            ? "rotate-180 bg-[#073b25] text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                        aria-hidden="true"
                      >
                        ⌄
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        id={answerId}
                        className="border-t border-gray-100 bg-gray-50 px-4 pb-5 pt-4 text-sm leading-7 text-gray-600 sm:px-5"
                      >
                        {faq.answer}
                      </div>
                    )}
                  </article>
                );
              })}

              {filteredFaqs.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 px-5 py-12 text-center">
                  <span className="text-4xl" aria-hidden="true">
                    ⌕
                  </span>

                  <h3 className="mt-3 font-serif text-xl font-bold">
                    No questions found
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    Try a different search term or select another category.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      selectCategory("All FAQs");
                    }}
                    className="mt-5 rounded-md bg-[#073b25] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#052d1c]"
                  >
                    View All FAQs
                  </button>
                </div>
              )}
            </div>
          </section>

          
          <aside className="space-y-4 lg:col-span-2 xl:col-span-1">
            <div className="rounded-lg border border-gray-200 p-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl text-[#073b25]" aria-hidden="true">
                  ◉
                </span>

                <div>
                  <h2 className="font-serif text-xl font-bold">
                    Still Need Help?
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Our support team can help with your enquiry.
                  </p>
                </div>
              </div>

              <Link
                to="/contact"
                className="mt-5 flex items-center justify-center gap-2 rounded-md bg-[#073b25] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#052d1c]"
              >
                ✉ Contact Support →
              </Link>

              <div className="mt-6 space-y-5">
                <div className="flex gap-3">
                  <span className="text-xl text-[#073b25]" aria-hidden="true">
                    ☎
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold">Call Us</h3>

                    <a
                      href={`tel:${faqSupport.phone.replace(/[^\d+]/g, "")}`}
                      className="mt-1 block wrap-break-word text-sm font-medium text-[#073b25] hover:underline"
                    >
                      {faqSupport.phone}
                    </a>

                    <p className="mt-1 text-xs text-gray-500">
                      {faqSupport.hours}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-xl text-[#073b25]" aria-hidden="true">
                    ✉
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold">Email Us</h3>

                    <a
                      href={`mailto:${faqSupport.email}`}
                      className="mt-1 block break-all text-sm font-medium text-[#073b25] hover:underline"
                    >
                      {faqSupport.email}
                    </a>

                    <p className="mt-1 text-xs text-gray-500">
                      {faqSupport.responseTime}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-xl text-[#073b25]" aria-hidden="true">
                    ◌
                  </span>

                  <div>
                    <h3 className="text-sm font-bold">Live Chat</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {faqSupport.chatHours}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Replace this demo text when live chat is configured.
                    </p>
                  </div>
                </div>
              </div>
            </div>

           
            <div className="rounded-lg border border-gray-200 p-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl text-[#073b25]" aria-hidden="true">
                  ▣
                </span>

                <div>
                  <h2 className="font-serif text-xl font-bold">
                    Track Your Order
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Enter your order number to continue to order tracking.
                  </p>
                </div>
              </div>

              <form onSubmit={handleTrackOrder} className="mt-4">
                <label htmlFor="faq-order-number" className="sr-only">
                  Order number
                </label>

                <div className="flex">
                  <input
                    id="faq-order-number"
                    type="text"
                    value={orderNumber}
                    onChange={(event) => setOrderNumber(event.target.value)}
                    placeholder="Enter order number"
                    required
                    className="min-w-0 flex-1 rounded-l-md border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#073b25]"
                  />

                  <button
                    type="submit"
                    aria-label="Continue to track order"
                    className="rounded-r-md bg-[#073b25] px-4 text-white transition hover:bg-[#052d1c]"
                  >
                    →
                  </button>
                </div>
              </form>

              <Link
                to="/track-order"
                className="mt-3 inline-block text-sm font-semibold text-[#073b25] hover:underline"
              >
                Track Order Page →
              </Link>
            </div>

           
            <div className="relative min-h-45 overflow-hidden rounded-lg">
              <img
                src="/images/faq-support.jpg"
                alt="Halla Bol products and customer support"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent" />

              <div className="relative flex min-h-45 items-end p-5 text-white">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-green-200">
                    Halla Bol Promise
                  </p>

                  <h3 className="mt-2 font-serif text-2xl font-bold">
                    Quality Products
                    <br />
                    Helpful Support
                  </h3>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

    
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {faqFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-3"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-2xl text-[#073b25]"
                  aria-hidden="true"
                >
                  {feature.icon}
                </span>

                <div>
                  <h3 className="text-sm font-bold">{feature.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;