<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    private const PAYMENTS = ['GCash', 'Credit or debit card', 'Cash on meetup'];

    public function show(Request $request): Response
    {
        $u = $request->user();

        return Inertia::render('Settings', ['user' => [
            'name' => $u->name, 'username' => $u->username, 'email' => $u->email, 'phone' => $u->phone,
            'bio' => $u->bio ?? $u->seller?->bio, 'avatar' => $u->avatar ?? $u->seller?->avatar,
        ]]);
    }

    public function profile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'alpha_dash', 'max:30', Rule::unique('users')->ignore($user->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'bio' => ['nullable', 'string', 'max:300'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar && str_starts_with($user->avatar, '/storage/')) {
                Storage::disk('public')->delete(Str::after($user->avatar, '/storage/'));
            }
            $data['avatar'] = Storage::url($request->file('avatar')->store('avatars', 'public'));
        } else {
            unset($data['avatar']);
        }

        $user->update($data);

        $user->seller?->update([
            'name' => $user->name,
            'bio' => $user->bio ?? '',
            'avatar' => $user->avatar ?? $user->seller->avatar,
        ]);

        return back();
    }

    public function payments(Request $request): Response
    {
        return Inertia::render('SettingsPayments', ['methods' => self::PAYMENTS, 'current' => $request->user()->default_payment ?? 'GCash']);
    }

    public function savePayment(Request $request): RedirectResponse
    {
        $data = $request->validate(['method' => ['required', Rule::in(self::PAYMENTS)]]);
        $request->user()->update(['default_payment' => $data['method']]);

        return back();
    }

    public function security(): Response
    {
        return Inertia::render('SettingsSecurity');
    }

    public function password(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $request->user()->update(['password' => $data['password']]);

        return back();
    }

    public function notifications(Request $request): Response
    {
        return Inertia::render('SettingsNotifications', [
            'prefs' => ($request->user()->notification_prefs ?? []) + ['offers' => true, 'orders' => true, 'reviews' => true],
        ]);
    }

    public function saveNotifications(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'offers' => ['required', 'boolean'], 'orders' => ['required', 'boolean'], 'reviews' => ['required', 'boolean'],
        ]);
        $request->user()->update(['notification_prefs' => $data]);

        return back();
    }
}