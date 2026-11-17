<?php

namespace App\Http\Controllers;

use App\Data\Catalog;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(string $slug): Response
    {
        $all = collect(Catalog::sneakers());
        abort_unless($sneaker = $all->firstWhere('slug', $slug), 404);

        return Inertia::render('ProductDetail', [
            'sneaker' => $sneaker,
            'similar' => $all->where('slug', '!=', $slug)->take(3)->values(),
        ]);
    }
}
