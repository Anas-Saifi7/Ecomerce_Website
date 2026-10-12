import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import {
  getCart,
  clearCart,
} from '../utils/cart'

const Checkout = () => {
  const navigate = useNavigate()

  const [cartItems, setCartItems] = useState([])

  const [shippingMethod, setShippingMethod] = useState('standard')

  const [paymentMethod, setPaymentMethod] = useState('card')

  const [billingSame, setBillingSame] = useState(true)

  const [formData, setFormData] = useState({
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
  })

  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)


  const [saveAddress, setSaveAddress] = useState(true)

  const [termsAccepted, setTermsAccepted] = useState(false)

  const [orderPlaced, setOrderPlaced] = useState(false)

  const [orderNumber, setOrderNumber] = useState('')

  const [error, setError] = useState('')

  useEffect(() => {
    const items = getCart()

    setCartItems(items)

    if (items.length === 0) {
      setCartItems([])
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setError('')
  }

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  )

  const shippingCost =
    shippingMethod === 'standard'
      ? subtotal >= 100
        ? 0
        : 10
      : shippingMethod === 'express'
        ? 15
        : 25

  const tax = subtotal * 0.1

  const discount = couponApplied ? 10 : 0

  const total = Math.max(
    0,
    subtotal + shippingCost + tax - discount
  )

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase()

    if (!code) {
      setError('Please enter a coupon code.')
      return
    }

    if (code === 'Halla Bol10') {
      setCouponApplied(true)
      setError('')
    } else {
      setCouponApplied(false)
      setError(
        'Invalid coupon code. Try Halla Bol10.'
      )
    }
  }

  const validateForm = () => {
    if (cartItems.length === 0) {
      setError(
        'Your cart is empty. Please add products first.'
      )

      return false
    }

    if (!formData.fullName.trim()) {
      setError('Please enter your full name.')
      return false
    }

    if (!formData.phone.trim()) {
      setError('Please enter your phone number.')
      return false
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address.')
      return false
    }

    if (!formData.address.trim()) {
      setError('Please enter your delivery address.')
      return false
    }

    if (!formData.city.trim()) {
      setError('Please enter your city.')
      return false
    }

    if (!formData.state.trim()) {
      setError('Please select your state.')
      return false
    }

    if (!formData.pinCode.trim()) {
      setError('Please enter your PIN code.')
      return false
    }

    if (!formData.country.trim()) {
      setError('Please select your country.')
      return false
    }

    if (!billingSame) {
      if (!formData.billingFullName.trim()) {
        setError(
          'Please enter billing full name.'
        )
        return false
      }

      if (!formData.billingAddress.trim()) {
        setError(
          'Please enter billing address.'
        )
        return false
      }

      if (!formData.billingCity.trim()) {
        setError(
          'Please enter billing city.'
        )
        return false
      }

      if (!formData.billingPinCode.trim()) {
        setError(
          'Please enter billing PIN code.'
        )
        return false
      }
    }

    if (!termsAccepted) {
      setError(
        'Please accept Terms & Conditions and Privacy Policy.'
      )

      return false
    }

    return true
  }

  const handlePlaceOrder = () => {
    setError('')

    const isValid = validateForm()

    if (!isValid) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      return
    }

    // Generate demo order number
    const generatedOrderNumber =
      `Halla Bol-${Date.now().toString().slice(-8)}`

    const orderData = {
      orderNumber: generatedOrderNumber,

      customer: {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
      },

      shippingAddress: {
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        country: formData.country,
      },

      billingAddress: billingSame
        ? 'Same as shipping address'
        : {
            fullName:
              formData.billingFullName,
            address:
              formData.billingAddress,
            city:
              formData.billingCity,
            state:
              formData.billingState,
            pinCode:
              formData.billingPinCode,
            country:
              formData.billingCountry,
          },

      items: cartItems,

      shippingMethod,

      paymentMethod,

      subtotal,

      shippingCost,

      tax,

      discount,

      total,

      createdAt:
        new Date().toISOString(),
    }

    // Save order for frontend demo
    localStorage.setItem(
      'Halla Bol_last_order',
      JSON.stringify(orderData)
    )

    // Save address if selected
    if (saveAddress) {
      localStorage.setItem(
        'Halla Bol_saved_address',
        JSON.stringify(formData)
      )
    }

    clearCart()
    setOrderNumber(generatedOrderNumber)
    setOrderPlaced(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">

        <Navbar />

        <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm max-w-xl w-full p-7 sm:p-10 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl">
              ✓
            </div>

            <p className="text-sm font-semibold text-[#075631] mt-6">
              ORDER CONFIRMED
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold mt-2">
              Thank You For Your Order!
            </h1>

            <p className="text-gray-500 mt-3 leading-6">
              Your order has been successfully placed.
              We will process it shortly.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mt-6">

              <p className="text-xs text-gray-500">
                Order Number
              </p>

              <p className="text-lg font-bold text-[#075631] mt-1">
                {orderNumber}
              </p>

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

            <p className="text-xs text-gray-400 mt-6">
              Order details have been saved for this
              frontend demo.
            </p>

          </div>

        </main>

        <Footer />

      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">

        <Navbar />

        <main className="min-h-[65vh] flex items-center justify-center px-4">

          <div className="text-center max-w-md">

            <div className="text-6xl mb-5">
              🛒
            </div>

            <h1 className="text-3xl font-bold">
              Your Cart is Empty
            </h1>

            <p className="text-gray-500 mt-3">
              Please add products to your cart before
              going to checkout.
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

      <section className="relative overflow-hidden">

        <img
          src="/images/hero.jpg"
          alt="Checkout"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-5 py-9 sm:py-12">

          <div className="flex items-center gap-2 text-xs sm:text-sm text-white mb-3">

          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">
            Checkout
          </h1>

          <p className="text-sm sm:text-lg text-white mt-2">
            Complete your order securely
          </p>

        </div>

      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-5 py-5">

        <div className="flex items-center justify-between">

          <CheckoutStep
            number="1"
            title="Shipping"
            subtitle="Delivery Address"
            active
          />

          <div className="h-px bg-gray-300 flex-1 mx-2 sm:mx-4" />

          <CheckoutStep
            number="2"
            title="Payment"
            subtitle="Payment Method"
            active
          />

          <div className="h-px bg-gray-300 flex-1 mx-2 sm:mx-4" />

          <CheckoutStep
            number="3"
            title="Review"
            subtitle="Confirm Order"
            active
          />

        </div>

      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-5 pb-10">

        <div className="grid lg:grid-cols-[1.8fr_0.9fr] gap-5">

          <div className="space-y-4">

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                ⚠️ {error}
              </div>
            )}

            <section className="border border-gray-200 rounded-xl p-4 sm:p-6">

              <SectionTitle
                number="1"
                title="Shipping Information"
                rightText="All required fields"
              />

              <div className="grid md:grid-cols-3 gap-4 mt-5">

                <InputField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                />

                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 9876543210"
                />

                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />

              </div>

              <div className="grid md:grid-cols-[2fr_1fr] gap-4 mt-4">

                <InputField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="House number, street, area"
                />

                <InputField
                  label="Apartment, Suite"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleChange}
                  placeholder="Optional"
                />

              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">

                <InputField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="City"
                />

                <SelectField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  options={[
                    'Delhi',
                    'Uttar Pradesh',
                    'Maharashtra',
                    'Rajasthan',
                    'Gujarat',
                    'Karnataka',
                    'Tamil Nadu',
                    'Kerala',
                    'West Bengal',
                  ]}
                />

                <InputField
                  label="PIN Code"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  required
                  placeholder="110001"
                />

                <SelectField
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  options={[
                    'India',
                    'United States',
                    'United Kingdom',
                    'Canada',
                    'Australia',
                    'Germany',
                    'France',
                    'UAE',
                  ]}
                />

              </div>

              <label className="flex items-center gap-2 mt-5 text-xs sm:text-sm cursor-pointer">

                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) =>
                    setSaveAddress(
                      e.target.checked
                    )
                  }
                  className="accent-[#075631] w-4 h-4"
                />

                Save this address for future orders

              </label>

            </section>

            <section className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-[#fcfbf8]">

              <SectionTitle
                number="2"
                title="Billing Address"
              />

              <div className="space-y-4 mt-5">

                <label className="flex items-center gap-3 cursor-pointer">

                  <input
                    type="radio"
                    name="billing"
                    checked={billingSame}
                    onChange={() =>
                      setBillingSame(true)
                    }
                    className="accent-[#075631] w-4 h-4"
                  />

                  <span className="text-sm">
                    Same as shipping address
                  </span>

                </label>

                <label className="flex items-center gap-3 cursor-pointer">

                  <input
                    type="radio"
                    name="billing"
                    checked={!billingSame}
                    onChange={() =>
                      setBillingSame(false)
                    }
                    className="accent-[#075631] w-4 h-4"
                  />

                  <span className="text-sm">
                    Use a different billing address
                  </span>

                </label>

              </div>

              {!billingSame && (
                <div className="mt-5 space-y-4">

                  <InputField
                    label="Billing Full Name"
                    name="billingFullName"
                    value={formData.billingFullName}
                    onChange={handleChange}
                    required
                    placeholder="Billing name"
                  />

                  <InputField
                    label="Billing Address"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleChange}
                    required
                    placeholder="Billing address"
                  />

                  <div className="grid grid-cols-2 gap-4">

                    <InputField
                      label="City"
                      name="billingCity"
                      value={formData.billingCity}
                      onChange={handleChange}
                      required
                      placeholder="City"
                    />

                    <InputField
                      label="PIN Code"
                      name="billingPinCode"
                      value={formData.billingPinCode}
                      onChange={handleChange}
                      required
                      placeholder="PIN code"
                    />

                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <SelectField
                      label="State"
                      name="billingState"
                      value={formData.billingState}
                      onChange={handleChange}
                      options={[
                        'Delhi',
                        'Uttar Pradesh',
                        'Maharashtra',
                        'Rajasthan',
                        'Gujarat',
                      ]}
                    />

                    <SelectField
                      label="Country"
                      name="billingCountry"
                      value={formData.billingCountry}
                      onChange={handleChange}
                      options={[
                        'India',
                        'United States',
                        'United Kingdom',
                        'Canada',
                      ]}
                    />

                  </div>

                </div>
              )}

            </section>

            <section className="border border-gray-200 rounded-xl p-4 sm:p-6">

              <SectionTitle
                number="3"
                title="Shipping Method"
              />

              <div className="grid md:grid-cols-3 gap-4 mt-5">

                <ShippingOption
                  value="standard"
                  selected={shippingMethod}
                  setSelected={setShippingMethod}
                  icon="🚚"
                  title="Standard Shipping"
                  description="5 - 7 business days"
                  price={
                    subtotal >= 100
                      ? 'Free'
                      : '$10.00'
                  }
                />

                <ShippingOption
                  value="express"
                  selected={shippingMethod}
                  setSelected={setShippingMethod}
                  icon="✈️"
                  title="Express Shipping"
                  description="2 - 4 business days"
                  price="$15.00"
                />

                <ShippingOption
                  value="international"
                  selected={shippingMethod}
                  setSelected={setShippingMethod}
                  icon="🌎"
                  title="International Shipping"
                  description="7 - 14 business days"
                  price="$25.00"
                />

              </div>

            </section>

            <section className="border border-gray-200 rounded-xl p-4 sm:p-6">

              <SectionTitle
                number="4"
                title="Payment Method"
              />

              <div className="grid md:grid-cols-2 gap-4 mt-5">

                <PaymentOption
                  value="card"
                  selected={paymentMethod}
                  setSelected={setPaymentMethod}
                  title="Credit / Debit Card"
                  description="Pay securely with your card"
                  logos="VISA • RuPay • AMEX"
                />

                <PaymentOption
                  value="upi"
                  selected={paymentMethod}
                  setSelected={setPaymentMethod}
                  title="UPI / Net Banking"
                  description="UPI, Google Pay, PhonePe, Paytm"
                  logos="GPay • PhonePe • Paytm"
                />

                <PaymentOption
                  value="paypal"
                  selected={paymentMethod}
                  setSelected={setPaymentMethod}
                  title="PayPal"
                  description="Pay securely with PayPal"
                  logos="PayPal"
                />

                <PaymentOption
                  value="bank"
                  selected={paymentMethod}
                  setSelected={setPaymentMethod}
                  title="Bank Transfer"
                  description="For wholesale & export orders"
                  logos=""
                />

              </div>

            </section>

          </div>


          <aside className="lg:sticky lg:top-4 h-fit space-y-4">

            <section className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-[#fcfaf5]">

              <div className="flex items-start justify-between gap-3">

                <div>

                  <h2 className="font-serif text-xl sm:text-2xl font-bold">
                    Order Summary
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    {cartItems.length}{' '}
                    {cartItems.length === 1
                      ? 'item'
                      : 'items'} in your order
                  </p>

                </div>

                <Link
                  to="/cart"
                  className="text-xs font-semibold text-[#075631] underline"
                >
                  ✎ Edit Cart
                </Link>

              </div>

              {/* Products */}
              <div className="mt-4">

                {cartItems.map((product) => (

                  <div
                    key={`${product.id}-${product.size}`}
                    className="flex gap-3 py-3 border-b border-gray-200"
                  >

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0"
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
                        $
                        {(
                          product.price *
                          product.quantity
                        ).toFixed(2)}
                      </strong>

                      <p className="text-[10px] text-gray-500 mt-1">
                        ${product.price.toFixed(2)} each
                      </p>

                    </div>

                  </div>

                ))}

              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm mt-5">

                <div className="flex justify-between">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    ${subtotal.toFixed(2)}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span>
                    Shipping
                  </span>

                  <span>
                    {shippingCost === 0
                      ? 'Free'
                      : `$${shippingCost.toFixed(2)}`}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span>
                    Tax (10%)
                  </span>

                  <span>
                    ${tax.toFixed(2)}
                  </span>

                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-700">

                    <span>
                      Coupon Discount
                    </span>

                    <span>
                      -${discount.toFixed(2)}
                    </span>

                  </div>
                )}

              </div>

              {/* Total */}
              <div className="flex items-center justify-between bg-[#e7f3e4] rounded-xl px-4 py-4 mt-5">

                <span className="font-serif font-bold">
                  Total Amount
                </span>

                <span className="text-xl sm:text-2xl font-bold text-[#075631]">
                  ${total.toFixed(2)}
                </span>

              </div>

            </section>

            <section className="border border-gray-200 rounded-xl p-4 bg-[#fcfaf5]">

              <div className="flex items-center gap-2">

                <span className="text-2xl text-[#075631]">
                  ◇
                </span>

                <h3 className="font-semibold text-sm sm:text-base">
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
                    setError('')
                  }}
                  placeholder="Enter coupon code"
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

              {couponApplied && (
                <p className="text-xs text-green-700 mt-2">
                  ✓ Halla Bol applied successfully. 10 discount.
                </p>
              )}

            </section>

            <section className="border border-gray-200 rounded-xl p-4">

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full bg-[#075631] hover:bg-[#053f25] text-white rounded-xl py-3.5 font-semibold text-sm transition"
              >
                🔒 Place Order
                <span className="ml-2">
                  — ${total.toFixed(2)}
                </span>
              </button>

              <label className="flex items-start gap-2 mt-4 text-[10px] sm:text-xs cursor-pointer">

                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) =>
                    setTermsAccepted(
                      e.target.checked
                    )
                  }
                  className="accent-[#075631] w-4 h-4 mt-0.5"
                />

                <span>
                  I agree to the{' '}

                  <Link
                    to="/terms"
                    className="text-[#075631] underline font-medium"
                  >
                    Terms & Conditions
                  </Link>

                  {' '}and{' '}

                  <Link
                    to="/privacy"
                    className="text-[#075631] underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                </span>

              </label>

            </section>


            <section className="bg-[#faf8ef] rounded-xl p-4">

              <div className="grid grid-cols-2 gap-4">

                <TrustItem
                  icon="♧"
                  title="100% Secure Payments"
                  text="Your information is safe"
                />

                <TrustItem
                  icon="⟳"
                  title="Easy Returns"
                  text="Hassle-free returns"
                />

                <TrustItem
                  icon="◎"
                  title="Global Shipping"
                  text="100+ countries"
                />

                <TrustItem
                  icon="♧"
                  title="Customer Support"
                  text="24/7 assistance"
                />

              </div>

            </section>

          </aside>

        </div>

      </main>

      <Footer />

    </div>
  )
}


