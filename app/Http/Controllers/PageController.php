<?php

namespace App\Http\Controllers;

use App\Data\Catalog;
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

    public function bag(): Response
    {
        return Inertia::render('Bag', ['items' => $this->all()->take(2)->values(), 'more' => $this->all()->slice(3)->values()]);
    }

    public function checkout(): Response { return Inertia::render('Checkout', ['item' => $this->all()->first()]); }

    public function orders(): Response
    {
        $s = $this->all();
        return Inertia::render('Orders', ['orders' => [
            ['id' => 'LU-30291', 'status' => 'In transit', 'note' => 'Arriving Thursday', 'total' => 9160, 'seller' => 'ryan.soles', 'item' => $s[0]],
            ['id' => 'LU-30118', 'status' => 'To pay', 'note' => 'Pay within 15 minutes', 'total' => 6520, 'seller' => 'bea.threads', 'item' => $s[1]],
            ['id' => 'LU-29977', 'status' => 'To ship', 'note' => 'Seller ships within 48h', 'total' => 11320, 'seller' => 'jomar.courtside', 'item' => $s[2]],
            ['id' => 'LU-29650', 'status' => 'Delivered', 'note' => 'Delivered 4 days ago', 'total' => 4920, 'seller' => 'anacrates', 'item' => $s[3]],
            ['id' => 'LU-29412', 'status' => 'Delivered', 'note' => 'Delivered last week', 'total' => 2240, 'seller' => 'sole.miguel', 'item' => $s[4]],
            ['id' => 'LU-29088', 'status' => 'Returns', 'note' => 'Refund after inspection', 'total' => 7400, 'seller' => 'kuya.kicks', 'item' => $s[5]],
        ]]);
    }

    public function tracking(string $id): Response { return Inertia::render('Tracking', ['id' => $id, 'item' => $this->all()->first()]); }

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