# MOLOG store

MOLOG is a React/Vite storefront and an Express/MongoDB API. The frontend and admin panel use the same versioned API at `/api/v1`.

## Local setup

1. Install Node.js 20.19+ or 22.12+.
2. In `backend`, copy `.env.example` to `.env`, set `MONGO_URI` and a long random `JWT_SECRET`. Protect `.env`; never commit it. `ADMIN_EMAIL` and `ADMIN_PASSWORD` are used only by the deliberate seed operation.
3. From `backend`, run `npm install`. Do not run the seed command against the configured store database unless you have explicitly approved the write and reviewed the target database. The seed upserts categories, settings, and coupons; it creates the configured administrator only when that email does not already exist, and inserts sample products only when the product collection is empty. It never promotes an existing account or changes its password.
4. Start the API with `npm run dev` in `backend`.
5. In `frontend`, run `npm install`; set `VITE_API_URL=http://localhost:5000/api/v1` in `.env.local` if the API is elsewhere, then run `npm run dev`.

Only seed a new, isolated database you control: configure that database URI in `backend/.env`, set a unique strong `ADMIN_EMAIL` and `ADMIN_PASSWORD` (12+ characters), and set `SEED_CONFIRM_DATABASE` to exactly the database name in that URI. Then run `npm run seed` from `backend`. For example, in PowerShell with database name `molog_sandbox`: `$env:SEED_CONFIRM_DATABASE='molog_sandbox'; npm run seed`. The seed refuses to run unless the database name matches. It creates the administrator only if the email is unused; reruns never promote users, reactivate accounts, or reset existing admin passwords. It also upserts categories, settings and coupons and seeds sample products only when no products exist. Never point this process at the store database without a separate explicit review and approval. There is no public admin registration.

## Verification

- Frontend production bundle: `cd frontend && npm run build`
- Frontend lint: `cd frontend && npm run lint`
- Backend unit and MongoDB API tests: `cd backend && npm test`

The API persistence test uses a uniquely named temporary MongoDB database, verifies product creation and customer catalog visibility, creates and retries an order, checks customer/admin order visibility and stock updates, then drops only that temporary test database. It requires a reachable MongoDB URI and permission to create/drop temporary databases.

## Production environment

### Vercel frontend

- Set `VITE_API_URL` to the deployed API URL ending in `/api/v1`.
- Set `VITE_UPLOADS_URL` to the API origin if uploaded image URLs use the API `/uploads` route.
- Deploy the `frontend` directory. `vercel.json` rewrites client-side routes to `index.html`.

### Backend service

Deploy `backend` to a persistent Node.js host and set:

- `NODE_ENV=production`, `PORT`
- `MONGO_URI` to the production MongoDB connection string
- `JWT_SECRET` to a randomly generated secret; `JWT_EXPIRE` as desired
- `FRONTEND_URL` to the exact Vercel origin for credentialed CORS and reset links
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` only for the deliberate initial seed operation
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` to enable actual Razorpay checkout/refunds and the payment webhook
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` to deliver password reset emails
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` for signed, durable image uploads. Uploads return HTTP 503 until these are configured; local filesystem upload storage is not used.

Run `npm run seed` against the intended database only after reviewing the seed behavior. Configure the Razorpay webhook URL as `/api/v1/payments/webhook` and subscribe to captured/failed payment events. Payment verification and refunds return errors when provider configuration is missing; the app does not claim payment or refund success without server/provider confirmation.

Configure the Razorpay dashboard webhook URL as `/api/v1/payments/webhook`, with the same secret in `RAZORPAY_WEBHOOK_SECRET`, and subscribe to captured/failed payment events. Put only public Razorpay key ID in the frontend environment if the hosted checkout UI requires it; keep the secret and webhook secret on the API. Refunds require captured Razorpay payments and provider credentials. COD refunds require an external provider/manual process and are intentionally not reported as successful by the API.

Keep database backups and use a managed MongoDB deployment with authentication, TLS and network access restrictions. Deploy frontend and API separately, set the exact Vercel origin in `FRONTEND_URL`, configure API CORS for that origin, and set `VITE_API_URL` to the API's `/api/v1` base. Run schema/index initialization through the normal application start; seed only after a separately authorized database review.

## Implemented scope and current limits

The storefront catalog, product detail, authentication, coupon validation, order submission, order tracking, and account order list use the API. Authenticated wishlists and submitted reviews are stored in MongoDB; guest wishlists and the cart remain in browser storage until sign-in/checkout. INR and USD prices are independent catalog values; the app does not convert between currencies. Shipping, tax, coupon discounts and stock are calculated or revalidated by the backend. COD is restricted by backend settings; online payments require Razorpay credentials.

Admin dashboard, customers, enquiries, product/category CRUD, inventory adjustment, orders/status/cancellations, blog, banners, review moderation, coupons, newsletter export, page content, settings, wholesale/export enquiry viewing, and 30-day analytics use protected API endpoints. Customer reviews are stored pending moderation; account email/order/offer notification preferences are stored on the customer record. Image uploads use signed Cloudinary storage when configured. Newsletter unsubscribe is restricted to administrators.

Password reset links are single-use and expire after 30 minutes. SMTP delivery must be configured to send them; without SMTP the API safely does not log reset links or claim delivery. Razorpay checkout, server-side payment fetch/signature verification, webhook processing, and provider-backed refunds require real Razorpay credentials and have not been live-tested without those credentials. USD and INR are independent configured list prices; no exchange rate is applied. Guest wishlist/cart behavior remains client-side; authenticated wishlists, orders, products, account profile, addresses, preferences, and reviews persist through MongoDB APIs.

Return requests are stored for review, but the store's actual return window and final eligibility policy have not been configured in application settings; publish the approved policy before accepting customer requests. Newsletter forms store subscriber consent and the admin can export or unsubscribe records; campaign delivery is not implemented. Product, blog and banner uploads use Cloudinary when configured. Customer reviews currently support text and rating only; review image attachments are not implemented. Provider calls were only tested in fail-safe mode without credentials, so live email, payment, refund and upload success remain unverified.

## Environment variables

Backend variables (`backend/.env`; values must be supplied by the operator): `PORT`, `NODE_ENV`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `FRONTEND_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SEED_CONFIRM_DATABASE` (one-time seed only), `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

Frontend variables (`frontend/.env.local` or Vercel project settings): `VITE_API_URL` (full API base ending in `/api/v1`) and `VITE_UPLOADS_URL` (legacy upload origin; Cloudinary now returns absolute durable URLs). Never put server secrets in `VITE_*` variables.
