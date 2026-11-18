<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use App\Models\Sneaker;
use Inertia\Inertia;
use Inertia\Response;

class MarketplaceController extends Controller
{
    private const HERO_SLIDES = 3;

    public function index(): Response
    {
        $hero = Sneaker::available()->with('seller')->where('featured', true)->orderBy('price')->get();

        if ($hero->count() < self::HERO_SLIDES) {
            $extra = Sneaker::available()->with('seller')
                ->where('featured', false)
                ->whereNotIn('name', $hero->pluck('name'))
                ->orderByDesc('price')->get()
                ->unique('name')
                ->take(self::HERO_SLIDES - $hero->count());

            $hero = $hero->concat($extra);
        }

        return Inertia::render('Marketplace', [
            'hero' => $hero->map(fn ($s) => [
                'badge' => $s->condition,
                'title' => $s->name,
                'blurb' => $s->blurb ?? "{$s->condition} pair from {$s->seller->handle}. Ships in 48 hours.",
                'price' => $s->price,
                'slug' => $s->slug,
                'image' => $s->image,
            ])->values(),
            'sneakers' => Sneaker::available()->with('seller')->orderBy('price')->get()->map->toCard(),
            'sellers' => Seller::orderByDesc('sales')->take(6)->get()->map->toCard(),
        ]);
    }
}