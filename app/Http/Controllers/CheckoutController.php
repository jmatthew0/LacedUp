<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    private const SHIPPING = ['Standard' => 120, 'Express' => 260, 'Meetup at Laced Up hub' => 0];
    private const PAYMENTS = ['GCash', 'Credit or debit card', 'Cash on meetup'];
    private const FEE = 90;

    public function show(Request $request): Response|RedirectResponse
    {
        $bag = $request->user()->bagItems()->with('sneaker.seller')->get();
        if ($bag->isEmpty()) {
            return redirect('/bag');
        }

        return Inertia::render('Checkout', [
            'items' => $bag->map(fn ($b) => ['id' => $b->id, 'size' => $b->size] + $b->sneaker->toCard())->values(),
            'fee' => self::FEE,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'postal' => ['required', 'string', 'max:10'],
            'shipping' => ['required', Rule::in(array_keys(self::SHIPPING))],
            'payment' => ['required', Rule::in(self::PAYMENTS)],
        ]);

        $bag = $request->user()->bagItems()->with('sneaker.seller')->get();
        if ($bag->isEmpty()) {
            return redirect('/bag');
        }

        $order = DB::transaction(function () use ($request, $data, $bag) {
            $subtotal = $bag->sum(fn ($b) => $b->sneaker->price);
            $shipping = self::SHIPPING[$data['shipping']];

            $order = Order::create([
                'user_id' => $request->user()->id,
                'code' => 'LU-'.strtoupper(Str::random(6)),
                'subtotal' => $subtotal, 'shipping' => $shipping, 'fee' => self::FEE,
                'total' => $subtotal + $shipping + self::FEE,
                'shipping_method' => $data['shipping'], 'payment_method' => $data['payment'],
                'address' => $request->only('name', 'phone', 'address', 'city', 'postal'),
            ]);

            foreach ($bag as $b) {
                $order->items()->create([
                    'sneaker_id' => $b->sneaker_id, 'name' => $b->sneaker->name, 'image' => $b->sneaker->image,
                    'seller' => $b->sneaker->seller->handle, 'condition' => $b->sneaker->condition,
                    'size' => $b->size, 'price' => $b->sneaker->price,
                ]);
            }

            $request->user()->bagItems()->delete();

            return $order;
        });

        return redirect('/orders/'.$order->code);
    }
}