const CheckoutStep = ({
  number,
  title,
  subtitle,
  active,
}) => {

  return (
    <div className="flex items-center gap-2 sm:gap-3 min-w-0">

      <div
        className={`
          w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0
          flex items-center justify-center font-semibold
          ${
            active
              ? 'bg-[#075631] text-white'
              : 'bg-gray-200 text-gray-600'
          }
        `}
      >
        {number}
      </div>

      <div className="hidden sm:block">

        <p className="font-semibold text-xs sm:text-sm">
          {title}
        </p>

        <p className="text-[10px] text-gray-500">
          {subtitle}
        </p>

      </div>

    </div>
  )
}

const SectionTitle = ({
  number,
  title,
  rightText,
}) => {

  return (
    <div className="flex items-center justify-between gap-3">

      <div className="flex items-center gap-3">

        <span className="w-8 h-8 rounded-full bg-[#075631] text-white flex items-center justify-center text-sm font-semibold shrink-0">
          {number}
        </span>

        <h2 className="font-serif text-xl sm:text-2xl font-bold">
          {title}
        </h2>

      </div>

      {rightText && (
        <span className="hidden sm:block text-xs text-gray-500">
          {rightText}
        </span>
      )}

    </div>
  )
}


const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required,
  placeholder,
}) => {

  return (
    <label className="block">

      <span className="block text-xs font-medium mb-1.5">

        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}

      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#075631] focus:ring-1 focus:ring-[#075631]/20"
      />

    </label>
  )
}

