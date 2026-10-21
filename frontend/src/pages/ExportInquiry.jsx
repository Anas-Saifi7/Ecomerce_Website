import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createEnquiry } from "../services/enquiryService.js";

const ExportInquiry = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    productCategory: "",
    productName: "",
    quantity: "",
    unit: "Pieces",
    targetPrice: "",
    packaging: "",
    destination: "",
    requirement: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    try {
      await createEnquiry({
        type: "export",
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: `${formData.company} · ${formData.productName || formData.productCategory}`,
        message: [
          formData.requirement,
          formData.message,
          `Quantity: ${formData.quantity} ${formData.unit}`,
          `Destination: ${formData.destination || formData.city + ", " + formData.country}`,
          `Packaging: ${formData.packaging}`,
          `Target price: ${formData.targetPrice}`,
        ]
          .filter(Boolean)
          .join("\n"),
        meta: formData,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error.message || "Unable to send this enquiry. Please try again.",
      );
      return;
    }

    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      productCategory: "",
      productName: "",
      quantity: "",
      unit: "Pieces",
      targetPrice: "",
      packaging: "",
      destination: "",
      requirement: "",
      message: "",
    });
  };

  const benefits = [
    {
      icon: "🌍",
      title: "Global Sourcing",
      text: "Source authentic Indian products for international markets.",
    },
    {
      icon: "📦",
      title: "Bulk Orders",
      text: "Discuss wholesale quantities and customized requirements.",
    },
    {
      icon: "🤝",
      title: "Business Partnership",
      text: "Build long-term sourcing and distribution partnerships.",
    },
    {
      icon: "🚚",
      title: "Export Support",
      text: "Share your destination and logistics requirements with us.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Send Your Inquiry",
      text: "Tell us about your products, quantity and destination.",
    },
    {
      number: "02",
      title: "Requirement Review",
      text: "Our team reviews your requirements and sourcing needs.",
    },
    {
      number: "03",
      title: "Receive a Response",
      text: "We get back to you with relevant product and order details.",
    },
    {
      number: "04",
      title: "Build the Partnership",
      text: "Move forward with your international sourcing requirement.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <section className="relative min-h-110 sm:min-h-125 overflow-hidden">
        <img
          src="/images/Export_SupportHero.jpg"
          alt="Halla Bol Export Inquiry"
          className="absolute inset-0 w-full h-full object-fit-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        <div className="absolute inset-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-8 py-24 sm:py-32">
          <div className="max-w-3xl text-white">
            <p className="text-sm uppercase tracking-[0.22em] text-[#f4df91] font-semibold">
              International Business
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-4">
              Export & Wholesale Inquiry
            </h1>

            <p className="mt-5 text-base sm:text-lg text-gray-100 leading-8 max-w-2xl">
              Looking to source authentic Indian products for your international
              market? Share your requirements with the Halla Bol team.
            </p>

            <a
              href="#inquiry-form"
              className="inline-flex mt-8 bg-[#f4df91] hover:bg-[#e8cf72] text-[#073b25] px-6 py-3.5 rounded-lg font-semibold transition"
            >
              Send an Inquiry
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-8 py-14 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#245d24] font-semibold">
                Partner With Halla Bol
              </p>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 leading-tight">
                Bring the Best of India to the World
              </h2>

              <p className="text-gray-600 leading-7 mt-5">
                Halla Bol connects international buyers with thoughtfully
                sourced products from India. Whether you are a distributor,
                retailer, importer, hospitality business or corporate buyer,
                tell us what you are looking for.
              </p>

              <p className="text-gray-600 leading-7 mt-4">
                Share your expected quantity, destination, product preferences
                and packaging requirements so our team can better understand
                your business inquiry.
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <span className="px-4 py-2 rounded-full bg-[#eff7e9] text-[#245d24] text-sm font-medium">
                  Bulk Sourcing
                </span>

                <span className="px-4 py-2 rounded-full bg-[#eff7e9] text-[#245d24] text-sm font-medium">
                  International Buyers
                </span>

                <span className="px-4 py-2 rounded-full bg-[#eff7e9] text-[#245d24] text-sm font-medium">
                  Wholesale
                </span>

                <span className="px-4 py-2 rounded-full bg-[#eff7e9] text-[#245d24] text-sm font-medium">
                  Private Requirements
                </span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-[#f5f7f2]">
              <img
                src="/images/export-inquiry.jpg"
                alt="Indian products for export"
                className="w-full h-75 sm:h-100 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f7f2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-8 py-14 sm:py-18">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-[#245d24] font-semibold">
              Why Work With Us
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3">
              Built for Global Buyers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <div className="w-12 h-12 rounded-xl bg-[#eff7e9] flex items-center justify-center text-2xl">
                  {benefit.icon}
                </div>

                <h3 className="font-serif text-xl font-bold mt-5">
                  {benefit.title}
                </h3>

                <p className="text-sm text-gray-500 leading-6 mt-2">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-8 py-14 sm:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-[#245d24] font-semibold">
              Simple Process
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3">
              How Export Inquiries Work
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-[#073b25] text-[#f4df91] flex items-center justify-center font-bold">
                  {step.number}
                </div>

                <h3 className="font-serif text-xl font-bold mt-5">
                  {step.title}
                </h3>

                <p className="text-sm text-gray-500 leading-6 mt-2">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="inquiry-form" className="bg-[#f5f7f2]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-8 py-14 sm:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-[#245d24] font-semibold">
              Export Inquiry
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3">
              Tell Us About Your Requirement
            </h2>

            <p className="text-sm sm:text-base text-gray-600 mt-4 leading-7">
              Fill in the details below and our team can review your
              international sourcing inquiry.
            </p>
          </div>

          <div className="mt-10 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8 lg:p-10">
            {submitError && (
              <p
                role="alert"
                className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {submitError}
              </p>
            )}

            {submitted && (
              <div className="mb-7 rounded-xl border border-green-200 bg-green-50 p-5">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                    ✓
                  </div>

                  <div>
                    <h3 className="font-semibold text-green-800">
                      Inquiry Submitted Successfully
                    </h3>

                    <p className="text-sm text-green-700 mt-1">
                      Thank you for contacting Halla Bol. Your export inquiry
                      has been recorded.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Buyer Information */}
              <div>
                <h3 className="font-serif text-2xl font-bold">
                  Buyer Information
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Tell us about yourself or your business.
                </p>

                <div className="grid sm:grid-cols-2 gap-5 mt-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Company / Business Name
                    </label>

                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="business@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone / WhatsApp
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Country *
                    </label>

                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      placeholder="Your country"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h3 className="font-serif text-2xl font-bold">
                  Product Requirement
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Give us information about the products you want to source.
                </p>

                <div className="grid sm:grid-cols-2 gap-5 mt-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Category *
                    </label>

                    <select
                      name="productCategory"
                      value={formData.productCategory}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                    >
                      <option value="">Select category</option>
                      <option value="Food & Beverages">Food & Beverages</option>
                      <option value="Spices & Herbs">Spices & Herbs</option>
                      <option value="Textiles & Fashion">
                        Textiles & Fashion
                      </option>
                      <option value="Handicrafts">Handicrafts</option>
                      <option value="Home & Lifestyle">Home & Lifestyle</option>
                      <option value="Wellness & Ayurveda">
                        Wellness & Ayurveda
                      </option>
                      <option value="Eco-Friendly Products">
                        Eco-Friendly Products
                      </option>
                      <option value="Art & Cultural Products">
                        Art & Cultural Products
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Name
                    </label>

                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      placeholder="Product you're interested in"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Required Quantity *
                    </label>

                    <input
                      type="number"
                      min="1"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 1000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Unit
                    </label>

                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                    >
                      <option value="Pieces">Pieces</option>
                      <option value="Kg">Kg</option>
                      <option value="Tonnes">Tonnes</option>
                      <option value="Boxes">Boxes</option>
                      <option value="Cartons">Cartons</option>
                      <option value="Units">Units</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Target Price
                    </label>

                    <input
                      type="text"
                      name="targetPrice"
                      value={formData.targetPrice}
                      onChange={handleChange}
                      placeholder="Optional"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Packaging Preference
                    </label>

                    <select
                      name="packaging"
                      value={formData.packaging}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                    >
                      <option value="">Select packaging</option>
                      <option value="Standard">Standard</option>
                      <option value="Retail Ready">Retail Ready</option>
                      <option value="Custom">Custom</option>
                      <option value="Private Label">Private Label</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h3 className="font-serif text-2xl font-bold">
                  Export & Delivery
                </h3>

                <div className="grid sm:grid-cols-2 gap-5 mt-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Destination Country *
                    </label>

                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      required
                      placeholder="Where should the order be delivered?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Requirement Type
                    </label>

                    <select
                      name="requirement"
                      value={formData.requirement}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                    >
                      <option value="">Select requirement</option>
                      <option value="Wholesale">Wholesale</option>
                      <option value="Distribution">Distribution</option>
                      <option value="Retail">Retail</option>
                      <option value="Hospitality">Hospitality</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Private Label">Private Label</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium mb-2">
                    Additional Details
                  </label>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Tell us about your requirements, specifications, certifications, packaging, timeline or any other details..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-7">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#073b25] hover:bg-[#064524] text-white px-8 py-3.5 rounded-lg font-semibold transition"
                >
                  Submit Export Inquiry
                </button>

                <p className="text-xs text-gray-500 mt-3">
                  By submitting this inquiry, you are requesting information
                  about potential export or wholesale opportunities.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-[#073b25]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <p className="text-[#f4df91] text-xs uppercase tracking-[0.2em] font-semibold">
                Halla Bol Global
              </p>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3">
                Let's Build a Global Partnership
              </h2>

              <p className="text-gray-200 text-sm sm:text-base leading-7 mt-4 max-w-xl">
                Have a specific sourcing requirement or want to discuss an
                international business opportunity?
              </p>
            </div>

            <div className="md:text-right">
              <Link
                to="/contact"
                className="inline-flex bg-[#f4df91] hover:bg-[#e8cf72] text-[#073b25] px-7 py-3.5 rounded-lg font-semibold transition"
              >
                Contact Halla Bol
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExportInquiry;
