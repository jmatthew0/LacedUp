# Laced Up — Sneaker Marketplace

Discover, buy, and sell sneakers. A marketplace where every pair is one of a kind: browse listings, make offers, check out, track orders, message sellers, and review them after delivery.

Built with **Laravel 12**, **Inertia.js**, **React + TypeScript**, and **Tailwind CSS v4**.

## Features

**Buying**
- Catalog with a hero carousel, size / price / deadstock filters, and search
- Product pages with size selection, saved pairs (heart), and add to bag
- Make an offer, and respond to counters
- Checkout with saved addresses, shipping methods, and payment options
- Order tracking, delivery confirmation, reviews, disputes, and returns

**Selling**
- Seller profiles with ratings, reviews, and an avatar
- Create listings with photo upload, delete listings
- Seller dashboard: earnings, pending offers (accept / counter / decline), orders to ship, disputes and returns
- Sellers directory with search and sorting

**Account**
- Sign in and create account, with settings (name, email, password)
- Saved pairs, My offers, My orders, Addresses, Messages
- In-app notifications (bell) for offers, orders, shipping, and reviews
- Real-time-ish messaging between buyers and sellers (polls every 5 seconds)

## Requirements

- PHP 8.2 or newer, with Composer
- Node.js 20 or newer
- SQLite (default), or MySQL / PostgreSQL

## Setup

```bash
git clone https://github.com/jmatthew0/LacedUp.git
cd LacedUp

composer install
npm install

cp .env.example .env
php artisan key:generate
```

By default the app uses SQLite. Create the database file if your `.env` points to it:

```bash
touch database/database.sqlite
```

Then build the tables and load sample data:

```bash
php artisan migrate:fresh --seed --seeder=DemoSeeder
php artisan storage:link
```

`storage:link` makes uploaded listing photos and avatars viewable.

### Run it

Use two terminals:

```bash
php artisan serve
```

```bash
npm run dev
```

Open http://localhost:8000.

## Demo accounts

`DemoSeeder` creates these accounts. The password for all of them is **password**.

| Email | Role | What to try |
|---|---|---|
| `juan@example.com` | Buyer | Orders at every tracking stage, a countered offer, saved pairs, and a bag |
| `ana@example.com` | Buyer | Two pending offers |
| `mika@example.com` | Seller | Pending offers to accept or counter, an order to ship, reviews |
| `paolo@example.com` | Seller | An offer from Juan and several orders |

> `migrate:fresh` **erases the whole database**. Only run it on a development database.

To load only the starter catalog without demo users, run `php artisan migrate:fresh --seed --seeder=CatalogSeeder`.

## Images and video

Sneaker photos are not generated. Put these files in `public/images/sneakers/` (lowercase, hyphenated, PNG):

```
bone-court-low.png
cloud-slide-ash.png
coastline-mid-sand.png
ember-retro-high.png
night-tide-runner.png
volt-trail-2.png
```

The Sign In panel uses `public/images/videoframe.png` (still frame) and `public/images/videoframe.mp4` (looping video). Both are optional, and the panel falls back to a dark background without them. The hero carousel looks best with transparent-background PNGs.

## Project structure

```
app/
  Data/Catalog.php              starter catalog used by the seeders
  Http/Controllers/             Marketplace, Product, Bag, Checkout, Order, Offer,
                                Dashboard, Listing, Saved, Message, Dispute,
                                Address, Settings, Notification, Auth, Page
  Models/                       Sneaker, Seller, Order, OrderItem, Offer, Review,
                                Dispute, Conversation, Message, Address, ...
  Notifications/AppNotification.php
database/
  migrations/                   one migration per feature
  seeders/                      CatalogSeeder, DemoSeeder
resources/
  css/app.css                   Tailwind v4 theme (colors, fonts)
  js/
    Layouts/                    AppLayout (header, menus), AccountLayout (sidebar)
    Components/                 Carousel, HeroSlide, SneakerCard, Modal, Bell, ...
    Pages/                      one file per screen
    types/index.ts              shared TypeScript interfaces
    lib/format.ts               peso formatting
routes/web.php                  all routes (public, guest, and auth groups)
public/images/                  sneaker photos, favicon, sign-in media
```

Pages are Inertia components. Each controller returns `Inertia::render('PageName', [...props])`, and the matching file in `resources/js/Pages/` receives those props.

## Common commands

```bash
npm run dev          # Vite dev server with hot reload
npm run build        # production assets
php artisan migrate  # run new migrations
php artisan tinker   # open a console to inspect data
```

Type-check the front end with `npx tsc --noEmit`.

## Known limits

- **No real payments.** Checkout records the chosen payment method but doesn't charge anyone. Escrow, refunds, and payouts are not implemented, and approving a return only records the decision.
- **Demo-only tracking.** "Simulate next update" on the Tracking page moves an order forward. Sellers can mark an order shipped, but there is no courier integration.
- **Starter sellers** in the catalog (such as `ryan.soles`) have no login, so offers and orders on their pairs notify nobody, and you can't message them.
- **Nav categories.** New In, Men, Women, and Kids all open the full shoe list, because the catalog has no gender or release-date data yet.
- **No email.** Notifications are in-app only, and there is no password-reset email.
- **Payment methods** (saved cards) are not built, because they need a real payment provider.

## Design

Warm paper background (`#f2f0ea`), near-black ink (`#121212`), ember orange accent (`#f0603a`), Archivo for headings and Inter for text. Colors and fonts are defined once in `resources/css/app.css`.