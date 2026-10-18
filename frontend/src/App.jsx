import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'

import Home from './pages/Home.jsx'
import OurStory from './pages/OurStory.jsx'
import Contact from './pages/Contact.jsx'
import Blog from './pages/Blog.jsx'
import Regions from './pages/Regions.jsx'
import Account from './pages/Account.jsx'
import Cart from './pages/Cart.jsx'
import Categories from './pages/Categories.jsx'
import Checkout from './pages/Checkout.jsx'
import FAQ from './pages/FAQ.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Products from './pages/Products.jsx'
import TrackOrder from './pages/TrackOrder.jsx'
import Wishlist from './pages/Wishlist.jsx'
import About from './pages/About.jsx'
import CategoryProducts from "./pages/CategoryProducts";
import RegionDetail from "./pages/RegionDetail";
import Support from './pages/Support.jsx'
import ExportInquiry from './pages/ExportInquiry.jsx'
import ShippingPolicy from './pages/ShippingPolicy.jsx'
import ReturnRefund from './pages/ReturnRefund.jsx'

import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Sitemap from "./pages/Sitemap";
import Impact from "./pages/Impact.jsx";

import Dashboard from './pages/admin/Dashboard.jsx'

import ProtectedRoute from './components/ProtectedRoute.jsx'


const App = () => {
    return (
        <div>
            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />


                <Route
                    path="/our-story"
                    element={<OurStory />}
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />

                <Route
                    path="/about"
                    element={<About />}
                />

                <Route
                    path="/blog"
                    element={<Blog />}
                />

                <Route
                    path="/regions"
                    element={<Regions />}
                />

                <Route
                    path="/categories"
                    element={<Categories />}
                />

                <Route
                    path="/categories/:slug"
                    element={<CategoryProducts />}
                />

                <Route
                    path="/faq"
                    element={<FAQ />}
                />

                <Route
                    path="/product"
                    element={<Products />}
                />

                <Route
                    path="/product/:id"
                    element={<ProductDetails />}
                />

                <Route
                    path="/cart"
                    element={<Cart />}
                />

                <Route
                    path="/wishlist"
                    element={<Wishlist />}
                />

                <Route
                    path="/account"
                    element={
                        <ProtectedRoute>
                            <Account />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/track-order"
                    element={<TrackOrder />}
                />

                <Route
                    path="/check-out"
                    element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={<Dashboard />}
                />

                <Route
                    path="/export-inquiry"
                    element={<ExportInquiry />} />

                <Route
                    path="/support"
                    element={<Support />}
                />

                <Route
                    path="/shipping-policy"
                    element={<ShippingPolicy />}
                />

                <Route
                    path="/support"
                    element={<Support />}
                />

                <Route
                    path="/return-refund"
                    element={<ReturnRefund />}
                />
                <Route
                    path="/regions/:regionSlug"
                    element={<RegionDetail />}
                />


                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route
                    path="/terms-and-conditions"
                    element={<TermsAndConditions />}
                />
                <Route path="/sitemap" element={<Sitemap />} />

<Route path="/impact" element={<Impact />} />
            </Routes>
        </div>
    )
}

export default App