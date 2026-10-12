import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from '../utils/cart'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  useEffect(() => {
    loadCart()

    const handleCartUpdate = () => {
      loadCart()
    }

    window.addEventListener('cartUpdated', handleCartUpdate)

    return () => {
      window.removeEventListener(
        'cartUpdated',
        handleCartUpdate
      )
    }
  }, [])

  const loadCart = () => {
    setCartItems(getCart())
  }

  const updateQuantity = (id, size, change) => {
    const item = cartItems.find(
      (item) => item.id === id && item.size === size
    )

    if (!item) return

    const newQuantity = Math.max(
      1,
      item.quantity + change
    )

    const updatedCart = updateCartQuantity(
      id,
      size,
      newQuantity
    )

    setCartItems(updatedCart)
  }

  const removeItem = (id, size) => {
    const updatedCart = removeFromCart(id, size)

    setCartItems(updatedCart)
  }

  // Clear cart
  const handleClearCart = () => {
    clearCart()
    setCartItems([])
    setCoupon('')
    setCouponApplied(false)
  }

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  )

  const shipping =
    subtotal === 0 || subtotal >= 100
      ? 0
      : 10

  const tax = subtotal * 0.1

  const discount = couponApplied ? 10 : 0

  const estimatedTotal = Math.max(
    0,
    subtotal + shipping + tax - discount
  )

  const applyCoupon = () => {
    if (coupon.trim()) {
      setCouponApplied(true)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <Navbar />

      <section className="relative overflow-hidden">

        <img
          src="/images/Carthero.jpg"
          alt="Shopping Cart"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-5 py-10 sm:py-14">

          <div className="flex items-center gap-2 text-xs sm:text-sm text-white/90 mb-3">
  
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">
            Your Shopping Cart
          </h1>

          <p className="text-sm sm:text-lg text-white mt-2">
            Review your selected items and proceed to checkout
          </p>

        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-5 py-6 sm:py-8">

        <div className="grid lg:grid-cols-[1.85fr_0.8fr] gap-5">

          <section className="border border-gray-200 rounded-lg overflow-hidden">

            <div className="px-4 sm:px-5 py-4 border-b border-gray-200 flex items-center justify-between gap-4">

              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                Cart Items ({cartItems.length})
              </h2>

              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 hover:text-red-600 transition"
                >
                  🗑
                  <span>Clear Cart</span>
                </button>
              )}

            </div>

            {cartItems.length > 0 ? (
              <>
               
                <div className="hidden md:grid grid-cols-[1.8fr_0.7fr_0.8fr_0.7fr] gap-4 px-5 py-3 border-b border-gray-100 text-xs font-medium text-gray-600">

                  <span>Product</span>

                  <span>Price</span>

                  <span>Quantity</span>

                  <span className="text-right">
                    Total
                  </span>

                </div>

                
                <div>

                  {cartItems.map((item) => (
                    <CartItem
                      key={`${item.id}-${item.size}`}
                      item={item}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                    />
                  ))}

                </div>

               
                <div className="px-4 sm:px-5 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">

                  <Link
                    to="/product"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 rounded-md px-5 py-2.5 text-sm font-medium hover:border-[#075631] hover:text-[#075631] transition"
                  >
                    ← Continue Shopping
                  </Link>

                  <span className="text-xs text-gray-500">
                    Your cart is saved automatically
                  </span>

                </div>
              </>
            ) : (
              <EmptyCart />
            )}

          </section>

          <aside className="space-y-3 lg:sticky lg:top-4 h-fit">

            <section className="border border-gray-200 rounded-lg p-4 sm:p-5 bg-[#fcfaf5]">

              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                Order Summary
              </h2>

              <div className="space-y-3 mt-5 text-sm">

                <div className="flex justify-between gap-4">

                  <span>
                    Subtotal ({cartItems.length}{' '}
                    {cartItems.length === 1
                      ? 'item'
                      : 'items'})
                  </span>

                  <strong>
                    ${subtotal.toFixed(2)}
                  </strong>

                </div>

                <div>

                  <div className="flex justify-between gap-4">

                    <span>Shipping</span>

                    <span>
                      {shipping === 0
                        ? 'FREE'
                        : `$${shipping.toFixed(2)}`}
                    </span>

                  </div>

                  <p className="text-[10px] text-gray-500 mt-1">
                    {subtotal >= 100
                      ? '✓ Free shipping on orders above $100'
                      : 'Free shipping on orders above $100'}
                  </p>

                </div>

                <div className="flex justify-between gap-4">

                  <span>Tax (EST)</span>

                  <span>
                    ${tax.toFixed(2)}
                  </span>

                </div>

                {couponApplied && (
                  <div className="flex justify-between gap-4 text-green-700">

                    <span>Coupon Discount</span>

                    <span>
                      -${discount.toFixed(2)}
                    </span>

                  </div>
                )}

              </div>

              <div className="border-t border-gray-300 mt-4 pt-4 flex items-center justify-between gap-4">

                <span className="font-serif font-bold text-lg">
                  Estimated Total
                </span>

                <span className="font-serif font-bold text-xl sm:text-2xl text-[#075631]">
                  ${estimatedTotal.toFixed(2)}
                </span>

              </div>

              <Link
                to="/check-out"
                className={`
                  mt-4 w-full flex items-center justify-center gap-2
                  rounded-md py-3 text-sm font-semibold transition
                  ${
                    cartItems.length === 0
                      ? 'bg-gray-300 pointer-events-none text-gray-500'
                      : 'bg-[#075631] hover:bg-[#053f25] text-white'
                  }
                `}
              >
                🔒
                Proceed to Checkout
                →
              </Link>

              <div className="flex items-center gap-3 my-3">

                <div className="h-px bg-gray-300 flex-1" />

                <span className="text-xs text-gray-500">
                  OR
                </span>

                <div className="h-px bg-gray-300 flex-1" />

              </div>

              <button
                type="button"
                onClick={() => {
                  if (cartItems.length === 0) {
                    alert('Your cart is empty.')
                    return
                  }

                  alert(
                    'PayPal payment integration will be connected with the backend later.'
                  )
                }}
                className="w-full bg-[#ffc439] hover:bg-[#f5b820] text-[#003087] font-bold rounded-md py-2.5 transition"
              >
                PayPal
              </button>

            </section>

        
            <section className="border border-gray-200 rounded-lg p-4 bg-[#fcfaf5]">

              <div className="flex items-center gap-2">

                <span className="text-2xl text-[#075631]">
                  ◇
                </span>

                <h3 className="font-semibold text-sm">
                  Have a Coupon Code?
                </h3>

              </div>

              <div className="flex gap-2 mt-3">

                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => {
                    setCoupon(e.target.value)
                    setCouponApplied(false)
                  }}
                  placeholder="Enter coupon code"
                  className="min-w-0 flex-1 border border-gray-300 rounded-md px-3 py-2.5 text-xs outline-none focus:border-[#075631]"
                />

                <button
                  type="button"
                  onClick={applyCoupon}
                  className="bg-[#075631] hover:bg-[#053f25] text-white px-4 rounded-md text-xs font-semibold"
                >
                  Apply
                </button>

              </div>

              {couponApplied && (
                <p className="text-xs text-green-700 mt-2">
                  ✓ Coupon applied successfully. $10 discount added.
                </p>
              )}

            </section>

        
            <section className="bg-[#eef8ed] rounded-lg p-4">

              <div className="space-y-4">

                <TrustItem
                  icon="♧"
                  title="100% Secure Checkout"
                  text="Your payment information is safe"
                />

                <TrustItem
                  icon="⟳"
                  title="Easy Returns"
                  text="Hassle-free returns within 30 days"
                />

                <TrustItem
                  icon="◎"
                  title="Global Shipping"
                  text="We deliver to 100+ countries"
                />

              </div>

            </section>

          </aside>

        </div>

        <section className="border-y border-gray-200 mt-6 py-6">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

            <TrustBarItem
              icon="🚚"
              title="Free Shipping"
              text="On orders above $100"
            />

            <TrustBarItem
              icon="♧"
              title="Secure Payments"
              text="100% secure transactions"
            />

            <TrustBarItem
              icon="◇"
              title="Easy Returns"
              text="Hassle-free returns"
            />

            <TrustBarItem
              icon="♧"
              title="Customer Support"
              text="24/7 assistance"
            />

          </div>

        </section>

        <section className="py-8">

          <div className="flex items-center justify-between mb-4">

            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              You May Also Like
            </h2>

            <Link
              to="/product"
              className="hidden sm:block text-sm font-medium text-[#075631] hover:underline"
            >
              View All Products →
            </Link>

          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">

            <RecommendationCard
              product={{
                id: 3,
                name: 'Pure Organic Honey',
                details: '500g',
                price: 20,
                rating: '4.9',
                reviews: '150',
                image: '/images/product-3.jpg',
              }}
            />

            <RecommendationCard
              product={{
                id: 7,
                name: 'Organic Green Tea',
                details: '100g',
                price: 15,
                rating: '4.6',
                reviews: '95',
                image: '/images/product-7.jpg',
              }}
            />

            <RecommendationCard
              product={{
                id: 5,
                name: 'Handcrafted Wooden Decor',
                details: 'Artisan Made',
                price: 45,
                rating: '4.5',
                reviews: '60',
                image: '/images/product-5.jpg',
              }}
            />

            <RecommendationCard
              product={{
                id: 6,
                name: 'Aromatherapy Essential Oils',
                details: '100ml',
                price: 22,
                rating: '4.8',
                reviews: '110',
                image: '/images/product-6.jpg',
              }}
            />

          </div>

        </section>

      </main>

      <Footer />

    </div>
  )
}

