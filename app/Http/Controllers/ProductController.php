<?php

namespace App\Http\Controllers;

use App\Models\Sneaker;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(string $slug): Response
    {
        $sneaker = Sneaker::available()->with('seller')->where('slug', $slug)->firstOrFail();

        return Inertia::render('ProductDetail', [
            'sneaker' => $sneaker->toCard(),
            'similar' => Sneaker::available()->with('seller')->where('id', '!=', $sneaker->id)->take(3)->get()->map->toCard(),
        ]);
    }
}