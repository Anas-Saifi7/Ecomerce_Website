import React, { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  shippingIntro,
  shippingHighlights,
  orderProcessingPoints,
  deliveryPoints,
  shippingChargePoints,
  shippingFaqs,
  shippingPolicyImages,
} from "../data/shippingPolicyData";

const ShippingPolicy = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq((current) => (current === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main>
        <section className="relative min-h-95 overflow-hidden sm:min-h-110">
          <img
            src={shippingPolicyImages.hero}
            alt="Halla Bol shipping and delivery"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <div className="absolute inset-0" />

          <div className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
            <div className="max-w-3xl text-white">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#f4df91]">
                Halla Bol Customer Care
              </p>

              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Shipping Policy
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-100 sm:text-lg">
                Everything you need to know about order processing, delivery,
                tracking and shipping.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#f5f7f2]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#073b25] text-xl text-[#f4df91]">
                🚚
              </span>

              <h2 className="mt-5 font-serif text-3xl font-bold sm:text-4xl">
                {shippingIntro.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                {shippingIntro.description}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {shippingHighlights.map((item) => (
                <article
                  key={item.icon}
                  className="rounded-2xl border border-gray-200 p-5 transition hover:-translate-y-1 hover:shadow-lg sm:p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eff7e9] text-sm font-bold text-[#073b25]">
                    {item.icon}
                  </div>

                  <h3 className="mt-5 font-serif text-xl font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f5f7f2]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="grid gap-8 lg:grid-cols-2">
              <InfoCard
                icon="📦"
                title="Order Processing"
                points={orderProcessingPoints}
              />

              <InfoCard icon="🏠" title="Delivery" points={deliveryPoints} />
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#245d24]">
                  Shipping Charges
                </p>

                <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                  Clear Shipping Information
                </h2>

                <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                  Shipping charges can vary based on the delivery location,
                  package size, product type and selected shipping method.
                </p>

                <div className="mt-7 space-y-5">
                  {shippingChargePoints.map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eff7e9] font-bold text-[#245d24]">
                        ✓
                      </span>

                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-gray-500">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-85 overflow-hidden rounded-2xl bg-[#073b25]">
                <img
                  src={shippingPolicyImages.delivery}
                  alt="Halla Bol shipping and global delivery"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />

                <div className="absolute inset-0" />

                <div className="relative z-10 flex min-h-85 flex-col justify-end p-7 text-white sm:p-10">
                  <p className="text-sm font-semibold uppercase tracking-wider text-[#2f2709]">
                    From India to the World
                  </p>

                  <h3 className="mt-2 font-serif text-3xl font-bold">
                    Bringing authentic products closer to you.
                  </h3>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-gray-200">
                    We work with shipping partners to deliver products safely
                    and efficiently to the address provided with your order.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f5f7f2]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#245d24]">
                Track Your Order
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                Know Where Your Order Is
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                Once tracking information is available, you can follow your
                shipment and check its latest status.
              </p>

              <Link
                to="/track-order"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#073b25] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#064524]"
              >
                Track Your Order →
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="rounded-2xl bg-[#073b25] p-6 text-white sm:p-8 lg:p-10">
              <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f4df91]">
                    Need Help?
                  </p>

                  <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">
                    Your delivery is delayed or has an issue?
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-200 sm:text-base">
                    If your shipment appears delayed, damaged or delivered
                    incorrectly, please contact our support team with your order
                    details.
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

        <section className="bg-[#f5f7f2]">
          <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#245d24]">
                Shipping Questions
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="mt-8 space-y-3">
              {shippingFaqs.map((faq, index) => {
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
                      <span className="text-sm font-semibold text-gray-900 sm:text-base">
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
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#073b25]">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
            <div className="text-center text-white">
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">
                Have a question about your shipment?
              </h2>

              <p className="mt-2 text-sm text-gray-200">
                Our customer support team is ready to help.
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/contact"
                  className="w-full rounded-lg bg-[#f4df91] px-6 py-3 text-center text-sm font-semibold text-[#073b25] transition hover:bg-[#e8cf72] sm:w-auto"
                >
                  Contact Us
                </Link>

                <Link
                  to="/return-refund"
                  className="w-full rounded-lg border border-white/40 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
                >
                  Return & Refund
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

function InfoCard({ icon, title, points }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#073b25] text-xl text-[#f4df91]">
        {icon}
      </div>

      <h2 className="mt-5 font-serif text-2xl font-bold sm:text-3xl">
        {title}
      </h2>

      <div className="mt-5 space-y-4">
        {points.map((point) => (
          <div key={point} className="flex items-start gap-3">
            <span className="font-bold text-[#245d24]">✓</span>
            <p className="text-sm leading-6 text-gray-600">{point}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export default ShippingPolicy;
