<?php

namespace App\Http\Controllers;

use App\Data\ModelInfo;
use App\Models\OrderItem;
use App\Models\Sneaker;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(string $slug): Response
    {
        $sneaker = Sneaker::available()->with('seller')->where('slug', $slug)->firstOrFail();
        $seller = $sneaker->seller;
        $info = ModelInfo::for($sneaker->name);

        $same = Sneaker::available()->where('name', $sneaker->name)->get();
        $sales = OrderItem::where('name', $sneaker->name)->latest()->take(5)->get();

        return Inertia::render('ProductDetail', [
            'sneaker' => $sneaker->toCard() + [
                'colorway' => $info['colorway'] ?? null,
                'styleCode' => $info['style_code'] ?? null,
                'box' => $sneaker->box_included,
                'receipt' => $sneaker->receipt_included,
            ],
            'stats' => [
                'lowest' => $same->min('price'),
                'listed' => $same->count(),
                'lastSold' => $sales->first()?->price,
            ],
            'others' => $same->where('id', '!=', $sneaker->id)
                ->flatMap(fn ($o) => collect($o->sizes)->map(fn ($s) => ['slug' => $o->slug, 'size' => $s + 0, 'price' => $o->price]))
                ->values(),
            'sales' => $sales->map(fn ($i) => [
                'size' => $i->size, 'condition' => $i->condition, 'price' => $i->price, 'when' => $i->created_at->diffForHumans(),
            ])->values(),
            'seller' => [
                'name' => $seller->name, 'handle' => $seller->handle, 'avatar' => $seller->avatar,
                'sales' => $seller->sales, 'rating' => $seller->rating,
                'reviews' => $seller->reviews()->count(), 'canMessage' => (bool) $seller->user_id,
            ],
            'similar' => Sneaker::available()->with('seller')->where('id', '!=', $sneaker->id)->take(3)->get()->map->toCard(),
        ]);
    }
}