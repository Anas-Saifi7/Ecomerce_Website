import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import products from '../data/products.js'

import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  addToCart,
} from '../utils/cart'

const COUPON_CODE = 'WELCOME10'
const COUPON_DISCOUNT_RATE = 0.10
const MINIMUM_COUPON_ORDER = 50
const FREE_SHIPPING_THRESHOLD = 100
const SHIPPING_CHARGE = 10
const TAX_RATE = 0.10

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponMessage, setCouponMessage] = useState('')
  const [couponError, setCouponError] = useState(false)

  useEffect(() => {
    const loadCart = () => {
      setCartItems(getCart())
    }

    loadCart()

    window.addEventListener('cartUpdated', loadCart)

    return () => {
      window.removeEventListener('cartUpdated', loadCart)
    }
  }, [])

  const totalQuantity = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  )

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      (Number(item.price) || 0) *
        (Number(item.quantity) || 0),
    0
  )

  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_CHARGE

  const tax = subtotal * TAX_RATE

  const discount = couponApplied
    ? subtotal * COUPON_DISCOUNT_RATE
    : 0

  const estimatedTotal = Math.max(
    0,
    subtotal + shipping + tax - discount
  )

  const updateQuantity = (id, size, change) => {
    const item = cartItems.find(
      (cartItem) =>
        String(cartItem.id) === String(id) &&
        (cartItem.size || 'Standard') === (size || 'Standard')
    )

    if (!item) return

    const newQuantity = (Number(item.quantity) || 1) + change

    if (newQuantity < 1) return

    updateCartQuantity(id, size || 'Standard', newQuantity)
  }

  const removeItem = (id, size) => {
    removeFromCart(id, size || 'Standard')

    setCouponApplied(false)
    setCouponMessage('')
  }

  const handleClearCart = () => {
    clearCart()

    setCoupon('')
    setCouponApplied(false)
    setCouponMessage('')
    setCouponError(false)
  }

  const applyCoupon = () => {
    const enteredCode = coupon.trim().toUpperCase()

    setCouponApplied(false)
    setCouponMessage('')
    setCouponError(false)

    if (!enteredCode) {
      setCouponError(true)
      setCouponMessage('Please enter a coupon code.')
      return
    }

    if (enteredCode !== COUPON_CODE) {
      setCouponError(true)
      setCouponMessage('Invalid coupon code. Please try again.')
      return
    }

    if (subtotal < MINIMUM_COUPON_ORDER) {
      setCouponError(true)
      setCouponMessage(
        `Minimum order of $${MINIMUM_COUPON_ORDER.toFixed(2)} is required.`
      )
      return
    }

    setCouponApplied(true)
    setCoupon(COUPON_CODE)
    setCouponError(false)
    setCouponMessage('Coupon applied successfully! You saved 10%.')
  }

  const removeCoupon = () => {
    setCoupon('')
    setCouponApplied(false)
    setCouponMessage('')
    setCouponError(false)
  }

  // Show actual products from products.js.
  const recommendedProducts = products
    .filter(
      (product) =>
        !cartItems.some(
          (item) => String(item.id) === String(product.id)
        )
    )
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src="/images/Carthero.jpg"
          alt="Shopping Cart"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-14">
          <p className="mb-3 text-xs text-white/90 sm:text-sm">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            {' / '}
            Shopping Cart
          </p>

          <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl">
            Your Shopping Cart
          </h1>

          <p className="mt-2 text-sm text-white sm:text-lg">
            Review your selected items and proceed to checkout
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-8">
        <div className="grid gap-5 lg:grid-cols-[1.85fr_0.8fr]">
          {/* Cart Items */}
          <section className="overflow-hidden rounded-lg border border-gray-200">
            <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-4 sm:px-5">
              <h2 className="font-serif text-xl font-bold sm:text-2xl">
                Cart Items ({totalQuantity})
              </h2>

              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="flex items-center gap-2 text-xs text-gray-700 transition hover:text-red-600 sm:text-sm"
                >
                  🗑 <span>Clear Cart</span>
                </button>
              )}
            </div>

            {cartItems.length > 0 ? (
              <>
                <div className="hidden grid-cols-[1.8fr_0.7fr_0.8fr_0.7fr] gap-4 border-b border-gray-100 px-5 py-3 text-xs font-medium text-gray-600 md:grid">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span className="text-right">Total</span>
                </div>

                <div>
                  {cartItems.map((item) => (
                    <CartItem
                      key={`${item.id}-${item.size || 'Standard'}`}
                      item={item}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                    />
                  ))}
                </div>

                <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-4 py-4 sm:flex-row sm:px-5">
                  <Link
                    to="/product"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium transition hover:border-[#075631] hover:text-[#075631] sm:w-auto"
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

          {/* Order Summary */}
          <aside className="h-fit space-y-3 lg:sticky lg:top-4">
            <section className="rounded-lg border border-gray-200 bg-[#fcfaf5] p-4 sm:p-5">
              <h2 className="font-serif text-xl font-bold sm:text-2xl">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <SummaryRow
                  label={`Subtotal (${totalQuantity} ${
                    totalQuantity === 1 ? 'item' : 'items'
                  })`}
                  value={`$${subtotal.toFixed(2)}`}
                />

                <div>
                  <SummaryRow
                    label="Shipping"
                    value={
                      shipping === 0
                        ? 'FREE'
                        : `$${shipping.toFixed(2)}`
                    }
                  />

                  <p className="mt-1 text-[10px] text-gray-500">
                    {subtotal >= FREE_SHIPPING_THRESHOLD
                      ? '✓ You qualify for free shipping!'
                      : `Free shipping on orders above $${FREE_SHIPPING_THRESHOLD}.`}
                  </p>
                </div>

                <SummaryRow
                  label="Tax (estimated)"
                  value={`$${tax.toFixed(2)}`}
                />

                {couponApplied && (
                  <SummaryRow
                    label="Coupon Discount (10%)"
                    value={`-$${discount.toFixed(2)}`}
                    valueClass="text-green-700"
                  />
                )}
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 border-t border-gray-300 pt-4">
                <span className="font-serif text-lg font-bold">
                  Estimated Total
                </span>

                <span className="font-serif text-xl font-bold text-[#075631] sm:text-2xl">
                  ${estimatedTotal.toFixed(2)}
                </span>
              </div>

              <Link
                to="/check-out"
                onClick={(event) => {
                  if (cartItems.length === 0) {
                    event.preventDefault()
                  }
                }}
                aria-disabled={cartItems.length === 0}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold transition ${
                  cartItems.length === 0
                    ? 'pointer-events-none bg-gray-300 text-gray-500'
                    : 'bg-[#075631] text-white hover:bg-[#053f25]'
                }`}
              >
                🔒 Proceed to Checkout →
              </Link>

              <div className="my-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-300" />
                <span className="text-xs text-gray-500">OR</span>
                <div className="h-px flex-1 bg-gray-300" />
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
                className="w-full rounded-md bg-[#ffc439] py-2.5 font-bold text-[#003087] transition hover:bg-[#f5b820]"
              >
                PayPal
              </button>

              <p className="mt-2 text-center text-[10px] text-gray-500">
                Payment options will be confirmed at checkout.
              </p>
            </section>

            {/* Coupon */}
            <section className="rounded-lg border border-gray-200 bg-[#fcfaf5] p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl text-[#075631]">◇</span>

                <h3 className="text-sm font-semibold">
                  Have a Coupon Code?
                </h3>
              </div>

              <form
                className="mt-3 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault()
                  applyCoupon()
                }}
              >
                <input
                  type="text"
                  value={coupon}
                  onChange={(event) => {
                    setCoupon(event.target.value)
                    setCouponApplied(false)
                    setCouponMessage('')
                    setCouponError(false)
                  }}
                  placeholder="Enter coupon code"
                  aria-label="Coupon code"
                  disabled={couponApplied}
                  className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2.5 text-xs uppercase outline-none focus:border-[#075631] disabled:bg-gray-100"
                />

                {couponApplied ? (
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="rounded-md bg-red-600 px-3 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="rounded-md bg-[#075631] px-4 text-xs font-semibold text-white hover:bg-[#053f25]"
                  >
                    Apply
                  </button>
                )}
              </form>

              {couponMessage && (
                <p
                  role="status"
                  className={`mt-2 text-xs ${
                    couponError ? 'text-red-600' : 'text-green-700'
                  }`}
                >
                  {couponMessage}
                </p>
              )}

              <p className="mt-2 text-[10px] text-gray-500">
                Try WELCOME10 for 10% off orders of $50 or more.
              </p>
            </section>

            {/* Trust information */}
            <section className="rounded-lg bg-[#eef8ed] p-4">
              <div className="space-y-4">
                <TrustItem
                  icon="♧"
                  title="Secure Checkout"
                  text="Payment security will depend on the configured payment provider."
                />

                <TrustItem
                  icon="⟳"
                  title="Easy Returns"
                  text="Please review our return and refund policy."
                />

                <TrustItem
                  icon="◎"
                  title="Global Shipping"
                  text="Available destinations depend on shipping coverage."
                />
              </div>
            </section>
          </aside>
        </div>

        {/* Benefits */}
        <section className="mt-6 border-y border-gray-200 py-6">
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            <TrustBarItem
              icon="🚚"
              title="Free Shipping"
              text="On orders above $100"
            />

            <TrustBarItem
              icon="♧"
              title="Secure Payments"
              text="Secure transactions at checkout"
            />

            <TrustBarItem
              icon="◇"
              title="Easy Returns"
              text="Review our return policy"
            />

            <TrustBarItem
              icon="♧"
              title="Customer Support"
              text="We're here to help"
            />
          </div>
        </section>

        {/* Recommendations */}
        {recommendedProducts.length > 0 && (
          <section className="py-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">
                You May Also Like
              </h2>

              <Link
                to="/product"
                className="hidden text-sm font-medium text-[#075631] hover:underline sm:block"
              >
                View All Products →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {recommendedProducts.map((product) => (
                <RecommendationCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

/* Cart item */
const CartItem = ({ item, updateQuantity, removeItem }) => {
  const price = Number(item.price) || 0
  const quantity = Number(item.quantity) || 1
  const total = price * quantity
  const oldPrice = Number(item.oldPrice) || 0

  const saving =
    oldPrice > price ? (oldPrice - price) * quantity : 0

  const size = item.size || 'Standard'
  const tags = Array.isArray(item.tags) ? item.tags : []

  return (
    <div className="relative border-b border-gray-100 px-4 py-4 sm:px-5">
      {/* Desktop */}
      <div className="hidden grid-cols-[1.8fr_0.7fr_0.8fr_0.7fr] items-center gap-4 md:grid">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={item.image}
            alt={item.name}
            className="h-20 w-24 shrink-0 rounded-md object-cover"
          />

          <div className="min-w-0">
            <Link
              to={`/product/${item.id}`}
              className="text-sm font-semibold transition hover:text-[#075631]"
            >
              {item.name}
            </Link>

            <p className="mt-1 text-xs text-gray-500">{size}</p>

            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-[#edf3f2] px-2 py-1 text-[10px] text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.id, size)}
              className="mt-2 text-xs text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">${price.toFixed(2)}</p>

          {oldPrice > price && (
            <p className="mt-1 text-xs text-gray-400 line-through">
              ${oldPrice.toFixed(2)}
            </p>
          )}
        </div>

        <QuantityControl
          quantity={quantity}
          onDecrease={() => updateQuantity(item.id, size, -1)}
          onIncrease={() => updateQuantity(item.id, size, 1)}
        />

        <div className="text-right">
          <p className="text-sm font-semibold">${total.toFixed(2)}</p>

          {saving > 0 && (
            <p className="mt-1 text-xs text-green-700">
              Save ${saving.toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex gap-3">
          <img
            src={item.image}
            alt={item.name}
            className="h-24 w-24 shrink-0 rounded-md object-cover"
          />

          <div className="min-w-0 flex-1">
            <div className="flex justify-between gap-2">
              <div className="min-w-0">
                <Link
                  to={`/product/${item.id}`}
                  className="text-sm font-semibold hover:text-[#075631]"
                >
                  {item.name}
                </Link>

                <p className="mt-1 text-xs text-gray-500">{size}</p>
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.id, size)}
                className="shrink-0 text-red-500 hover:text-red-700"
                aria-label={`Remove ${item.name}`}
              >
                🗑
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-[#edf3f2] px-2 py-1 text-[10px] text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <div>
                <span className="text-sm font-semibold">
                  ${price.toFixed(2)}
                </span>

                {oldPrice > price && (
                  <span className="ml-2 text-xs text-gray-400 line-through">
                    ${oldPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <QuantityControl
                quantity={quantity}
                onDecrease={() => updateQuantity(item.id, size, -1)}
                onIncrease={() => updateQuantity(item.id, size, 1)}
              />
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-xs text-gray-500">Total</span>
              <span className="text-sm font-bold">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Quantity controls */
const QuantityControl = ({
  quantity,
  onDecrease,
  onIncrease,
}) => (
  <div className="inline-flex items-center overflow-hidden rounded-md border border-gray-300">
    <button
      type="button"
      onClick={onDecrease}
      disabled={quantity <= 1}
      aria-label="Decrease quantity"
      className="flex h-8 w-8 items-center justify-center hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
    >
      −
    </button>

    <span className="flex h-8 w-8 items-center justify-center border-x border-gray-300 text-sm">
      {quantity}
    </span>

    <button
      type="button"
      onClick={onIncrease}
      aria-label="Increase quantity"
      className="flex h-8 w-8 items-center justify-center hover:bg-gray-100"
    >
      +
    </button>
  </div>
)

/* Empty cart */
const EmptyCart = () => (
  <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
    <div className="mb-4 text-6xl">🛒</div>

    <h3 className="font-serif text-2xl font-bold">
      Your Cart is Empty
    </h3>

    <p className="mt-2 max-w-md text-sm text-gray-500">
      Looks like you haven't added anything to your cart yet.
    </p>

    <Link
      to="/product"
      className="mt-5 rounded-md bg-[#075631] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#053f25]"
    >
      Continue Shopping →
    </Link>
  </div>
)

/* Recommended product */
const RecommendationCard = ({ product }) => {
  const price = Number(product.price) || 0
  const rating = Number(product.rating) || 0
  const reviews = Number(product.reviews) || 0

  const image = product.image?.startsWith('/')
    ? product.image
    : `/images/${product.image || ''}`

  const handleAddToCart = () => {
    try {
      addToCart(product, 1, 'Standard')
      alert(`${product.name} added to your cart.`)
    } catch (error) {
      alert(error.message || 'Unable to add this product to your cart.')
    }
  }

  return (
    <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-md">
      <Link to={`/product/${product.id}`}>
        <div className="overflow-hidden">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-32 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-36"
          />
        </div>

        <div className="p-2.5">
          <h3 className="line-clamp-1 text-xs font-semibold sm:text-sm">
            {product.name}
          </h3>

          <p className="mt-1 text-[10px] text-gray-500">
            {product.categoryType || 'Halla Bol Product'}
          </p>

          <div className="mt-1 flex items-center gap-1">
            <span className="text-xs text-yellow-500">★</span>

            <span className="text-[10px] font-medium">
              {rating.toFixed(1)}
            </span>

            <span className="text-[10px] text-gray-400">
              ({reviews})
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-1">
            <span className="text-sm font-bold text-[#075631]">
              ${price.toFixed(2)}
            </span>

            <span className="text-[10px] text-gray-500">
              View →
            </span>
          </div>
        </div>
      </Link>

      <div className="px-2.5 pb-2.5">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.inStock === false}
          className="w-full rounded-md bg-[#075631] px-2 py-2 text-xs font-semibold text-white transition hover:bg-[#053f25] disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

/* Summary row */
const SummaryRow = ({
  label,
  value,
  valueClass = '',
}) => (
  <div className="flex justify-between gap-4">
    <span>{label}</span>
    <span className={`font-medium ${valueClass}`}>{value}</span>
  </div>
)

/* Trust bar */
const TrustBarItem = ({ icon, title, text }) => (
  <div className="flex items-center justify-center gap-3">
    <span className="text-2xl text-[#075631] sm:text-3xl">
      {icon}
    </span>

    <div>
      <h3 className="text-xs font-semibold sm:text-sm">{title}</h3>
      <p className="mt-1 text-[10px] text-gray-500">{text}</p>
    </div>
  </div>
)

/* Trust item */
const TrustItem = ({ icon, title, text }) => (
  <div className="flex items-start gap-3">
    <span className="shrink-0 text-2xl text-[#075631]">{icon}</span>

    <div>
      <h3 className="text-xs font-semibold sm:text-sm">{title}</h3>
      <p className="mt-1 text-[10px] text-gray-500">{text}</p>
    </div>
  </div>
)

export default Cart