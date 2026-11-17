<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use App\Models\Sneaker;
use Inertia\Inertia;
use Inertia\Response;

class MarketplaceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Marketplace', [
            'hero' => Sneaker::where('featured', true)->orderBy('price')->get()->map(fn ($s) => [
                'badge' => $s->condition, 'title' => $s->name, 'blurb' => $s->blurb,
                'price' => $s->price, 'slug' => $s->slug, 'image' => $s->image,
            ]),
            'sneakers' => Sneaker::with('seller')->orderBy('price')->get()->map->toCard(),
            'sellers' => Seller::orderByDesc('sales')->take(6)->get()->map->toCard(),
        ]);
    }
}