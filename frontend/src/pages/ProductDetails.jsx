import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import products from '../data/products'
import { addToCart } from '../utils/cart'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const product = useMemo(() => {
    return products.find((item) => item.id === Number(id))
  }, [id])

  const [activeImage, setActiveImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('Standard')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('Description')
  const [addedMessage, setAddedMessage] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  // Reset state whenever product changes
  useEffect(() => {
    setActiveImage(0)
    setQuantity(1)
    setActiveTab('Description')
    setSelectedSize('Standard')
    setAddedMessage('')
  }, [id])

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-6xl mb-5">🛍️</div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Product Not Found
            </h1>

            <p className="text-gray-500 mt-3">
              Sorry, this product does not exist.
            </p>

            <Link
              to="/product"
              className="inline-flex mt-6 bg-[#075631] text-white px-6 py-3 rounded-lg hover:bg-[#064526] transition"
            >
              Back to Products
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  const images =
    product.images?.length > 0
      ? product.images
      : [product.image]

  const price = Number(product.price) || 0
  const oldPrice = Number(product.oldPrice) || 0

  const discount =
    oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0

  // Quantity
  const increaseQuantity = () => {
    setQuantity((current) => current + 1)
  }

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1))
  }

  // Add to cart
  const handleAddToCart = () => {
    if (!product || !product.inStock || isAdding) return

    setIsAdding(true)

    addToCart(product, quantity, selectedSize)

    setAddedMessage(
      `${quantity} × ${product.name} added to cart`
    )

    setIsAdding(false)

    setTimeout(() => {
      setAddedMessage('')
    }, 2500)
  }

  // Buy Now
  const handleBuyNow = () => {
    if (!product || !product.inStock) return

    addToCart(product, quantity, selectedSize)

    navigate('/check-out')
  }

  const tabs = [
    'Description',
    'Benefits',
    'Usage',
    'Reviews',
    'Shipping & Returns',
  ]

  // Related products
  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .filter(
      (item) =>
        item.categoryType === product.categoryType ||
        item.region === product.region
    )
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">

          <Link
            to="/"
            className="hover:text-[#075631] transition"
          >
            Home
          </Link>

          <span>›</span>

          <Link
            to="/product"
            className="hover:text-[#075631] transition"
          >
            Products
          </Link>

          <span>›</span>

          <span className="text-gray-900 line-clamp-1">
            {product.name}
          </span>

        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          <div>

            <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-square">

              <img
                src={images[activeImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Discount */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-[#075631] text-white text-xs font-bold px-3 py-2 rounded-full">
                  {discount}% OFF
                </div>
              )}

              {/* Wishlist */}
              <button
                type="button"
                aria-label="Add to wishlist"
                className="absolute top-4 right-4 w-11 h-11 bg-white/95 rounded-full flex items-center justify-center text-xl shadow hover:text-red-500 transition"
              >
                ♡
              </button>

            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">

                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition ${
                      activeImage === index
                        ? 'border-[#075631]'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}

              </div>
            )}

          </div>

        
          <div className="flex flex-col">

            <div className="text-sm text-[#075631] font-medium">
              {product.categoryType}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-2 leading-tight">
              {product.name}
            </h1>

            {product.subtitle && (
              <p className="text-gray-500 mt-2">
                {product.subtitle}
              </p>
            )}

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-3 mt-4">

              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-lg">
                  ★
                </span>

                <span className="font-semibold">
                  {product.rating || 0}
                </span>
              </div>

              <span className="text-gray-300">|</span>

              <span className="text-sm text-gray-500">
                {product.reviews || 0} Reviews
              </span>

              {product.sold && (
                <>
                  <span className="text-gray-300">|</span>

                  <span className="text-sm text-gray-500">
                    {product.sold}
                  </span>
                </>
              )}

            </div>

            {/* Price */}
            <div className="flex items-center flex-wrap gap-3 mt-6">

              <span className="text-3xl font-bold text-[#075631]">
                ${price.toFixed(2)}
              </span>

              {oldPrice > price && (
                <span className="text-lg text-gray-400 line-through">
                  ${oldPrice.toFixed(2)}
                </span>
              )}

              {discount > 0 && (
                <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                  Save {discount}%
                </span>
              )}

            </div>

            {/* Stock */}
            <div className="mt-5">

              {product.inStock ? (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  In Stock
                </span>
              ) : (
                <span className="text-sm font-medium text-red-500">
                  Out of Stock
                </span>
              )}

            </div>

            <div className="border-t border-gray-200 my-6" />

            {/* Region / Product Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Region
                </p>

                <p className="font-semibold mt-1">
                  {product.region || 'India'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Product Type
                </p>

                <p className="font-semibold mt-1">
                  {product.productType || 'Premium Product'}
                </p>
              </div>

            </div>

            {product.certifications?.length > 0 && (
              <div className="mt-5">

                <p className="text-sm font-semibold mb-2">
                  Certifications
                </p>

                <div className="flex flex-wrap gap-2">

                  {product.certifications.map((item) => (
                    <span
                      key={item}
                      className="text-xs bg-green-50 text-[#075631] border border-green-100 px-3 py-2 rounded-full"
                    >
                      ✓ {item}
                    </span>
                  ))}

                </div>

              </div>
            )}

            {/* Size */}
            <div className="mt-6">

              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold">
                  Size
                </p>

                <span className="text-xs text-gray-500">
                  Standard
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSize('Standard')}
                className={`px-5 py-3 rounded-lg border text-sm font-medium transition ${
                  selectedSize === 'Standard'
                    ? 'border-[#075631] bg-green-50 text-[#075631]'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                Standard
              </button>

            </div>

            {/* Quantity */}
            <div className="mt-6">

              <p className="font-semibold mb-3">
                Quantity
              </p>

              <div className="flex items-center border border-gray-300 rounded-lg w-fit overflow-hidden">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="w-11 h-11 hover:bg-gray-100 text-lg"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span className="w-12 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  className="w-11 h-11 hover:bg-gray-100 text-lg"
                  aria-label="Increase quantity"
                >
                  +
                </button>

              </div>

            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding}
                className="py-3.5 rounded-xl border-2 border-[#075631] text-[#075631] font-semibold hover:bg-green-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? 'Adding...' : '🛒 Add to Cart'}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="py-3.5 rounded-xl bg-[#075631] text-white font-semibold hover:bg-[#064526] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⚡ Buy Now
              </button>

            </div>

            {/* Success Message */}
            {addedMessage && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm flex items-center justify-between gap-3">

                <span>
                  ✓ {addedMessage}
                </span>

                <Link
                  to="/cart"
                  className="font-semibold underline whitespace-nowrap"
                >
                  View Cart
                </Link>

              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">

              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-xl">🚚</div>
                <p className="text-xs font-medium mt-2">
                  Fast Delivery
                </p>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-xl">🌿</div>
                <p className="text-xs font-medium mt-2">
                  Natural
                </p>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-xl">✓</div>
                <p className="text-xs font-medium mt-2">
                  Quality Checked
                </p>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-xl">🔒</div>
                <p className="text-xs font-medium mt-2">
                  Secure Payment
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= TABS ================= */}
      <section className="border-t border-gray-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="flex gap-2 overflow-x-auto border-b border-gray-200">

            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab
                    ? 'border-[#075631] text-[#075631]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}

          </div>

          <div className="max-w-4xl pt-8">

            {/* Description */}
            {activeTab === 'Description' && (
              <div>
                <h2 className="text-xl font-bold mb-4">
                  About this Product
                </h2>

                <p className="text-gray-600 leading-7">
                  {product.description ||
                    'A premium quality product sourced from India.'}
                </p>
              </div>
            )}

            {/* Benefits */}
            {activeTab === 'Benefits' && (
              <div>

                <h2 className="text-xl font-bold mb-4">
                  Product Benefits
                </h2>

                {product.benefits?.length > 0 ? (
                  <ul className="space-y-3">

                    {product.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-start gap-3 text-gray-600"
                      >
                        <span className="text-[#075631] font-bold">
                          ✓
                        </span>

                        <span>
                          {benefit}
                        </span>
                      </li>
                    ))}

                  </ul>
                ) : (
                  <p className="text-gray-500">
                    Product benefits information will be available soon.
                  </p>
                )}

              </div>
            )}

            {/* Usage */}
            {activeTab === 'Usage' && (
              <div>

                <h2 className="text-xl font-bold mb-4">
                  How to Use
                </h2>

                <p className="text-gray-600 leading-7">
                  {product.usage ||
                    'Please follow the recommended usage instructions provided with the product.'}
                </p>

              </div>
            )}

            {/* Reviews */}
            {activeTab === 'Reviews' && (
              <div>

                <h2 className="text-xl font-bold mb-4">
                  Customer Reviews
                </h2>

                <div className="flex items-center gap-4">

                  <div className="text-4xl font-bold text-[#075631]">
                    {product.rating || 0}
                  </div>

                  <div>

                    <div className="text-yellow-500 text-lg">
                      ★★★★★
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                      Based on {product.reviews || 0} reviews
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* Shipping */}
            {activeTab === 'Shipping & Returns' && (
              <div>

                <h2 className="text-xl font-bold mb-4">
                  Shipping & Returns
                </h2>

                <div className="space-y-3 text-gray-600 leading-7">

                  <p>
                    We carefully pack every order before dispatch.
                  </p>

                  <p>
                    Delivery time depends on your location and
                    shipping method.
                  </p>

                  <p>
                    Please check our shipping and return policy
                    before placing an order.
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>

      </section>

      {relatedProducts.length > 0 && (
        <section className="bg-gray-50 py-12">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex items-end justify-between mb-6">

              <div>
                <p className="text-sm text-[#075631] font-semibold">
                  YOU MAY ALSO LIKE
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold mt-1">
                  Related Products
                </h2>
              </div>

              <Link
                to="/products"
                className="hidden sm:block text-sm font-semibold text-[#075631] hover:underline"
              >
                View All
              </Link>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition group"
                >

                  <div className="aspect-square overflow-hidden bg-gray-100">

                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                  </div>

                  <div className="p-4">

                    <p className="text-xs text-gray-500">
                      {item.category}
                    </p>

                    <h3 className="font-semibold mt-1 line-clamp-2">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-1 mt-2 text-sm">

                      <span className="text-yellow-500">
                        ★
                      </span>

                      <span>
                        {item.rating || 0}
                      </span>

                      <span className="text-gray-400">
                        ({item.reviews || 0})
                      </span>

                    </div>

                    <div className="mt-3">

                      <span className="font-bold text-[#075631]">
                        ${Number(item.price || 0).toFixed(2)}
                      </span>

                      {item.oldPrice && (
                        <span className="ml-2 text-xs text-gray-400 line-through">
                          ${Number(item.oldPrice).toFixed(2)}
                        </span>
                      )}

                    </div>

                  </div>

                </Link>
              ))}

            </div>

          </div>

        </section>
      )}

      <Footer />

    </div>
  )
}

export default ProductDetails