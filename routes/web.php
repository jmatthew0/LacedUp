<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BagController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ListingController;

// Public
Route::get('/', [MarketplaceController::class, 'index'])->name('marketplace');
Route::get('/sneakers/{slug}', [ProductController::class, 'show'])->name('sneakers.show');
Route::get('/search', [PageController::class, 'search']);
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

    Route::get('/bag', [BagController::class, 'index']);
    Route::post('/bag', [BagController::class, 'store']);
    Route::delete('/bag/{item}', [BagController::class, 'destroy']);

    Route::get('/checkout', [CheckoutController::class, 'show']);
    Route::post('/checkout', [CheckoutController::class, 'store']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{code}', [OrderController::class, 'show']);
    Route::post('/orders/{code}/advance', [OrderController::class, 'advance']);

    Route::get('/sell', [PageController::class, 'sell']);
    Route::get('/dashboard', [PageController::class, 'dashboard']);
    Route::post('/dashboard/orders/{code}/ship', [DashboardController::class, 'ship']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::post('/listings', [ListingController::class, 'store']);
    Route::delete('/listings/{sneaker:slug}', [ListingController::class, 'destroy']);

});