<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Notifications\AppNotification;
use App\Models\Dispute;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $seller = $request->user()->seller;

        if (! $seller) {
            return Inertia::render('Dashboard', ['seller' => null, 'stats' => null, 'listings' => [], 'toShip' => [], 'offers' => []]);
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
            'offers' => Offer::where('status', 'pending')
                ->whereHas('sneaker', fn ($q) => $q->where('seller_id', $seller->id)->whereNull('sold_at'))
                ->with(['sneaker', 'buyer'])->latest()->get()
                ->map(fn ($o) => [
                    'id' => $o->id, 'name' => $o->sneaker->name, 'size' => $o->size,
                    'asking' => $o->sneaker->price, 'amount' => $o->amount, 'buyer' => $o->buyer->name,
                ])->values(),
                'cases' => Dispute::where('status', 'open')
                ->whereHas('order.items', fn ($q) => $q->where('seller', $seller->handle))
                ->with(['order', 'user'])->latest()->get()
                ->map(fn ($d) => [
                    'id' => $d->id, 'type' => $d->type, 'reason' => $d->reason, 'details' => $d->details,
                    'code' => $d->order->code, 'buyer' => $d->user->name, 'date' => $d->created_at->format('M j'),
                ])->values(),
                    ]);
    }

    public function ship(Request $request, string $code): RedirectResponse
    {
        $seller = $request->user()->seller;
        abort_unless($seller, 403);

        $order = Order::where('code', $code)
            ->whereHas('items', fn ($q) => $q->where('seller', $seller->handle))
            ->firstOrFail();

            if ($order->stage < 2) {
                $order->update(['stage' => 2]);
                $order->user->notify(new AppNotification("Order {$order->code} has shipped", "/orders/{$order->code}"));
            }

        return back();
    }
}