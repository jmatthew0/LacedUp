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
use App\Http\Controllers\SavedController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\DisputeController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\PasswordResetController;

// Public
Route::get('/', [MarketplaceController::class, 'index'])->name('marketplace');
Route::get('/sneakers/{slug}', [ProductController::class, 'show'])->name('sneakers.show');
Route::get('/search', [PageController::class, 'search']);
Route::get('/sellers', [PageController::class, 'sellers']);
Route::get('/sellers/{handle}', [PageController::class, 'seller']);
Route::get('/shop/{section}', [CatalogController::class, 'section'])->where('section', 'new-in|men|women|kids|retro');
Route::inertia('/terms', 'Terms');
Route::inertia('/privacy', 'Privacy');
Route::inertia('/help', 'Help');
Route::post('/support', [SupportController::class, 'store'])->middleware('throttle:5,1');

// Guests only
Route::middleware('guest')->group(function () {
    Route::get('/sign-in', [PageController::class, 'signIn'])->name('login');
    Route::post('/sign-in', [AuthController::class, 'login']);
    Route::post('/sign-up', [AuthController::class, 'register']);
    Route::get('/forgot-password', [PasswordResetController::class, 'request']);
    Route::post('/forgot-password', [PasswordResetController::class, 'email'])->middleware('throttle:5,1');
    Route::get('/reset-password/{token}', [PasswordResetController::class, 'reset'])->name('password.reset');
    Route::post('/reset-password', [PasswordResetController::class, 'update']);
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
    Route::post('/dashboard/orders/{code}/ship', [DashboardController::class, 'ship']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::post('/listings', [ListingController::class, 'store']);
    Route::delete('/listings/{sneaker:slug}', [ListingController::class, 'destroy']);

    Route::get('/saved', [SavedController::class, 'index']);
    Route::post('/saved/{slug}', [SavedController::class, 'toggle']);

    Route::get('/offers', [OfferController::class, 'index']);
    Route::post('/offers', [OfferController::class, 'store']);
    Route::post('/offers/{offer}/respond', [OfferController::class, 'respond']);
    Route::post('/offers/{offer}/reply', [OfferController::class, 'reply']);
    Route::post('/offers/{offer}/checkout', [OfferController::class, 'checkout']);

    Route::post('/orders/{code}/confirm', [OrderController::class, 'confirm']);
    Route::post('/orders/{code}/items/{item}/review', [OrderController::class, 'review']);

    Route::get('/settings', [SettingsController::class, 'show']);
    Route::post('/settings/profile', [SettingsController::class, 'profile']);
    Route::get('/settings/payments', [SettingsController::class, 'payments']);
    Route::post('/settings/payments', [SettingsController::class, 'savePayment']);
    Route::get('/settings/security', [SettingsController::class, 'security']);
    Route::put('/settings/password', [SettingsController::class, 'password']);
    Route::get('/settings/notifications', [SettingsController::class, 'notifications']);
    Route::post('/settings/notifications', [SettingsController::class, 'saveNotifications']);

    Route::get('/notifications/{id}', [NotificationController::class, 'open']);
    Route::post('/notifications/read-all', [NotificationController::class, 'readAll']);

    Route::get('/messages/{conversation?}', [MessageController::class, 'index']);
    Route::post('/messages/start', [MessageController::class, 'start']);
    Route::post('/messages/{conversation}', [MessageController::class, 'send']);

    Route::post('/bag/bulk', [BagController::class, 'bulk']);

    Route::patch('/offers/{offer}/raise', [OfferController::class, 'raise']);
    Route::delete('/offers/{offer}', [OfferController::class, 'destroy']);

    Route::post('/orders/{code}/disputes', [DisputeController::class, 'store']);
    Route::post('/disputes/{dispute}/respond', [DisputeController::class, 'respond']);

    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{address}', [AddressController::class, 'update']);
    Route::post('/addresses/{address}/default', [AddressController::class, 'makeDefault']);
    Route::delete('/addresses/{address}', [AddressController::class, 'destroy']);
});