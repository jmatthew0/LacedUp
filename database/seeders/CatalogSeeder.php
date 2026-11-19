<?php

namespace Database\Seeders;

use App\Data\Catalog;
use App\Models\Seller;
use App\Models\Sneaker;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $blurbs = [
            'bone-court-low' => 'Tonal leather in bone. Worn twice, cleaned and stored in the original box. Ships in 48 hours.',
            'ember-retro-high' => 'Patent ember leather, never worn. Original box and receipt included.',
            'night-tide-runner' => 'Mesh and silver overlays from a seller with a perfect 5.0 rating.',
        ];

        foreach (Catalog::sellers() as $s) {
            Seller::updateOrCreate(['handle' => $s['handle']], [
                'name' => $s['name'], 'bio' => $s['bio'], 'sales' => $s['sales'],
                'rating' => $s['rating'], 'on_time' => $s['onTime'],
            ]);
        }

        foreach (Catalog::sneakers() as $s) {
            // Sellers that only appear on listings get a basic profile.
            $seller = Seller::firstOrCreate(['handle' => $s['seller']], [
                'name' => ucwords(str_replace('.', ' ', $s['seller'])),
                'bio' => 'Verified Laced Up seller.',
                'sales' => 50, 'rating' => $s['rating'], 'on_time' => 95,
            ]);

            Sneaker::updateOrCreate(['slug' => $s['slug']], [
                'seller_id' => $seller->id, 'name' => $s['name'], 'category' => $s['category'],
                'condition' => $s['condition'], 'price' => $s['price'], 'sizes' => $s['sizes'],
                'image' => $s['image'], 'blurb' => $blurbs[$s['slug']] ?? null,
                'featured' => isset($blurbs[$s['slug']]),
                'box_included' => in_array($s['condition'], ['Deadstock', 'Like new'], true),
                'receipt_included' => $s['condition'] === 'Deadstock',
            ]);
        }
    }
}