<?php

use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MarketplaceController::class, 'index'])->name('marketplace');
Route::get('/sneakers/{slug}', [ProductController::class, 'show'])->name('sneakers.show');

// Next pages (same pattern): bag, checkout, orders, tracking, sell, seller/{handle}, dashboard, auth
