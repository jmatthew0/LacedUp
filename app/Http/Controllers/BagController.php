<?php

namespace App\Http\Controllers;

use App\Models\BagItem;
use App\Models\Sneaker;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BagController extends Controller
{
    public function index(Request $request): Response
    {
        $bag = $request->user()->bagItems();

        // Drop pairs someone else already bought.
        (clone $bag)->whereHas('sneaker', fn ($q) => $q->whereNotNull('sold_at'))->delete();

        return Inertia::render('Bag', [
            'items' => (clone $bag)->with('sneaker.seller')->get()
                ->map(fn ($b) => ['id' => $b->id, 'size' => $b->size, 'price' => $b->price ?? $b->sneaker->price] + $b->sneaker->toCard())->values(),
            'more' => Sneaker::available()->with('seller')->whereNotIn('id', (clone $bag)->pluck('sneaker_id'))->take(3)->get()->map->toCard(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'slug' => ['required', 'exists:sneakers,slug'],
            'size' => ['nullable', 'string', 'max:8'],
            'checkout' => ['boolean'],
        ]);

        $sneaker = Sneaker::available()->where('slug', $data['slug'])->firstOrFail();
        $request->user()->bagItems()->updateOrCreate(['sneaker_id' => $sneaker->id], ['size' => $data['size'] ?? null, 'price' => null]);

        return redirect($request->boolean('checkout') ? '/checkout' : '/bag');
    }

    public function destroy(Request $request, BagItem $item): RedirectResponse
    {
        abort_unless($item->user_id === $request->user()->id, 403);
        $item->delete();

        return back();
    }
}