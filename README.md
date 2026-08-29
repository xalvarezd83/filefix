# FileFix

FileFix is a SaaS starter for validating and cleaning Excel/CSV files.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Auth.js credentials authentication
- PostgreSQL + Prisma
- Stripe subscriptions
- S3-compatible object storage (Cloudflare R2 works well)
- Railway deployment

## 1. Local setup

```bash
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

Create an `AUTH_SECRET` with a strong random value.

## 2. Railway

Create a Railway project with:
1. PostgreSQL service
2. FileFix application service

Set `DATABASE_URL` from Railway's Postgres variable/reference.

Build command:

```bash
npm run build
```

Start command:

```bash
npm start
```

For a production deployment, add the variables from `.env.example`.

## 3. Stripe

Create a recurring Product/Price for `$4.99 USD/month`.

Set:
- `STRIPE_SECRET_KEY`
- `STRIPE_PRO_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`

Configure a webhook endpoint:

`https://YOUR-DOMAIN/api/stripe/webhook`

Listen for:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## 4. Storage

Do not store uploaded files on Railway's local filesystem. Railway deployments/containers are not the right place for durable user uploads.

Create an S3-compatible bucket (Cloudflare R2 is a simple option) and configure the S3 variables.

## 5. Current MVP scope

Implemented:
- Landing page
- Registration
- Login/logout foundation
- PostgreSQL data model
- Dashboard
- CSV/XLS/XLSX upload
- S3/R2 upload
- Usage event tracking
- Pricing page
- Stripe Checkout
- Stripe webhook
- Saved validation-template schema

Next implementation step:
- Add the actual Excel/CSV validation worker using DuckDB/Polars/Python.
- Add validation-template CRUD UI.
- Add results/report page.
- Add automatic cleaning and downloadable output.
- Add AI assistant after the validation workflow is solid.

## Product limits

Suggested initial limits:
- Free: 3 files/month, 10MB/file
- Pro: 100 files/month, 100MB/file

The upload endpoint currently enforces file-size limits; monthly quota enforcement should be added before public launch.
