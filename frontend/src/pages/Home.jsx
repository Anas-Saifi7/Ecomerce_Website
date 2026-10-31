import React, { lazy, Suspense } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const Categories = lazy(() => import("../components/Categories"));
const FeaturedProducts = lazy(
  () => import("../components/FeaturedProducts")
);
const Regions = lazy(() => import("../components/Regions"));
const StorySection = lazy(() => import("../components/StorySection"));
const TrustSection = lazy(() => import("../components/TrustSection"));

const SectionLoader = () => (
  <div
    className="flex min-h-40 items-center justify-center"
    role="status"
    aria-label="Loading homepage sections"
  >
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
    <span className="sr-only">Loading content...</span>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main>
        <Hero />

        <Suspense fallback={<SectionLoader />}>
          <Categories />
          <FeaturedProducts />
          <Regions />
          <StorySection />
          <TrustSection />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
