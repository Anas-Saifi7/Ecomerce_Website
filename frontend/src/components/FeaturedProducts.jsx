import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService.js'
import { mapApiProducts } from '../utils/productMapper.js'
import { useCurrency } from '../context/CurrencyContext.jsx'

const FeaturedProducts = () => {
  const [products, setProducts] = useState([])
  const { formatPrice } = useCurrency()
  useEffect(() => {
    let active = true
    getProducts({ featured: true, limit: 6 })
      .then((data) => { if (active) setProducts(mapApiProducts(data.products || [])) })
      .catch(() => {})
    return () => { active = false }
  }, [])
  return (
    <section className="w-full bg-[#fafaf8]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 py-8 sm:py-10">

        <div className="flex items-end justify-between gap-4 mb-5 sm:mb-6">

          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">      
              Featured Products
            </h2>

            <p className="mt-1 text-xs sm:text-sm text-gray-500
            ">
              Handpicked products from across India
            </p>

          </div>

          <Link
            to="/product"
            className="hidden sm:flex gap-1 shrink-0 items-center text-xs sm:text-sm font-medium text-[#073b25]
             hover:text-[#a77c32] transition">
            View All Products
            <span>→</span>
          </Link>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">

          {products.map((product) => (

            <div
              key={product.id}
              className="group bg-white rounded-lg overflow-hidden border border-gray-200 
              hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

              <div className="relative overflow-hidden bg-gray-100">
                <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}><img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-40 sm:h-50 lg:h-50 object-cover group-hover:scale-105 transition-transform duration-500"/></Link>

                {product.badge && (
                  <span className="absolute top-2 left-2 bg-[#075631] text-white text-[9px] sm:text-[10px] px-2 py-1 rounded">
                    {product.badge}
                  </span>
                )}

              
                {/* <button
                  type="button"
                  aria-label={`Add ${product.name} to wishlist`}
                  className="absolute top-2 right-2 bg-white w-8 h-8 rounded-full shadow flex items-center justify-center
                   text-gray-600 hover-text-red-500 hover:scale-105 transition">
                  ♡
                </button> */}

              </div>

              <div className="p-3">
                <Link to={`/product/${product.id}`}><h3 className="font-semibold text-xs sm:text-sm text-gray-900 leading-5 line-clamp-2 min-h-10">
                  {product.name}
                </h3></Link>

                <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1">
                  {product.category}
                </p>

                <div className="flex items-center gap-1 mt-2 text-xs">
                <span className="text-yellow-500">
                    ★
                  </span>

                  <span className="font-medium text-gray-700">
                    {product.rating}
                  </span>

                  <span className="text-gray-400">
                    ({product.reviews})
                  </span>

                </div>

                <div className="flex items-ceneter justify-between gap-2 mt-3">
                  <span className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-7">                                
                    {formatPrice(product)}
                  </span>

                </div>

              </div>

            </div>
          ))}

        </div>

        <div className="sm:hidden flex justify-center mt-6">

          <Link
            to="/product"
            className="inline-flex items-center gap-2 border border-[#073b25] text-[#073b25] px-5 py-2.5
            rounded-md text-sm font-medium hover:bg-[#073b25] hover:text-white transition">
            View All Products
            <span>→</span>
          </Link>

        </div>

      </div>

    </section>
  )
}

export default FeaturedProducts
