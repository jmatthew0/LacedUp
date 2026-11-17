<?php

namespace App\Data;

/** Mock catalog. Swap for Eloquent models (Sneaker, Seller, Listing) when the DB is ready. */
class Catalog
{
    public static function sneakers(): array
    {
        return [
            ['slug' => 'ember-retro-high', 'name' => 'Ember Retro High', 'category' => 'Retro · Men\'s', 'seller' => 'ryan.soles', 'rating' => 4.9, 'price' => 8950, 'condition' => 'Deadstock', 'sizes' => [8, 9, 10], 'image' => '/images/sneakers/ember-retro-high.png'],
            ['slug' => 'bone-court-low', 'name' => 'Bone Court Low', 'category' => 'Court · Unisex', 'seller' => 'bea.threads', 'rating' => 4.8, 'price' => 6400, 'condition' => 'Like new', 'sizes' => [7, 8, 9, 10], 'image' => '/images/sneakers/bone-court-low.png'],
            ['slug' => 'night-tide-runner', 'name' => 'Night Tide Runner', 'category' => 'Runner · Men\'s', 'seller' => 'jomar.courtside', 'rating' => 5.0, 'price' => 11200, 'condition' => 'Deadstock', 'sizes' => [9, 10, 11, 12], 'image' => '/images/sneakers/night-tide-runner.png'],
            ['slug' => 'volt-trail-2', 'name' => 'Volt Trail 2', 'category' => 'Trail · Men\'s', 'seller' => 'anacrates', 'rating' => 4.7, 'price' => 4800, 'condition' => 'Worn once', 'sizes' => [8, 8.5, 9], 'image' => '/images/sneakers/volt-trail-2.png'],
            ['slug' => 'cloud-slide-ash', 'name' => 'Cloud Slide Ash', 'category' => 'Slides · Unisex', 'seller' => 'sole.miguel', 'rating' => 4.9, 'price' => 2150, 'condition' => 'Good condition', 'sizes' => [7, 8], 'image' => '/images/sneakers/cloud-slide-ash.png'],
            ['slug' => 'coastline-mid-sand', 'name' => 'Coastline Mid "Sand"', 'category' => 'Mid · Men\'s', 'seller' => 'kuya.kicks', 'rating' => 4.9, 'price' => 7300, 'condition' => 'Deadstock', 'sizes' => [10, 11], 'image' => '/images/sneakers/coastline-mid-sand.png'],
        ];
    }

    public static function sellers(): array
    {
        return [
            ['handle' => 'ryan.soles', 'name' => 'Ryan Dela Cruz', 'bio' => 'Retro and deadstock specialist. Every pair under daylight with box shots.', 'sales' => 312, 'rating' => 4.9, 'onTime' => 98],
            ['handle' => 'bea.threads', 'name' => 'Bea Villanueva', 'bio' => 'Clean court and lifestyle pairs, worn once and cleaned before every shipment.', 'sales' => 198, 'rating' => 4.8, 'onTime' => 96],
            ['handle' => 'jomar.courtside', 'name' => 'Jomar Reyes', 'bio' => 'Runners and performance releases. Fast shipper with a perfect dispute record.', 'sales' => 741, 'rating' => 5.0, 'onTime' => 100],
            ['handle' => 'anacrates', 'name' => 'Ana Cruz', 'bio' => 'Curated sneaker crates. Sizes 7 to 9 with new arrivals every Friday.', 'sales' => 96, 'rating' => 4.7, 'onTime' => 94],
        ];
    }

    public static function hero(): array
    {
        return [
            ['badge' => 'Just listed', 'title' => 'Bone Court Low', 'blurb' => 'Tonal leather in bone. Worn twice, cleaned and stored in the original box. Ships in 48 hours.', 'price' => 6400, 'slug' => 'bone-court-low', 'image' => '/images/sneakers/bone-court-low.png'],
            ['badge' => 'Deadstock', 'title' => 'Ember Retro High', 'blurb' => 'Patent ember leather, never worn. Original box and receipt included.', 'price' => 8950, 'slug' => 'ember-retro-high', 'image' => '/images/sneakers/ember-retro-high.png'],
            ['badge' => 'Top rated seller', 'title' => 'Night Tide Runner', 'blurb' => 'Mesh and silver overlays from a seller with a perfect 5.0 rating.', 'price' => 11200, 'slug' => 'night-tide-runner', 'image' => '/images/sneakers/night-tide-runner.png'],
        ];
    }
}