const CartItem = ({
  item,
  updateQuantity,
  removeItem,
}) => {

  const total = item.price * item.quantity

  const oldPrice = item.oldPrice || null

  const saving = oldPrice
    ? (oldPrice - item.price) * item.quantity
    : 0

  return (
    <div className="relative px-4 sm:px-5 py-4 border-b border-gray-100">

      <div className="hidden md:grid grid-cols-[1.8fr_0.7fr_0.8fr_0.7fr] gap-4 items-center">

        <div className="flex items-center gap-3 min-w-0">

          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-20 rounded-md object-cover shrink-0"
          />

          <div className="min-w-0">

            <Link
              to={`/product/${item.id}`}
              className="font-semibold text-sm hover:text-[#075631] transition"
            >
              {item.name}
            </Link>

            <p className="text-xs text-gray-500 mt-1">
              {item.size || 'Standard'}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">

              {item.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-1 rounded bg-[#edf3f2] text-gray-600"
                >
                  {tag}
                </span>
              ))}

            </div>

          </div>

        </div>

        {/* Price */}
        <div>

          <p className="font-semibold text-sm">
            ${item.price.toFixed(2)}
          </p>

          {oldPrice && (
            <p className="text-xs text-gray-400 line-through mt-1">
              ${oldPrice.toFixed(2)}
            </p>
          )}

        </div>

        <QuantityControl
          quantity={item.quantity}
          onDecrease={() =>
            updateQuantity(
              item.id,
              item.size || 'Standard',
              -1
            )
          }
          onIncrease={() =>
            updateQuantity(
              item.id,
              item.size || 'Standard',
              1
            )
          }
        />

        <div className="text-right">

          <p className="font-semibold text-sm">
            ${total.toFixed(2)}
          </p>

          {saving > 0 && (
            <p className="text-xs text-green-700 mt-1">
              Save ${saving.toFixed(2)}
            </p>
          )}

        </div>

      </div>

      <div className="md:hidden">

        <div className="flex gap-3">

          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-24 rounded-md object-cover shrink-0"
          />

          <div className="flex-1 min-w-0">

            <div className="flex justify-between gap-2">

              <div className="min-w-0">

                <Link
                  to={`/product/${item.id}`}
                  className="font-semibold text-sm hover:text-[#075631]"
                >
                  {item.name}
                </Link>

                <p className="text-xs text-gray-500 mt-1">
                  {item.size || 'Standard'}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  removeItem(
                    item.id,
                    item.size || 'Standard'
                  )
                }
                className="text-red-500 shrink-0 hover:text-red-700"
                title="Remove item"
              >
                🗑
              </button>

            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2">

              {item.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-1 rounded bg-[#edf3f2] text-gray-600"
                >
                  {tag}
                </span>
              ))}

            </div>

            <div className="flex items-center justify-between mt-3">

              <div>

                <span className="font-semibold text-sm">
                  ${item.price.toFixed(2)}
                </span>

                {oldPrice && (
                  <span className="text-xs text-gray-400 line-through ml-2">
                    ${oldPrice.toFixed(2)}
                  </span>
                )}

              </div>

              <QuantityControl
                quantity={item.quantity}
                onDecrease={() =>
                  updateQuantity(
                    item.id,
                    item.size || 'Standard',
                    -1
                  )
                }
                onIncrease={() =>
                  updateQuantity(
                    item.id,
                    item.size || 'Standard',
                    1
                  )
                }
              />

            </div>

            {/* Total */}
            <div className="flex justify-between mt-3">

              <span className="text-xs text-gray-500">
                Total
              </span>

              <span className="font-bold text-sm">
                ${total.toFixed(2)}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

