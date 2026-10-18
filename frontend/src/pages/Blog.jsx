import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  categories,
  featuredArticle,
  articles,
  popularArticles,
  tags,
} from "../data/Blog.js";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === "All Articles" ||
        article.category === activeCategory;

      const searchableText = [
        article.title,
        article.category,
        article.description,
        article.content,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchableText.includes(query);
    });
  }, [activeCategory, search]);

  const handleCategory = (category) => {
    setActiveCategory(category);
  };

  const handleTag = (tag) => {
    setActiveCategory("All Articles");
    setSearch(tag);
  };

  // Demo newsletter signup using localStorage
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();

    const email = newsletterEmail.trim().toLowerCase();

    if (!email) {
      setNewsletterMessage("Please enter your email address.");
      return;
    }

    try {
      const savedEmails = JSON.parse(
        localStorage.getItem("halla bol_blog_subscribers") || "[]"
      );

      if (!Array.isArray(savedEmails)) {
        throw new Error("Invalid subscriber data");
      }

      if (savedEmails.includes(email)) {
        setNewsletterMessage("This email is already subscribed.");
        return;
      }

      savedEmails.push(email);

      localStorage.setItem(
        "hala Bol_subscribers",
        JSON.stringify(savedEmails)
      );

      setNewsletterEmail("");
      setNewsletterMessage("Thank you! You have subscribed successfully.");
    } catch {
      setNewsletterMessage(
        "Unable to save your subscription. Please try again."
      );
    }
  };

  const openArticle = (article) => {
    setSelectedArticle(article);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("All Articles");
  };

  const BlogImage = ({ src, alt, className = "" }) => (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
      className={className}
    />
  );

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <section className="relative flex min-h-75 items-center overflow-hidden sm:min-h-90 lg:min-h-105">
        <BlogImage
          src="/images/blog-hero.jpg"
           loading="lazy"
          alt="Indian spices and traditional products"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/55 to-black/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-5">
          <div className="max-w-2xl text-white">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-green-200 sm:text-sm">
              Stories • Heritage • Sustainability
            </p>

            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Blog &amp; Stories
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-100 sm:text-base lg:text-lg">
              Discover the stories behind our products, our farmers, and the
              rich heritage of India's natural treasures.
            </p>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("blog-articles")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-7 rounded-md bg-[#073b25] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5435]"
            >
              Explore Our Stories →
            </button>
          </div>
        </div>
      </section>

      <section
        id="blog-articles"
        className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur"
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategory(category)}
                aria-pressed={activeCategory === category}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition sm:text-sm ${
                  activeCategory === category
                    ? "border-[#073b25] bg-[#073b25] text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-[#073b25] hover:text-[#073b25]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-5">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_310px]">
         
          <div className="min-w-0">
        
            {activeCategory === "All Articles" && !search.trim() && (
              <article className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="grid md:grid-cols-2">
                  <div className="relative min-h-60 overflow-hidden bg-[#eff7e9] sm:min-h-75">
                    <BlogImage
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-105"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#073b25] shadow">
                      Featured Story
                    </span>
                  </div>

                  <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-8">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-[#e4f1e6] px-3 py-1 font-medium text-[#075631]">
                        {featuredArticle.category}
                      </span>

                      <span className="text-gray-400">
                        {featuredArticle.date}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl font-bold leading-tight sm:text-3xl">
                      {featuredArticle.title}
                    </h2>

                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {featuredArticle.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => openArticle(featuredArticle)}
                      className="mt-6 inline-flex w-fit items-center rounded-md bg-[#075631] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#064524]"
                    >
                      Read Full Story <span className="ml-2">→</span>
                    </button>
                  </div>
                </div>
              </article>
            )}

           
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#075631]">
                  Discover Halla Bol
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
                  {activeCategory === "All Articles"
                    ? "Latest Stories"
                    : activeCategory}
                </h2>
              </div>

              <p className="text-xs text-gray-500 sm:text-sm">
                {filteredArticles.length}{" "}
                {filteredArticles.length === 1 ? "article" : "articles"}
              </p>
            </div>

            {search.trim() && (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#eff7e9] px-4 py-3">
                <p className="text-sm text-[#073b25]">
                  Results for: <strong>{search}</strong>
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-semibold text-[#073b25] underline"
                >
                  Clear filters
                </button>
              </div>
            )}

          
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredArticles.map((article) => (
                  <article
                    key={article.id}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-48 overflow-hidden bg-[#eff7e9] sm:h-52">
                      <BlogImage
                        src={article.image}
                        alt={article.title}
                         loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold text-[#075631]">
                        {article.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <p className="text-xs text-gray-500">{article.date}</p>

                      <h3 className="mt-3 font-serif text-lg font-bold leading-snug transition group-hover:text-[#075631] sm:text-xl">
                        {article.title}
                      </h3>

                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-gray-600">
                        {article.description}
                      </p>

                      <button
                        type="button"
                        onClick={() => openArticle(article)}
                        className="mt-5 inline-flex w-fit items-center text-sm font-semibold text-[#073b25] transition hover:text-[#a77c32]"
                      >
                        Read More <span className="ml-2">→</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 px-5 py-16 text-center">
                <div className="text-4xl text-[#075631]">⌕</div>

                <h3 className="mt-4 font-serif text-xl font-bold">
                  No articles found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try another search term or choose a different category.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-md bg-[#073b25] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0b5435]"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

         
          <aside className="space-y-5">
         
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-serif text-xl font-bold">
                Search Articles
              </h2>

              <form
                className="mt-4 flex"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search stories..."
                  aria-label="Search blog articles"
                  className="min-w-0 flex-1 rounded-l-md border border-gray-300 px-3 py-3 text-sm outline-none focus:border-[#075631]"
                />

                <button
                  type="submit"
                  aria-label="Search"
                  className="rounded-r-md bg-[#073b25] px-4 text-white transition hover:bg-[#0b5435]"
                >
                  ⌕
                </button>
              </form>
            </section>

           
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-4 font-serif text-xl font-bold">
                Popular Articles
              </h2>

              <div className="space-y-4">
                {popularArticles.map((article) => (
                  <button
                    type="button"
                    key={article.id}
                    onClick={() => {
                      const match =
                        articles.find((item) => item.id === article.id) ||
                        featuredArticle;

                      openArticle(match);
                    }}
                    className="group flex w-full gap-3 text-left"
                  >
                    <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md bg-[#eff7e9]">
                      <BlogImage
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-5 transition group-hover:text-[#075631]">
                        {article.title}
                      </h3>

                      <p className="mt-1 text-[10px] text-gray-500">
                        {article.date} · {article.time}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

         
            <section className="rounded-xl border border-[#dcebd5] bg-[#eff7e9] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl font-bold">
                    Stay Updated
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Get the latest stories, product news and updates from
                    Halla Bol.
                  </p>
                </div>

                <span className="text-3xl text-[#075631]">♧</span>
              </div>

              <form onSubmit={handleNewsletterSubmit} className="mt-4 space-y-3">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    setNewsletterMessage("");
                  }}
                  placeholder="Your email address"
                  aria-label="Newsletter email address"
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-[#075631]"
                />

                <button
                  type="submit"
                  className="w-full rounded-md bg-[#073b25] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5435]"
                >
                  Subscribe →
                </button>

                {newsletterMessage && (
                  <p
                    role="status"
                    className="text-xs leading-5 text-[#073b25]"
                  >
                    {newsletterMessage}
                  </p>
                )}
              </form>
            </section>

         
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-4 font-serif text-xl font-bold">
                Popular Tags
              </h2>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTag(tag)}
                    className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs transition hover:border-[#075631] hover:bg-[#eff7e9] hover:text-[#075631]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-[#073b25] p-5 text-white">
              <h2 className="font-serif text-xl font-bold">
                Explore Halla Bol
              </h2>

              <p className="mt-2 text-sm leading-6 text-green-100">
                Discover authentic products, traditional crafts and flavours
                from across India.
              </p>

              <Link
                to="/categories"
                className="mt-5 inline-flex items-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-[#073b25] transition hover:bg-green-100"
              >
                Explore Categories →
              </Link>
            </section>
          </aside>
        </div>
      </main>

   
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 sm:px-6 md:grid-cols-4 lg:px-5">
          {[
            {
              icon: "♧",
              title: "Worldwide Shipping",
              description: "Shipping options by destination",
            },
            {
              icon: "▣",
              title: "Secure Payments",
              description: "Secure checkout options",
            },
            {
              icon: "◇",
              title: "Authentic Products",
              description: "Rooted in Indian heritage",
            },
            {
              icon: "◉",
              title: "Customer Support",
              description: "We're here to help",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3"
            >
              <span className="text-3xl text-[#073b25]">{item.icon}</span>

              <div>
                <h3 className="text-xs font-bold sm:text-sm">
                  {item.title}
                </h3>

                <p className="mt-1 text-[10px] leading-4 text-gray-500 sm:text-xs">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

    
      {selectedArticle && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeArticle();
          }}
        >
          <article className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <button
              type="button"
              onClick={closeArticle}
              aria-label="Close article"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl text-gray-800 shadow transition hover:bg-gray-100"
            >
              ×
            </button>

            <div className="relative h-56 overflow-hidden bg-[#eff7e9] sm:h-80">
              <BlogImage
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full bg-[#e4f1e6] px-3 py-1.5 font-semibold text-[#075631]">
                  {selectedArticle.category}
                </span>

                <span className="text-gray-500">
                  {selectedArticle.date}
                </span>
              </div>

              <h2 className="mt-4 font-serif text-2xl font-bold leading-tight sm:text-4xl">
                {selectedArticle.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                {selectedArticle.description}
              </p>

              <div className="mt-5 whitespace-pre-line text-sm leading-8 text-gray-700 sm:text-base">
                {selectedArticle.content}
              </div>

              <div className="mt-7 border-t border-gray-200 pt-5">
                <p className="text-sm font-semibold text-[#073b25]">
                  Rooted in India for a better world.
                </p>

                <button
                  type="button"
                  onClick={closeArticle}
                  className="mt-4 rounded-md bg-[#073b25] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5435]"
                >
                  Back to Articles
                </button>
              </div>
            </div>
          </article>
        </div>
      )}
    </div>
  );
};

export default Blog;