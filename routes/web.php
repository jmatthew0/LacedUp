<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// Public
Route::get('/', [MarketplaceController::class, 'index'])->name('marketplace');
Route::get('/sneakers/{slug}', [ProductController::class, 'show'])->name('sneakers.show');
Route::get('/search', [PageController::class, 'search']);
Route::get('/bag', [PageController::class, 'bag']);
Route::get('/sellers/{handle}', [PageController::class, 'seller']);

// Guests only
Route::middleware('guest')->group(function () {
    Route::get('/sign-in', [PageController::class, 'signIn'])->name('login');
    Route::post('/sign-in', [AuthController::class, 'login']);
    Route::post('/sign-up', [AuthController::class, 'register']);
});

// Signed-in only
Route::middleware('auth')->group(function () {
    Route::post('/sign-out', [AuthController::class, 'logout']);
    Route::get('/checkout', [PageController::class, 'checkout']);
    Route::get('/orders', [PageController::class, 'orders']);
    Route::get('/orders/{id}', [PageController::class, 'tracking']);
    Route::get('/sell', [PageController::class, 'sell']);
    Route::get('/dashboard', [PageController::class, 'dashboard']);
});