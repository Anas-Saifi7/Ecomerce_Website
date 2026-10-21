import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { sitemapSections } from "../data/legalPages.js";

export default function Sitemap() {
  return (
    <div className="min-h-screen bg-stone-50 text-gray-900">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
        <header className="mb-8 rounded-2xl bg-amber-50 px-6 py-8 sm:px-10 sm:py-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
            Explore Halla Bol
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-5xl">
            Website Sitemap
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-stone-600">
            Find shopping, account, support, and policy pages.
          </p>
        </header>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sitemapSections.map((section) => (
            <section
              key={section.title}
              className="rounded-xl border border-stone-200 bg-white p-5 sm:p-6"
            >
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <ul className="mt-3 divide-y divide-stone-100">
                {section.links.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="flex items-center justify-between gap-3 py-3 text-sm text-stone-600 transition hover:text-amber-800"
                    >
                      <span>{item.label}</span>
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <section className="mt-8 rounded-xl bg-stone-900 p-6 text-white sm:p-9">
          <h2 className="text-2xl font-semibold">Need help?</h2>
          <p className="mt-2 text-stone-300">
            Visit customer support for help with your order or account.
          </p>
          <Link
            to="/support"
            className="mt-5 inline-flex rounded-lg bg-white px-5 py-3 font-semibold text-stone-900 transition hover:bg-amber-100"
          >
            Contact Support
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
