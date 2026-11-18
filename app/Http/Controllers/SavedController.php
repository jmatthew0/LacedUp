<?php

namespace App\Http\Controllers;

use App\Models\Sneaker;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SavedController extends Controller
{
    public function index(Request $request): Response
{
    return Inertia::render('Saved', [
        'pairs' => $request->user()->savedSneakers()->with('seller')
            ->latest('saved_sneakers.created_at')->get()
            ->map(fn ($s) => $s->toCard() + ['sold' => (bool) $s->sold_at]),
    ]);
}

    public function toggle(Request $request, string $slug): RedirectResponse
    {
        $sneaker = Sneaker::where('slug', $slug)->firstOrFail();
        $request->user()->savedSneakers()->toggle($sneaker->id);

        return back();
    }
}