<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use App\Models\Sneaker;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    private function all() { return Sneaker::with('seller')->get()->map->toCard(); }

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
            'listings' => $seller->sneakers()->with('seller')->get()->map->toCard(),
        ]);
    }

    public function sell(): Response { return Inertia::render('Sell', ['models' => $this->all()]); }

    public function dashboard(): Response { return Inertia::render('Dashboard', ['listings' => $this->all()->take(5)->values()]); }

    public function signIn(): Response { return Inertia::render('SignIn'); }
}