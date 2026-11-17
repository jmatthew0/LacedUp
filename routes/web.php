<?php

use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MarketplaceController::class, 'index'])->name('marketplace');
Route::get('/sneakers/{slug}', [ProductController::class, 'show'])->name('sneakers.show');

Route::controller(PageController::class)->group(function () {
    Route::get('/search', 'search');
    Route::get('/bag', 'bag');
    Route::get('/checkout', 'checkout');
    Route::get('/orders', 'orders');
    Route::get('/orders/{id}', 'tracking');
    Route::get('/sellers/{handle}', 'seller');
    Route::get('/sell', 'sell');
    Route::get('/dashboard', 'dashboard');
    Route::get('/sign-in', 'signIn');
});