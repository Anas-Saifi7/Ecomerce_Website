import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Register = lazy(() => import("./pages/Register.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));

const Home = lazy(() => import("./pages/Home.jsx"));
const OurStory = lazy(() => import("./pages/OurStory.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Blog = lazy(() => import("./pages/Blog.jsx"));
const Regions = lazy(() => import("./pages/Regions.jsx"));
const Account = lazy(() => import("./pages/Account.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Categories = lazy(() => import("./pages/Categories.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const FAQ = lazy(() => import("./pages/FAQ.jsx"));
const ProductDetails = lazy(() => import("./pages/ProductDetails.jsx"));
const Products = lazy(() => import("./pages/Products.jsx"));
const TrackOrder = lazy(() => import("./pages/TrackOrder.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const CategoryProducts = lazy(() => import("./pages/CategoryProducts.jsx"));
const RegionDetail = lazy(() => import("./pages/RegionDetail.jsx"));
const Support = lazy(() => import("./pages/Support.jsx"));
const ExportInquiry = lazy(() => import("./pages/ExportInquiry.jsx"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy.jsx"));
const ReturnRefund = lazy(() => import("./pages/ReturnRefund.jsx"));
const Sitemap = lazy(() => import("./pages/Sitemap.jsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.jsx"));
const TermsAndConditions = lazy(
  () => import("./pages/TermsAndConditions.jsx")
);
const Impact = lazy(() => import("./pages/Impact.jsx"));
const ContentPage = lazy(() => import("./pages/ContentPage.jsx"));

//  admin pages
const Dashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders.jsx"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts.jsx"));
const AdminCustomer = lazy(() => import("./pages/admin/AdminCustomer.jsx"));
const AdminEnquiries = lazy(() => import("./pages/admin/AdminEnquiries.jsx"));
const AdminCategories = lazy(
  () => import("./pages/admin/AdminCategories.jsx")
);
const AdminResources = lazy(
  () => import("./pages/admin/AdminResources.jsx")
);

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";

// Loading fallback
const PageLoader = () => (
  <div
    className="flex min-h-[60vh] items-center justify-center"
    role="status"
    aria-live="polite"
  >
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#073b25]" />
      <p className="mt-4 text-sm text-gray-600">Loading page...</p>
    </div>
  </div>
);

const NotFound = () => (
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
);

const App = () => {
  return (
    <Suspense fallback={<PageLoader />}>
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
        <Route
          path="/terms-and-conditions"
          element={<TermsAndConditions />}
        />
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
          <Route
            path="settings"
            element={<AdminResources type="settings" />}
          />
          <Route path="export" element={<AdminResources type="export" />} />
          <Route
            path="analytics"
            element={<AdminResources type="analytics" />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
