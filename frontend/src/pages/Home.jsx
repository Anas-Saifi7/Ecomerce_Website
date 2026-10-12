import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import FeaturedProducts from '../components/FeaturedProducts'
import Regions from '../components/Regions'
import StorySection from '../components/StorySection'
import TrustSection from '../components/TrustSection'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      <Navbar />

        <Hero />

        <Categories />

      <FeaturedProducts />

      <Regions />

      <StorySection />

      <TrustSection />

      <Footer /> 

    </div>
  )
}

export default Home