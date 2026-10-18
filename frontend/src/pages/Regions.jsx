import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { regions, regionCategories } from '../data/regions'

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const Regions = () => {
  const [activeCategory, setActiveCategory] = useState('All Regions')
  const [sortBy, setSortBy] = useState('Popularity')
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  const filteredRegions = useMemo(() => {
    let result = [...regions]

    if (activeCategory !== 'All Regions') {
      result = result.filter(
        (region) => region.category === activeCategory
      )
    }

    const search = searchTerm.trim().toLowerCase()

    if (search) {
      result = result.filter((region) =>
        `${region.name} ${region.category} ${region.description}`
          .toLowerCase()
          .includes(search)
      )
    }

    if (sortBy === 'Name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'Products') {
      result.sort(
        (a, b) => (b.productCount || 0) - (a.productCount || 0)
      )
    }

    return result
  }, [activeCategory, searchTerm, sortBy])

  const categoryCount = (category) => {
    if (category === 'All Regions') return regions.length

    return regions.filter((region) => region.category === category).length
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <section className="relative isolate min-h-107 overflow-hidden sm:min-h-120">
        <img
          src="/images/regions-hero.jpg"
          alt="Discover the diverse regions of India"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/75 via-black/45 to-black/20" />

        <div className="mx-auto flex min-h-107 max-w-7xl items-center px-5 py-16 sm:min-h-120 sm:px-8 lg:px-6">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#f4df91] sm:text-sm">
              Discover the diversity of India
            </p>

            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Explore by Regions
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-100 sm:text-lg">
              Discover authentic products, traditional crafts, regional
              flavours and cultural heritage from every corner of India.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#region-list"
                className="rounded-md bg-[#f4df91] px-6 py-3 text-sm font-semibold text-[#073b25] transition hover:bg-white"
              >
                Explore Regions ↓
              </a>

              <Link
                to="/product"
                className="rounded-md border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#073b25]"
              >
                Shop Products
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {[
                ['✦', 'Authentic Sourcing'],
                ['♡', 'Local Communities'],
                ['◇', 'Regional Products'],
                ['◎', 'Indian Heritage'],
              ].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-2xl text-[#f4df91]">{icon}</span>
                  <span className="text-xs font-medium sm:text-sm">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="region-list" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-6 lg:py-14">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#52755f]">
              Explore India's heritage
            </p>

            <h2 className="mt-2 font-serif text-3xl font-bold text-[#073b25] sm:text-4xl">
              Discover Indian Regions
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              Select a region to learn about its famous places, culture,
              food, agriculture and traditional products.
            </p>
          </div>
          

          <button
            type="button"
            onClick={() => setMobileFilterOpen((open) => !open)}
            aria-expanded={mobileFilterOpen}
            className="mb-5 flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 font-semibold lg:hidden"
          >
            <span>Filter by region</span>
            <span>{mobileFilterOpen ? '−' : '+'}</span>
          </button>

          <div className="grid items-start gap-7 lg:grid-cols-[240px_minmax(0,1fr)]">
           
            <aside className={`${mobileFilterOpen ? 'block' : 'hidden'} lg:block`}>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="mb-4 font-serif text-xl font-bold text-[#073b25]">
                  Browse Regions
                </h3>

                <div className="space-y-1">
                  {regionCategories.map((category) => (
                    <button
                      type="button"
                      key={category}
                      onClick={() => {
                        setActiveCategory(category)
                        setMobileFilterOpen(false)
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-3 text-left text-sm transition ${
                        activeCategory === category
                          ? 'bg-[#073b25] text-white'
                          : 'text-gray-700 hover:bg-[#eff7e9]'
                      }`}
                    >
                      <span>{category}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          activeCategory === category
                            ? 'bg-white/15 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {categoryCount(category)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative mt-5 h-72 overflow-hidden rounded-xl bg-[#073b25]">
                <img
                  src="/images/regions-story.jpg"
                  alt="Indian cultural heritage"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="relative flex h-full flex-col justify-end p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#f4df91]">
                    One country, many traditions
                  </p>

                  <h3 className="mt-2 font-serif text-2xl font-bold">
                    Celebrating India's Diversity
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-100">
                    Different lands. Unique products. One authentic India.
                  </p>

                  <Link
                    to="/our-story"
                    className="mt-4 self-start text-sm font-semibold text-[#f4df91] hover:text-white"
                  >
                    Learn Our Story →
                  </Link>
                </div>
              </div>
            </aside>

         
            <div className="min-w-0">
       
              <div className="mb-6 flex flex-col gap-4">
                <label className="relative block">
                  <span className="sr-only">Search regions</span>

                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search region, category or products..."
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-[#073b25] focus:ring-2 focus:ring-[#073b25]/10"
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    ⌕
                  </span>
                </label>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 sm:text-2xl">
                      {activeCategory === 'All Regions'
                        ? 'All Indian Regions'
                        : activeCategory}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {filteredRegions.length}{' '}
                      {filteredRegions.length === 1 ? 'region' : 'regions'} found
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="region-sort"
                      className="text-sm text-gray-500"
                    >
                      Sort:
                    </label>

                    <select
                      id="region-sort"
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      className="max-w-37 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#073b25]"
                    >
                      <option value="Popularity">Default order</option>
                      <option value="Name">Name A–Z</option>
                      <option value="Products">Product count</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid view"
                      aria-pressed={viewMode === 'grid'}
                      className={`hidden h-10 w-10 items-center justify-center rounded-md border sm:flex ${
                        viewMode === 'grid'
                          ? 'border-[#073b25] bg-[#eff7e9] text-[#073b25]'
                          : 'border-gray-200 text-gray-500'
                      }`}
                    >
                      ▦
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                      aria-pressed={viewMode === 'list'}
                      className={`hidden h-10 w-10 items-center justify-center rounded-md border sm:flex ${
                        viewMode === 'list'
                          ? 'border-[#073b25] bg-[#eff7e9] text-[#073b25]'
                          : 'border-gray-200 text-gray-500'
                      }`}
                    >
                      ☷
                    </button>
                  </div>
                </div>
              </div>

              {filteredRegions.length > 0 ? (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'
                      : 'grid grid-cols-1 gap-4'
                  }
                >
                  {filteredRegions.map((region) => (
                    <Link
                      to={`/regions/${slugify(region.name)}`}
                      key={region.name}
                      className={`group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#cbd9ce] hover:shadow-lg ${
                        viewMode === 'list'
                          ? 'sm:flex sm:items-stretch'
                          : ''
                      }`}
                    >
                      <div
                        className={`relative overflow-hidden bg-[#eff7e9] ${
                          viewMode === 'list'
                            ? 'h-52 sm:h-auto sm:w-64 sm:shrink-0'
                            : 'h-48 sm:h-44'
                        }`}
                      >
                        <img
                          src={region.image}
                          alt={region.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none'
                          }}
                        />

                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#073b25] shadow-sm">
                          {region.category}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <h4 className="font-serif text-xl font-bold text-[#073b25] transition group-hover:text-[#42694d]">
                          {region.name}
                        </h4>

                        <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">
                          {region.description}
                        </p>

                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                          <span className="text-sm font-semibold text-[#073b25]">
                            Explore region
                          </span>

                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4df91] text-lg text-[#073b25] transition group-hover:bg-[#073b25] group-hover:text-white">
                            →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 px-5 py-16 text-center">
                  <div className="text-4xl">⌕</div>

                  <h3 className="mt-4 font-serif text-xl font-bold text-gray-900">
                    No regions found
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Try another search term or select a different category.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('')
                      setActiveCategory('All Regions')
                      setSortBy('Popularity')
                    }}
                    className="mt-5 rounded-md bg-[#073b25] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#105335]"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#073b25]">
        <img
          src="/images/regions-cta.jpg"
          alt="region"
           loading="lazy"
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />

        <div className="absolute inset-0 -z-10" />

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-6 lg:py-16">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f4df91]">
              From local roots to global markets
            </p>

            <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">
              Discover the Essence of Every Region
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-200 sm:text-base">
              Explore the stories, traditions and products that make every
              region of India special.
            </p>
          </div>

          <Link
            to="/product"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#f4df91] px-6 py-3 font-semibold text-[#073b25] transition hover:bg-white"
          >
            Explore All Products →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Regions;