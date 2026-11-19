<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use App\Models\Sneaker;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    private const SECTIONS = [
        'new-in' => ['eyebrow' => 'New in', 'title' => 'Just landed', 'blurb' => 'The newest pairs from verified sellers, listed this week.'],
        'men' => ['eyebrow' => "Men's sneakers", 'title' => 'Court, retro, and run', 'blurb' => 'Deadstock drops, worn-once favorites, and daily runners from sellers we have verified one by one.'],
        'women' => ['eyebrow' => "Women's sneakers", 'title' => 'Fresh pairs, clean lines', 'blurb' => 'Court classics, retro silhouettes, and everyday sneakers in the sizes you wear.'],
        'kids' => ['eyebrow' => "Kids' sneakers", 'title' => 'Small sizes, big drops', 'blurb' => 'Gently worn and brand new pairs for growing feet.'],
        'retro' => ['eyebrow' => 'Retro', 'title' => 'Throwback heat', 'blurb' => 'Archive silhouettes and retro releases, checked pair by pair.'],
    ];

    public function section(string $section): Response
    {
        abort_unless(isset(self::SECTIONS[$section]), 404);

        $all = Sneaker::available()->with('seller')->latest()->get();

        $rows = $all->map(function ($s) {
            [$type, $aud] = array_pad(explode(' · ', $s->category, 2), 2, '');

            return ['model' => $s, 'type' => trim($type), 'aud' => strtolower(trim($aud))];
        });

        $picked = $rows->filter(fn ($r) => match ($section) {
            'men' => in_array($r['aud'], ["men's", 'unisex'], true),
            'women' => in_array($r['aud'], ["women's", 'unisex'], true),
            'kids' => str_starts_with($r['aud'], 'kids'),
            'retro' => strtolower($r['type']) === 'retro',
            default => true,
        });

        return Inertia::render('Shop', [
            'section' => ['key' => $section] + self::SECTIONS[$section],
            'sneakers' => $picked->take($section === 'new-in' ? 24 : 200)
                ->map(fn ($r) => $r['model']->toCard() + ['type' => $r['type']])->values(),
            'sellers' => Seller::orderByDesc('sales')->take(4)->get()->map->toCard(),
            'live' => $all->count(),
        ]);
    }
}