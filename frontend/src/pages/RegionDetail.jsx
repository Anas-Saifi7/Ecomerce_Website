import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { regions } from '../data/regions'
import regionDetails from '../data/regionDetails'

const slugify = (value = '') =>
  value.toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const SectionHeading = ({ eyebrow, title, description }) => (
  <div className="mb-6">
    {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#52755f]">{eyebrow}</p>}
    <h2 className="mt-2 font-serif text-2xl font-bold text-[#073b25] sm:text-3xl">{title}</h2>
    {description && <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">{description}</p>}
  </div>
)

const TextCard = ({ title, text }) => (
  <article className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
    <h3 className="font-serif text-lg font-bold text-[#073b25]">{title}</h3>
    <p className="mt-3 text-sm leading-7 text-gray-600">{text}</p>
  </article>
)

const ListCard = ({ title, items, numbered = false }) => (
  <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
    <h2 className="font-serif text-xl font-bold text-[#073b25]">{title}</h2>
    <div className="mt-4 space-y-4">
      {(items || []).map((item, index) => {
        const entry = typeof item === 'string' ? { name: item, description: '' } : item
        return (
          <div key={`${entry.name}-${index}`} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eff7e9] text-sm font-bold text-[#073b25]">
              {numbered ? index + 1 : '✦'}
            </span>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{entry.name}</h3>
              {entry.description && <p className="mt-1 text-sm leading-6 text-gray-600">{entry.description}</p>}
            </div>
          </div>
        )
      })}
    </div>
  </section>
)

const RegionDetail = () => {
  const { regionSlug } = useParams()
  const slug = slugify(decodeURIComponent(regionSlug || ''))
  const region = regions.find((item) => slugify(item.name) === slug)
  const details = regionDetails[slug]

  if (!region || !details) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="mx-auto max-w-3xl px-5 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#52755f]">Region not found</p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-[#073b25]">We couldn't find this region</h1>
          <p className="mt-3 text-gray-600">Please return to the regions page and choose one of the available regions.</p>
          <Link to="/regions" className="mt-6 inline-flex rounded-md bg-[#073b25] px-5 py-3 text-sm font-semibold text-white hover:bg-[#105335]">Back to all regions</Link>
        </main>
        <Footer />
      </div>
    )
  }

  const opportunities = details.hallaBolOpportunities || []
  const otherRegions = regions.filter((item) => slugify(item.name) !== slug).slice(0, 6)

  return (
    <div className="min-h-screen bg-[#fbfcfa] text-gray-900">
      <Navbar />

      <header className="relative isolate min-h-98 overflow-hidden bg-[#073b25] sm:min-h-115">
        <img
          src={region.image}
          alt={details.name}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          onError={(event) => { event.currentTarget.style.display = 'none' }}
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/80 via-black/55 to-black/25" />
        <div className="mx-auto flex min-h-97 max-w-7xl items-end px-5 py-12 sm:min-h-115 sm:px-8 lg:px-6">
          <div className="max-w-3xl text-white">
            <Link to="/regions" className="text-sm font-semibold text-[#f4df91] hover:text-white">← All regions</Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#f4df91]">{region.category}</p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{details.name}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-gray-100">{details.tagline}</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-200 sm:text-base">{details.overview}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 sm:py-14 lg:px-6">
        <section>
          <SectionHeading eyebrow="A closer look" title={`Discover ${details.name}`} description={details.overview} />
          <div className="grid gap-4 md:grid-cols-3">
            <TextCard title="History and heritage" text={details.history} />
            <TextCard title="Geography and landscape" text={details.geography} />
            <TextCard title="Culture and traditions" text={details.culture} />
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Places to know" title={`Famous places in ${details.name}`} description="Explore the destinations, heritage sites and local centres associated with this region." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(details.famousPlaces || []).map((place) => (
              <article key={place.name} className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-md">
                <span className="text-2xl text-[#c5a94a]">⌖</span>
                <h3 className="mt-3 font-serif text-lg font-bold text-[#073b25]">{place.name}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{place.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Made in the region" title={`Famous products of ${details.name}`} description="These are regional product categories and craft traditions. Verify the supplier, origin, materials and applicable compliance before listing products for sale." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(details.products || []).map((product) => (
              <article key={product.name} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff7e9] text-lg text-[#073b25]">✦</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{product.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <ListCard title="Popular food" items={details.food} />
          <ListCard title="Festivals and celebrations" items={details.festivals} />
          <ListCard title="Agriculture and produce" items={details.agriculture} />
        </section>

        <section className="rounded-2xl bg-[#073b25] p-6 text-white sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f4df91]">Halla Bol regional collection</p>
          <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">Product opportunities from {details.name}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-200">Halla Bol can help customers discover regional goods when product origin, maker information and quality details are clearly documented.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((item) => (
              <div key={item} className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm">{item}</div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-gray-200">{details.closing}</p>
          <Link to="/product" className="mt-6 inline-flex rounded-md bg-[#f4df91] px-5 py-3 text-sm font-semibold text-[#073b25] transition hover:bg-white">Explore products →</Link>
        </section>

        <section>
          <SectionHeading eyebrow="Keep exploring" title="Discover more regions" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherRegions.map((item) => (
              <Link key={item.name} to={`/regions/${slugify(item.name)}`} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-[#b9cbbb] hover:shadow-sm">
                <img src={item.image} alt="" className="h-16 w-16 rounded-lg bg-[#eff7e9] object-cover" onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[#073b25]">{item.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">{item.description}</p>
                </div>
                <span className="text-lg text-[#073b25]">→</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default RegionDetail
