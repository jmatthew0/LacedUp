<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Review;
use App\Models\Seller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Orders', [
            'orders' => $request->user()->orders()->with('items.review')->latest()->get()->map->toCard(),
        ]);
    }

    public function show(Request $request, string $code): Response
    {
        $order = $request->user()->orders()->with('items.review')->where('code', $code)->firstOrFail();

        return Inertia::render('Tracking', ['order' => $order->toCard()]);
    }

    /** Demo only: moves the order to its next tracking stage. */
    public function advance(Request $request, string $code): RedirectResponse
    {
        $order = $request->user()->orders()->where('code', $code)->firstOrFail();
        if ($order->stage < 4) {
            $order->increment('stage');
        }

        return back();
    }

    /** Buyer confirms the pair arrived. */
    public function confirm(Request $request, string $code): RedirectResponse
    {
        $order = $request->user()->orders()->with('items')->where('code', $code)->firstOrFail();
        abort_unless($order->stage >= 4 && ! $order->confirmed_at, 422);

        $order->update(['confirmed_at' => now()]);
        Seller::whereIn('handle', $order->items->pluck('seller')->unique())->increment('sales');

        return back();
    }

    /** Buyer rates the seller for one pair. */
    public function review(Request $request, string $code, OrderItem $item): RedirectResponse
    {
        $order = $request->user()->orders()->where('code', $code)->firstOrFail();
        abort_unless($order->confirmed_at && $item->order_id === $order->id && ! $item->review, 403);

        $data = $request->validate([
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:500'],
        ]);

        $seller = Seller::where('handle', $item->seller)->firstOrFail();

        Review::create([
            'order_item_id' => $item->id, 'user_id' => $request->user()->id, 'seller_id' => $seller->id,
            'rating' => $data['rating'], 'comment' => $data['comment'] ?? null,
        ]);

        $seller->update(['rating' => round(Review::where('seller_id', $seller->id)->avg('rating'), 1)]);

        return back();
    }
}