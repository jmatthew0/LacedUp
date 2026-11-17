<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Orders', [
            'orders' => $request->user()->orders()->with('items')->latest()->get()->map->toCard(),
        ]);
    }

    public function show(Request $request, string $code): Response
    {
        $order = $request->user()->orders()->with('items')->where('code', $code)->firstOrFail();

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
}