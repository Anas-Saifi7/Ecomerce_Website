import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBanners } from '../services/bannerService.js';

const Hero = () => {
  const [count, setCount] = useState(0);
  const [images, setImages] = useState([
    "/images/hero-1.jpg",
    "/images/hero-2.jpg",
  ]);
  const [banners, setBanners] = useState([]);
  const [activeBanner, setActiveBanner] = useState(null);

  useEffect(() => {
    let active = true;
    getBanners({ placement: 'home-hero' }).then((result) => {
      const entries = (result.banners || []).filter((banner) => banner.image);
      if (active && entries.length) {
        setBanners(entries);
        setImages(entries.map((banner) => banner.image));
      }
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (banners.length > 0) setActiveBanner(banners[count % banners.length]);
  }, [banners, count]);

  const handlePrev = () => {
    setCount((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCount((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section
      className="relative min-h-140 sm:min-h-150 lg:h-125 lg:min-h-0 
      overflow-hidden">

      <img
        src={images[count % images.length]}
        alt="Indian natural products"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {activeBanner?.link && <a href={activeBanner.link} aria-label={activeBanner.title} className="absolute inset-0 z-0" />}

      <div className="absolute inset-0 bg-black/45"></div>

      <div
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-5 
        h-full flex items-center">

        <div className="max-w-xl text-white py-16 sm:py-20 lg:py-0">

          <p
            className="uppercase tracking-[0.2em] sm:tracking-[0.3em] 
            text-xs sm:text-sm text-[#e7c477] mb-3 sm:mb-4"
          >
            Natural • Authentic • Global
          </p>

          <h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl 
            font-bold leading-[1.05]"
          >
            Discover India's
            <br />
            Exceptional Products
          </h1>

          <p
            className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg 
            text-gray-100 sm:leading-7 max-w-lg" >
            From traditional spices to handcrafted treasures,
            we bring authentic Indian products to the world.
          </p>

          <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">

            <Link
              to="/product"
              className="inline-flex items-center justify-center 
              bg-[#075631] hover:bg-[#064524] px-6 sm:px-7 py-3 
              rounded-md font-medium text-sm sm:text-base 
              transition duration-200"
            >
              Explore Products
              <span className="ml-2">→</span>
            </Link>

            <Link
              to="/our-story"
              className="inline-flex items-center justify-center 
              border border-white px-6 sm:px-7 py-3 rounded-md 
              font-medium text-sm sm:text-base hover:bg-white 
              hover:text-gray-900 transition duration-200"
            >
              Our Story
              <span className="ml-2">⊙</span>
            </Link>

          </div>

          <div
            className="grid grid-cols-2 sm:flex sm:flex-wrap 
            gap-x-6 gap-y-5 sm:gap-8 mt-8 sm:mt-10"
          >

            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">✧</span>

              <div>
                <p className="font-semibold text-sm sm:text-base">
                  Authentic
                </p>

                <p className="text-[11px] sm:text-xs text-gray-200">
                  Products
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">♧</span>

              <div>
                <p className="font-semibold text-sm sm:text-base">
                  Curated
                </p>

                <p className="text-[11px] sm:text-xs text-gray-200">
                  Products
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">◎</span>

              <div>
                <p className="font-semibold text-sm sm:text-base">
                  Shipping
                </p>

                <p className="text-[11px] sm:text-xs text-gray-200">
                  Options
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">♧</span>

              <div>
                <p className="font-semibold text-sm sm:text-base">
                  Regional
                </p>

                <p className="text-[11px] sm:text-xs text-gray-200">
                  Stories
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div
        className="absolute bottom-5 right-5 sm:right-8 lg:right-10 
        flex items-center gap-3 sm:gap-4 text-white z-20"
      >

        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCount(index)}
            className={`text-xs sm:text-sm transition ${count === index
                ? "text-[#e7c477]"
                : "opacity-50 hover:opacity-100"
              }`}
          >
            ●
          </button>
        ))}

        <button
          type="button"
          onClick={handlePrev}
          className="hover:text-[#e7c477] transition text-lg"
          aria-label="Previous image"
        >
          ←
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="hover:text-[#e7c477] transition text-lg"
          aria-label="Next image"
        >
          →
        </button>

      </div>
    </section>
  );
};

export default Hero;
