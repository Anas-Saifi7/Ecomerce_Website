
import { Link } from "react-router-dom";

export default function LegalDocument({ data }) {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 text-stone-900 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 rounded-2xl bg-amber-50 px-6 py-10 sm:px-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
            Halla Bol · Customer Information
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            {data.title}
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-stone-600">
            {data.subtitle}
          </p>

          <p className="mt-5 text-sm text-stone-500">
            Last updated: {data.lastUpdated}
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="rounded-xl border border-stone-200 bg-white p-5 lg:sticky lg:top-24">
            <h2 className="mb-4 font-semibold">On this page</h2>

            <nav className="space-y-1">
              {data.sections.map((section, index) => (
                <a
                  key={section.title}
                  href={`#section-${index}`}
                  className="block rounded-lg px-3 py-2 text-sm leading-5 text-stone-600 transition hover:bg-amber-50 hover:text-amber-900"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="rounded-xl border border-stone-200 bg-white p-6 sm:p-9">
            <p className="mb-8 leading-7 text-stone-600">
              Please read the following information carefully.
              It explains the policies and conditions relevant to
              using Halla Bol.
            </p>

            {data.sections.map((section, index) => (
              <section
                id={`section-${index}`}
                key={section.title}
                className="scroll-mt-24 border-t border-stone-100 py-6 first:border-t-0"
              >
                <h2 className="mb-3 text-xl font-semibold tracking-tight">
                  {section.title}
                </h2>

                <p className="leading-7 text-stone-600">
                  {section.content}
                </p>
              </section>
            ))}

            <div className="mt-6 flex flex-wrap gap-4 border-t border-stone-200 pt-6 text-sm">
              <Link
                to="/privacy-policy"
                className="text-amber-800 hover:underline"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms-and-conditions"
                className="text-amber-800 hover:underline"
              >
                Terms &amp; Conditions
              </Link>

              <Link
                to="/contact"
                className="text-amber-800 hover:underline"
              >
                Contact Us
              </Link>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
