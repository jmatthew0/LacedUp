<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $seller = $request->user()->seller;

        if (! $seller) {
            return Inertia::render('Dashboard', ['seller' => null, 'stats' => null, 'listings' => [], 'toShip' => []]);
        }

        $listings = $seller->sneakers()->latest()->get();
        $sales = OrderItem::where('seller', $seller->handle);

        return Inertia::render('Dashboard', [
            'seller' => ['handle' => $seller->handle, 'name' => $seller->name],
            'stats' => [
                'earnings' => (clone $sales)->where('created_at', '>=', now()->startOfMonth())->sum('price'),
                'active' => $listings->whereNull('sold_at')->count(),
                'sales' => (clone $sales)->count(),
                'rating' => $seller->rating,
            ],
            'listings' => $listings->map(fn ($s) => [
                'slug' => $s->slug, 'name' => $s->name, 'image' => $s->image, 'sizes' => $s->sizes,
                'price' => $s->price, 'status' => $s->sold_at ? 'Sold' : 'Active',
            ])->values(),
            'toShip' => (clone $sales)->whereHas('order', fn ($q) => $q->where('stage', '<', 2))->with('order')->get()
                ->map(fn ($i) => ['name' => $i->name, 'size' => $i->size, 'code' => $i->order->code])->values(),
        ]);
    }
}