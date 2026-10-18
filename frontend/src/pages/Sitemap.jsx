import { Link } from "react-router-dom";
import { sitemapSections } from "../data/legalPages";

export default function Sitemap() {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-8 text-sm text-stone-500">
          <Link to="/" className="hover:text-amber-800">
            Home
          </Link>
          <span className="mx-2">/</span>
          Sitemap
        </nav>

        <header className="mb-10 rounded-2xl bg-amber-50 px-6 py-10 sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
            Explore MOLOG
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Website Sitemap
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-stone-600">
            Find our shopping pages, customer account links,
            support information and legal policies in one place.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sitemapSections.map((section) => (
            <section
              key={section.title}
              className="rounded-xl border border-stone-200 bg-white p-6"
            >
              <h2 className="text-xl font-semibold">
                {section.title}
              </h2>

              <ul className="mt-5 divide-y divide-stone-100">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="flex items-center justify-between gap-3 py-3 text-sm text-stone-600 transition hover:text-amber-800"
                    >
                      <span>{link.label}</span>
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-stone-900 p-7 text-white sm:p-9">
          <h2 className="text-2xl font-semibold">
            Need help?
          </h2>
          <p className="mt-2 text-stone-300">
            Our customer support page can help you find the right information.
          </p>
          <Link
            to="/contact"
            className="mt-5 inline-flex rounded-lg bg-white px-5 py-3 font-semibold text-stone-900 transition hover:bg-amber-100"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
