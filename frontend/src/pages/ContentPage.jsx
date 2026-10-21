import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { getPage } from "../services/pageService.js";

export default function ContentPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setPage(null);
    setError("");
    getPage(slug)
      .then((result) => {
        if (active) setPage(result.page);
      })
      .catch((e) => {
        if (active) setError(e.message || "Page not found.");
      });
    return () => {
      active = false;
    };
  }, [slug]);
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="mx-auto min-h-[60vh] max-w-4xl px-5 py-14 sm:px-8">
        <Link to="/" className="text-sm text-[#075631]">
          ← Home
        </Link>
        {error ? (
          <h1 className="mt-8 text-2xl">{error}</h1>
        ) : !page ? (
          <p className="mt-8 text-gray-500">Loading page…</p>
        ) : (
          <>
            <h1 className="mt-8 font-serif text-4xl text-[#073b25]">
              {page.title}
            </h1>
            <article className="mt-6 whitespace-pre-wrap leading-8 text-gray-700">
              {page.content}
            </article>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
