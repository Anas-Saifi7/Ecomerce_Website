import React, { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  returnPolicy,
  refundPolicy,
  returnEligibility,
  returnSteps,
  nonReturnableItems,
  returnFaqs,
  returnRefundImages,
  saveReturnRequest,
} from "../data/returnRefundData";

const ReturnRefund = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({
    orderNumber: "",
    email: "",
    reason: "Damaged product",
    details: "",
  });
  const [formMessage, setFormMessage] = useState({
    type: "",
    text: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setFormMessage({ type: "", text: "" });

    if (isSubmitting) return;

    const orderNumber = form.orderNumber.trim();
    const email = form.email.trim().toLowerCase();
    const details = form.details.trim();

    if (!orderNumber || !email || !details) {
      setFormMessage({
        type: "error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      saveReturnRequest({
        orderNumber,
        email,
        reason: form.reason,
        details,
      });

      setForm({
        orderNumber: "",
        email: "",
        reason: "Damaged product",
        details: "",
      });

      setFormMessage({
        type: "success",
        text: "Demo request saved successfully in this browser. It has not been sent to Halla Bol support.",
      });
    } catch {
      setFormMessage({
        type: "error",
        text: "Unable to save the request. Check your browser storage and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main>
       
        <section className="relative flex min-h-95 items-center overflow-hidden sm:min-h-110">
          <img
            src={returnRefundImages.hero}
            alt="Halla Bol returns and refunds"
             loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <div className="absolute inset-0" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#f4df91] sm:text-sm">
              Halla Bol Customer Care
            </p>

            <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Returns &amp; Refunds
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-100 sm:text-lg">
              Your satisfaction matters to us. Understand the return,
              replacement and refund process before submitting a request.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#return-request"
                className="rounded-md bg-[#f4df91] px-5 py-3 text-sm font-semibold text-[#073b25] transition hover:bg-white"
              >
                Request a Return →
              </a>

              <Link
                to="/contact"
                className="rounded-md border border-white/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#f5f7f2]">
          <div className="mx-auto max-w-7xl px-5 py-12 text-center sm:px-8 sm:py-16">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#073b25] text-xl text-[#f4df91]">
              ✓
            </span>

            <h2 className="mt-5 font-serif text-3xl font-bold sm:text-4xl">
              Simple &amp; Transparent
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
              If something is wrong with your order, review the eligibility
              conditions and contact our team. Each request is subject to
              product condition, order details and the applicable policy.
            </p>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="grid gap-6 md:grid-cols-2">
              {[returnPolicy, refundPolicy].map((policy, index) => (
                <article
                  key={policy.title}
                  className="rounded-2xl border border-gray-200 p-6 transition hover:shadow-lg sm:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff7e9] text-xl text-[#073b25]">
                    {index === 0 ? "↩" : "₹"}
                  </div>

                  <h2 className="mt-5 font-serif text-2xl font-bold">
                    {policy.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {policy.description}
                  </p>

                  <ul className="mt-5 space-y-3">
                    {policy.conditions.map((condition) => (
                      <li
                        key={condition}
                        className="flex items-start gap-3 text-sm leading-6 text-gray-600"
                      >
                        <span className="font-bold text-[#245d24]">✓</span>
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f5f7f2]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#245d24]">
                Before You Request a Return
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                Return Eligibility
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                Keep your order details ready and check the conditions
                applicable to your product.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {returnEligibility.map((item) => (
                <article
                  key={item.number}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <span className="text-xs font-bold text-[#245d24]">
                    {item.number}
                  </span>

                  <h3 className="mt-3 font-serif text-lg font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-gray-500">
              Demo policy: the original design specifies a 7-day return
              window. Confirm the actual Halla Bol policy before publishing.
            </p>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#245d24]">
                How It Works
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                Easy Return Process
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                Follow these steps to request a return or report a problem
                with an order.
              </p>

              <div className="mt-8 space-y-6">
                {returnSteps.map((step) => (
                  <div key={step.number} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#073b25] text-sm font-bold text-[#f4df91]">
                      {step.number}
                    </div>

                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/contact"
                className="mt-8 inline-flex items-center font-semibold text-[#075631] hover:underline"
              >
                Contact Our Team →
              </Link>
            </div>

            <div className="relative min-h-90 overflow-hidden rounded-2xl bg-[#073b25]">
              <img
                src={returnRefundImages.process}
                alt="Halla Bol return and refund support"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />

              <div className="absolute inset-0 " />

              <div className="relative flex min-h-90 flex-col justify-end p-7 text-white sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#f4df91]">
                  Halla Bol Customer Care
                </p>

                <h3 className="mt-2 font-serif text-3xl font-bold">
                  We are here to help.
                </h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-gray-200">
                  If something does not feel right with your order, reach
                  out to our customer support team for guidance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f5f7f2]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 font-bold text-red-600">
                  !
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold">
                    Items That May Not Be Returnable
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Some items may not qualify for standard returns due to
                    customization, hygiene requirements, product condition
                    or other applicable restrictions.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {nonReturnableItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-lg bg-gray-50 p-3 text-sm leading-6 text-gray-600"
                  >
                    <span className="font-bold text-red-500">×</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                This list is illustrative. Actual exclusions depend on the
                applicable policy, product type and legal requirements.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="rounded-2xl bg-[#073b25] p-6 text-white sm:p-8 lg:p-10">
              <div className="grid items-center gap-7 lg:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f4df91]">
                    Received Something Wrong?
                  </p>

                  <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">
                    Damaged, defective or incorrect product?
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-200 sm:text-base">
                    Keep your order number and product details ready.
                    Contact support to discuss the available resolution.
                  </p>
                </div>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-lg bg-[#f4df91] px-6 py-3 text-sm font-semibold text-[#073b25] transition hover:bg-[#e8cf72]"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Demo return request form */}
        <section id="return-request" className="scroll-mt-24 bg-white">
          <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#245d24]">
                Return Request
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                Tell Us About Your Order
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600">
                Enter your order details and reason for return. This
                prototype stores the request in your browser for testing.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5 rounded-2xl border border-gray-200 p-5 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="return-order-number"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Order number *
                  </label>

                  <input
                    id="return-order-number"
                    name="orderNumber"
                    type="text"
                    value={form.orderNumber}
                    onChange={handleChange}
                    placeholder="e.g. MO12345"
                    autoComplete="off"
                    maxLength={80}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#075631] focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="return-email"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Order email *
                  </label>

                  <input
                    id="return-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    maxLength={254}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#075631] focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="return-reason"
                  className="mb-2 block text-sm font-semibold"
                >
                  Reason for return *
                </label>

                <select
                  id="return-reason"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#075631] focus:ring-2 focus:ring-green-100"
                >
                  <option>Damaged product</option>
                  <option>Defective product</option>
                  <option>Incorrect product received</option>
                  <option>Product not as described</option>
                  <option>Exchange request</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="return-details"
                  className="mb-2 block text-sm font-semibold"
                >
                  Describe the issue *
                </label>

                <textarea
                  id="return-details"
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  placeholder="Tell us what happened with your order..."
                  rows={5}
                  minLength={10}
                  maxLength={1500}
                  required
                  className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#075631] focus:ring-2 focus:ring-green-100"
                />

                <p className="mt-1 text-right text-xs text-gray-500">
                  {form.details.length}/1500 characters
                </p>
              </div>

              {formMessage.text && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-lg p-4 text-sm leading-6 ${
                    formMessage.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {formMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#073b25] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#052d1c] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? "Submitting..." : "Submit Demo Request →"}
              </button>

              <p className="text-xs leading-5 text-gray-500">
                Do not enter passwords, OTPs or payment card details. Demo
                requests are stored only in this browser; no support agent
                receives them.
              </p>
            </form>
          </div>
        </section>

        <section className="bg-[#f5f7f2]">
          <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#245d24]">
                Need Help?
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                Return &amp; Refund FAQs
              </h2>
            </div>

            <div className="mt-8 space-y-3">
              {returnFaqs.map((faq, index) => {
                const isOpen = openFaq === index;
                const answerId = `return-faq-answer-${index}`;

                return (
                  <article
                    key={faq.question}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(isOpen ? null : index)
                      }
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50"
                    >
                      <span className="text-sm font-semibold text-gray-900 sm:text-base">
                        {faq.question}
                      </span>

                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eff7e9] text-lg text-[#245d24]">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        id={answerId}
                        className="px-5 pb-5"
                      >
                        <p className="border-t border-gray-100 pt-4 text-sm leading-7 text-gray-500">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#073b25]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
            <div className="text-center text-white">
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">
                Still Have Questions?
              </h2>

              <p className="mt-2 text-sm text-gray-200">
                Contact our team or visit the order tracking page.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/contact"
                  className="rounded-lg bg-[#f4df91] px-6 py-3 text-sm font-semibold text-[#073b25] transition hover:bg-[#e8cf72]"
                >
                  Contact Us
                </Link>

                <Link
                  to="/track-order"
                  className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Track Your Order
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

export default ReturnRefund;