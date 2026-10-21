import React from "react";
import { Routes, Route } from "react-router-dom";

import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

import Home from "./pages/Home.jsx";
import OurStory from "./pages/OurStory.jsx";
import Contact from "./pages/Contact.jsx";
import Blog from "./pages/Blog.jsx";
import Regions from "./pages/Regions.jsx";
import Account from "./pages/Account.jsx";
import Cart from "./pages/Cart.jsx";
import Categories from "./pages/Categories.jsx";
import Checkout from "./pages/Checkout.jsx";
import FAQ from "./pages/FAQ.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Products from "./pages/Products.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import About from "./pages/About.jsx";
import CategoryProducts from "./pages/CategoryProducts";
import RegionDetail from "./pages/RegionDetail";
import Support from "./pages/Support.jsx";
import ExportInquiry from "./pages/ExportInquiry.jsx";
import ShippingPolicy from "./pages/ShippingPolicy.jsx";
import ReturnRefund from "./pages/ReturnRefund.jsx";
import Sitemap from "./pages/Sitemap.jsx";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Impact from "./pages/Impact.jsx";
// Admin
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
// admin handle Pages
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminCustomer from "./pages/admin/AdminCustomer.jsx";
import AdminEnquiries from "./pages/admin/AdminEnquiries.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminResources from "./pages/admin/AdminResources.jsx";
import ContentPage from "./pages/ContentPage.jsx";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token?" element={<ResetPassword />} />

        <Route path="/our-story" element={<OurStory />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/about" element={<About />} />

        <Route path="/blog" element={<Blog />} />

        <Route path="/regions" element={<Regions />} />

        <Route path="/categories" element={<Categories />} />

        <Route path="/categories/:slug" element={<CategoryProducts />} />

        <Route path="/faq" element={<FAQ />} />

        <Route path="/product" element={<Products />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        <Route path="/track-order" element={<TrackOrder />} />

        <Route
          path="/check-out"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route path="/impact" element={<Impact />} />

        <Route path="/export-inquiry" element={<ExportInquiry />} />

        <Route path="/support" element={<Support />} />

        <Route path="/shipping-policy" element={<ShippingPolicy />} />

        <Route path="/return-refund" element={<ReturnRefund />} />
        <Route path="/regions/:regionSlug" element={<RegionDetail />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/pages/:slug" element={<ContentPage />} />

        <Route path="/sitemap" element={<Sitemap />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="customers" element={<AdminCustomer />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route
            path="inventory"
            element={<AdminResources type="inventory" />}
          />
          <Route path="blog" element={<AdminResources type="blog" />} />
          <Route path="banners" element={<AdminResources type="banners" />} />
          <Route path="reviews" element={<AdminResources type="reviews" />} />
          <Route path="offers" element={<AdminResources type="coupons" />} />
          <Route
            path="newsletter"
            element={<AdminResources type="newsletter" />}
          />
          <Route path="pages" element={<AdminResources type="pages" />} />
          <Route path="settings" element={<AdminResources type="settings" />} />
          <Route path="export" element={<AdminResources type="export" />} />
          <Route
            path="analytics"
            element={<AdminResources type="analytics" />}
          />
        </Route>

        <Route
          path="*"
          element={
            <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
              <h1 className="font-serif text-3xl font-bold text-[#073b25]">
                Page not found
              </h1>
              <p className="mt-3 text-gray-600">
                The page you requested doesn’t exist or may have moved.
              </p>
              <a
                href="/"
                className="mt-6 rounded bg-[#073b25] px-5 py-3 font-semibold text-white"
              >
                Back to home
              </a>
            </main>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
