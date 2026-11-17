<?php

namespace App\Http\Controllers;

use App\Data\Catalog;
use Inertia\Inertia;
use Inertia\Response;

class MarketplaceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Marketplace', [
            'hero' => Catalog::hero(),
            'sneakers' => Catalog::sneakers(),
            'sellers' => Catalog::sellers(),
        ]);
    }
}