const QuantityControl = ({
  quantity,
  onDecrease,
  onIncrease,
}) => {

  return (
    <div className="inline-flex items-center border border-gray-300 rounded-md overflow-hidden">

      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        −
      </button>

      <span className="w-8 h-8 border-x border-gray-300 flex items-center justify-center text-sm">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
      >
        +
      </button>

    </div>
  )
}

const EmptyCart = () => {

  return (
    <div className="min-h-75 flex flex-col items-center justify-center text-center p-8">

      <div className="text-6xl mb-4">
        🛒
      </div>

      <h3 className="font-serif text-2xl font-bold">
        Your Cart is Empty
      </h3>

      <p className="text-sm text-gray-500 mt-2 max-w-md">
        Looks like you haven't added anything to your
        cart yet.
      </p>

      <Link
        to="/product"
        className="mt-5 bg-[#075631] hover:bg-[#053f25] text-white px-6 py-3 rounded-md text-sm font-medium transition"
      >
        Continue Shopping →
      </Link>

    </div>
  )
}

const RecommendationCard = ({
  product,
}) => {

  return (
    <div className="group border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition">

      <Link to={`/product/${product.id}`}>

        <div className="relative overflow-hidden">

          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-32 sm:h-36 object-cover group-hover:scale-105 transition duration-300"
          />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-gray-700 hover:text-red-500"
          >
            ♡
          </button>

        </div>

        <div className="p-2.5">

          <h3 className="font-semibold text-xs sm:text-sm line-clamp-1">
            {product.name}
          </h3>

          <p className="text-[10px] text-gray-500 mt-1">
            {product.details}
          </p>

          <div className="flex items-center gap-1 mt-1">

            <span className="text-yellow-500 text-xs">
              ★
            </span>

            <span className="text-[10px] font-medium">
              {product.rating}
            </span>

            <span className="text-[10px] text-gray-400">
              ({product.reviews})
            </span>

          </div>

          <div className="flex items-center justify-between mt-2">

            <span className="font-bold text-sm text-[#075631]">
              ${product.price.toFixed(2)}
            </span>

            <span className="w-8 h-8 rounded-md bg-[#075631] text-white flex items-center justify-center">
              🛒
            </span>

          </div>

        </div>

      </Link>

    </div>
  )
}

const TrustBarItem = ({
  icon,
  title,
  text,
}) => {

  return (
    <div className="flex items-center justify-center gap-3">

      <span className="text-2xl sm:text-3xl text-[#075631]">
        {icon}
      </span>

      <div>

        <h3 className="font-semibold text-xs sm:text-sm">
          {title}
        </h3>

        <p className="text-[10px] text-gray-500 mt-1">
          {text}
        </p>

      </div>

    </div>
  )
}

const TrustItem = ({
  icon,
  title,
  text,
}) => {

  return (
    <div className="flex items-start gap-3">

      <span className="text-2xl text-[#075631] shrink-0">
        {icon}
      </span>

      <div>

        <h3 className="font-semibold text-xs sm:text-sm">
          {title}
        </h3>

        <p className="text-[10px] text-gray-500 mt-1">
          {text}
        </p>

      </div>

    </div>
  )
}

export default Cart