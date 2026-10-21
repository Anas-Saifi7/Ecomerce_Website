import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getPosts } from "../services/blogService.js";

import { focusAreas } from "../data/impactData";

const Impact = () => {
  const [stories, setStories] = useState([]);
  const [storiesError, setStoriesError] = useState("");

  useEffect(() => {
    let active = true;
    getPosts()
      .then((result) => {
        if (active) setStories((result.posts || []).slice(0, 3));
      })
      .catch(() => {
        if (active)
          setStoriesError("Published stories are unavailable right now.");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-white text-gray-900">
        <section className="relative flex min-h-105 items-center sm:min-h-120">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=90"
            alt="Indian countryside"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/55 to-transparent" />

          <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
            <div className="max-w-2xl text-white">
              <p className="mb-5 text-xs uppercase tracking-[0.35em]">
                Our Impact ────
              </p>

              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Building a Better Tomorrow Together
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/90 sm:text-base">
                At Halla Bol, impact is at the heart of everything we do. We
                work to support Indian farmers, artisans and local communities,
                preserve heritage and bring authentic products to the world.
              </p>

              <Link
                to="/our-story"
                className="mt-6 inline-flex items-center gap-3 rounded-md border border-white/70 bg-[#073b25] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#073b25]"
              >
                Our Story →
              </Link>
            </div>
          </div>
        </section>

        <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <h2 className="font-serif text-3xl font-bold sm:text-4xl">
                Our Focus Areas
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                These themes guide how the store presents products and stories.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {focusAreas.map((area) => (
                <article
                  key={area.title}
                  className="group overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={area.image}
                      alt={area.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${area.color} text-xl`}
                      >
                        {area.icon}
                      </span>
                      <h3 className="text-lg font-bold">{area.title}</h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-sm leading-6 text-gray-600">
                      {area.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f8f3e9] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.8fr_2fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#073b25]">
                Published Updates ────
              </p>

              <h2 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
                Stories from the MOLOG Blog
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-gray-600 sm:text-base">
                Read stories and updates published by the store team.
              </p>

              <Link
                to="/blog"
                className="mt-6 inline-flex items-center gap-3 rounded-md bg-[#073b25] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5133]"
              >
                View All Stories →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {stories.map((story) => (
                <article
                  key={story._id}
                  className="overflow-hidden rounded-xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {story.image && (
                    <img
                      src={story.image}
                      alt=""
                      loading="lazy"
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-5">
                    <h3 className="font-bold">{story.title}</h3>
                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-gray-600">
                      {story.excerpt || story.content}
                    </p>
                  </div>
                </article>
              ))}
              {!stories.length && (
                <p className="rounded-xl bg-white p-6 text-sm text-gray-600 md:col-span-3">
                  {storiesError || "No published stories yet."}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#073b25] px-5 py-14 text-white sm:px-8 lg:px-10">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1600&q=80')",
            }}
          />

          <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
                Join Our Journey ────
              </p>

              <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">
                Let’s Create a More Inclusive and Sustainable World
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/80 sm:text-base">
                Support authentic products. Empower real people. Make a
                meaningful impact.
              </p>
            </div>

            <Link
              to="/product"
              className="inline-flex shrink-0 items-center gap-3 rounded-md bg-[#f5d46d] px-6 py-4 text-sm font-bold text-[#173c25] transition hover:bg-white"
            >
              Shop with Purpose →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Impact;
