<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use App\Models\Sneaker;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Data\ModelInfo;

class PageController extends Controller
{
    private function all() { return Sneaker::available()->with('seller')->get()->map->toCard(); }

    public function search(Request $r): Response
{
    // Ignore punctuation, so "runer." searches the same as "runer".
    $q = trim(preg_replace('/\s+/', ' ', preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', (string) $r->query('q', ''))));
    $words = $q === '' ? [] : explode(' ', mb_strtolower($q));

    $all = Sneaker::available()->with('seller')->get()->map(function ($s) {
        [$type, $aud] = array_pad(explode(' · ', $s->category, 2), 2, '');

        return $s->toCard() + [
            'brand' => ModelInfo::for($s->name)['brand'] ?? 'Other',
            'type' => trim($type),
            'aud' => trim($aud),
        ];
    });

    $haystack = fn ($s) => mb_strtolower(implode(' ', [$s['name'], $s['category'], $s['brand'], $s['seller'], $s['condition']]));

    // 1) exact: every word appears somewhere
    $exact = fn ($s) => collect($words)->every(fn ($w) => str_contains($haystack($s), $w));

    // 2) close: a word may be off by a letter or two (runer -> runner)
    $fuzzy = function ($s) use ($words, $haystack) {
        $hay = $haystack($s);
        $tokens = preg_split('/[^\p{L}\p{N}]+/u', $hay, -1, PREG_SPLIT_NO_EMPTY);

        return collect($words)->every(function ($w) use ($hay, $tokens) {
            if (str_contains($hay, $w)) {
                return true;
            }
            if (mb_strlen($w) < 4) {
                return false;
            }
            $allowed = mb_strlen($w) >= 7 ? 2 : 1;
            foreach ($tokens as $t) {
                if (levenshtein($w, $t) <= $allowed) {
                    return true;
                }
            }

            return false;
        });
    };

    $results = $all->filter($exact)->values();
    $close = false;

    if ($results->isEmpty() && $words) {
        $results = $all->filter($fuzzy)->values();
        $close = $results->isNotEmpty();
    }

    $suggestion = null;
    if ($q !== '' && $results->isEmpty()) {
        $best = 0;
        foreach ($all->pluck('name')->unique() as $name) {
            similar_text(mb_strtolower($q), mb_strtolower($name), $pct);
            if ($pct > $best) {
                $best = $pct;
                $suggestion = $name;
            }
        }
        if ($best < 40) {
            $suggestion = null;
        }
    }

    return Inertia::render('Search', ['q' => $q, 'results' => $results, 'suggestion' => $suggestion, 'close' => $close]);
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