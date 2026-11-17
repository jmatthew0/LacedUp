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
    public function show(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Settings', [
            'user' => $user->only('name', 'email'),
            'seller' => $user->seller?->only('handle', 'bio', 'avatar'),
        ]);
    }

    public function account(Request $request): RedirectResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update($data);
        $user->seller?->update(['name' => $data['name']]);

        return back();
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

    public function seller(Request $request): RedirectResponse
    {
        $seller = $request->user()->seller;
        abort_unless($seller, 403);

        $data = $request->validate([
            'bio' => ['required', 'string', 'max:300'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        $update = ['bio' => $data['bio']];

        if ($request->hasFile('avatar')) {
            if ($seller->avatar && str_starts_with($seller->avatar, '/storage/')) {
                Storage::disk('public')->delete(Str::after($seller->avatar, '/storage/'));
            }
            $update['avatar'] = Storage::url($request->file('avatar')->store('avatars', 'public'));
        }

        $seller->update($update);

        return back();
    }
}