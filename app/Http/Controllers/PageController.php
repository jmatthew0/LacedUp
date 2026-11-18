<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use App\Models\Sneaker;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    private function all() { return Sneaker::available()->with('seller')->get()->map->toCard(); }

    public function search(Request $r): Response
    {
        $q = strtolower((string) $r->query('q', ''));
        $res = $this->all()->filter(fn ($s) => $q === '' || str_contains(strtolower($s['name'].' '.$s['category']), $q))->values();

        return Inertia::render('Search', ['q' => $q, 'results' => $res]);
    }

    public function seller(string $handle): Response
{
    $seller = Seller::where('handle', $handle)->firstOrFail();

    return Inertia::render('SellerProfile', [
        'seller' => $seller->toCard(),
        'listings' => $seller->sneakers()->available()->with('seller')->get()->map->toCard(),
        'reviews' => $seller->reviews()->with('user')->latest()->take(20)->get()->map(fn ($r) => [
            'rating' => $r->rating, 'comment' => $r->comment,
            'by' => explode(' ', $r->user->name)[0], 'date' => $r->created_at->format('M j, Y'),
        ]),
    ]);
}

    /** Models a seller can pick from: the starter catalog (sellers without a user account). */
    public function sell(): Response
    {
        $models = Sneaker::with('seller')->whereHas('seller', fn ($q) => $q->whereNull('user_id'))->get()->map->toCard();

        return Inertia::render('Sell', ['models' => $models]);
    }

    public function signIn(): Response { return Inertia::render('SignIn'); }

    public function sellers(): Response
{
    $sellers = Seller::withCount(['sneakers as listings' => fn ($q) => $q->whereNull('sold_at')])
        ->get()
        ->map(fn ($s) => $s->toCard() + ['listings' => $s->listings]);

    return Inertia::render('Sellers', ['sellers' => $sellers]);
}

}