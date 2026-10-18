import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getCart, clearCart } from '../utils/cart'

// Demo conversion rate only — live exchange rate nahi hai.
const USD_TO_INR = 85.5
const COUPON_CODE = 'HALLABOL10'
const COUPON_PERCENT = 10

const formatMoney = (usdAmount, currency) => {
  const amount =
    currency === 'INR'
      ? usdAmount * USD_TO_INR
      : usdAmount

  return new Intl.NumberFormat(
    currency === 'INR' ? 'en-IN' : 'en-US',
    {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(amount)
}

const getProductImage = (image) => {
  if (!image) return '/images/hero.jpg'
  if (image.startsWith('/') || image.startsWith('http')) return image
  return `/images/${image}`
}

const initialFormData = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  apartment: '',
  city: '',
  state: 'Delhi',
  pinCode: '',
  country: 'India',
  billingFullName: '',
  billingAddress: '',
  billingCity: '',
  billingState: 'Delhi',
  billingPinCode: '',
  billingCountry: 'India',
}

const states = [
  'Delhi',
  'Haryana',
  'Uttar Pradesh',
  'Maharashtra',
  'Rajasthan',
  'Gujarat',
  'Karnataka',
  'Tamil Nadu',
  'Kerala',
  'West Bengal',
  'Punjab',
  'Bihar',
  'Madhya Pradesh',
  'Telangana',
  'Andhra Pradesh',
  'Other',
]

const countries = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'UAE',
]