const SelectField = ({
  label,
  name,
  value,
  onChange,
  required,
  options,
}) => {

  return (
    <label className="block">

      <span className="block text-xs font-medium mb-1.5">

        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}

      </span>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#075631] bg-white"
      >

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </label>
  )
}

const ShippingOption = ({
  value,
  selected,
  setSelected,
  icon,
  title,
  description,
  price,
}) => {

  const isSelected =
    selected === value

  return (
    <button
      type="button"
      onClick={() =>
        setSelected(value)
      }
      className={`
        text-left border rounded-xl p-4 transition w-full
        ${
          isSelected
            ? 'border-[#075631] bg-[#f3faf4] ring-1 ring-[#075631]'
            : 'border-gray-200 hover:border-[#075631]'
        }
      `}
    >

      <div className="flex items-start justify-between gap-3">

        <div className="flex items-start gap-3">

          <span className="text-2xl">
            {icon}
          </span>

          <div>

            <h3 className="font-semibold text-xs sm:text-sm">
              {title}
            </h3>

            <p className="text-[10px] text-gray-500 mt-1">
              {description}
            </p>

            <p className="font-semibold text-xs mt-2 text-[#075631]">
              {price}
            </p>

          </div>

        </div>

        <span
          className={`
            w-4 h-4 rounded-full border flex items-center justify-center shrink-0
            ${
              isSelected
                ? 'border-[#075631]'
                : 'border-gray-400'
            }
          `}
        >

          {isSelected && (
            <span className="w-2 h-2 bg-[#075631] rounded-full" />
          )}

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

  const isSelected =
    selected === value

  return (
    <button
      type="button"
      onClick={() =>
        setSelected(value)
      }
      className={`
        text-left border rounded-xl p-4 transition w-full
        ${
          isSelected
            ? 'border-[#075631] bg-[#f3faf4] ring-1 ring-[#075631]'
            : 'border-gray-200 hover:border-[#075631]'
        }
      `}
    >

      <div className="flex items-start gap-3">

        <span
          className={`
            w-4 h-4 rounded-full border shrink-0 mt-0.5
            flex items-center justify-center
            ${
              isSelected
                ? 'border-[#075631]'
                : 'border-gray-400'
            }
          `}
        >

          {isSelected && (
            <span className="w-2 h-2 bg-[#075631] rounded-full" />
          )}

        </span>

        <div className="flex-1">

          <h3 className="font-semibold text-xs sm:text-sm">
            {title}
          </h3>

          <p className="text-[10px] text-gray-500 mt-1">
            {description}
          </p>

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

const TrustItem = ({
  icon,
  title,
  text,
}) => {

  return (
    <div className="flex items-start gap-2">

      <span className="text-xl sm:text-2xl text-[#075631] shrink-0">
        {icon}
      </span>

      <div>

        <h3 className="font-semibold text-xs">
          {title}
        </h3>

        <p className="text-[10px] text-gray-500 mt-1">
          {text}
        </p>

      </div>

    </div>
  )
}

export default Checkout