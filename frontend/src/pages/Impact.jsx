import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  impactStats,
  focusAreas,
  impactStories,
} from "../data/impactData";

const Impact = () => {
  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-white text-gray-900">

        <section className="relative flex min-h-[420px] items-center sm:min-h-[480px]">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=90"
            alt="Indian countryside"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />

          <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
            <div className="max-w-2xl text-white">
              <p className="mb-5 text-xs uppercase tracking-[0.35em]">
                Our Impact ────
              </p>

              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Building a Better Tomorrow Together
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/90 sm:text-base">
                At Halla Bol, impact is at the heart of everything we do.
                We work to support Indian farmers, artisans and local
                communities, preserve heritage and bring authentic products
                to the world.
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

     
        <section className="border-b border-gray-100 bg-[#faf8f2]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-5 py-8 sm:grid-cols-3 sm:px-8 lg:grid-cols-5">
            {impactStats.map((stat) => (
              <div
                key={stat.title}
                className="flex items-center gap-3 lg:justify-center lg:border-r lg:border-gray-200 lg:px-3"
              >
                <span className="text-3xl text-[#073b25] sm:text-4xl">
                  {stat.icon}
                </span>

                <div>
                  <h2 className="text-2xl font-bold text-[#073b25] sm:text-3xl">
                    {stat.number}
                  </h2>
                  <p className="mt-1 text-xs font-medium sm:text-sm">
                    {stat.title}
                  </p>
                  <p className="text-xs text-gray-600">{stat.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <h2 className="font-serif text-3xl font-bold sm:text-4xl">
                Our Focus Areas
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                Creating positive change through conscious business practices.
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

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${area.color} text-xl`}>
                        {area.icon}
                      </span>
                      <h3 className="text-lg font-bold">
                        {area.title}
                      </h3>
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
                Real Stories ────
              </p>

              <h2 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
                Voices of Change
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-gray-600 sm:text-base">
                Meet the inspiring people behind our products — farmers,
                artisans and community members working towards a brighter
                future.
              </p>

              <Link
                to="/blog"
                className="mt-6 inline-flex items-center gap-3 rounded-md bg-[#073b25] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5133]"
              >
                Read More Stories →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {impactStories.map((story) => (
                <article
                  key={story.name}
                  className="overflow-hidden rounded-xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <img
                    src={story.image}
                    alt={story.name}
                    loading="lazy"
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-5">
                    <span className="font-serif text-3xl text-[#b99b55]">
                      “
                    </span>

                    <p className="text-sm leading-6 text-gray-600">
                      {story.quote}
                    </p>

                    <div className="mt-5 border-t border-gray-100 pt-4">
                      <h3 className="font-bold">{story.name}</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {story.role}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
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