const Checkout = () => {
  const [cartItems, setCartItems] = useState([])
  const [currency, setCurrency] = useState('INR')
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [billingSame, setBillingSame] = useState(true)
  const [formData, setFormData] = useState(initialFormData)
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [saveAddress, setSaveAddress] = useState(true)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [error, setError] = useState('')
  const [couponMessage, setCouponMessage] = useState('')

  useEffect(() => {
    setCartItems(getCart())
  }, [])

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      ),
    [cartItems]
  )

  const shippingCost =
    shippingMethod === 'standard'
      ? subtotal >= 100 ? 0 : 10
      : shippingMethod === 'express'
        ? 15
        : 25

  const tax = subtotal * 0.1
  const discount = couponApplied
    ? subtotal * (COUPON_PERCENT / 100)
    : 0

  const total = Math.max(
    0,
    subtotal + shippingCost + tax - discount
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
    setError('')
  }

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase()

    if (!code) {
      setCouponApplied(false)
      setCouponMessage('Please enter a coupon code.')
      return
    }

    if (code === COUPON_CODE) {
      setCouponApplied(true)
      setCouponMessage('Coupon applied! You saved 10% on your subtotal.')
      setError('')
    } else {
      setCouponApplied(false)
      setCouponMessage('Invalid coupon. Try HALLABOL10.')
    }
  }

  const validateForm = () => {
    if (!cartItems.length) {
      setError('Your cart is empty. Please add products first.')
      return false
    }

    const requiredFields = [
      ['fullName', 'Please enter your full name.'],
      ['phone', 'Please enter your phone number.'],
      ['email', 'Please enter your email address.'],
      ['address', 'Please enter your delivery address.'],
      ['city', 'Please enter your city.'],
      ['state', 'Please select your state.'],
      ['pinCode', 'Please enter your PIN code.'],
      ['country', 'Please select your country.'],
    ]

    for (const [field, message] of requiredFields) {
      if (!String(formData[field] || '').trim()) {
        setError(message)
        return false
      }
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(formData.email.trim())) {
      setError('Please enter a valid email address.')
      return false
    }

    const phoneDigits = formData.phone.replace(/\D/g, '')
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setError('Please enter a valid phone number.')
      return false
    }

    if (formData.pinCode.trim().length < 4) {
      setError('Please enter a valid PIN or postal code.')
      return false
    }

    if (!billingSame) {
      const billingFields = [
        ['billingFullName', 'Please enter billing full name.'],
        ['billingAddress', 'Please enter billing address.'],
        ['billingCity', 'Please enter billing city.'],
        ['billingPinCode', 'Please enter billing PIN code.'],
        ['billingState', 'Please select billing state.'],
        ['billingCountry', 'Please select billing country.'],
      ]

      for (const [field, message] of billingFields) {
        if (!String(formData[field] || '').trim()) {
          setError(message)
          return false
        }
      }
    }

    if (!termsAccepted) {
      setError('Please accept the Terms & Conditions and Privacy Policy.')
      return false
    }

    return true
  }

  const handlePlaceOrder = () => {
    setError('')

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const generatedOrderNumber =
      `HB-${Date.now().toString().slice(-8)}`

    const orderData = {
      orderNumber: generatedOrderNumber,
      customer: {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
      },
      shippingAddress: {
        address: formData.address.trim(),
        apartment: formData.apartment.trim(),
        city: formData.city.trim(),
        state: formData.state,
        pinCode: formData.pinCode.trim(),
        country: formData.country,
      },
      billingAddress: billingSame
        ? 'Same as shipping address'
        : {
            fullName: formData.billingFullName.trim(),
            address: formData.billingAddress.trim(),
            city: formData.billingCity.trim(),
            state: formData.billingState,
            pinCode: formData.billingPinCode.trim(),
            country: formData.billingCountry,
          },
      items: cartItems,
      shippingMethod,
      paymentMethod,
      currency,
      exchangeRate: currency === 'INR' ? USD_TO_INR : 1,
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      createdAt: new Date().toISOString(),
      paymentStatus: 'Demo - not processed',
      orderStatus: 'Pending',
    }

    try {
      localStorage.setItem(
        'Halla Bol_last_order',
        JSON.stringify(orderData)
      )

      if (saveAddress) {
        localStorage.setItem(
          'Halla Bol_saved_address',
          JSON.stringify(formData)
        )
      }

      clearCart()
      setCartItems([])
      setOrderNumber(generatedOrderNumber)
      setOrderPlaced(true)

      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError(
        'We could not save your order in this browser. Please try again.'
      )
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />

        <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm max-w-xl w-full p-7 sm:p-10 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl text-[#075631]">
              ✓
            </div>

            <p className="text-sm font-semibold text-[#075631] mt-6">
              DEMO ORDER CONFIRMED
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold mt-2">
              Thank You For Your Order!
            </h1>

            <p className="text-gray-500 mt-3 leading-6">
              Your demo order has been saved in this browser.
              No payment has been taken.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mt-6">
              <p className="text-xs text-gray-500">Order Number</p>
              <p className="text-lg font-bold text-[#075631] mt-1">
                {orderNumber}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4 text-sm text-amber-800">
              This is a frontend demo. Real order processing and payment
              require a backend and payment gateway.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <Link
                to="/product"
                className="border border-[#075631] text-[#075631] hover:bg-green-50 py-3 rounded-xl font-semibold transition"
              >
                Continue Shopping
              </Link>

              <Link
                to="/"
                className="bg-[#075631] hover:bg-[#053f25] text-white py-3 rounded-xl font-semibold transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <main className="min-h-[65vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-5">🛒</div>
            <h1 className="text-3xl font-bold">Your Cart is Empty</h1>

            <p className="text-gray-500 mt-3">
              Please add products to your cart before going to checkout.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link
                to="/product"
                className="bg-[#075631] hover:bg-[#053f25] text-white px-6 py-3 rounded-xl font-semibold"
              >
                Shop Products
              </Link>

              <Link
                to="/cart"
                className="border border-gray-300 px-6 py-3 rounded-xl font-semibold"
              >
                View Cart
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src="/images/hero.jpg"
          alt="Halla Bol checkout"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-5 py-9 sm:py-12">
          <p className="text-sm text-white/80 mb-2">
            Home / Cart / Checkout
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">
            Checkout
          </h1>
          <p className="text-sm sm:text-lg text-white mt-2">
            Complete your order securely
          </p>
        </div>
      </section>

      {/* Checkout steps */}
      <section className="max-w-4xl mx-auto px-4 sm:px-5 py-5">
        <div className="flex items-center justify-between">
          <CheckoutStep number="1" title="Shipping" subtitle="Delivery Address" />
          <div className="h-px bg-gray-300 flex-1 mx-2 sm:mx-4" />
          <CheckoutStep number="2" title="Payment" subtitle="Payment Method" />
          <div className="h-px bg-gray-300 flex-1 mx-2 sm:mx-4" />
          <CheckoutStep number="3" title="Review" subtitle="Confirm Order" />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-5 pb-10">
        <div className="grid lg:grid-cols-[1.8fr_0.9fr] gap-5">
          <div className="space-y-4">
            {error && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
              >
                ⚠️ {error}
              </div>
            )}

            {/* Shipping information */}
            <section className="border border-gray-200 rounded-xl p-4 sm:p-6">
              <SectionTitle number="1" title="Shipping Information" rightText="Required fields marked *" />

              <div className="grid md:grid-cols-3 gap-4 mt-5">
                <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Enter full name" />
                <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="+91 9876543210" />
                <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
              </div>

              <div className="grid md:grid-cols-[2fr_1fr] gap-4 mt-4">
                <InputField label="Address" name="address" value={formData.address} onChange={handleChange} required placeholder="House number, street, area" />
                <InputField label="Apartment, Suite" name="apartment" value={formData.apartment} onChange={handleChange} placeholder="Optional" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <InputField label="City" name="city" value={formData.city} onChange={handleChange} required placeholder="City" />
                <SelectField label="State" name="state" value={formData.state} onChange={handleChange} required options={states} />
                <InputField label="PIN / Postal Code" name="pinCode" value={formData.pinCode} onChange={handleChange} required placeholder="110001" />
                <SelectField label="Country" name="country" value={formData.country} onChange={handleChange} required options={countries} />
              </div>

              <label className="flex items-center gap-2 mt-5 text-xs sm:text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  className="accent-[#075631] w-4 h-4"
                />
                Save this address for future orders on this device
              </label>
            </section>

            {/* Billing address */}
            <section className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-[#fcfbf8]">
              <SectionTitle number="2" title="Billing Address" />

              <div className="space-y-4 mt-5">
                <RadioLabel
                  checked={billingSame}
                  onChange={() => setBillingSame(true)}
                  label="Same as shipping address"
                />
                <RadioLabel
                  checked={!billingSame}
                  onChange={() => setBillingSame(false)}
                  label="Use a different billing address"
                />
              </div>

              {!billingSame && (
                <div className="mt-5 space-y-4">
                  <InputField label="Billing Full Name" name="billingFullName" value={formData.billingFullName} onChange={handleChange} required placeholder="Billing name" />
                  <InputField label="Billing Address" name="billingAddress" value={formData.billingAddress} onChange={handleChange} required placeholder="Billing address" />

                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="City" name="billingCity" value={formData.billingCity} onChange={handleChange} required placeholder="City" />
                    <InputField label="PIN / Postal Code" name="billingPinCode" value={formData.billingPinCode} onChange={handleChange} required placeholder="PIN code" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <SelectField label="State" name="billingState" value={formData.billingState} onChange={handleChange} required options={states} />
                    <SelectField label="Country" name="billingCountry" value={formData.billingCountry} onChange={handleChange} required options={countries} />
                  </div>
                </div>
              )}
            </section>

            {/* Shipping method */}
            <section className="border border-gray-200 rounded-xl p-4 sm:p-6">
              <SectionTitle number="3" title="Shipping Method" />

              <div className="grid md:grid-cols-3 gap-4 mt-5">
                <ShippingOption
                  value="standard"
                  selected={shippingMethod}
                  setSelected={setShippingMethod}
                  icon="🚚"
                  title="Standard Shipping"
                  description="5–7 business days"
                  price={subtotal >= 100 ? 'Free' : formatMoney(10, currency)}
                />
                <ShippingOption
                  value="express"
                  selected={shippingMethod}
                  setSelected={setShippingMethod}
                  icon="✈️"
                  title="Express Shipping"
                  description="2–4 business days"
                  price={formatMoney(15, currency)}
                />
                <ShippingOption
                  value="international"
                  selected={shippingMethod}
                  setSelected={setShippingMethod}
                  icon="🌎"
                  title="International Shipping"
                  description="7–14 business days"
                  price={formatMoney(25, currency)}
                />
              </div>
            </section>

            {/* Payment method */}
            <section className="border border-gray-200 rounded-xl p-4 sm:p-6">
              <SectionTitle number="4" title="Payment Method" />

              <p className="text-xs text-gray-500 mt-3">
                Demo only: selecting a method does not process a payment.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-5">
                <PaymentOption value="upi" selected={paymentMethod} setSelected={setPaymentMethod} title="UPI / Net Banking" description="UPI, Google Pay, PhonePe, Paytm" logos="GPay • PhonePe • Paytm" />
                <PaymentOption value="card" selected={paymentMethod} setSelected={setPaymentMethod} title="Credit / Debit Card" description="Card payment option" logos="VISA • RuPay • AMEX" />
                <PaymentOption value="paypal" selected={paymentMethod} setSelected={setPaymentMethod} title="PayPal" description="For supported international payments" logos="PayPal" />
                <PaymentOption value="bank" selected={paymentMethod} setSelected={setPaymentMethod} title="Bank Transfer" description="For wholesale and export orders" logos="" />
                <PaymentOption value="cod" selected={paymentMethod} setSelected={setPaymentMethod} title="Cash on Delivery" description="Pay when the order arrives" logos="COD" />
              </div>
            </section>
          </div>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-4 h-fit space-y-4">
            <section className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-[#fcfaf5]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold">
                    Order Summary
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0)} item(s) in your order
                  </p>
                </div>
                <Link to="/cart" className="text-xs font-semibold text-[#075631] underline">
                  Edit Cart
                </Link>
              </div>

              <div className="mt-4">
                {cartItems.map((product, index) => (
                  <div
                    key={`${product.id}-${product.size || 'standard'}-${index}`}
                    className="flex gap-3 py-3 border-b border-gray-200"
                  >
                    <img
                      src={getProductImage(product.image)}
                      alt={product.name || 'Product'}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = '/images/hero.jpg'
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm">
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Size: {product.size || 'Standard'}
                      </p>
                      <span className="inline-block bg-gray-100 rounded px-2 py-1 text-[10px] mt-2">
                        Qty: {product.quantity}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <strong className="text-sm">
                        {formatMoney(product.price * product.quantity, currency)}
                      </strong>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {formatMoney(product.price, currency)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm mt-5">
                <SummaryRow label="Subtotal" value={formatMoney(subtotal, currency)} />
                <SummaryRow
                  label="Shipping"
                  value={shippingCost === 0 ? 'Free' : formatMoney(shippingCost, currency)}
                />
                <SummaryRow label="Tax (10%)" value={formatMoney(tax, currency)} />

                {couponApplied && (
                  <SummaryRow
                    label="Coupon discount (10%)"
                    value={`−${formatMoney(discount, currency)}`}
                    green
                  />
                )}
              </div>

              <div className="flex items-center justify-between gap-3 bg-[#e7f3e4] rounded-xl px-4 py-4 mt-5">
                <span className="font-serif font-bold">Total Amount</span>
                <span className="text-xl sm:text-2xl font-bold text-[#075631] text-right">
                  {formatMoney(total, currency)}
                </span>
              </div>

              <p className="text-[10px] text-gray-500 mt-3">
                {currency === 'INR'
                  ? `Demo rate: US$1 = ₹${USD_TO_INR}.`
                  : `Displayed in US Dollars. Demo rate: US$1 = ₹${USD_TO_INR}.`}
                {' '}Taxes and shipping are calculated from the stored product prices.
              </p>
            </section>

            {/* Currency selector */}
            <section className="border border-gray-200 rounded-xl p-4 bg-white">
              <h3 className="font-semibold text-sm">Display Currency</h3>
              <p className="text-xs text-gray-500 mt-1">
                Switch how prices are displayed.
              </p>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                    currency === 'INR'
                      ? 'border-[#075631] bg-[#f3faf4] text-[#075631]'
                      : 'border-gray-200 hover:border-[#075631]'
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                    currency === 'USD'
                      ? 'border-[#075631] bg-[#f3faf4] text-[#075631]'
                      : 'border-gray-200 hover:border-[#075631]'
                  }`}
                >
                  $ USD
                </button>
              </div>
            </section>

            {/* Coupon */}
            <section className="border border-gray-200 rounded-xl p-4 bg-[#fcfaf5]">
              <h3 className="font-semibold text-sm">Have a Coupon Code?</h3>

              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => {
                    setCoupon(e.target.value)
                    setCouponApplied(false)
                    setCouponMessage('')
                  }}
                  placeholder="HALLABOL10"
                  aria-label="Coupon code"
                  className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#075631]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-[#075631] hover:bg-[#053f25] text-white px-4 rounded-lg text-xs font-semibold"
                >
                  Apply
                </button>
              </div>

              {couponMessage && (
                <p className={`text-xs mt-2 ${couponApplied ? 'text-green-700' : 'text-red-600'}`}>
                  {couponMessage}
                </p>
              )}
            </section>

            {/* Place order */}
            <section className="border border-gray-200 rounded-xl p-4">
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full bg-[#075631] hover:bg-[#053f25] text-white rounded-xl py-3.5 font-semibold text-sm transition"
              >
                Place Demo Order — {formatMoney(total, currency)}
              </button>

              <label className="flex items-start gap-2 mt-4 text-[10px] sm:text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="accent-[#075631] w-4 h-4 mt-0.5"
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="text-[#075631] underline font-medium">
                    Terms & Conditions
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-[#075631] underline font-medium">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <p className="text-[10px] text-gray-500 mt-3">
                No real payment is collected in this demo checkout.
              </p>
            </section>

            {/* Trust information */}
            <section className="bg-[#faf8ef] rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <TrustItem icon="♧" title="Secure Checkout" text="Demo interface" />
                <TrustItem icon="⟳" title="Easy Returns" text="See return policy" />
                <TrustItem icon="◎" title="Global Shipping" text="Shipping options shown" />
                <TrustItem icon="♡" title="Customer Support" text="We're here to help" />
              </div>
            </section>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}

const CheckoutStep = ({ number, title, subtitle }) => (
  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0 flex items-center justify-center font-semibold bg-[#075631] text-white">
      {number}
    </div>
    <div className="hidden sm:block">
      <p className="font-semibold text-xs sm:text-sm">{title}</p>
      <p className="text-[10px] text-gray-500">{subtitle}</p>
    </div>
  </div>
)

const SectionTitle = ({ number, title, rightText }) => (
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      {number && (
        <span className="w-8 h-8 rounded-full bg-[#075631] text-white flex items-center justify-center text-sm font-semibold shrink-0">
          {number}
        </span>
      )}
      <h2 className="font-serif text-xl sm:text-2xl font-bold">{title}</h2>
    </div>
    {rightText && (
      <span className="hidden sm:block text-xs text-gray-500">{rightText}</span>
    )}
  </div>
)

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder = '',
}) => (
  <label className="block">
    <span className="block text-xs font-medium mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      autoComplete="on"
      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#075631] focus:ring-1 focus:ring-[#075631]/20"
    />
  </label>
)

const SelectField = ({
  label,
  name,
  value,
  onChange,
  required = false,
  options,
}) => (
  <label className="block">
    <span className="block text-xs font-medium mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </span>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#075631] bg-white"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
)

const RadioLabel = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="radio"
      name="billing"
      checked={checked}
      onChange={onChange}
      className="accent-[#075631] w-4 h-4"
    />
    <span className="text-sm">{label}</span>
  </label>
)

const ShippingOption = ({
  value,
  selected,
  setSelected,
  icon,
  title,
  description,
  price,
}) => {
  const isSelected = selected === value

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => setSelected(value)}
      className={`text-left border rounded-xl p-4 transition w-full ${
        isSelected
          ? 'border-[#075631] bg-[#f3faf4] ring-1 ring-[#075631]'
          : 'border-gray-200 hover:border-[#075631]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-xs sm:text-sm">{title}</h3>
            <p className="text-[10px] text-gray-500 mt-1">{description}</p>
            <p className="font-semibold text-xs mt-2 text-[#075631]">{price}</p>
          </div>
        </div>
        <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
          isSelected ? 'border-[#075631]' : 'border-gray-400'
        }`}>
          {isSelected && <span className="w-2 h-2 bg-[#075631] rounded-full" />}
        </span>
      </div>
    </button>
  )
}

const PaymentOption = ({
  value,
  selected,
  setSelected,
  title,
  description,
  logos,
}) => {
  const isSelected = selected === value

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => setSelected(value)}
      className={`text-left border rounded-xl p-4 transition w-full ${
        isSelected
          ? 'border-[#075631] bg-[#f3faf4] ring-1 ring-[#075631]'
          : 'border-gray-200 hover:border-[#075631]'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center ${
          isSelected ? 'border-[#075631]' : 'border-gray-400'
        }`}>
          {isSelected && <span className="w-2 h-2 bg-[#075631] rounded-full" />}
        </span>
        <div className="flex-1">
          <h3 className="font-semibold text-xs sm:text-sm">{title}</h3>
          <p className="text-[10px] text-gray-500 mt-1">{description}</p>
          {logos && (
            <p className="text-[10px] font-semibold text-[#075631] mt-2">
              {logos}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}

const SummaryRow = ({ label, value, green = false }) => (
  <div className={`flex justify-between gap-4 ${green ? 'text-green-700' : ''}`}>
    <span>{label}</span>
    <span className="text-right">{value}</span>
  </div>
)

const TrustItem = ({ icon, title, text }) => (
  <div className="flex items-start gap-2">
    <span className="text-xl sm:text-2xl text-[#075631] shrink-0">{icon}</span>
    <div>
      <h3 className="font-semibold text-xs">{title}</h3>
      <p className="text-[10px] text-gray-500 mt-1">{text}</p>
    </div>
  </div>
)

export default Checkout